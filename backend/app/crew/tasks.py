from crewai import Task
from .agents import scraper_agent, matcher_agent, tailor_agent, applicator_agent

def create_scraping_task(platforms: list[str], keywords: str):
    return Task(
        description=f"Utilize available search tools to discover fresh internship listings matching '{keywords}'. Focus on specified platforms where possible: {', '.join(platforms)}, but also search broadly for recent postings.",
        expected_output="A JSON list of dictionaries containing job_title, company, description, apply_link, and platform. Ensure all links are valid and directly point to the application or job detail page.",
        agent=scraper_agent
    )

def create_matching_task(user_profile: dict):
    return Task(
        description=f"Analyze the previously found job listings against the provided user profile: {user_profile}. Score each from 0-100.",
        expected_output="The original JSON list appended with a 'fit_score' and 'fit_reasoning' for each job.",
        agent=matcher_agent,
        # In a real environment, you'd pass context=[scraping_task] when assembling the Crew
    )

def create_tailoring_task(target_job: dict, base_resume_data: dict):
    return Task(
        description=f"Given the target job {target_job['job_title']} at {target_job['company']} and the base resume data, rewrite bullet points to align with the job description.",
        expected_output="A JSON structure representing the tailored resume sections (skills, experience, summary).",
        agent=tailor_agent
    )

def create_application_task(target_job: dict):
    return Task(
        description=f"Track the application attempt for {target_job['job_title']} at {target_job['company']} using the apply_link ({target_job['apply_link']}). If auto-apply is enabled, map the tailored resume data to the form.",
        expected_output="A dictionary containing status ('success', 'failed', 'manual_required') and a status_message.",
        agent=applicator_agent
    )
