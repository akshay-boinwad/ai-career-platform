import json

from .gemini_service import ask_ai


# -----------------------------------------
# RESUME ANALYSIS JSON SCHEMA
# -----------------------------------------

RESUME_SCHEMA = {
    "type": "object",

    "properties": {

        "ats_score": {
            "type": "integer",
            "description": "ATS compatibility score from 0 to 100."
        },

        "skills": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Technical and professional skills clearly found in the resume."
        },

        "strengths": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Important strengths demonstrated by the resume."
        },

        "weaknesses": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Important weaknesses or areas that need improvement."
        },

        "missing_skills": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Useful skills that appear to be missing based on the candidate profile."
        },

        "suggestions": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Practical suggestions for improving the resume."
        },

        "recommended_roles": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Realistic job roles based on the resume."
        }
    },

    "required": [
        "ats_score",
        "skills",
        "strengths",
        "weaknesses",
        "missing_skills",
        "suggestions",
        "recommended_roles"
    ]
}


# -----------------------------------------
# AI RESUME ANALYZER
# -----------------------------------------

def analyze_resume_with_ai(resume_text: str):

    prompt = f"""
You are an expert ATS resume analyzer and professional career coach.

Analyze the following resume carefully.

RESUME
--------------------------------
{resume_text}
--------------------------------

Perform a detailed but realistic analysis.

IMPORTANT RULES:

1. Do not invent qualifications, experience, projects,
   certifications or skills that are not supported by the resume.

2. Identify technical and professional skills clearly
   present in the resume.

3. Give an ATS score between 0 and 100.

4. Consider these factors when calculating the ATS score:
   - Relevant skills
   - Education
   - Projects
   - Work experience
   - Achievements
   - Keywords
   - Resume structure
   - Clarity
   - Relevance to technical roles

5. Provide 3 to 5 important strengths.

6. Provide 3 to 5 weaknesses or areas that need improvement.

7. Identify useful skills that are missing or could improve
   the candidate's employability.

8. Provide 4 to 6 practical resume improvement suggestions.

9. Recommend 3 to 5 realistic job roles based only on
   the candidate's demonstrated profile.

10. Keep the analysis specific to this resume.
    Do not give generic advice when specific advice is possible.

Return the result according to the provided JSON schema.
"""

    response = ask_ai(
        prompt,
        response_schema=RESUME_SCHEMA
    )

    try:

        analysis = json.loads(response)

    except json.JSONDecodeError:

        raise ValueError(
            "AI returned an invalid structured response."
        )

    # -----------------------------------------
    # BASIC VALIDATION
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

            raise ValueError(
                f"AI response missing field: {field}"
            )

    # Keep ATS score within valid range
    analysis["ats_score"] = max(
        0,
        min(
            100,
            int(analysis["ats_score"])
        )
    )

    return analysis