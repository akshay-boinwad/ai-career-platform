from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.application import Application
from models.job import Job
from dependencies import get_current_user


router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"]
)


@router.post("/{job_id}")
def apply_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Check if job exists
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Check if user already applied
    existing_application = (
        db.query(Application)
        .filter(
            Application.user_id == current_user.id,
            Application.job_id == job_id
        )
        .first()
    )

    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="You have already applied for this job."
        )

    # Create application
    application = Application(
        user_id=current_user.id,
        job_id=job_id,
        status="Applied"
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "message": "Application submitted successfully",
        "application": {
            "id": application.id,
            "job_id": application.job_id,
            "job_title": job.title,
            "company": job.company,
            "status": application.status,
            "applied_at": application.applied_at
        }
    }


@router.get("/")
def get_my_applications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    applications = (
        db.query(Application)
        .filter(Application.user_id == current_user.id)
        .order_by(Application.applied_at.desc())
        .all()
    )

    results = []

    for application in applications:

        job = (
            db.query(Job)
            .filter(Job.id == application.job_id)
            .first()
        )

        results.append({
            "id": application.id,
            "job_id": application.job_id,
            "job_title": job.title if job else "Unknown Job",
            "company": job.company if job else "Unknown Company",
            "location": job.location if job else None,
            "status": application.status,
            "applied_at": application.applied_at
        })

    return {
        "applications": results
    }