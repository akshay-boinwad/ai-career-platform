from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.job import Job
from models.resume import Resume
from dependencies import get_current_user

from job_matcher import (
    calculate_job_match,
    get_matched_skills,
    get_missing_skills
)

from ai.job_ai import analyze_jobs_match

from services.adzuna_service import import_adzuna_jobs


router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"]
)


# =========================================================
# IMPORT LIVE JOBS FROM ADZUNA
# =========================================================

@router.post("/import-adzuna")
def import_live_adzuna_jobs(
    what: str = "software developer",
    where: str = "India",
    page: int = 1,
    results_per_page: int = 20,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Fetch live jobs from Adzuna and store them
    in the CareerAI database.

    Existing Adzuna jobs are updated instead of
    creating duplicates.
    """

    imported_jobs = import_adzuna_jobs(
        db=db,
        what=what,
        where=where,
        page=page,
        results_per_page=results_per_page
    )

    return {
        "message": "Adzuna jobs imported successfully",
        "count": len(imported_jobs)
    }


# =========================================================
# GET JOB RECOMMENDATIONS
# =========================================================

@router.get("/")
def get_jobs(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # -----------------------------------------------------
    # GET USER'S LATEST RESUME
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # GET ALL AVAILABLE JOBS
    # -----------------------------------------------------

    jobs = (
        db.query(Job)
        .order_by(
            Job.created_at.desc()
        )
        .all()
    )

    # -----------------------------------------------------
    # NO JOBS
    # -----------------------------------------------------

    if not jobs:
        return {
            "jobs": []
        }

    # -----------------------------------------------------
    # PREPARE BASIC JOB DATA
    # -----------------------------------------------------

    basic_results = []

    for job in jobs:

        job_skills = []

        if job.skills:

            job_skills = [
                skill.strip()
                for skill in job.skills.split(",")
                if skill.strip()
            ]

        # -------------------------------------------------
        # BASIC FALLBACK MATCHING
        # -------------------------------------------------

        basic_match_score = calculate_job_match(
            [],
            job_skills
        )

        basic_matched_skills = get_matched_skills(
            [],
            job_skills
        )

        basic_missing_skills = get_missing_skills(
            [],
            job_skills
        )

        basic_results.append({

            "id": job.id,

            "title": job.title,

            "company": job.company,

            "location": job.location,

            "skills": job.skills,

            "description": job.description,

            "job_type": job.job_type,

            "experience": job.experience,

            "application_url": job.application_url,

            "adzuna_id": job.adzuna_id,

            "match_score": basic_match_score,

            "matched_skills": basic_matched_skills,

            "missing_skills": basic_missing_skills,

            "match_reason": (
                "Basic skill matching used."
            )
        })

    # =====================================================
    # AI MATCHING WITH GEMINI
    # =====================================================

    if latest_resume and latest_resume.resume_text:

        try:

            # -------------------------------------------------
            # PREPARE JOBS FOR GEMINI
            # -------------------------------------------------

            ai_jobs = []

            for job in jobs:

                ai_jobs.append({

                    "id": job.id,

                    "title": job.title or "",

                    "description": job.description or "",

                    "skills": job.skills or ""
                })

            # -------------------------------------------------
            # ONE GEMINI REQUEST FOR ALL JOBS
            # -------------------------------------------------

            ai_matches = analyze_jobs_match(
                resume_text=latest_resume.resume_text,
                jobs=ai_jobs
            )

            # -------------------------------------------------
            # CONVERT AI RESULTS INTO LOOKUP DICTIONARY
            # -------------------------------------------------

            ai_match_map = {
                match["job_id"]: match
                for match in ai_matches
            }

            # -------------------------------------------------
            # APPLY AI RESULTS
            # -------------------------------------------------

            for result in basic_results:

                job_id = result["id"]

                if job_id not in ai_match_map:
                    continue

                ai_result = ai_match_map[job_id]

                result["match_score"] = ai_result[
                    "match_score"
                ]

                result["matched_skills"] = ai_result[
                    "matched_skills"
                ]

                result["missing_skills"] = ai_result[
                    "missing_skills"
                ]

                result["match_reason"] = ai_result[
                    "reason"
                ]

        except Exception as e:

            # -------------------------------------------------
            # FALLBACK
            # -------------------------------------------------

            print(
                f"AI job matching failed: {str(e)}"
            )

    # -----------------------------------------------------
    # SORT BY MATCH SCORE
    # -----------------------------------------------------

    basic_results.sort(
        key=lambda job: job["match_score"],
        reverse=True
    )

    # -----------------------------------------------------
    # RETURN RESULTS
    # -----------------------------------------------------

    return {
        "jobs": basic_results
    }