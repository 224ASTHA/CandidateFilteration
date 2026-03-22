import requests
import json
from config import GROK_API_KEY

def process_candidate(candidate: dict, role: str) -> dict | None:
    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization" : f"Bearer {GROK_API_KEY}",
        "Content-Type" : "application/json"
    }

    prompt = f"""
    You are an AI recruiter.
    Evaluate this candidate for the role: "{role}"
    Candidate Data:
    - Name: {candidate.get("fullName", "Unknown")}
    - LinkedIn URL: {candidate.get("url", "")}
    - Google Description: {candidate.get("description", "")}
    Return Only JSONwith no extra text, no markdown:
    {{
    "name": "candidate full name",
    "role": "detected current role",
    "experience": <estimated years as integer>,
    "location": "location if mentioned, else Unknown",
    "skills": ["skill1", "skill2", "skill3"],
    "score": <number 0-10 based on relevance to {role}>,
    "summary": "2 line summary of why this candidate is or isn't a good fit"
    }}
    """

    data = {
        "model" : "openai/gpt-oss-120b",
        "messages" : [
            {"role": "system", "content": "You are an expert AI recruiter. Always respond with valid JSON only."},
            {"role": "user", "content": prompt}
            ],
        "temperature": 0
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        print(f"Response: {response.text}")  # ✅ add this temporarily
        result = response.json()
        output = result["choices"][0]["message"]["content"]
        return json.loads(output)
    except Exception as e:
        print(f"LLM Error: {e}")
        return None