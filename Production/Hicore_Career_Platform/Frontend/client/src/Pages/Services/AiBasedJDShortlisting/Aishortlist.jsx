import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AishortlistCard from "./AishortlistCard";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const Aishortlist = () => {
  const location = useLocation();
  const jobDescription = location?.state?.jobDescription || "";

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 6;

  // Normalize API response
  const normalizeToArray = (data) => {
    if (!data && data !== 0) return [];
    if (Array.isArray(data)) return data;

    if (data.results) return data.results;
    if (data.matches) return data.matches;
    if (data.candidates) return data.candidates;
    if (data.data) return data.data;

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

    console.warn("normalizeToArray → unknown response:", data);
    return [];
  };

  // Fetch shortlisted matches
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
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [jobDescription]);

  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = safeCandidates.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );

  const totalPages = Math.ceil(safeCandidates.length / profilesPerPage);

  // =========================
  //       RETURN UI
  // =========================
  return (
    <div className="w-full flex flex-col items-center pb-10">
      {/* MAIN WRAPPER */}
      <div className="max-w-7xl w-full px-4 mt-10">
        {/* HEADING */}
        <h3 className="text-[22px] font-bold text-[#4631A1] mb-6">
          {loading
            ? "Loading shortlisted candidates..."
            : `${safeCandidates.length} Candidates matched your hiring preferences`}
        </h3>

        {/* ERROR */}
        {error && (
          <p className="text-red-600 mb-5 font-medium">{error}</p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Fetching matches...
            </p>
          ) : currentProfiles.length > 0 ? (
            currentProfiles.map((candidate, idx) => (
              <div key={candidate.id ?? idx} className="h-full">
                <AishortlistCard candidate={candidate} />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No candidates found.
            </p>
          )}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-end items-center gap-3 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="text-[#4631A1] disabled:opacity-40"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            {(() => {
              let pages = [];

              if (totalPages <= 7) {
                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
              } else {
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);

                pages.push(1);
                if (start > 2) pages.push("...");

                for (let i = start; i <= end; i++) pages.push(i);

                if (end < totalPages - 1) pages.push("...");
                pages.push(totalPages);
              }

              return pages.map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-3 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded flex items-center justify-center ${
                      currentPage === page
                        ? "bg-[#4631A1] text-white"
                        : "text-[#4631A1] hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              );
            })()}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="text-[#4631A1] disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Aishortlist;
