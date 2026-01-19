// StartmyMockInterview.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import MockInterviewPanel from "./MockInterviewPanel";

/* ✅ API BASE */
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const StartmyMockInterview = () => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [recordMode, setRecordMode] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleStart = async () => {
  if (jobRole.trim() === "") {
    alert("Please enter a job role.");
    return;
  }

  setLoading(true);

  try {
    const formattedRole = jobRole.replace(/\s+/g, "");
    const url = `${API_BASE}/ai/mock-interview-qa?domain=${encodeURIComponent(
      formattedRole
    )}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
    console.log("Fetched questions:", data);

    // ✅ FIXED FOR YOUR FORMAT
    if (Array.isArray(data?.mockInterviewQA)) {
      setQuestions(data.mockInterviewQA);
      setShowQuestions(true);
    } else {
      alert("Invalid response format from backend.");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleBack = () => {
    if (recordMode) {
      setRecordMode(false);
    } else if (showQuestions) {
      setShowQuestions(false);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleStart();
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-16 py-8 transition-all duration-500 ease-in-out">
      <button
        onClick={handleBack}
        className="flex items-center text-[#343079] text-sm font-medium mb-6"
      >
        <FiArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {!showQuestions ? (
        loading ? (
          <div className="flex justify-center items-center mt-20">
            <p className="text-[#3D3584] text-lg font-medium animate-pulse">
              Loading questions...
            </p>
          </div>
        ) : (
          <div className="flex justify-center items-start mt-16">
            <div className="bg-white shadow-md border rounded-lg border-gray-200 p-6 md:p-10 w-full max-w-7xl">
              <h2 className="text-[#343079] text-lg md:text-2xl font-semibold mb-4 md:mb-6">
                What job role and experience are you preparing for?
              </h2>

              <form onSubmit={handleSubmit}>
                <textarea
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g., Frontend Developer with 2 years of experience"
                  className="border border-[#3D3584] rounded-md p-4 md:p-5 w-full h-32 md:h-50 text-[#343079] text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#3D3584]"
                />

                <div className="mt-4 md:mt-10">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-4 bg-[#3D3584] text-white text-sm rounded-lg hover:bg-[#2f2a6e] transition"
                  >
                    Start My Mock Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      ) : (
        <MockInterviewPanel
          jobRole={jobRole}
          setJobRole={setJobRole}
          recordMode={recordMode}
          setRecordMode={setRecordMode}
          questions={questions}
        />
      )}
    </div>
  );
};

export default StartmyMockInterview;
