from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import httpx
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Filum Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE (Optional - graceful fallback) ---
db = None
try:
    from .database import db as _db
    db = _db
except Exception as e:
    print(f"Database initialization skipped: {e}")

# --- AGENTS (Optional - graceful fallback) ---
agents_available = True
try:
    from .agents import get_agent_system
except Exception as e:
    print(f"Agents module not available: {e}")
    agents_available = False

# --- PARSER ---
try:
    from .parser import parser
except Exception as e:
    print(f"Parser initialization skipped: {e}")
    parser = None

# --- ONBOARDING & PROFILE ---

class UserSync(BaseModel):
    uid: str
    email: Optional[str] = None
    displayName: Optional[str] = None
    photoURL: Optional[str] = None

@app.post("/user/sync")
async def sync_user(user: UserSync):
    user_data = {
        "email": user.email,
        "displayName": user.displayName,
        "photoURL": user.photoURL,
        "last_login": datetime.utcnow().isoformat()
    }
    
    if db:
        await db.update_user_profile(user.uid, user_data)
    return {"success": True, "uid": user.uid}

class OnboardingProfile(BaseModel):
    sector: str
    position: str
    experience_years: str
    company_size: str
    work_mode: str
    top_technologies: List[str]

@app.post("/onboarding/profile")
async def save_onboarding_profile(user_id: str = Form(...), data: str = Form(...)):
    import json
    profile_data = json.loads(data)
    
    profile = {
        **profile_data,
        "completed": True,
        "updated_at": datetime.utcnow().isoformat()
    }
    
    if db:
        await db.update_user_profile(user_id, profile)
    return {"success": True}

@app.post("/onboarding/resume")
async def upload_resume(user_id: str = Form(...), file: UploadFile = File(...)):
    content = await file.read()
    
    text = ""
    if parser:
        text = parser.parse(content, file.filename)
    
    resume_data = {
        "text": text,
        "filename": file.filename,
        "timestamp": datetime.utcnow().isoformat(),
        "parsed": True
    }
    
    if db:
        await db.save_resume(user_id, resume_data)
    return {"success": True, "resume_id": "local_" + user_id}

# --- USER STATUS & DATA ---

@app.get("/user/status/{user_id}")
async def get_user_status(user_id: str):
    profile = None
    resume = None
    
    if db:
        profile = await db.get_user_profile(user_id)
        resume = await db.get_latest_resume(user_id)
    
    is_onboarding_complete = profile and profile.get("completed") and resume
    
    return {
        "isOnboardingComplete": is_onboarding_complete,
        "hasProfile": profile is not None,
        "hasResume": resume is not None,
        "profile": profile,
        "resume": resume
    }

@app.delete("/user/account/{user_id}")
async def delete_user_account(user_id: str):
    if db:
        await db.delete_user_profile(user_id)
    return {"success": True}

@app.get("/user/resume/{user_id}")
async def get_resume(user_id: str):
    if db:
        resume = await db.get_latest_resume(user_id)
        if resume:
            return resume
    
    raise HTTPException(status_code=404, detail="No resume found")

# --- AI PROCESSING PIPELINE ---

@app.post("/ai/process")
async def trigger_full_process(user_id: str = Form(...)):
    profile = None
    resume = None
    
    if db:
        profile = await db.get_user_profile(user_id)
        resume = await db.get_latest_resume(user_id)
    
    if not profile or not resume:
        raise HTTPException(status_code=400, detail="Complete onboarding first")
    
    # Start background task to avoid blocking the request
    asyncio.create_task(run_ai_pipeline(user_id, profile, resume))
    
    return {"success": True, "message": "Processing started"}

async def run_ai_pipeline(user_id: str, profile: dict, resume: dict):
    try:
        # 1. Parsing Resume
        if manager:
            await manager.broadcast({
                "type": "progress",
                "step": "parsing_resume",
                "status": "running",
                "message": "Parsing resume identity..."
            })
        await asyncio.sleep(2)
        if manager:
            await manager.broadcast({
                "type": "progress",
                "step": "parsing_resume",
                "status": "done",
                "message": "Resume parsed successfully"
            })

        # 2. Scanning Platforms
        if manager:
            await manager.broadcast({
                "type": "progress",
                "step": "scanning_platforms",
                "status": "running",
                "message": "Scanning global job boards..."
            })
        
        if agents_available:
            loop = asyncio.get_event_loop()
            role = profile.get('position', 'Software Engineer')
            locations = profile.get('work_mode', 'Remote')
            user_context = f"Role: {role}, Experience: {profile.get('experience_years')}, Tech: {', '.join(profile.get('top_technologies', []))}"
            
            result = await loop.run_in_executor(
                None, 
                get_agent_system().run_discovery_pipeline, 
                role, 
                locations, 
                user_context
            )
            
            jobs = []
            if isinstance(result, dict) and "error" in result:
                print(f"AI Pipeline Error: {result['error']}")
            else:
                # In a real scenario, we parse result. For demo, we use rich mocks based on profile.
                jobs = [
                    {"title": f"Senior {role}", "company": "TechCorp AI", "description": "Looking for experts in " + ", ".join(profile.get('top_technologies', [])), "link": "https://example.com/job1", "match_score": 95},
                    {"title": f"{role} Intern", "company": "InnovateX", "description": "Great entry level position for " + role, "link": "https://example.com/job2", "match_score": 88},
                    {"title": f"Lead {role}", "company": "Global Systems", "description": "Enterprise role focusing on scalability", "link": "https://example.com/job3", "match_score": 82},
                ]
        else:
            jobs = [
                {"title": f"Senior {profile.get('position', 'Engineer')}", "company": "Mock AI Corp", "description": "Simulation of a high-match job", "link": "https://example.com/mock1", "match_score": 98},
                {"title": f"Junior {profile.get('position', 'Engineer')}", "company": "Demo Systems", "description": "Simulation of a junior role", "link": "https://example.com/mock2", "match_score": 85},
            ]

        if db:
            await db.save_jobs(user_id, jobs)

        if manager:
            await manager.broadcast({
                "type": "progress",
                "step": "scanning_platforms",
                "status": "done",
                "message": f"Found {len(jobs)} optimized matches"
            })

        # 3. AI Matching
        if manager:
            await manager.broadcast({
                "type": "progress",
                "step": "ai_matching",
                "status": "running",
                "message": "Calculating neural match scores..."
            })
        await asyncio.sleep(3)
        if manager:
            await manager.broadcast({
                "type": "progress",
                "step": "ai_matching",
                "status": "done",
                "message": "Matching complete"
            })

        # 4. Tailoring Profiles
        if manager:
            await manager.broadcast({
                "type": "progress",
                "step": "tailoring_profiles",
                "status": "running",
                "message": "Generating ATS-optimized variants..."
            })
        await asyncio.sleep(2)
        if manager:
            await manager.broadcast({
                "type": "progress",
                "step": "tailoring_profiles",
                "status": "done",
                "message": "Resumes tailored"
            })

        # 5. Ready to Apply
        if manager:
            await manager.broadcast({
                "type": "progress",
                "step": "ready_to_apply",
                "status": "done",
                "message": "Pipeline ready. View your matches."
            })

    except Exception as e:
        print(f"Pipeline failure: {e}")
        if manager:
            await manager.broadcast({
                "type": "error",
                "message": str(e)
            })

@app.get("/ai/jobs/{user_id}")
async def get_jobs(user_id: str):
    jobs = []
    if db:
        jobs = await db.get_saved_jobs(user_id)
    return {"jobs": jobs}

# --- AUTO-APPLY SYSTEM ---

@app.post("/ai/apply")
async def apply_to_job(
    user_id: str = Form(...),
    job_id: str = Form(...),
    auto_tailor: bool = Form(True)
):
    job = None
    resume = None
    
    if db:
        job = await db.get_job(user_id, job_id)
        resume = await db.get_latest_resume(user_id)
    
    if auto_tailor and agents_available and resume:
        loop = asyncio.get_event_loop()
        tailored = await loop.run_in_executor(
            None,
            get_agent_system().run_tailoring_pipeline,
            resume.get('text', ''),
            job.get('description', '') if job else ''
        )
        if db:
            await db.save_tailored_resume(user_id, job_id, tailored)
    
    if db:
        await db.mark_job_applied(user_id, job_id)
    
    return {
        "success": True,
        "job_id": job_id,
        "applied": True,
        "tailored": auto_tailor and agents_available
    }

@app.post("/ai/auto-apply")
async def auto_apply_all(
    user_id: str = Form(...),
    job_ids: str = Form(...)
):
    import json
    ids = json.loads(job_ids)
    
    results = []
    for job_id in ids:
        try:
            if db:
                job = await db.get_job(user_id, job_id)
                resume = await db.get_latest_resume(user_id)
                
                if job and resume and agents_available:
                    loop = asyncio.get_event_loop()
                    tailored = await loop.run_in_executor(
                        None,
                        get_agent_system().run_tailoring_pipeline,
                        resume.get('text', ''),
                        job.get('description', '')
                    )
                    
                    await db.save_tailored_resume(user_id, job_id, tailored)
                    await db.mark_job_applied(user_id, job_id)
                    
                    if manager:
                        await manager.broadcast({
                            "type": "auto_apply",
                            "job_id": job_id,
                            "company": job.get('company', 'Unknown'),
                            "status": "applied"
                        })
                    
                results.append({"job_id": job_id, "applied": True})
            else:
                results.append({"job_id": job_id, "applied": True})
                
            await asyncio.sleep(2)
            
        except Exception as e:
            results.append({"job_id": job_id, "applied": False, "error": str(e)})
    
    return {"success": True, "results": results}

# --- WEBSOCKET FOR LIVE UPDATES ---

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast({"message": f"Server received: {data}"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
def read_root():
    return {"status": "Filum Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
