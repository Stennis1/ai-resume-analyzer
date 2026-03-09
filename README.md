# AI Resume Analyzer

An AI-powered, full-stack web application that analyzes a resume against a job description and returns a match score, missing skills, and actionable improvement suggestions using a Large Language Model (LLM).

This project focuses on **practical AI integration and real-world system design**, rather than academic machine learning or model training.

---

## 🚀 Live Demo

* **Frontend:** *Coming soon*
* **Backend API:** *Coming soon*

> Live links will be added once deployment is complete.

---

## 🧠 What This Application Does

Given:

* A resume (plain text, PDF, or Word `.docx`)
* A job description

The system returns:

* A **match score (0–100)**
* A list of **missing or weak skills**
* **Actionable improvement suggestions**
* A concise **final verdict** from a recruiter’s perspective

This mirrors how modern AI-powered tools are used in hiring platforms, HR tech, and internal developer tooling.

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

* The frontend handles user input and result presentation
* The backend validates requests and orchestrates AI inference
* The AI model performs structured analysis using prompt engineering

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Fetch API

### Backend

* FastAPI
* Python
* Pydantic (request validation)
* Uvicorn (ASGI server)

### AI

* Large Language Models via API
* Structured prompt engineering with enforced JSON output

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📂 Project Structure (Monorepo)

```
ai-resume-analyzer/
├── backend/
│   ├── main.py
│   ├── services/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   └── (Next.js application)
├── README.md
└── .gitignore
```

The frontend and backend are developed in a single repository and deployed independently.

---

## 🔍 Key Engineering Decisions

### Why FastAPI?

* Strong request validation with Pydantic
* Automatic interactive API documentation (`/docs`)
* Excellent fit for AI-driven and data-oriented services
* Minimal boilerplate with production-grade structure

### Why Use LLM APIs Instead of Training a Model?

* Reflects how AI is used in real-world products
* Faster iteration and significantly lower operational cost
* Focuses on **AI system design**, not model research

### Why Enforce Structured JSON Output?

* Predictable frontend rendering
* Easier validation and error handling
* Prevents malformed or ambiguous AI responses
* Safer than free-form text generation

---

## 📦 API Example

### Endpoints

`POST /analyze-resume`
`POST /analyze-resume-upload`

### Request

```json
{
  "resume": "Experienced backend engineer with Python and APIs...",
  "job_description": "Looking for a Python developer with cloud experience..."
}
```

For file uploads, send `multipart/form-data` with:

- `job_description`
- `resume_file` (`.pdf` or `.docx`)
- optional `resume` text fallback

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

The backend requires environment variables for secure configuration. Copy
`backend/.env.example` to `backend/.env` and fill in the values.

Example:

```env
OPENAI_API_KEY=your_api_key_here
FRONTEND_ORIGINS=http://localhost:3000
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

### Frontend

```bash
cd frontend
npm install
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000 npm run dev
```

Visit:

* `http://127.0.0.1:8000` — API root
* `http://127.0.0.1:8000/docs` — Interactive API documentation
* `http://localhost:3000` — Frontend

---

## 📈 Future Enhancements (Non-Breaking)

The current architecture supports future extensions such as:

* PDF resume upload
* Resume history and comparisons
* Retrieval-Augmented Generation (RAG)
* Authentication
* Analytics and feedback tracking

These additions can be introduced **without rewriting the core system**.

---

## 📜 License

MIT
