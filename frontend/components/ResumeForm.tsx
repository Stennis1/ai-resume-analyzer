"use client";

import { useState } from "react";
import { analyzeResume } from "../lib/api";
import type { ResumeAnalysisResponse } from "../lib/types";

const productStats = [
  { label: "Structured scoring", value: "0-100" },
  { label: "Accepted formats", value: "PDF / DOCX" },
  { label: "Review output", value: "Skills + verdict" },
];

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
    <div className="flex flex-1 flex-col gap-8 lg:gap-10">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="metric-card grid-pattern relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
          <div className="absolute top-0 right-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,_rgba(74,222,128,0.22),_transparent_65%)] blur-2xl" />
          <div className="relative space-y-8">
            <div className="space-y-5">
              <p className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                AI Screening Workspace
              </p>
              <div className="space-y-4">
                <h2 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  Evaluate resumes with a cleaner, faster hiring interface.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                  Upload a document or paste resume text, compare it against a
                  target role, and get structured feedback that feels ready for
                  a real product team instead of a demo scaffold.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {productStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-[0_20px_45px_-35px_var(--shadow-strong)]"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="metric-card rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
              Workflow
            </p>
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  1. Add source material
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Use a PDF, DOCX, or pasted resume text. The upload flow is
                  optimized for recruiter-style review.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  2. Compare against the role
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Paste the target job description to score alignment and expose
                  missing skills.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  3. Review the output
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Inspect the score, recruiter verdict, gaps, and suggestions in
                  one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="metric-card rounded-[2rem] p-6 sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                Analysis Input
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                Compose the candidate review
              </h3>
            </div>
            <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
              Text or document upload
            </span>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Resume source
                </label>
                <div className="glass-panel rounded-[1.5rem] border border-[var(--border)] p-5">
                  <div className="space-y-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[var(--muted-foreground)]">
                      Upload PDF or DOCX
                    </p>
                    <input
                      key={fileInputKey}
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => {
                        const nextFile = e.target.files?.[0] ?? null;
                        setResumeFile(nextFile);
                      }}
                      className="block w-full text-sm text-[var(--muted-foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-[var(--accent-contrast)] hover:file:bg-[var(--accent-strong)]"
                    />
                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
                      {resumeFile
                        ? `Selected file: ${resumeFile.name}`
                        : "No file selected. You can still paste the resume manually below."}
                    </div>
                    {resumeFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setResumeFile(null);
                          setFileInputKey((current) => current + 1);
                        }}
                        className="text-sm font-medium text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                      >
                        Remove uploaded file
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  className="glass-panel min-h-[260px] w-full resize-none rounded-[1.5rem] border border-[var(--border)] p-5 text-sm leading-7 outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
                  placeholder="Paste the resume text if you want to analyze raw content directly..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Job description
                </label>
                <textarea
                  className="glass-panel min-h-[403px] w-full resize-none rounded-[1.5rem] border border-[var(--border)] p-5 text-sm leading-7 outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
                  placeholder="Paste the target role description, responsibilities, and required skills..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">
                The analyzer returns a score, missing skills, tailored
                suggestions, and a concise recruiter verdict.
              </p>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3.5 text-sm font-medium text-[var(--background)] shadow-[0_18px_45px_-20px_var(--shadow-strong)] transition hover:translate-y-[-1px] hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Analyzing candidate..." : "Run analysis"}
              </button>
            </div>

            {error && (
              <div className="rounded-2xl border border-[color:color-mix(in_srgb,var(--danger)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--danger)_10%,transparent)] px-4 py-3 text-sm text-[var(--danger)]">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="metric-card rounded-[2rem] p-6 sm:p-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                Analysis Output
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                Recruiter-facing result
              </h3>
            </div>
            <div className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Live result
            </div>
          </div>

          {result ? (
            <div className="space-y-6">
              <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_45%),var(--surface-muted)] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                  Match score
                </p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-6xl font-semibold tracking-tight">
                    {result.match_score}
                  </span>
                  <span className="pb-2 text-lg text-[var(--muted-foreground)]">
                    /100
                  </span>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                  Verdict
                </p>
                <p className="text-sm leading-7 text-[var(--foreground)]">
                  {result.verdict}
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                    Missing skills
                  </p>
                  {result.missing_skills.length > 0 ? (
                    <ul className="space-y-2 text-sm text-[var(--foreground)]">
                      {result.missing_skills.map((skill, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      No major skill gaps detected for this role.
                    </p>
                  )}
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                    Suggestions
                  </p>
                  {result.suggestions.length > 0 ? (
                    <ul className="space-y-3 text-sm text-[var(--foreground)]">
                      {result.suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="rounded-2xl bg-[var(--surface-strong)] px-4 py-3 leading-6"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Your resume already appears well aligned with the target
                      role.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid-pattern rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-muted)] p-8">
              <div className="max-w-sm space-y-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                  Waiting for input
                </p>
                <h4 className="text-2xl font-semibold tracking-tight">
                  Results appear here after you run an analysis.
                </h4>
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                  You can use pasted content, an uploaded document, or both.
                  Once submitted, the panel updates with a recruiter-style
                  assessment.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
