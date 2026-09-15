from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.resume import Resume
from models.interview import Interview
from models.job import Job
from dependencies import get_current_user


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # =========================================================
    # LATEST RESUME
    # =========================================================

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

    # Default value when no resume exists
    resume_score = None

    if latest_resume:
        resume_score = latest_resume.ats_score


    # =========================================================
    # AVAILABLE JOBS
    # =========================================================

    jobs = db.query(Job).all()


    # =========================================================
    # RESUME SKILLS
    # =========================================================

    resume_skills = set()

    if latest_resume and latest_resume.skills:

        resume_skills = {
            skill.strip().lower()
            for skill in latest_resume.skills.split(",")
            if skill.strip()
        }


    # =========================================================
    # JOB MATCHES
    # =========================================================

    job_matches = 0

    # A user without a resume cannot have personalized
    # job matches yet.
    if latest_resume:

        for job in jobs:

            if not job.skills:
                continue

            job_skills = {
                skill.strip().lower()
                for skill in job.skills.split(",")
                if skill.strip()
            }

            if not job_skills:
                continue

            matched_skills = resume_skills.intersection(
                job_skills
            )

            match_score = (
                len(matched_skills) / len(job_skills)
            ) * 100

            # Same matching rule used by the platform
            if match_score >= 50:
                job_matches += 1


    # =========================================================
    # SKILLS TO IMPROVE
    # =========================================================

    missing_skills = set()

    # If there is no resume, there are no personalized
    # skills to improve.
    if latest_resume:

        for job in jobs:

            if not job.skills:
                continue

            job_skills = {
                skill.strip().lower()
                for skill in job.skills.split(",")
                if skill.strip()
            }

            if not job_skills:
                continue

            matched_skills = resume_skills.intersection(
                job_skills
            )

            match_score = (
                len(matched_skills) / len(job_skills)
            ) * 100

            # Only calculate missing skills for jobs
            # that are reasonably relevant to the user.
            if match_score >= 50:

                missing_skills.update(
                    job_skills - resume_skills
                )


    # =========================================================
    # INTERVIEW COUNT
    # =========================================================

    interview_count = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.score.isnot(None)
        )
        .count()
    )


    # =========================================================
    # RESPONSE
    # =========================================================

    return {
        "resume_score": resume_score,
        "job_matches": job_matches,
        "skills_to_improve": len(missing_skills),
        "interviews": interview_count,
    }