from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.resume import Resume
from models.job import Job
from dependencies import get_current_user

from ai.skill_ai import analyze_skill_gap


router = APIRouter(
    prefix="/api/skills",
    tags=["Skill Gap Analysis"]
)


@router.get("/")
def get_skill_gap(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # -----------------------------------------
    # GET USER'S LATEST RESUME
    # -----------------------------------------

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

    # -----------------------------------------
    # NO RESUME
    # -----------------------------------------

    if not latest_resume:

        return {
            "message": "Please upload a resume first.",
            "resume_skills": [],
            "total_resume_skills": 0,
            "recommended_skills": [],
            "skill_analysis": [],
            "jobs": []
        }

    # -----------------------------------------
    # GET RESUME SKILLS
    # -----------------------------------------

    resume_skills = []

    if latest_resume.skills:

        resume_skills = [
            skill.strip().lower()
            for skill in latest_resume.skills.split(",")
            if skill.strip()
        ]

    resume_skill_set = set(resume_skills)

    # -----------------------------------------
    # GET AVAILABLE JOBS
    # -----------------------------------------

    jobs = (
        db.query(Job)
        .order_by(
            Job.created_at.desc()
        )
        .all()
    )

    # -----------------------------------------
    # BASIC JOB ANALYSIS
    # -----------------------------------------

    results = []

    for job in jobs:

        job_skills = []

        if job.skills:

            job_skills = [
                skill.strip().lower()
                for skill in job.skills.split(",")
                if skill.strip()
            ]

        job_skill_set = set(job_skills)

        matched_skills = sorted(
            resume_skill_set.intersection(
                job_skill_set
            )
        )

        missing_skills = sorted(
            job_skill_set - resume_skill_set
        )

        if job_skill_set:

            match_score = round(
                (
                    len(matched_skills)
                    /
                    len(job_skill_set)
                ) * 100
            )

        else:

            match_score = 0

        results.append({

            "job_id": job.id,

            "job_title": job.title,

            "company": job.company,

            "match_score": match_score,

            "matched_skills": matched_skills,

            "missing_skills": missing_skills
        })

    # -----------------------------------------
    # AI SKILL GAP ANALYSIS
    # -----------------------------------------

    recommended_skills = []
    skill_analysis = []

    if latest_resume.resume_text and jobs:

        try:

            ai_jobs = []

            for job in jobs:

                ai_jobs.append({

                    "id": job.id,

                    "title": job.title or "",

                    "skills": job.skills or "",

                    "description": (
                        job.description or ""
                    )
                })

            ai_result = analyze_skill_gap(
                resume_text=latest_resume.resume_text,
                jobs=ai_jobs
            )

            recommended_skills = (
                ai_result.get(
                    "recommended_skills",
                    []
                )
            )

            skill_analysis = (
                ai_result.get(
                    "skill_analysis",
                    []
                )
            )

        except Exception as e:

            print(
                f"AI skill-gap analysis failed: "
                f"{str(e)}"
            )

            # Keep basic results if AI fails

    # -----------------------------------------
    # SORT JOBS
    # -----------------------------------------

    results.sort(
        key=lambda item: item["match_score"],
        reverse=True
    )

    # -----------------------------------------
    # FALLBACK RECOMMENDED SKILLS
    # -----------------------------------------

    if not recommended_skills:

        all_missing_skills = set()

        for job in results:

            all_missing_skills.update(
                job["missing_skills"]
            )

        recommended_skills = sorted(
            all_missing_skills
        )

    # -----------------------------------------
    # FINAL RESPONSE
    # -----------------------------------------

    return {

        "resume_skills": sorted(
            resume_skill_set
        ),

        "total_resume_skills": len(
            resume_skill_set
        ),

        "recommended_skills": (
            recommended_skills
        ),

        "skill_analysis": skill_analysis,

        "jobs": results
    }