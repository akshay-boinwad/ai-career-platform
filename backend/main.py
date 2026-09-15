from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base

# =========================================================
# MODELS
# =========================================================

from models.user import User
from models.resume import Resume
from models.job import Job
from models.application import Application
from models.career_chat import CareerChat


# =========================================================
# AUTH ROUTES
# =========================================================

from api.routes.auth import router as auth_router


# =========================================================
# APPLICATION ROUTES
# =========================================================

from routes.resume import router as resume_router
from routes.jobs import router as jobs_router
from routes.applications import router as applications_router
from routes.skills import router as skills_router
from routes.interview import router as interview_router
from routes.roadmap import router as roadmap_router
from routes.career_assistant import router as career_assistant_router
from routes.dashboard import router as dashboard_router
from routes.live_jobs import router as live_jobs_router


# =========================================================
# CREATE DATABASE TABLES
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="CareerAI API",
    description="AI-Powered All-in-One Career & Job Readiness Platform",
    version="1.0.0"
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        # React / Vite localhost
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",

        # React / Vite 127.0.0.1
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


# =========================================================
# REGISTER ROUTES
# =========================================================

app.include_router(auth_router)

app.include_router(resume_router)

app.include_router(jobs_router)

app.include_router(applications_router)

app.include_router(skills_router)

app.include_router(interview_router)

app.include_router(roadmap_router)

app.include_router(career_assistant_router)

app.include_router(dashboard_router)

app.include_router(live_jobs_router)

# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to CareerAI API 🚀"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "message": "CareerAI backend is running"
    }