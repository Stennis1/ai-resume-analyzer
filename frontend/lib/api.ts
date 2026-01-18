const API_BASE_URL = "http://127.0.0.1:8000";

export async function analyzeResume(resume: string, jobDescription: string) {
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

  return response.json();
}
