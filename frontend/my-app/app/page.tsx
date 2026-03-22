"use client"
import React, { useState } from "react"
import CandidateCard from "./components/candidateCard"

type Candidate = {
    name: string;
    location: string;
    experience: number;
    score: number;
    skills: string[];
    linkedin_url?: string;
    summary?: string;
};

type ApiResponse = {
  "total_found": number,
  "returned": number,
  "role": string,
  "location": string,
  "experience": number,
  "candidates": Candidate[];
};

export default function Home() {
  const [role, setRole] = useState("ML Intern")
  const [location, setLocation] = useState("Banglore")
  const [exp, setExp] = useState(2)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error , setError] = useState<string | null>(null)

  const fetchCandidate = async () => {
    if(!role.trim() || !location.trim()){
      setError("Please enter a role and location");
      return;
    }
    try{
      setLoading(true);
      setError(null);
      setData(null);

      const res = await fetch(
        `http://localhost:8000/candidates?role=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}&exp=${exp}`
      );

      if(!res.ok){
        const errData = await res.json();
        throw new Error(errData.detail || "Something went wrong");
      }

      const result : ApiResponse = await res.json();
      setData(result)
    } catch(err: unknown){
      if(err instanceof Error){
        setError(err.message)
      }else{
        setError("Failed to fetch. Make sure backend is running.");
      }
    }finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Enter") fetchCandidate();
  };

  return(
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-6 
      bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AI Candidate Filter</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border p-2 rounded text-zinc-400"
          placeholder="Role"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border p-2 rounded text-zinc-400"
          placeholder="Location"
        />
        <input
           type="number"
           value={exp}
           onChange={(e) => setExp(Number(e.target.value))}
           onKeyDown={handleKeyDown}
           className="border p-2 rounded text-zinc-400"
           placeholder="Min Experience"
           min={0}
        />
        <button 
           onClick={fetchCandidate}
           disabled={loading}
           className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 
           disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Find Candidates"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 mb-4 text-sm">{error}</p>
      )}

      {loading && (
        <p className="text-gray-400 mb-4 text-sm animate-pulse">
          Scanning LinkedIn profiles...
        </p>
      )}

      {data && !loading && (
        <p className="text-sm text-gray-500 mb-4">
          Showing {data.returned} of {data.total_found} candidates for <strong>{data.role}</strong>
          {" "} in <strong>{data.location}</strong>
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data && data.candidates.length > 0 ? (
          data.candidates.map((c, i) => (
            <CandidateCard key={i} candidate={c} rank={i + 1} />
          ))
        ) : (
          !loading && !error && (
            <p className="text-gray-500">No candidates found. Try searching.</p>
          )
        )}
      </div>
    </div>
  );
}