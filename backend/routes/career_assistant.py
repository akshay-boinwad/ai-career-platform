from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user

from models.career_chat import CareerChat
from models.resume import Resume
from models.job import Job
from models.interview import Interview

from ai.career_ai import ask_career_ai


router = APIRouter(
    prefix="/api/career-assistant",
    tags=["AI Career Assistant"]
)


@router.post("/chat")
def career_chat(
    message: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # =====================================================
    # DEBUG
    # =====================================================

    print("=== CAREER ASSISTANT REQUEST RECEIVED ===")
    print("User:", current_user.id)
    print("Message:", message)


    # =====================================================
    # VALIDATE MESSAGE
    # =====================================================

    message = message.strip()

    if not message:
        return {
            "response": "Please enter a message."
        }


    # =====================================================
    # GET USER'S LATEST RESUME
    # =====================================================

    latest_resume = (
        db.query(Resume)
        .filter(
            Resume.user_id == current_user.id
        )
        .order_by(
            Resume.created_at.desc()
        )
        .first()
    )


    # =====================================================
    # GET AVAILABLE JOBS
    # =====================================================

    jobs = (
        db.query(Job)
        .order_by(
            Job.created_at.desc()
        )
        .all()
    )


    # =====================================================
    # CURRENT USER SKILLS
    # =====================================================

    resume_skills = []

    if latest_resume and latest_resume.skills:

        resume_skills = [
            skill.strip()
            for skill in latest_resume.skills.split(",")
            if skill.strip()
        ]


    # =====================================================
    # COLLECT REQUIRED JOB SKILLS
    # =====================================================

    required_skills = set()

    for job in jobs:

        if job.skills:

            job_skills = [
                skill.strip().lower()
                for skill in job.skills.split(",")
                if skill.strip()
            ]

            required_skills.update(job_skills)


    # =====================================================
    # FIND MISSING SKILLS
    # =====================================================

    current_skill_set = {
        skill.lower()
        for skill in resume_skills
    }

    missing_skills = sorted(
        required_skills - current_skill_set
    )


    # =====================================================
    # JOB MATCH INFORMATION
    # =====================================================

    job_matches = []

    for job in jobs:

        if not job.skills:
            continue

        job_skills = [
            skill.strip().lower()
            for skill in job.skills.split(",")
            if skill.strip()
        ]

        if not job_skills:
            continue

        matched_skills = [
            skill
            for skill in job_skills
            if skill in current_skill_set
        ]

        match_score = round(
            (len(matched_skills) / len(job_skills)) * 100
        )

        job_matches.append({

            "title": job.title,

            "company": getattr(
                job,
                "company",
                ""
            ),

            "location": getattr(
                job,
                "location",
                ""
            ),

            "match_score": match_score,

            "matched_skills": matched_skills,

            "missing_skills": [
                skill
                for skill in job_skills
                if skill not in current_skill_set
            ]
        })


    # =====================================================
    # INTERVIEW PERFORMANCE
    # =====================================================

    interviews = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.score.isnot(None)
        )
        .all()
    )

    interview_score = None

    if interviews:

        scores = [
            interview.score
            for interview in interviews
            if interview.score is not None
        ]

        if scores:

            interview_score = round(
                sum(scores) / len(scores)
            )


    # =====================================================
    # CAREER ROADMAP
    # =====================================================

    roadmap = []

    if missing_skills:

        roadmap = [

            {
                "step": 1,
                "title": "Learn Priority Skills",
                "skills": missing_skills[:5]
            },

            {
                "step": 2,
                "title": "Build Practical Projects",
                "description": (
                    "Create projects that demonstrate "
                    "the skills you have learned."
                )
            },

            {
                "step": 3,
                "title": "Prepare for Interviews",
                "description": (
                    "Practice technical and behavioral "
                    "interview questions."
                )
            },

            {
                "step": 4,
                "title": "Apply for Suitable Jobs",
                "description": (
                    "Apply to roles where your current "
                    "skills provide a strong match."
                )
            }

        ]

    else:

        roadmap = [

            {
                "step": 1,
                "title": "Strengthen Existing Skills"
            },

            {
                "step": 2,
                "title": "Build Real-World Projects"
            },

            {
                "step": 3,
                "title": "Practice Interviews"
            },

            {
                "step": 4,
                "title": "Apply for Suitable Jobs"
            }

        ]


    # =====================================================
    # RESUME SCORE
    # =====================================================

    resume_score = None

    if latest_resume:

        resume_score = latest_resume.ats_score


    # =====================================================
    # RESUME TEXT
    # =====================================================

    resume_text = ""

    # IMPORTANT:
    # Resume model uses "resume_text",
    # NOT "extracted_text".

    if latest_resume and latest_resume.resume_text:

        resume_text = latest_resume.resume_text


    # =====================================================
    # CALL REAL AI CAREER ASSISTANT
    # =====================================================

    try:

        ai_result = ask_career_ai(

            user_message=message,

            resume_text=resume_text,

            resume_score=resume_score,

            resume_skills=resume_skills,

            missing_skills=missing_skills,

            job_matches=job_matches,

            interview_score=interview_score,

            roadmap=roadmap
        )

    except Exception as e:

        print("Career AI Error:", str(e))

        return {

            "message": message,

            "response": (
                "I'm temporarily unable to generate "
                "an AI response. Please try again "
                "in a moment."
            ),

            "error": "AI service unavailable"
        }


    # =====================================================
    # SAVE CHAT
    # =====================================================

    try:

        chat = CareerChat(

            user_id=current_user.id,

            message=message,

            response=ai_result["response"]
        )

        db.add(chat)

        db.commit()

        db.refresh(chat)

    except Exception as e:

        db.rollback()

        print("Career Chat Database Error:", str(e))

        return {

            "message": message,

            "response": ai_result["response"],

            "action_items": ai_result["action_items"],

            "relevant_skills": ai_result["relevant_skills"],

            "recommended_roles": ai_result["recommended_roles"],

            "chat_id": None
        }


    # =====================================================
    # RETURN AI RESPONSE
    # =====================================================

    return {

        "message": message,

        "response": ai_result["response"],

        "action_items": ai_result["action_items"],

        "relevant_skills": ai_result["relevant_skills"],

        "recommended_roles": ai_result["recommended_roles"],

        "chat_id": chat.id
    }