from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pypdf import PdfReader
from docx import Document

from database import SessionLocal
from models.resume import Resume
from ai.resume_ai import analyze_resume_with_ai
from dependencies import get_current_user

import io


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"]
)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    # Check file type
    if file.content_type not in [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    # Read file
    contents = await file.read()

    # Check file size - 5 MB
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 5 MB."
        )

    extracted_text = ""

    try:

        # PDF
        if file.content_type == "application/pdf":

            pdf_file = io.BytesIO(contents)
            reader = PdfReader(pdf_file)

            for page in reader.pages:
                text = page.extract_text()

                if text:
                    extracted_text += text + "\n"

        # DOCX
        else:

            docx_file = io.BytesIO(contents)
            document = Document(docx_file)

            for paragraph in document.paragraphs:
                if paragraph.text.strip():
                    extracted_text += paragraph.text + "\n"

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"Unable to read resume: {str(e)}"
        )

    # Check extracted text
    if not extracted_text.strip():

        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the resume."
        )

    # -----------------------------------------
    # AI RESUME ANALYSIS
    # -----------------------------------------

    try:
        analysis = analyze_resume_with_ai(extracted_text)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"AI resume analysis failed: {str(e)}"
        )

    # -----------------------------------------
    # Validate AI response
    # -----------------------------------------

    required_fields = [
        "ats_score",
        "skills",
        "strengths",
        "weaknesses",
        "missing_skills",
        "suggestions",
        "recommended_roles"
    ]

    for field in required_fields:

        if field not in analysis:
            raise HTTPException(
                status_code=500,
                detail=f"AI response missing field: {field}"
            )

    # Connect to database
    db = SessionLocal()

    try:

        # Create resume record
        resume = Resume(
            user_id=current_user.id,
            filename=file.filename,
            resume_text=extracted_text,
            ats_score=analysis["ats_score"],
            skills=", ".join(analysis["skills"]),
            strengths=" | ".join(analysis["strengths"]),
            weaknesses=" | ".join(analysis["weaknesses"]),
            missing_skills=", ".join(analysis["missing_skills"]),
            suggestions=" | ".join(analysis["suggestions"]),
            recommended_roles=", ".join(analysis["recommended_roles"])
        )

        # Save to database
        db.add(resume)
        db.commit()
        db.refresh(resume)

    finally:
        db.close()

    # Return result
    return {
        "message": "Resume analyzed by AI and saved successfully",
        "resume_id": resume.id,
        "filename": file.filename,
        "characters": len(extracted_text),
        "analysis": analysis
    }


@router.get("/history")
def get_resume_history(
    current_user=Depends(get_current_user)
):

    db = SessionLocal()

    try:

        resumes = (
            db.query(Resume)
            .filter(Resume.user_id == current_user.id)
            .order_by(Resume.created_at.desc())
            .all()
        )

        return {
            "resumes": [
                {
                    "id": resume.id,
                    "filename": resume.filename,
                    "ats_score": resume.ats_score,
                    "skills": resume.skills,
                    "created_at": resume.created_at
                }
                for resume in resumes
            ]
        }

    finally:
        db.close()