import React, { useState, useEffect } from "react";
import axios from "axios";
import JobBoard from "./JobBoard";

// ✅ Use environment API base or fallback to "/api"
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const ApplyForJobs = () => {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Helper to build API URL cleanly
  const getFullUrl = (path = "") => {
    const cleanPath = path.replace(/^\/+/, "");
    const base = API_BASE.replace(/\/+$/, "");
    return `${base}/${cleanPath}`;
  };

  // ✅ Fetch Jobs from backend
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint = getFullUrl("/jobs");
      console.log("🌍 Fetching jobs from:", endpoint);

      const response = await axios.get(endpoint, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      // ✅ Support both array and paginated formats
      const jobList = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : [];

      if (!jobList.length) {
        console.warn("⚠️ No jobs found in API response");
      }

      setJobData(jobList);
      console.log(`✅ Jobs fetched successfully: ${jobList.length}`);
    } catch (err) {
      console.error("❌ Error fetching jobs:", err);

      if (err.response) {
        setError(
          `Server error: ${err.response.status} ${err.response.statusText}`
        );
      } else if (err.request) {
        setError(
          "No response from backend. The API may not be reachable or CORS/proxy might be blocking."
        );
      } else {
        setError(err.message || "Unexpected error while fetching jobs.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ UI
  return (
    <div className="min-h-screen py-10 px-6">
      {loading ? (
        <div className="text-center text-[#343079] text-lg font-medium mt-12 animate-pulse">
          Fetching jobs, please wait...
        </div>
      ) : error ? (
        <div className="text-center text-red-600 text-lg font-medium mt-12 bg-red-50 p-4 rounded-md inline-block">
          {error}
        </div>
      ) : jobData.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-12">
          No jobs available at the moment.
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <JobBoard jobs={jobData} />
        </div>
      )}
    </div>
  );
};

export default ApplyForJobs;
