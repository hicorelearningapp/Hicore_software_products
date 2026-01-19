import React, { useState, useEffect } from "react";
import JobSeekerCard from "./JobSeekerCard";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const JobSeekerProfile = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 12;

  useEffect(() => {
    const fetchJobSeekers = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("🌐 Fetching jobseeker profiles from:", `${API_BASE}/profile/role/jobseeker`);

        const response = await fetch(`${API_BASE}/profile/role/jobseeker`);
        console.log("📩 /profile/role/jobseeker raw response:", response);

        if (!response.ok) {
          throw new Error(`Failed to fetch job seeker profiles (${response.status})`);
        }

        const textData = await response.text();
        console.log("📜 /profile/role/jobseeker response text:", textData);

        let profilesData;
        try {
          profilesData = JSON.parse(textData);
        } catch (parseErr) {
          console.error("❌ JSON parse error for /profile/role/jobseeker:", parseErr);
          throw new Error("Invalid JSON in /profile/role/jobseeker response");
        }

        // The API may return { profiles: [...] } or a direct array
        const allProfiles = Array.isArray(profilesData)
          ? profilesData
          : profilesData.profiles || [];

        console.log("✅ Parsed jobseeker profiles:", allProfiles);

        setJobSeekers(allProfiles);
      } catch (err) {
        console.error("❌ Error fetching jobseeker profiles:", err);
        setError("Failed to load job seeker profiles.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobSeekers();
  }, []);

  // ✅ Pagination logic
  const totalPages = Math.ceil(jobSeekers.length / profilesPerPage);
  const startIndex = (currentPage - 1) * profilesPerPage;
  const currentProfiles = jobSeekers.slice(startIndex, startIndex + profilesPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  // === UI States ===
  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-indigo-700">
        <div className="text-lg font-semibold animate-pulse">
          Loading job seeker profiles...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 py-8 font-medium">{error}</div>
    );

  if (jobSeekers.length === 0)
    return (
      <div className="text-center text-gray-600 py-8">
        No job seeker profiles found.
      </div>
    );

  // === Render ===
  return (
    <div className="w-full px-4">
      <div className="max-w-8xl m-8 bg-white border border-gray-300 rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">
            Meet Our Job Seekers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 m-10 gap-6">
          {currentProfiles.map((seeker, idx) => (
            <JobSeekerCard key={idx} seeker={seeker} />
          ))}
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-4">
            {currentPage > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-2 rounded-md text-white text-sm font-semibold bg-indigo-900 hover:bg-indigo-800"
              >
                Previous
              </button>
            )}
            {currentPage < totalPages && (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-md text-white text-sm font-semibold bg-indigo-900 hover:bg-indigo-800"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerProfile;
