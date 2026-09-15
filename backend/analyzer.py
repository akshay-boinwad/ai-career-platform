import re


SKILLS = [
    "python",
    "java",
    "javascript",
    "react",
    "react native",
    "node.js",
    "node",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "html",
    "css",
    "git",
    "github",
    "docker",
    "aws",
    "azure",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "data analysis",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "fastapi",
    "django",
    "flask",
    "c++",
    "c#",
]


def analyze_resume(text: str):

    text_lower = text.lower()

    # Find skills
    detected_skills = []

    for skill in SKILLS:
        if skill.lower() in text_lower:
            detected_skills.append(skill)

    # Remove duplicate skills
    detected_skills = list(dict.fromkeys(detected_skills))

    # Calculate basic ATS score
    score = 40

    if len(detected_skills) >= 3:
        score += 15

    if len(detected_skills) >= 6:
        score += 10

    if any(word in text_lower for word in ["experience", "internship", "work experience"]):
        score += 10

    if any(word in text_lower for word in ["project", "projects"]):
        score += 10

    if any(word in text_lower for word in ["education", "degree", "bachelor", "master"]):
        score += 5

    if any(word in text_lower for word in ["email", "@", "phone", "contact"]):
        score += 5

    score = min(score, 95)

    # Strengths
    strengths = []

    if detected_skills:
        strengths.append(
            f"Good technical skill coverage with {len(detected_skills)} detected skills."
        )

    if "project" in text_lower or "projects" in text_lower:
        strengths.append("Projects are included in the resume.")

    if "experience" in text_lower or "internship" in text_lower:
        strengths.append("Work experience or internship information is present.")

    if "education" in text_lower or "degree" in text_lower:
        strengths.append("Educational background is included.")

    if not strengths:
        strengths.append("Resume contains useful professional information.")

    # Possible missing skills
    common_skills = [
        "python",
        "sql",
        "git",
        "javascript",
        "react",
        "machine learning",
    ]
    missing_skills = [
    skill for skill in common_skills
    if skill not in detected_skills
]

    missing_skills = [
        skill for skill in common_skills
        if skill not in detected_skills
    ]

    # Weaknesses
    weaknesses = []

    if len(detected_skills) < 3:
        weaknesses.append("Add more relevant technical skills.")

    if "project" not in text_lower:
        weaknesses.append("Add relevant projects with measurable results.")

    if "experience" not in text_lower and "internship" not in text_lower:
        weaknesses.append("Add internship or work experience if available.")

    if len(text) < 500:
        weaknesses.append("Resume content appears too short.")

    # Suggestions
    suggestions = [
        "Use clear section headings such as Skills, Projects, Education and Experience.",
        "Use measurable achievements wherever possible.",
        "Tailor your resume keywords to the job description.",
        "Keep formatting simple and ATS-friendly.",
    ]

    # Job recommendations
    job_roles = []

    if any(skill in detected_skills for skill in ["python", "java", "javascript", "c++", "c#"]):
        job_roles.append("Software Developer")

    if any(skill in detected_skills for skill in ["python", "sql", "pandas", "numpy"]):
        job_roles.append("Data Analyst")

    if any(
        skill in detected_skills
        for skill in ["machine learning", "deep learning", "tensorflow", "pytorch"]
    ):
        job_roles.append("AI/ML Engineer")

    if "react" in detected_skills or "react native" in detected_skills:
        job_roles.append("Frontend Developer")

    if not job_roles:
        job_roles.append("Software Developer")

    return {
        "ats_score": score,
        "skills": detected_skills,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "recommended_roles": list(dict.fromkeys(job_roles)),
    }