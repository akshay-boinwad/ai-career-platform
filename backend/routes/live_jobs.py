from fastapi import APIRouter, Depends, Query
from dependencies import get_current_user

from services.indianapi_jobs import fetch_jobs


router = APIRouter(
    prefix="/api/live-jobs",
    tags=["Real-Time Jobs"]
)


@router.get("")
def get_live_jobs(
    keyword: str = Query(
        default=None,
        description="Job title or keyword"
    ),
    location: str = Query(
        default=None,
        description="Job location"
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=10,
        description="Number of jobs to return"
    ),
    current_user=Depends(get_current_user)
):

    try:

        jobs = fetch_jobs(
            limit=limit,
            location=location,
            title=keyword
        )

        return {
            "success": True,
            "count": len(jobs) if isinstance(jobs, list) else 0,
            "jobs": jobs
        }

    except Exception as e:

        print("Live Jobs Error:", str(e))

        return {
            "success": False,
            "count": 0,
            "jobs": [],
            "error": str(e)
        }