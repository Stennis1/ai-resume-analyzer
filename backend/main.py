import json
import logging
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, ValidationError, field_validator
from pathlib import Path
from services.resume_analyzer import analyze_resume
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger(__name__)

app = FastAPI()

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

frontend_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResumeRequest(BaseModel):
    resume: str = Field(..., min_length=1)
    job_description: str = Field(..., min_length=1)

    @field_validator("resume", "job_description")
    @classmethod
    def validate_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("must not be blank")
        return stripped


class ResumeAnalysisResponse(BaseModel):
    match_score: int = Field(..., ge=0, le=100)
    missing_skills: list[str]
    suggestions: list[str]
    verdict: str = Field(..., min_length=1)


def parse_analysis_response(ai_response: str) -> ResumeAnalysisResponse:
    if not ai_response or not ai_response.strip():
        raise ValueError("AI returned an empty response")

    try:
        parsed_response = json.loads(ai_response)
    except json.JSONDecodeError as exc:
        raise ValueError("AI returned invalid JSON") from exc

    try:
        return ResumeAnalysisResponse.model_validate(parsed_response)
    except ValidationError as exc:
        raise ValueError("AI returned a response with an invalid schema") from exc

@app.get("/")
def health_check():
    return {"status": "AI Resume is running!"}

@app.post("/analyze-resume", response_model=ResumeAnalysisResponse)
def analyze_resume_endpoint(payload: ResumeRequest):
    try:
        ai_response = analyze_resume(payload.resume, payload.job_description)
        return parse_analysis_response(ai_response)
    except ValueError as exc:
        logger.exception("Invalid AI response received")
        raise HTTPException(
            status_code=502,
            detail="The AI service returned an invalid analysis response.",
        ) from exc
    except RuntimeError as exc:
        logger.exception("Backend configuration error")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected error while analyzing resume")
        raise HTTPException(
            status_code=500,
            detail="Unexpected error while analyzing resume.",
        ) from exc
