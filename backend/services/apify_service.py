# from apify_client import ApifyClient
# from config import APIFY_API_TOKEN

# client = ApifyClient(APIFY_API_TOKEN)

def fetch_profiles(profiles: list) -> list:
   print(f"Passing {len(profiles)} profiles to LLM")
   return profiles