from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.resume import Resume
from models.job import Job
from dependencies import get_current_user


router = APIRouter(
    prefix="/api/roadmap",
    tags=["Career Roadmap"]
)


@router.get("/")
def get_career_roadmap(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Get user's latest resume
    latest_resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .first()
    )

    # No resume uploaded
    if not latest_resume:
        return {
            "message": "Please upload a resume first.",
            "current_skills": [],
            "skills_to_learn": [],
            "roadmap": []
        }

    # Get current resume skills
    current_skills = []

    if latest_resume.skills:
        current_skills = [
            skill.strip().lower()
            for skill in latest_resume.skills.split(",")
            if skill.strip()
        ]

    current_skill_set = set(current_skills)

    # Get available jobs
    jobs = (
        db.query(Job)
        .order_by(Job.created_at.desc())
        .all()
    )

    # Collect skills required by jobs
    required_skills = set()

    for job in jobs:
        if job.skills:
            job_skills = [
                skill.strip().lower()
                for skill in job.skills.split(",")
                if skill.strip()
            ]

            required_skills.update(job_skills)

    # Skills missing from the resume
    skills_to_learn = sorted(
        required_skills - current_skill_set
    )

    # Build learning roadmap
    roadmap = []

    if skills_to_learn:
        for index, skill in enumerate(skills_to_learn):

            if index < 2:
                stage = "Foundation"
                description = (
                    f"Learn the fundamentals of {skill} "
                    "and understand its core concepts."
                )

            elif index < 4:
                stage = "Intermediate"
                description = (
                    f"Practice {skill} through hands-on "
                    "projects and practical exercises."
                )

            else:
                stage = "Advanced"
                description = (
                    f"Develop advanced knowledge of {skill} "
                    "and apply it in real-world projects."
                )

            roadmap.append({
                "step": index + 1,
                "skill": skill,
                "stage": stage,
                "description": description
            })

    return {
        "current_skills": sorted(current_skill_set),
        "total_current_skills": len(current_skill_set),

        "skills_to_learn": skills_to_learn,
        "total_skills_to_learn": len(skills_to_learn),

        "target_jobs": [
            {
                "id": job.id,
                "title": job.title,
                "company": job.company
            }
            for job in jobs
        ],

        "roadmap": roadmap
    }