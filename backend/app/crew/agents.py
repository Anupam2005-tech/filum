from crewai import Agent
from crewai_tools import SerperDevTool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
import os

# --- LLM Configurations ---

# 1. Native Google Gemini (Gemma 4)
# Best for high-volume logic and context matching (Analyst/Scraping)
gemma_llm = ChatGoogleGenerativeAI(
    model="gemma-4-31b",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# 2. Puter Unified API (OpenAI Compatible)
# We use one token to access best-in-class models for specialized tasks
puter_base_url = "https://api.puter.com/puterai/openai/v1/"
puter_api_key = os.getenv("PUTER_AUTH_TOKEN")

# Claude 3.5 Sonnet for natural prose (Resume Specialist)
claude_llm = ChatOpenAI(
    base_url=puter_base_url,
    api_key=puter_api_key,
    model="claude-3.5-sonnet"
)

# GPT-4o for logical precision (Applicator/Final Polish)
openai_llm = ChatOpenAI(
    base_url=puter_base_url,
    api_key=puter_api_key,
    model="gpt-4o"
)

# --- Tools ---
search_tool = SerperDevTool()

scraper_agent = Agent(
    role="Internship Scout",
    goal="Discover fresh internship listings using advanced reasoning and tool-use.",
    backstory="Powered by Gemma 4, this agent is optimized for autonomous web exploration and rapid data extraction.",
    verbose=True,
    allow_delegation=False,
    llm=gemma_llm,
    tools=[search_tool]
)

matcher_agent = Agent(
    role="Fit Analyst",
    goal="Match user profiles against Job Descriptions and generate a precise fit score.",
    backstory="Utilizes Gemma 4's massive context window to contrast subtle resume details against complex job requirements.",
    verbose=True,
    allow_delegation=False,
    llm=gemma_llm
)

tailor_agent = Agent(
    role="Resume Specialist",
    goal="Rewrite and optimize resumes using high-fidelity human-like prose.",
    backstory="Enhanced with Claude 3.5 Sonnet to ensure the most natural, persuasive, and professional tone possible.",
    verbose=True,
    allow_delegation=False,
    llm=claude_llm
)

applicator_agent = Agent(
    role="Application Manager",
    goal="Orchestrate the final submission process with logical precision.",
    backstory="Uses GPT-4o's superior following of multi-step instructions to ensure flawless form submissions.",
    verbose=True,
    allow_delegation=False,
    llm=openai_llm
)
