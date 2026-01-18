# AI Resume Analyzer

An AI-powered, full-stack web application that analyzes a resume against a job description and provides a match score, missing skills, and actionable improvement suggestions using a Large Language Model (LLM).

This project demonstrates practical AI integration, backend API design, and modern full-stack deployment focusing on **real-world usefulness rather than academic machine learning**.

---

## 🚀 Live Demo
> _Coming soon_

---

## 🧠 What This Project Does

Given:
- A resume (plain text)
- A job description

The system returns:
- A **match score (0–100)**
- A list of **missing or weak skills**
- **Improvement suggestions**
- A concise **final verdict** from a recruiter’s perspective

This mirrors how modern AI tools are used in hiring, HR tech, and internal tooling.

---

## 🏗️ Architecture Overview

```

Frontend (Next.js)
|
|  HTTP (JSON)
v
Backend API (FastAPI)
|
|  Prompt + Context
v
Large Language Model (LLM)

```

- The frontend handles user input and displays results
- The backend validates requests and orchestrates AI inference
- The AI model performs structured analysis using prompt engineering

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Fetch API

### Backend
- FastAPI
- Python
- Pydantic (data validation)
- Uvicorn (ASGI server)

### AI
- Large Language Models via API
- Prompt engineering for structured, deterministic output

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 📂 Project Structure

```

ai-resume-analyzer/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   └── (Next.js app)
├── README.md
└── .gitignore

````

---

## 🔍 Key Engineering Decisions

### Why FastAPI?
- Strong request validation with Pydantic
- Automatic interactive API documentation
- Excellent fit for AI and data-driven services
- Minimal boilerplate with production-level structure

### Why LLM APIs Instead of Training a Model?
- Reflects how AI is used in real products
- Faster iteration and lower operational cost
- Focus on **AI system design**, not model research

### Why Structured JSON Output?
- Predictable frontend rendering
- Easier future integrations
- Safer than free-form text generation

---

## 📦 API Example

### Endpoint
`POST /analyze-resume`

### Request
```json
{
  "resume": "Experienced backend engineer with Python and APIs...",
  "job_description": "Looking for a Python developer with cloud experience..."
}
````

### Response

```json
{
  "match_score": 78,
  "missing_skills": ["Docker", "AWS"],
  "suggestions": [
    "Add quantified achievements",
    "Highlight cloud-related projects"
  ],
  "verdict": "Strong candidate with minor gaps"
}
```

---

## 🔐 Environment Variables

The backend requires environment variables for secure configuration.

Example:

```
OPENAI_API_KEY=your_api_key_here
```

Environment files are excluded from version control.

---

## 🧪 Running Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Visit:

* `http://127.0.0.1:8000` (Homepage - Local Server)
* `http://127.0.0.1:8000/docs` (API Documentation)

---

## 📈 Future Enhancements (Non-Breaking)

The architecture supports future extensions such as:

* PDF resume upload
* Resume history & comparisons
* Retrieval-Augmented Generation (RAG)
* Authentication
* Analytics & feedback tracking

These additions will **not require a rewrite** of the core system.

---

## 📜 License

MIT