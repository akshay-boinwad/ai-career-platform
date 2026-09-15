import json

from .gemini_service import ask_ai


# -----------------------------------------
# AI SKILL GAP SCHEMA
# -----------------------------------------

SKILL_GAP_SCHEMA = {
    "type": "object",

    "properties": {

        "recommended_skills": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },

        "skill_analysis": {
            "type": "array",

            "items": {
                "type": "object",

                "properties": {

                    "skill": {
                        "type": "string"
                    },

                    "priority": {
                        "type": "string",
                        "enum": [
                            "High",
                            "Medium",
                            "Low"
                        ]
                    },

                    "reason": {
                        "type": "string"
                    },

                    "learning_path": {
                        "type": "string"
                    }
                },

                "required": [
                    "skill",
                    "priority",
                    "reason",
                    "learning_path"
                ]
            }
        }
    },

    "required": [
        "recommended_skills",
        "skill_analysis"
    ]
}


# -----------------------------------------
# AI SKILL GAP ANALYSIS
# -----------------------------------------

def analyze_skill_gap(
    resume_text: str,
    jobs: list
):

    jobs_text = ""

    for job in jobs:

        jobs_text += f"""
JOB ID: {job["id"]}

JOB TITLE:
{job["title"]}

REQUIRED SKILLS:
{job["skills"]}

JOB DESCRIPTION:
{job["description"]}

--------------------------------
"""

    prompt = f"""
You are an expert AI career coach and technical skills advisor.

Analyze the candidate's resume and identify the most important
skills the candidate should learn or improve to become more
competitive for the available jobs.

CANDIDATE RESUME
================================
{resume_text}
================================

AVAILABLE JOBS
================================
{jobs_text}
================================

Perform a detailed skill-gap analysis.

Consider:

1. Skills already demonstrated in the resume.
2. Skills frequently required by the available jobs.
3. Skills that are missing from the candidate profile.
4. Skills that would significantly improve employability.
5. The candidate's likely career direction.
6. Technical relevance and industry demand.

IMPORTANT RULES:

- Do not recommend skills randomly.
- Do not claim the candidate has a skill unless the resume
  supports it.
- Prioritize skills that are relevant to multiple jobs.
- Give each recommended skill a priority:
  High, Medium, or Low.
- Explain why each skill is important.
- Provide a practical learning path for each skill.
- Keep recommendations realistic for the candidate.
- Avoid unnecessary duplicate skills.

Return the result according to the provided JSON schema.
"""

    response = ask_ai(
        prompt,
        response_schema=SKILL_GAP_SCHEMA
    )

    try:

        result = json.loads(response)

    except json.JSONDecodeError:

        raise ValueError(
            "AI returned an invalid skill-gap response."
        )

    # -----------------------------------------
    # VALIDATE RESPONSE
    # -----------------------------------------

    if "recommended_skills" not in result:

        raise ValueError(
            "AI response missing recommended_skills."
        )

    if "skill_analysis" not in result:

        raise ValueError(
            "AI response missing skill_analysis."
        )

    # -----------------------------------------
    # VALIDATE SKILL ANALYSIS
    # -----------------------------------------

    validated_analysis = []

    for item in result["skill_analysis"]:

        required_fields = [
            "skill",
            "priority",
            "reason",
            "learning_path"
        ]

        if not all(
            field in item
            for field in required_fields
        ):
            continue

        if item["priority"] not in [
            "High",
            "Medium",
            "Low"
        ]:
            item["priority"] = "Medium"

        validated_analysis.append(item)

    result["skill_analysis"] = validated_analysis

    return result