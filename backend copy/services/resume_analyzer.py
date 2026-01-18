import os
from openai import OpenAI

def analyze_resume(resume: str, job_description: str):
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set in environment variables.")

    client = OpenAI(api_key=api_key)
    
    prompt = f"""
You are a senior technical recruiter.

Analyze the following resume against the job description.

Resume:
{resume}

Job Description:
{job_description}

Return ONLY valid JSON with the following keys:
- match_score: An integer from 0 to 100 indicating how well the resume matches the job description 
- missing_skills: Array of strings listing skills required by the job description but missing from the resume
- suggestions: Array of strings with suggestions to improve the resume
- verdict: A brief summary verdict of the candidate's suitability for the job 
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[   
            {"role": "user", "content": prompt}
        ],
        response_format={ 'type': "json_object"},
        temperature=0.3
    )

    return response.choices[0].message.content