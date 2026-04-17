from crewai import Crew, Process
from .agents import scraper_agent, matcher_agent, tailor_agent, applicator_agent
from .tasks import create_scraping_task, create_matching_task

def run_job_search_crew(platforms: list[str], keywords: str, user_profile: dict):
    """Runs the initial discovery and matching pipeline."""
    
    scrape_task = create_scraping_task(platforms, keywords)
    match_task = create_matching_task(user_profile)
    
    # In Sequential process, output of scrape_task automatically feeds into match_task
    crew = Crew(
        agents=[scraper_agent, matcher_agent],
        tasks=[scrape_task, match_task],
        process=Process.sequential,
        verbose=True
    )
    
    # Execute the crew workflow
    result = crew.kickoff()
    return result

def run_application_crew(target_job: dict, base_resume_data: dict, auto_apply: bool):
    """Runs the tailoring and application pipeline for a specific job."""
    from .tasks import create_tailoring_task, create_application_task
    
    tailor_task = create_tailoring_task(target_job, base_resume_data)
    apply_task = create_application_task(target_job)
    
    agents = [tailor_agent]
    tasks = [tailor_task]
    
    if auto_apply:
        agents.append(applicator_agent)
        tasks.append(apply_task)
    
    crew = Crew(
        agents=agents,
        tasks=tasks,
        process=Process.sequential,
        verbose=True
    )
    
    result = crew.kickoff()
    return result
