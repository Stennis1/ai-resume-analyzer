import {
  isResumeAnalysisResponse,
  type ResumeAnalysisResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function analyzeResume(
  resume: string,
  resumeFile: File | null,
  jobDescription: string
): Promise<ResumeAnalysisResponse> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = resumeFile
    ? await fetchUploadResume(resume, resumeFile, jobDescription)
    : await fetchTextResume(resume, jobDescription);

  if (!response.ok) {
    throw new Error(await extractApiError(response));
  }

  const payload: unknown = await response.json();

  if (!isResumeAnalysisResponse(payload)) {
    throw new Error("API returned an invalid analysis response.");
  }

  return payload;
}

async function extractApiError(response: Response) {
  try {
    const payload: unknown = await response.json();
    if (
      typeof payload === "object" &&
      payload !== null &&
      "detail" in payload &&
      typeof (payload as { detail: unknown }).detail === "string"
    ) {
      return (payload as { detail: string }).detail;
    }
  } catch {
    // Fall back to the response text below when the payload is not JSON.
  }

  return `Failed to analyze resume: ${await response.text()}`;
}

async function fetchTextResume(resume: string, jobDescription: string) {
  return fetch(`${API_BASE_URL}/analyze-resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume,
      job_description: jobDescription,
    }),
  });
}

async function fetchUploadResume(
  resume: string,
  resumeFile: File,
  jobDescription: string
) {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  formData.append("resume_file", resumeFile);

  if (resume.trim()) {
    formData.append("resume", resume);
  }

  return fetch(`${API_BASE_URL}/analyze-resume-upload`, {
    method: "POST",
    body: formData,
  });
}
