from apify_client import ApifyClient
from config import APIFY_API_TOKEN

client = ApifyClient(APIFY_API_TOKEN)

def fetch_linkedin_urls(query: str, skills: str = "", max_results: int = 10) -> list:
    if skills:
        query = f'{query} "{skills}"'
    
    try:
        run = client.actor("apify/google-search-scraper").call(
            run_input={
                "queries": query,
                "maxPagesPerQuery": 2,
                "resultsPerPage": max_results
            }
        )

        data = client.dataset(run["defaultDatasetId"]).list_items().items

        profiles = []
        for item in data:
            organic_results = item.get("organicResults", [])
            for result in organic_results:
                link = result.get("url", "")
                if "linkedin.com/in/" in link:
                    profiles.append({
                        "url": link,
                        "fullName": result.get("title", "").split("-")[0].strip(),
                        "description": result.get("description", ""),
                        "skills": []
                    })
                
        print(f"Found {len(profiles)} LinkedIn URLs")
        return list({p["url"]: p for p in profiles}.values())
    
    except Exception as e:
        print(f"Error fetching in LinkedIn URLs: {e}")
        return []