import os
import requests
from dotenv import load_dotenv

from sqlalchemy.orm import Session

from models.job import Job

load_dotenv()

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")


def search_adzuna_jobs(
    what: str = "software developer",
    where: str = "India",
    page: int = 1,
    results_per_page: int = 20
):
    """
    Search jobs from Adzuna and return normalized job data.
    """

    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        raise ValueError(
            "ADZUNA_APP_ID or ADZUNA_APP_KEY is missing from .env"
        )

    country = "in"

    url = (
        f"https://api.adzuna.com/v1/api/jobs/"
        f"{country}/search/{page}"
    )

    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "what": what,
        "where": where,
        "results_per_page": results_per_page,
        "content-type": "application/json",
    }

    response = requests.get(
        url,
        params=params,
        timeout=20
    )

    response.raise_for_status()

    data = response.json()

    normalized_jobs = []

    for item in data.get("results", []):

        company_data = item.get("company") or {}
        location_data = item.get("location") or {}

        company_name = (
            company_data.get("display_name")
            or "Unknown Company"
        )

        location_name = (
            location_data.get("display_name")
            or where
        )

        title = (
            item.get("title")
            or "Untitled Job"
        )

        description = (
            item.get("description")
            or ""
        )

        redirect_url = (
            item.get("redirect_url")
            or ""
        )

        normalized_jobs.append({
            "title": title,
            "company": company_name,
            "location": location_name,
            "description": description,
            "job_type": "",
            "experience": "",
            "skills": "",
            "application_url": redirect_url,
            "adzuna_id": str(
                item.get("id", "")
            )
        })

    return normalized_jobs


def import_adzuna_jobs(
    db: Session,
    what: str = "software developer",
    where: str = "India",
    page: int = 1,
    results_per_page: int = 20
):
    """
    Fetch jobs from Adzuna and save them into the
    existing CareerAI jobs table.

    Existing Adzuna jobs are updated instead of duplicated.
    """

    live_jobs = search_adzuna_jobs(
        what=what,
        where=where,
        page=page,
        results_per_page=results_per_page
    )

    imported_jobs = []

    for job_data in live_jobs:

        adzuna_id = job_data.get("adzuna_id")

        if not adzuna_id:
            continue

        # -----------------------------------------
        # CHECK IF JOB ALREADY EXISTS
        # -----------------------------------------

        existing_job = (
            db.query(Job)
            .filter(
                Job.adzuna_id == adzuna_id
            )
            .first()
        )

        # -----------------------------------------
        # UPDATE EXISTING JOB
        # -----------------------------------------

        if existing_job:

            existing_job.title = job_data["title"]
            existing_job.company = job_data["company"]
            existing_job.location = job_data["location"]
            existing_job.description = job_data["description"]
            existing_job.job_type = job_data["job_type"]
            existing_job.experience = job_data["experience"]
            existing_job.skills = job_data["skills"]
            existing_job.application_url = job_data[
                "application_url"
            ]

            imported_jobs.append(existing_job)

        # -----------------------------------------
        # CREATE NEW JOB
        # -----------------------------------------

        else:

            new_job = Job(
                title=job_data["title"],
                company=job_data["company"],
                location=job_data["location"],
                description=job_data["description"],
                job_type=job_data["job_type"],
                experience=job_data["experience"],
                skills=job_data["skills"],
                application_url=job_data[
                    "application_url"
                ],
                adzuna_id=adzuna_id
            )

            db.add(new_job)

            imported_jobs.append(new_job)

    db.commit()

    return imported_jobs