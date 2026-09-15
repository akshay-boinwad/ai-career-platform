import os
import requests
from dotenv import load_dotenv

load_dotenv()

INDIANAPI_KEY = os.getenv("INDIANAPI_KEY")

BASE_URL = "https://jobs.indianapi.in"


def fetch_jobs(
    limit=10,
    location=None,
    title=None,
    company=None,
    experience=None,
    job_type=None
):
    """
    Fetch real-time jobs from IndianAPI.
    """

    if not INDIANAPI_KEY:
        raise ValueError("INDIANAPI_KEY is not configured in .env")

    params = {
        "limit": str(limit)
    }

    if location:
        params["location"] = location

    if title:
        params["title"] = title

    if company:
        params["company"] = company

    if experience:
        params["experience"] = experience

    if job_type:
        params["job_type"] = job_type

    headers = {
        "X-Api-Key": INDIANAPI_KEY,
        "Accept": "application/json"
    }

    response = requests.get(
        f"{BASE_URL}/jobs",
        params=params,
        headers=headers,
        timeout=20
    )

    if response.status_code != 200:
        raise Exception(
            f"IndianAPI error {response.status_code}: "
            f"{response.text}"
        )

    return response.json()