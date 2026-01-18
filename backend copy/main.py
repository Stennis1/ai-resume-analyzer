import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path
from services.resume_analyzer import analyze_resume
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

OPEN_API_KEY = os.getenv("OPENAI_API_KEY")

class ResumeRequest(BaseModel):
    resume: str
    job_description: str

@app.get("/")
def health_check():
    return {"status": "AI Resume is running!"}

@app.post("/analyze-resume")
def analyze_resume_endpoint(payload: ResumeRequest):
    try:
        ai_response = analyze_resume(
            payload.resume,
            payload.job_description
        )

        if not ai_response or not ai_response.strip():
            raise ValueError("AI returned on an empty response")
        
        try: 
            return json.loads(ai_response)
        except json.JSONDecodeError:
            raise ValueError("AI returned an invalid JSON response")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))