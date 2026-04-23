import os
from dotenv import load_dotenv

load_dotenv()

class FilumAgents:
    def __init__(self):
        self._initialized = False
        self.scraper = None
        self.matcher = None
        self.tailor = None
        self._init_agents()
    
    def _init_agents(self):
        try:
            from crewai import Agent, Task, Crew, Process
            from crewai_tools import SerperDevTool, ScrapeWebsiteTool
            
            # Check if we have necessary API keys
            if not os.getenv("SERPER_API_KEY"):
                print("Warning: SERPER_API_KEY not set. Agent functionality will be limited.")
                self._initialized = False
                return
            
            search_tool = SerperDevTool()
            scrape_tool = ScrapeWebsiteTool()
            
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
            
            self._initialized = True
            print("Agents initialized successfully")
        except ImportError as e:
            print(f"Agent dependencies not available: {e}")
            self._initialized = False
        except Exception as e:
            print(f"Agent initialization failed: {e}")
            self._initialized = False

def get_agent_system():
    if not hasattr(get_agent_system, '_instance'):
        get_agent_system._instance = FilumAgents()
    return get_agent_system._instance
