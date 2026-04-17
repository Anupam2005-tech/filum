from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, ScrapeWebsiteTool
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Tools
search_tool = SerperDevTool()
scrape_tool = ScrapeWebsiteTool()

class FilumAgents:
    def __init__(self):
        # Scraper Agent: Finds the listings
        self.scraper = Agent(
            role='Internship Scout',
            goal='Discover high-quality internship listings for {role} in {locations}',
            backstory='You are an expert at navigating job boards, LinkedIn, and company career pages to find the most relevant and recent internship openings.',
            tools=[search_tool, scrape_tool],
            verbose=True,
            allow_delegation=False,
            memory=True
        )

        # Matcher Agent: Analyzes fit
        self.matcher = Agent(
            role='Fit Analyst',
            goal='Analyze the fit between the user profile and the discovered {role} internships',
            backstory='You are a precision-focused analyst who evaluates skills, experience, and requirements to provide a a scoring percentage for each match.',
            tools=[search_tool],
            verbose=True,
            allow_delegation=False,
            memory=True
        )

        # Tailor Agent: Optimizes the resume
        self.tailor = Agent(
            role='Resume Specialist',
            goal='Tailor the user resume to perfectly align with the specific requirements of a job description',
            backstory='You are a veteran career consultant who knows exactly how to highlight relevant experience and use keywords that pass ATS filters while remaining authentic.',
            tools=[],
            verbose=True,
            allow_delegation=False,
            memory=True
        )

    def run_discovery_pipeline(self, role: str, locations: str, user_profile: str):
        # Task 1: Scrape and find links
        search_task = Task(
            description=f"Search for the latest {role} internships in {locations}. Return a list of the top 10 most relevant openings with their direct application links and a brief summary of requirements.",
            expected_output="A structured list of 10 internships including: Company, Role, Link, and Key Requirements.",
            agent=self.scraper
        )

        # Task 2: Match against profile
        match_task = Task(
            description=f"Given the discovered internships and the following user profile: {user_profile}, calculate a match score (0-100%) for each. Explain why the score was given based on skills and experience.",
            expected_output="A list of the same 10 internships, each with a Fit Score (%), a summary of matching skills, and a list of missing requirements.",
            agent=self.matcher
        )

        crew = Crew(
            agents=[self.scraper, self.matcher],
            tasks=[search_task, match_task],
            process=Process.sequential,
            verbose=True
        )

        return crew.kickoff(inputs={'role': role, 'locations': locations})

    def run_tailoring_pipeline(self, resume_text: str, job_description: str):
        tailor_task = Task(
            description=f"Tailor the following resume to match this job description:\n\nResume:\n{resume_text}\n\nJob Description:\n{job_description}\n\nEnsure the output is a professional, high-impact resume that emphasizes the most relevant skills and achievements.",
            expected_output="A fully tailored, professional resume in markdown format, optimized for ATS and human recruiters.",
            agent=self.tailor
        )

        crew = Crew(
            agents=[self.tailor],
            tasks=[tailor_task],
            process=Process.sequential,
            verbose=True
        )

        return crew.kickoff()

agent_system = FilumAgents()
