import json

from .gemini_service import ask_ai


# =========================================================
# AI CAREER ASSISTANT SCHEMA
# =========================================================

CAREER_ASSISTANT_SCHEMA = {
    "type": "object",

    "properties": {

        "response": {
            "type": "string",
            "description": "Helpful and personalized career advice."
        },

        "action_items": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Practical actions the user should take next."
        },

        "relevant_skills": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Skills relevant to the user's question or career."
        },

        "recommended_roles": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Relevant job roles for the candidate."
        }
    },

    "required": [
        "response",
        "action_items",
        "relevant_skills",
        "recommended_roles"
    ]
}


# =========================================================
# AI CAREER ASSISTANT
# =========================================================

def ask_career_ai(
    user_message: str,
    resume_text: str = "",
    resume_score=None,
    resume_skills=None,
    missing_skills=None,
    job_matches=None,
    interview_score=None,
    roadmap=None
):

    resume_skills = resume_skills or []
    missing_skills = missing_skills or []
    job_matches = job_matches or []
    roadmap = roadmap or []

    prompt = f"""
You are CareerAI, an intelligent personal career coach.

Your job is to help the user with:

- Career planning
- Resume improvement
- Job recommendations
- Skill development
- Interview preparation
- Career roadmap
- Job applications
- Professional growth

You have access to the user's CareerAI profile information.

==================================================
USER RESUME
==================================================

{resume_text}

==================================================
RESUME SCORE
==================================================

{resume_score}

==================================================
CURRENT SKILLS
==================================================

{", ".join(resume_skills)}

==================================================
SKILLS TO IMPROVE
==================================================

{", ".join(missing_skills)}

==================================================
JOB MATCHES
==================================================

{json.dumps(job_matches, indent=2)}

==================================================
INTERVIEW PERFORMANCE
==================================================

{interview_score}

==================================================
CAREER ROADMAP
==================================================

{json.dumps(roadmap, indent=2)}

==================================================
USER QUESTION
==================================================

{user_message}

==================================================

IMPORTANT RULES:

1. Give personalized advice based on the user's actual
   CareerAI data.

2. Do not invent skills, experience, projects,
   certifications, qualifications or achievements.

3. If the resume does not contain enough information,
   clearly say what information is missing.

4. Do not give generic advice when personalized advice
   can be provided.

5. When discussing jobs, consider the user's current
   skills and skill gaps.

6. When discussing learning, prioritize skills that can
   improve the user's job opportunities.

7. When discussing interviews, consider the user's
   interview performance if available.

8. Give practical and achievable recommendations.

9. Keep the main response clear and understandable
   for a student or job seeker.

10. Provide useful action items the user can actually
    follow.

11. Recommended roles must be realistic based on the
    candidate profile.

12. Never claim that the user has a skill unless the
    available profile data supports it.

Return the result according to the provided JSON schema.
"""

    response = ask_ai(
        prompt,
        response_schema=CAREER_ASSISTANT_SCHEMA
    )

    try:
        result = json.loads(response)

    except json.JSONDecodeError:
        raise ValueError(
            "AI returned an invalid career assistant response."
        )

    required_fields = [
        "response",
        "action_items",
        "relevant_skills",
        "recommended_roles"
    ]

    for field in required_fields:

        if field not in result:

            raise ValueError(
                f"Career AI response missing field: {field}"
            )

    return result