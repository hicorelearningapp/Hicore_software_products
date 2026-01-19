// src/pages/JDBasedAi/AIShortlistingPage.jsx
import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import bgImage from "../../../assets/JDBaesdAi/hiring-page-bg.jpg";

import AishortlistCard from "./AishortlistCard";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const AIShortlistingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const jobDescription = location?.state?.jobDescription || "";

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalize API response into a clean array
  const normalizeToArray = (data) => {
    if (!data && data !== 0) return [];
    if (Array.isArray(data)) return data;

    if (data.results) return data.results;
    if (data.matches) return data.matches;
    if (data.candidates) return data.candidates;
    if (data.data) return data.data;

    // Convert number-keyed object into an array
    if (
      typeof data === "object" &&
      data !== null &&
      Object.keys(data).every((k) => /^\d+$/.test(k))
    ) {
      return Object.keys(data)
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => data[k]);
    }

    if (typeof data === "object") return [data];

    return [];
  };

  // Fetch AI shortlisted matches
  const fetchMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE}/match/getmatch`, {
        params: { query: jobDescription ?? "" },
      });

      const normalized = normalizeToArray(response?.data);
      setCandidates(normalized);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load candidates."
      );
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [jobDescription]);

  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  return (
    <div className="flex flex-col min-h-screen w-full">

      {/* ---------------- Banner Section ---------------- */}
      <div
        className="flex flex-col items-center justify-start px-6 py-16 relative text-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Back button */}
        <div
          className="absolute top-6 left-6 flex items-center text-[#342074] cursor-pointer"
          onClick={() => navigate("/hiring")}
        >
          <FiArrowLeft className="mr-2 text-lg" />
          <span className="text-base font-medium">Back</span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#342074] mt-16">
          From hundreds of resumes to your top picks – in seconds
        </h1>

        <p className="mt-4 max-w-7xl text-base md:text-lg text-[#342074] leading-relaxed">
          Our AI scans, analyzes, and ranks candidates based on skills,
          experience, and role fit.
        </p>
      </div>

      {/* ---------------- Candidate Cards Section ---------------- */}
      <div className="px-10 mt-10 pb-10 max-w-7xl mx-auto">
        
        {/* Label */}
        <h3 className="text-[22px] font-bold text-[#4631A1] mb-6">
          {loading
            ? "Loading shortlisted candidates..."
            : `${safeCandidates.length} Candidates matched your hiring preferences`}
        </h3>

        {/* Error */}
        {error && (
          <p className="text-red-600 mb-5 font-medium">{error}</p>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Fetching matches...
            </p>
          ) : safeCandidates.length > 0 ? (
            safeCandidates
              .filter((c) => c && typeof c === "object" && Object.keys(c).length > 0)
              .map((candidate, idx) => (
                <AishortlistCard
                  key={candidate.id ?? candidate.user_id ?? idx}
                  candidate={candidate}
                />
              ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No candidates found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIShortlistingPage;
