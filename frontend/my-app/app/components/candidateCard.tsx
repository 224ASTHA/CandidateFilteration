"use client"

type Candidate = {
    name: string;
    location: string;
    experience: number;
    score: number;
    skills: string[];
    linkedin_url?: string;
    summary?: string;
}

const scoreColor = (score: number): string => {
    if(score >= 8) return "text-green-600";
    if(score >= 5) return "text-yellow-600";
    return "text-red-500"
}

export default function CandidateCard({
    candidate,
    rank,
}: {
    candidate: Candidate;
    rank?: number
}) {
    return (
        <div className="bg-white border rounded-2xl shadow-md p-5 
        hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-800">
                    {candidate.name || "N/A"}
                </h2>
                {rank && (
                    <span className="text-xs text-gray-400 font-mono">#{rank}</span>
                )}
            </div>

            <p className="text-gray-600 mb-1">
                {candidate.location || "Unknown"}
            </p>

            <p className="text-gray-600 mb-1">
                {candidate.experience} year
            </p>

            <p className={`font-semibold mb-2 ${scoreColor(candidate.score)}`}>
                Score : {candidate.score} out of 10
            </p>

            {candidate.summary && (
                <p className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3 mb-3">
                    {candidate.summary}
                </p>
            )}

            <div className="mb-3">
                <p className="font-semibold text-gray-700 mb-1">Skills :</p>
                <div className="flex flex-wrap gap-2">
                    {candidate.skills && candidate.skills.length > 0 ? (
                        <>
                          {candidate.skills.slice(0,6).map((skill, index) => (
                            <span 
                            key={index}
                            className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full">
                                {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 6 && (
                            <span className="text-gray-400 text-sm px-2 py-1">
                                +{candidate.skills.length - 6} more
                            </span>
                          )}
                        </>
                    ): (
                        <span className="text-gray-500 text-sm">No skills available</span>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-4">
                {candidate.linkedin_url ? (
                    <a 
                       href={candidate.linkedin_url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="bg-blue-500 text-white px-3 py-1
                        rounded-lg hover:bg-blue-600 transition text-sm">
                            View Profile
                        </a>
                ): (
                    <button
                      disabled
                      className="bg-blue-200 text-white px-3 py-1 
                      rounded-lg text-sm cursor-not-allowed">
                        View Profile
                      </button>
                )}
            </div>
        </div>
    )
}