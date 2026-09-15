def calculate_job_match(resume_skills, job_skills):
    """
    Calculate how well a resume matches a job based on skills.
    """

    if not resume_skills or not job_skills:
        return 0

    resume_set = {
        skill.strip().lower()
        for skill in resume_skills
        if skill.strip()
    }

    job_set = {
        skill.strip().lower()
        for skill in job_skills
        if skill.strip()
    }

    if not job_set:
        return 0

    matched_skills = resume_set.intersection(job_set)

    score = round((len(matched_skills) / len(job_set)) * 100)

    return score


def get_matched_skills(resume_skills, job_skills):
    """
    Return the skills that exist in both resume and job.
    """

    resume_set = {
        skill.strip().lower()
        for skill in resume_skills
        if skill.strip()
    }

    job_set = {
        skill.strip().lower()
        for skill in job_skills
        if skill.strip()
    }

    return sorted(resume_set.intersection(job_set))
def get_missing_skills(resume_skills, job_skills):
    """
    Return job skills that are missing from the resume.
    """

    resume_set = {
        skill.strip().lower()
        for skill in resume_skills
        if skill.strip()
    }

    job_set = {
        skill.strip().lower()
        for skill in job_skills
        if skill.strip()
    }

    return sorted(job_set - resume_set)