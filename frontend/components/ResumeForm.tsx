"use client";

import { useState } from "react";
import { analyzeResume } from "../lib/api";
import type { ResumeAnalysisResponse } from "../lib/types";

export default function ResumeForm() {
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ResumeAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if ((!resume.trim() && !resumeFile) || !jobDescription.trim()) {
      setError("Please provide a resume document or resume text, plus a job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeResume(resume, resumeFile, jobDescription);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-16">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          AI Resume Analyzer
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-500">
          Compare your resume against a job description and get instant,
          AI-powered feedback.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-600">Resume</label>
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Upload PDF or Word (.docx)
              </p>
              <input
                key={fileInputKey}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  const nextFile = e.target.files?.[0] ?? null;
                  setResumeFile(nextFile);
                }}
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-black/90"
              />
              <p className="text-xs text-gray-500">
                {resumeFile
                  ? `Selected file: ${resumeFile.name}`
                  : "Or paste the resume text below if you prefer."}
              </p>
              {resumeFile && (
                <button
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    setFileInputKey((current) => current + 1);
                  }}
                  className="text-xs font-medium text-gray-700 underline underline-offset-2"
                >
                  Remove file
                </button>
              )}
            </div>
          </div>
          <textarea
            className="min-h-[280px] w-full resize-none rounded-xl bg-gray-50 p-5 text-sm leading-relaxed focus:ring-2 focus:ring-black/10 focus:outline-none dark:bg-zinc-900"
            placeholder="Paste your resume here if you are not uploading a file..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-600">
            Job Description
          </label>
          <textarea
            className="min-h-[280px] w-full resize-none rounded-xl bg-gray-50 p-5 text-sm leading-relaxed focus:ring-2 focus:ring-black/10 focus:outline-none dark:bg-zinc-900"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </section>

      <section className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-full bg-black px-8 py-4 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </section>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {result && (
        <section className="mx-auto max-w-3xl space-y-10">
          <div className="space-y-2 text-center">
            <p className="text-sm text-gray-500">Match Score</p>
            <p className="text-5xl font-semibold tracking-tight">
              {result.match_score}%
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Missing Skills
              </h3>

              {result.missing_skills?.length > 0 ? (
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                  {result.missing_skills.map((skill: string, i: number) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-gray-500">
                  No major skill gaps detected for this role.
                </p>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Suggestions
              </h3>

              {result.suggestions?.length > 0 ? (
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                  {result.suggestions.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-gray-500">
                  Your resume is well aligned with the job description. No
                  improvements needed.
                </p>
              )}
            </div>

            <div className="pt-6 text-sm text-gray-700">
              <span className="font-medium">Verdict:</span> {result.verdict}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
