import json

from .gemini_service import ask_ai


# -----------------------------------------
# AI JOB MATCHING SCHEMA
# -----------------------------------------

JOB_MATCH_SCHEMA = {
    "type": "object",

    "properties": {

        "matches": {
            "type": "array",

            "items": {
                "type": "object",

                "properties": {

                    "job_id": {
                        "type": "integer"
                    },

                    "match_score": {
                        "type": "integer"
                    },

                    "matched_skills": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },

                    "missing_skills": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },

                    "reason": {
                        "type": "string"
                    }
                },

                "required": [
                    "job_id",
                    "match_score",
                    "matched_skills",
                    "missing_skills",
                    "reason"
                ]
            }
        }
    },

    "required": [
        "matches"
    ]
}


# -----------------------------------------
# AI JOB MATCHING - ALL JOBS AT ONCE
# -----------------------------------------

def analyze_jobs_match(
    resume_text: str,
    jobs: list
):

    jobs_text = ""

    for job in jobs:

        jobs_text += f"""
JOB ID: {job["id"]}

JOB TITLE:
{job["title"]}

JOB DESCRIPTION:
{job["description"]}

REQUIRED SKILLS:
{job["skills"]}

--------------------------------
"""

    prompt = f"""
You are an expert AI recruitment and career recommendation system.

Analyze the candidate's resume against ALL of the jobs provided below.

CANDIDATE RESUME
================================
{resume_text}
================================

JOBS
================================
{jobs_text}
================================

For EVERY job, calculate:

1. Match score from 0 to 100.
2. Skills demonstrated by the candidate that are relevant to the job.
3. Important skills required by the job that appear to be missing.
4. A short explanation of the match.

Consider:

- Technical skills
- Programming languages
- Frameworks
- Databases
- Tools
- Projects
- Education
- Experience
- Job requirements
- Semantic similarity between related skills
- Overall relevance

IMPORTANT RULES:

- Give realistic scores.
- Do not give a high score simply because one skill matches.
- Do not invent candidate experience or skills.
- Only use information supported by the resume.
- Return exactly one result for every provided job.
- Keep the original job ID for every result.
- Match scores must be between 0 and 100.
- Keep explanations short and understandable.

Return the result according to the provided JSON schema.
"""

    response = ask_ai(
        prompt,
        response_schema=JOB_MATCH_SCHEMA
    )

    try:

        result = json.loads(response)

    except json.JSONDecodeError:

        raise ValueError(
            "AI returned an invalid job matching response."
        )

    if "matches" not in result:

        raise ValueError(
            "AI job matching response missing matches."
        )

    # -----------------------------------------
    # VALIDATE EACH MATCH
    # -----------------------------------------

    validated_matches = []

    for match in result["matches"]:

        required_fields = [
            "job_id",
            "match_score",
            "matched_skills",
            "missing_skills",
            "reason"
        ]

        if not all(
            field in match
            for field in required_fields
        ):
            continue

        match["match_score"] = max(
            0,
            min(
                100,
                int(match["match_score"])
            )
        )

        validated_matches.append(match)

    return validated_matches