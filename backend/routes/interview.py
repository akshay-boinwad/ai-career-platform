from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.interview import Interview
from models.job import Job
from models.resume import Resume
from dependencies import get_current_user

from ai.interview_ai import (
    generate_interview_questions,
    evaluate_interview_answer
)


router = APIRouter(
    prefix="/api/interview",
    tags=["Mock Interview"]
)


# ==========================================
# START AI MOCK INTERVIEW
# ==========================================

@router.post("/start")
def start_interview(
    role: str,
    difficulty: str = "Medium",
    job_id: int | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # --------------------------------------
    # Validate role
    # --------------------------------------

    if not role.strip():
        raise HTTPException(
            status_code=400,
            detail="Role cannot be empty."
        )

    role = role.strip()

    # --------------------------------------
    # Validate difficulty
    # --------------------------------------

    difficulty = difficulty.capitalize()

    if difficulty not in [
        "Easy",
        "Medium",
        "Hard"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Difficulty must be Easy, Medium, or Hard."
        )

    # --------------------------------------
    # Get latest resume
    # --------------------------------------

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

    if not latest_resume:
        raise HTTPException(
            status_code=400,
            detail="Please upload a resume before starting an AI mock interview."
        )

    if not latest_resume.resume_text:
        raise HTTPException(
            status_code=400,
            detail="Resume text is not available."
        )

    # --------------------------------------
    # Get job information if job_id exists
    # --------------------------------------

    job_description = ""
    job_skills = ""

    if job_id is not None:

        job = (
            db.query(Job)
            .filter(
                Job.id == job_id
            )
            .first()
        )

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found."
            )

        job_description = job.description or ""
        job_skills = job.skills or ""

    # --------------------------------------
    # Generate questions using AI
    # --------------------------------------

    try:

        questions = generate_interview_questions(
            resume_text=latest_resume.resume_text,
            role=role,
            difficulty=difficulty,
            job_description=job_description,
            job_skills=job_skills
        )

    except Exception as e:

        print(
            f"AI interview question generation failed: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"AI interview generation failed: {str(e)}"
        )

    # --------------------------------------
    # Create interview questions in database
    # --------------------------------------

    created_interviews = []

    try:

        for question in questions:

            interview = Interview(
                user_id=current_user.id,
                job_id=job_id,
                role=role,
                difficulty=difficulty,
                question=question
            )

            db.add(interview)
            db.flush()

            created_interviews.append({
                "id": interview.id,
                "role": interview.role,
                "difficulty": interview.difficulty,
                "question": interview.question
            })

        db.commit()

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Unable to save interview questions: {str(e)}"
        )

    return {
        "message": "AI mock interview started successfully.",
        "total_questions": len(created_interviews),
        "interviews": created_interviews
    }


# ==========================================
# SUBMIT ANSWER
# ==========================================

@router.post("/{interview_id}/answer")
def submit_answer(
    interview_id: int,
    answer: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # --------------------------------------
    # Find interview question
    # --------------------------------------

    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.user_id == current_user.id
        )
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview question not found."
        )

    # --------------------------------------
    # Validate answer
    # --------------------------------------

    if not answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty."
        )

    answer = answer.strip()

    # --------------------------------------
    # Get latest resume
    # --------------------------------------

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

    if not latest_resume:
        raise HTTPException(
            status_code=400,
            detail="Resume not found."
        )

    # --------------------------------------
    # Get job information
    # --------------------------------------

    job_description = ""
    job_skills = ""

    if interview.job_id is not None:

        job = (
            db.query(Job)
            .filter(
                Job.id == interview.job_id
            )
            .first()
        )

        if job:

            job_description = (
                job.description or ""
            )

            job_skills = (
                job.skills or ""
            )

    # --------------------------------------
    # Evaluate answer using AI
    # --------------------------------------

    try:

        evaluation = evaluate_interview_answer(
            resume_text=latest_resume.resume_text,
            role=interview.role,
            difficulty=interview.difficulty,
            question=interview.question,
            answer=answer,
            job_description=job_description,
            job_skills=job_skills
        )

    except Exception as e:

        print(
            f"AI interview evaluation failed: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"AI answer evaluation failed: {str(e)}"
        )

    # --------------------------------------
    # Save AI evaluation
    # --------------------------------------

    interview.answer = answer

    interview.score = evaluation["score"]

    interview.feedback = evaluation["feedback"]

    try:

        db.commit()
        db.refresh(interview)

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Unable to save interview evaluation: {str(e)}"
        )

    # --------------------------------------
    # Count completed questions
    # --------------------------------------

    completed_questions = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.role == interview.role,
            Interview.difficulty == interview.difficulty,
            Interview.answer.isnot(None)
        )
        .count()
    )

    return {
        "message": "Answer evaluated successfully.",

        "result": {
            "interview_id": interview.id,
            "question": interview.question,
            "answer": interview.answer,
            "score": interview.score,
            "feedback": interview.feedback,

            # New AI feedback
            "strengths": evaluation["strengths"],
"improvements": evaluation["improvements"],
"better_answer": evaluation["better_answer"],

"technical_score": evaluation["technical_score"],
"communication_score": evaluation["communication_score"],
"problem_solving_score": evaluation["problem_solving_score"]
        },

        "completed_questions": completed_questions,

        "total_questions": 5
    }


# ==========================================
# INTERVIEW HISTORY
# ==========================================

@router.get("/history")
def get_interview_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    interviews = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id
        )
        .order_by(
            Interview.created_at.desc()
        )
        .all()
    )

    return {
        "interviews": [
            {
                "id": interview.id,
                "role": interview.role,
                "difficulty": interview.difficulty,
                "question": interview.question,
                "answer": interview.answer,
                "score": interview.score,
                "feedback": interview.feedback,
                "created_at": interview.created_at
            }

            for interview in interviews
        ]
    }