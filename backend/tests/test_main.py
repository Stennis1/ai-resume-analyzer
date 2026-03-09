import json
from io import BytesIO

import pytest
from fastapi import HTTPException
from pydantic import ValidationError
from docx import Document

import main


def test_parse_analysis_response_returns_validated_model():
    parsed = main.parse_analysis_response(
        json.dumps(
            {
                "match_score": 82,
                "missing_skills": ["AWS"],
                "suggestions": ["Add cloud projects"],
                "verdict": "Strong candidate with one notable gap",
            }
        )
    )

    assert parsed.match_score == 82
    assert parsed.missing_skills == ["AWS"]


def test_parse_analysis_response_rejects_invalid_ai_schema():
    with pytest.raises(ValueError, match="invalid schema"):
        main.parse_analysis_response(
            json.dumps(
                {
                    "match_score": 150,
                    "missing_skills": "AWS",
                    "suggestions": [],
                    "verdict": "",
                }
            )
        )


def test_resume_request_rejects_blank_fields():
    with pytest.raises(ValidationError):
        main.ResumeRequest(resume="   ", job_description="   ")


def test_analyze_resume_endpoint_raises_502_for_invalid_ai_response(monkeypatch):
    def mock_analyze_resume(resume: str, job_description: str) -> str:
        return '{"match_score": "bad"}'

    monkeypatch.setattr(main, "analyze_resume", mock_analyze_resume)

    with pytest.raises(HTTPException) as exc_info:
        main.analyze_resume_endpoint(
            main.ResumeRequest(
                resume="Python developer", job_description="Needs AWS"
            )
        )

    assert exc_info.value.status_code == 502


def test_extract_resume_text_rejects_unsupported_extension():
    with pytest.raises(ValueError, match="Only PDF and Word"):
        main.extract_resume_text("resume.txt", b"plain text")


def test_extract_resume_text_reads_docx():
    document = Document()
    document.add_paragraph("Python developer with FastAPI experience")

    buffer = BytesIO()
    document.save(buffer)

    extracted = main.extract_resume_text("resume.docx", buffer.getvalue())

    assert "FastAPI" in extracted


def test_validate_job_description_rejects_blank_values():
    with pytest.raises(HTTPException) as exc_info:
        main.validate_job_description("   ")

    assert exc_info.value.status_code == 422


def test_validate_job_description_strips_whitespace():
    assert main.validate_job_description("  Needs cloud experience  ") == (
        "Needs cloud experience"
    )
