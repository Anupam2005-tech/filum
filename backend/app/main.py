from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import httpx
import os
from typing import List, Optional

from .database import db
from .agents import agent_system
from .parser import parser

app = FastAPI(title="Filum Backend")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecaptchaRequest(BaseModel):
    token: str

@app.post("/verify-recaptcha")
async def verify_recaptcha(request: RecaptchaRequest):
    secret_key = os.getenv("RECAPTCHA_SECRET_KEY")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": secret_key, "response": request.token}
        )
        
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to connect to reCAPTCHA API")
        
    result = response.json()
    
    if not result.get("success"):
        return {"success": False, "error": "reCAPTCHA verification failed"}
        
    if result.get("score", 0) < 0.5:
        return {"success": False, "error": "Low confidence score. Please try again."}
        
    return {"success": True}

# --- USER PROFILE & RESUME ---

@app.delete("/user/account/{user_id}")
async def delete_user_account(user_id: str):
    try:
        # Delete user profile
        db.db.collection("users").document(user_id).delete()
        
        # Delete sub-collections (resumes and matches)
        # Firestore doesn't support recursive delete via SDK easily, 
        # so we manually clear common sub-collections
        resumes = db.db.collection("users").document(user_id).collection("resumes").stream()
        for doc in resumes:
            doc.reference.delete()
            
        matches = db.db.collection("users").document(user_id).collection("matches").stream()
        for doc in matches:
            doc.reference.delete()
            
        return {"success": True, "message": "Account data deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting account data: {str(e)}")

@app.post("/user/profile")
async def update_profile(user_id: str = Form(...), role: str = Form(...), locations: str = Form(...)):
    await db.update_user_profile(user_id, {"role": role, "locations": locations})
    return {"success": True}

@app.post("/user/resume")
async def upload_resume(user_id: str = Form(...), file: UploadFile = File(...)):
    content = await file.read()
    text = parser.parse(content, file.filename)
    
    import datetime
    resume_data = {
        "text": text,
        "filename": file.filename,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    
    resume_id = await db.save_resume(user_id, resume_data)
    return {"success": True, "resume_id": resume_id}

@app.get("/user/resume/{user_id}")
async def get_resume(user_id: str):
    resume = await db.get_latest_resume(user_id)
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found for this user")
    return resume

# --- AI PIPELINES ---

@app.post("/ai/discover")
async def trigger_discovery(user_id: str = Form(...)):
    profile = await db.get_user_profile(user_id)
    resume = await db.get_latest_resume(user_id)
    
    if not profile or not resume:
        raise HTTPException(status_code=400, detail="Profile or Resume missing. Please complete them first.")
    
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None, 
        agent_system.run_discovery_pipeline, 
        profile['role'], 
        profile['locations'], 
        resume['text']
    )
    
    return {"success": True, "result": result}

@app.post("/ai/tailor")
async def trigger_tailoring(user_id: str = Form(...), job_description: str = Form(...)):
    resume = await db.get_latest_resume(user_id)
    if not resume:
        raise HTTPException(status_code=400, detail="No resume found to tailor.")
    
    loop = asyncio.get_event_loop()
    tailored_resume = await loop.run_in_executor(
        None,
        agent_system.run_tailoring_pipeline,
        resume['text'],
        job_description
    )
    
    return {"success": True, "tailored_resume": tailored_resume}

@app.get("/")
def read_root():
    return {"status": "Filum Backend is running"}

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
            except Exception as e:
                pass

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast({"message": f"Server received: {data}"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
