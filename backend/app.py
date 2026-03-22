from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from services.google_service import fetch_linkedin_urls
from services.apify_service import fetch_profiles
from services.llm_service import process_candidate
from core.filter import is_valid
from core.rank import rank_candidates

app = FastAPI(
    title="Candidate Filter API",
    description="AI-powered candidate filtering and ranking system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Candidate Filter API is running"}

@app.get("/candidates")
def get_candidates(
    role: str = Query(..., description='Job role to search for'),
    location: str = Query(..., description='Location to filter candidate'),
    exp: int = Query(..., description='Minimum years of experience'),
    skills: str = Query("", description="Required skills"),
    limit: int = Query(10, description="Number of result to return")
):
    if not role or not location:
        raise HTTPException(status_code=400, detail="Roles and location are required")
    
    if exp < 0:
        raise HTTPException(status_code=400, detail="Experience cannot be negative")
    
    query = f'site:linkedin.com/in "{role}" "{location}"'
    print(f"Searching for : {query}")

    profiles = fetch_linkedin_urls(query, skills)

    if not profiles:
        raise HTTPException(status_code=404, detail="No LinkedIn profiles found")
    
    print(f"Found {len(profiles)} LinkedIn URLs")

    profiles = fetch_profiles(profiles)

    processed = []
    for i,p in enumerate(profiles[:20]):
        llm_data = process_candidate(p, role)

        if not llm_data:
            print(f"Skipping candidate {i+1} - LLM Failed")
            continue

        if not is_valid(llm_data, role, location, exp):
            print(f"Skipping candidate {i+1} - did not pass filter")
            continue

        processed.append({
            "name": llm_data.get("name", p.get("fullName", "Unknown")),
            "linkedin_url": p.get("url", ""),
            "role": llm_data.get("role", role),
            "location": llm_data.get("location", location),
            "experience": llm_data.get("experience", 0),
            "score": llm_data.get("score", 0),
            "skills": llm_data.get("skills", []),
            "summary": llm_data.get("summary", "")
        })

    if not processed:
        raise HTTPException(status_code=404, detail="No valid candidate found")
        
    ranked = rank_candidates(processed)
    print(f"Returning top {limit} candidates")

    return{
        "total_found": len(processed),
        "returned": min(limit, len(ranked)),
        "role": role,
        "location": location,
        "experience": exp,
        "candidates": ranked[:limit]
    }


# @app.get("/health")
# def health_check():
#     return {'status': 'healthy'}
