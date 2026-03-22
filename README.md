# 🚀 AI Candidate Filter

An AI-powered full-stack application that automatically finds, filters, and ranks LinkedIn candidates based on a job role, location, and experience — using Google Search, Groq LLM, and a Next.js frontend.

---

## 📸 How It Works

```
User enters Role + Location + Experience
        ↓
Google Search (Apify) finds LinkedIn profiles
        ↓
LLM (Groq) evaluates each candidate
        ↓
Filter + Rank candidates by score
        ↓
Display results on frontend
```

---

## 🗂️ Project Structure

```
candidate-filter/
├── backend/
│   ├── core/
│   │   ├── filter.py          # Filters candidates by score/experience
│   │   └── rank.py            # Ranks candidates by score
│   ├── services/
│   │   ├── google_service.py  # Fetches LinkedIn URLs via Apify Google Scraper
│   │   ├── apify_service.py   # Passes profiles through (no scraping)
│   │   └── llm_service.py     # Evaluates candidates using Groq LLM
│   ├── .env                   # Environment variables
│   ├── app.py                 # FastAPI main entry point
│   ├── config.py              # Loads env variables
│   └── requirements.txt
│
└── frontend/
    └── ai-candidate-filter/
        ├── app/
        │   ├── components/
        │   │   └── CandidateCard.tsx   # Candidate display card
        │   ├── page.tsx               # Main search page
        │   ├── layout.tsx
        │   └── globals.css
        ├── package.json
        └── next.config.ts
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Backend** | FastAPI, Python |
| **Google Search** | Apify (`apify/google-search-scraper`) |
| **LLM** | Groq (`openai/gpt-oss-120b`) |
| **Environment** | Python Virtual Environment |

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
APIFY_API_TOKEN=your_apify_token_here
GROQ_API_KEY=your_groq_api_key_here
```

### How to get the keys

- **Apify API Token** → [console.apify.com](https://console.apify.com) → Settings → Integrations → Create Token
- **Groq API Key** → [console.groq.com](https://console.groq.com) → API Keys → Create Key (free)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/224ASTHA/Candidate_Filteration.git
cd candidate-filter
```

### 2. Set up the backend

```bash
# Create and activate virtual environment
python -m venv myenv
myenv\Scripts\activate        # Windows
source myenv/bin/activate     # macOS/Linux

# Install dependencies
cd backend
pip install -r requirements.txt

# Add your API keys to .env
# Then run the server
uvicorn app:app --reload
```

Backend runs at: `http://localhost:8000`

### 3. Set up the frontend

```bash
cd frontend/ai-candidate-filter
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 📡 API Reference

### `GET /candidates`

Fetch and rank candidates for a given role.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `role` | string | ✅ | Job role (e.g. "ML Intern") |
| `location` | string | ✅ | Location (e.g. "Bangalore") |
| `exp` | integer | ✅ | Minimum years of experience |
| `skills` | string | ❌ | Required skills (e.g. "Python") |
| `limit` | integer | ❌ | Number of results (default: 10) |

**Example Request:**
```
GET http://localhost:8000/candidates?role=ML Intern&location=Bangalore&exp=0

```

**Example Response:**
```json
{
  "total_found": 15,
  "returned": 10,
  "role": "ML Intern",
  "location": "Bangalore",
  "experience": 0,
  "candidates": [
    {
      "name": "John Doe",
      "linkedin_url": "https://linkedin.com/in/john-doe",
      "role": "AI/ML Intern",
      "location": "Bangalore",
      "experience": 1,
      "score": 8,
      "skills": ["Python", "Machine Learning", "Deep Learning"],
      "summary": "Strong fit with hands-on ML internship experience.",
      "verdict": "Strong Fit"
    }
  ]
}
```
---

## 💡 Features

- 🔍 **Smart Search** — Uses Google Search to find real LinkedIn profiles
- 🤖 **AI Evaluation** — Groq LLM scores and summarizes each candidate
- 🎯 **Smart Filtering** — Automatically adjusts filter rules for intern vs full-time roles
- 📊 **Score Ranking** — Candidates ranked 0-10 by relevance
- ⚡ **Fast** — Groq LLM is extremely fast for inference
- 💰 **Cost Effective** — Groq is free, Apify costs ~$0.01 per run

---

## 📦 Backend Dependencies

```
fastapi
uvicorn
python-dotenv
requests
apify-client
```

Install all with:
```bash
pip install -r requirements.txt
```

---

## 🛠️ Development Notes

- For intern roles, candidates are filtered by **score ≥ 5** (not experience)
- For full-time roles, candidates are filtered by **minimum experience**
- The app uses Google Search descriptions to evaluate candidates (no LinkedIn scraping needed)
- Groq rate limit: 8,000 tokens/min on free tier — add `time.sleep(0.5)` between LLM calls if needed

---

## 📄 License

MIT License — feel free to use and modify.

---

## 🙏 Acknowledgements

- [Apify](https://apify.com) — Google Search scraping
- [Groq](https://groq.com) — Fast, free LLM inference
- [FastAPI](https://fastapi.tiangolo.com) — Python backend framework
- [Next.js](https://nextjs.org) — React frontend framework
