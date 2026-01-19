// src/pages/HiringPage.jsx
import React, { useState } from "react";
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import { Sparkles } from "lucide-react"; // sparkle icon
import bgImage from "../../../assets/JDBaesdAi/hiring-page-bg.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import dropboxIcon from "../../../assets/JDBaesdAi/button-one.png";
import driveIcon from "../../../assets/JDBaesdAi/button-two.png";
import cloudIcon from "../../../assets/JDBaesdAi/button-three.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const HiringPage = () => {
  const navigate = useNavigate();

  // state
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // call GET /match/getmatch?query=...
  const fetchMatches = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE}/match/getmatch`, {
        params: { query: query ?? "" },
      });
      const matches = response?.data;

      // Navigate to ai-shortlisting page and pass matches via state
      navigate("/ai-shortlisting", { state: { matches, jobDescription: query } });
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch matches. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // handler for Start AI Shortlisting
  const handleStartShortlisting = () => {
    // use the jobDesc as the query parameter
    fetchMatches(jobDesc);
  };

  // optional: handle "Upload" (opens file picker). We won't send file to GET endpoint,
  // but you can read text from .txt/.md if desired — keeping minimal here.
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // put file content into textarea so user can edit before sending
      setJobDesc(String(ev.target.result));
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== Banner Section ===== */}
      <div
        className="relative flex flex-col border-b border-blue-400"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Back Button */}
        <div className="p-6">
          <button
            onClick={() => navigate("/ai-based-shortlisting")}
            className="flex items-center text-[#2C297D] text-lg font-medium"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        {/* Center Heading */}
        <div className="flex flex-col items-center justify-center text-center px-6 mt-5 pb-16">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2C297D]">
            Instantly Find Your Best-Fit Candidates
          </h1>
          <p className="text-base md:text-lg mt-4 text-[#2C297D] max-w-4xl">
            Upload your Job Description and let our AI analyze, match, and rank
            the most suitable profiles — saving you hours of manual screening.
          </p>
        </div>
      </div>

      {/* ===== AI Assistant Button (Between Banner & Content) ===== */}
      {/*<div className="flex justify-end w-full mx-auto px-6 mt-10">
        <button
          onClick={() => navigate("/ai-assistant")}
          className="flex items-center gap-2 bg-[#2C63B6] text-white font-medium px-5 py-2 rounded-md shadow hover:bg-[#1e4c8f] transition"
        >
          <Sparkles size={18} />
          AI Assistant
        </button>
      </div>*/}

      {/* ===== Content Section (Below Banner) ===== */}
      <div className="flex-1 bg-white">
        <div className="w-full mx-auto mt-10 px-10">
          {/* Left: Job Description Textarea */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-7">
            <h2 className="text-xl font-semibold text-[#2C297D] mb-4">
              Job Description
            </h2>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder={`Paste the job description here...\n\nExample:\n\nJob Title: Frontend Developer (React.js)\nCompany: ABC Software Technologies\nLocation: Remote\nExperience: 2–4 years\nJob Type: Full-Time\n\nAbout the Role:`}
              className="w-full h-70 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C297D] text-md text-gray-700 text-leading resize-none overflow-y-scroll scrollbar-hide"
            />
            {error && (
              <p className="text-sm text-red-600 mt-2" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Right: File Upload */}
          {/*<div className="bg-white rounded-lg shadow-sm border border-gray-300 p-5 flex flex-col items-center justify-center text-center">
            <label
              htmlFor="jd-file"
              className="flex items-center gap-2 px-4 py-2 border border-[#2C297D] text-[#2C297D] rounded-md hover:bg-[#2C297D] hover:text-white transition cursor-pointer"
            >
              <FiUpload />
              Upload Your Job Description
            </label>
            <input
              id="jd-file"
              type="file"
              accept=".txt,.md,.json,.doc,.docx,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />*/}

            {/* Cloud Storage Icons */}
            {/*<div className="flex gap-6 mt-5 text-2xl text-[#2C297D]">
              <img
                src={dropboxIcon}
                alt="Dropbox"
                className="w-12 h-12 cursor-pointer hover:scale-110 transition"
              />
              <img
                src={driveIcon}
                alt="Google Drive"
                className="w-12 h-12 cursor-pointer hover:scale-110 transition"
              />
              <img
                src={cloudIcon}
                alt="Cloud"
                className="w-12 h-12 cursor-pointer hover:scale-110 transition"
              />
            </div>*/}

            {/* Supported Formats */}
            {/*<p className="text-gray-500 text-sm mt-4">
              Supported formats: <b>.pdf</b> (max 100MB)
            </p>
          </div>*/}
        </div>

        {/* Bottom Button */}
        <div className="flex justify-center mt-10 mb-12">
          <button
            onClick={handleStartShortlisting}
            disabled={loading}
            className="bg-[#2C297D] disabled:opacity-60 text-white font-medium px-8 py-3 rounded-md hover:bg-[#1e1a5c] transition"
          >
            {loading ? "Finding matches..." : "Start AI Shortlisting"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiringPage;
