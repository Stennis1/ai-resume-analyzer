export type ResumeAnalysisResponse = {
  match_score: number;
  missing_skills: string[];
  suggestions: string[];
  verdict: string;
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isResumeAnalysisResponse(
  value: unknown
): value is ResumeAnalysisResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.match_score === "number" &&
    Number.isInteger(candidate.match_score) &&
    candidate.match_score >= 0 &&
    candidate.match_score <= 100 &&
    isStringArray(candidate.missing_skills) &&
    isStringArray(candidate.suggestions) &&
    typeof candidate.verdict === "string" &&
    candidate.verdict.trim().length > 0
  );
}
