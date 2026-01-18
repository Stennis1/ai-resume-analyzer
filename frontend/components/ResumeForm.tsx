"use client";

import { useState } from "react";
import { analyzeResume } from "../lib/api";

export default function ResumeForm() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!resume || !jobDescription) {
      setError("Please provide both a resume and a job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeResume(resume, jobDescription);
      setResult(data);
    } catch {
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-16">
      {/* Hero */}
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          AI Resume Analyzer
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-500">
          Compare your resume against a job description and get instant,
          AI-powered feedback.
        </p>
      </section>

      {/* Inputs */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-600">Resume</label>
          <textarea
            className="min-h-[280px] w-full resize-none rounded-xl bg-gray-50 p-5 text-sm leading-relaxed focus:ring-2 focus:ring-black/10 focus:outline-none dark:bg-zinc-900"
            placeholder="Paste your resume here…"
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
            placeholder="Paste the job description here…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </section>

      {/* Action */}
      <section className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-full bg-black px-8 py-4 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Analyze Resume"}
        </button>
      </section>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {/* Results */}
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
                <p className="text-sm text-gray-500 italic">
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
                <p className="text-sm text-gray-500 italic">
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
