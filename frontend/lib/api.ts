import {
  isResumeAnalysisResponse,
  type ResumeAnalysisResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function analyzeResume(
  resume: string,
  jobDescription: string
): Promise<ResumeAnalysisResponse> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to analyze resume: ${text}`);
  }

  const payload: unknown = await response.json();

  if (!isResumeAnalysisResponse(payload)) {
    throw new Error("API returned an invalid analysis response.");
  }

  return payload;
}
