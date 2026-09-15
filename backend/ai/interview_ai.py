import json

from .gemini_service import ask_ai


# =========================================================
# AI INTERVIEW QUESTIONS SCHEMA
# =========================================================

INTERVIEW_QUESTIONS_SCHEMA = {
    "type": "object",
    "properties": {
        "questions": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Exactly 5 interview questions."
        }
    },
    "required": [
        "questions"
    ]
}


# =========================================================
# AI INTERVIEW EVALUATION SCHEMA
# =========================================================

INTERVIEW_EVALUATION_SCHEMA = {
    "type": "object",
    "properties": {

        # Overall score
        "score": {
            "type": "integer",
            "description": "Overall interview answer score from 0 to 100."
        },

        # Detailed scores
        "technical_score": {
            "type": "integer",
            "description": "Technical knowledge score from 0 to 100."
        },

        "communication_score": {
            "type": "integer",
            "description": "Communication quality score from 0 to 100."
        },

        "problem_solving_score": {
            "type": "integer",
            "description": "Problem solving and reasoning score from 0 to 100."
        },

        # Feedback
        "feedback": {
            "type": "string",
            "description": "Clear and practical feedback on the answer."
        },

        # Strengths
        "strengths": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Important strengths demonstrated in the answer."
        },

        # Improvements
        "improvements": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Specific areas the candidate should improve."
        },

        # Better answer
        "better_answer": {
            "type": "string",
            "description": "A concise example of how the answer could be improved."
        }
    },

    "required": [
        "score",
        "technical_score",
        "communication_score",
        "problem_solving_score",
        "feedback",
        "strengths",
        "improvements",
        "better_answer"
    ]
}


# =========================================================
# GENERATE AI INTERVIEW QUESTIONS
# =========================================================

def generate_interview_questions(
    resume_text: str,
    role: str,
    difficulty: str,
    job_description: str = "",
    job_skills: str = ""
):

    prompt = f"""
You are an expert technical interviewer and career coach.

Generate a realistic mock interview for a candidate.

CANDIDATE RESUME
================================
{resume_text}
================================

TARGET ROLE
================================
{role}
================================

DIFFICULTY
================================
{difficulty}
================================

JOB DESCRIPTION
================================
{job_description}
================================

REQUIRED JOB SKILLS
================================
{job_skills}
================================

Generate EXACTLY 5 interview questions.

IMPORTANT RULES:

1. Questions must be relevant to the target role.

2. Use the candidate's resume to personalize questions.

3. Ask about skills, projects, technical knowledge,
   problem solving, and practical experience when relevant.

4. Do not ask about skills or experience that are not
   supported by the resume unless the question is clearly
   testing a required job skill.

5. Difficulty must match:

   Easy:
   Basic concepts, introduction, projects and fundamentals.

   Medium:
   Technical reasoning, problem solving and practical scenarios.

   Hard:
   Advanced technical reasoning, architecture, trade-offs
   and challenging real-world situations.

6. Avoid duplicate questions.

7. Questions should sound like real interview questions.

8. Keep questions clear and understandable.

9. Return exactly 5 questions.

Return the result according to the provided JSON schema.
"""

    response = ask_ai(
        prompt,
        response_schema=INTERVIEW_QUESTIONS_SCHEMA
    )

    try:
        result = json.loads(response)

    except json.JSONDecodeError:
        raise ValueError(
            "AI returned an invalid interview question response."
        )

    questions = result.get(
        "questions",
        []
    )

    if not isinstance(questions, list):
        raise ValueError(
            "AI interview questions must be a list."
        )

    questions = [
        str(question).strip()
        for question in questions
        if str(question).strip()
    ]

    if len(questions) < 5:
        raise ValueError(
            "AI generated fewer than 5 interview questions."
        )

    return questions[:5]


# =========================================================
# EVALUATE INTERVIEW ANSWER
# =========================================================

def evaluate_interview_answer(
    resume_text: str,
    role: str,
    difficulty: str,
    question: str,
    answer: str,
    job_description: str = "",
    job_skills: str = ""
):

    prompt = f"""
You are an expert technical interviewer and professional
career coach.

Evaluate the candidate's answer to the interview question.

CANDIDATE RESUME
================================
{resume_text}
================================

TARGET ROLE
================================
{role}
================================

DIFFICULTY
================================
{difficulty}
================================

JOB DESCRIPTION
================================
{job_description}
================================

REQUIRED JOB SKILLS
================================
{job_skills}
================================

INTERVIEW QUESTION
================================
{question}
================================

CANDIDATE ANSWER
================================
{answer}
================================


Evaluate the answer fairly.

Evaluate these areas separately:

1. TECHNICAL KNOWLEDGE

Evaluate:

- Technical correctness
- Understanding of concepts
- Relevant technologies
- Accuracy of the explanation
- Practical technical knowledge


2. COMMUNICATION

Evaluate:

- Clarity
- Structure
- Confidence of explanation
- Ability to communicate technical concepts
- Conciseness
- Use of examples


3. PROBLEM SOLVING

Evaluate:

- Logical reasoning
- Approach to solving problems
- Practical thinking
- Understanding of trade-offs
- Ability to explain decisions


4. OVERALL PERFORMANCE

Give an overall score based on the complete answer.

IMPORTANT:

The overall score should represent the quality of the
complete answer and should NOT simply be based on answer length.

SCORING GUIDELINES:

90-100:
Excellent answer with strong understanding,
clear reasoning and relevant examples.

75-89:
Good answer with solid understanding but
some areas could be improved.

60-74:
Average answer with reasonable understanding
but missing important details.

40-59:
Weak answer with limited explanation,
missing details or unclear reasoning.

0-39:
Very weak answer, incorrect, irrelevant,
or extremely incomplete.


IMPORTANT RULES:

- Be fair and realistic.
- Do not give a high score only because the answer is long.
- Do not penalize short answers automatically if they are
  technically correct and complete.
- Do not invent experience for the candidate.
- Only consider experience supported by the resume.
- Feedback must be specific and useful.
- Provide practical improvements.
- The better answer should be an example, not something
  the candidate must copy word-for-word.
- Scores must be between 0 and 100.
- Keep the feedback understandable to a student or job seeker.

Return the result according to the provided JSON schema.
"""

    response = ask_ai(
        prompt,
        response_schema=INTERVIEW_EVALUATION_SCHEMA
    )

    try:
        result = json.loads(response)

    except json.JSONDecodeError:
        raise ValueError(
            "AI returned an invalid interview evaluation response."
        )

    required_fields = [
        "score",
        "technical_score",
        "communication_score",
        "problem_solving_score",
        "feedback",
        "strengths",
        "improvements",
        "better_answer"
    ]

    for field in required_fields:

        if field not in result:
            raise ValueError(
                f"AI interview evaluation missing field: {field}"
            )

    # ==========================================
    # VALIDATE SCORES
    # ==========================================

    result["score"] = max(
        0,
        min(
            100,
            int(result["score"])
        )
    )

    result["technical_score"] = max(
        0,
        min(
            100,
            int(result["technical_score"])
        )
    )

    result["communication_score"] = max(
        0,
        min(
            100,
            int(result["communication_score"])
        )
    )

    result["problem_solving_score"] = max(
        0,
        min(
            100,
            int(result["problem_solving_score"])
        )
    )

    return result