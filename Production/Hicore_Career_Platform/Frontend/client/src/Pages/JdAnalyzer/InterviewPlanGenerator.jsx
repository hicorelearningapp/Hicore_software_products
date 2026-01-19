// src/pages/InterviewPlanGenerator.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const getFullUrl = (path) => {
  const clean = path.replace(/^\/+/, "");
  const base = API_BASE.replace(/\/+$/, "");
  return `${base}/${clean}`;
};

const InterviewPlanGenerator = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();   // <-- ADDED

  const handleGeneratePlan = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    setLoading(true);

    try {
      const axiosConfig = {
        headers: { "Content-Type": "application/json" }
      };

      const [skillsRes, roadmapRes, questionsRes, resumeRes] = await Promise.all([
        axios.post(getFullUrl("ai/grouped-skills"),
          { job_description: jobDescription }, axiosConfig),

        axios.post(getFullUrl("ai/roadmap"),
          { job_description: jobDescription }, axiosConfig),

        axios.post(getFullUrl("ai/learning-materials"),
          { job_description: jobDescription }, axiosConfig),

        axios.post(getFullUrl("ai/resume-bullets"),
          { job_description: jobDescription }, axiosConfig),
      ]);

      // Build final object to send to next page
      const finalPlan = {
        skills: skillsRes.data.grouped_skills || [],
        roadmap: roadmapRes.data.roadmap || [],
        writtenQuestions: questionsRes.data.writtenQuestions || [],
        mcqQuestions: questionsRes.data.mcqQuestions || [],
        flashcards: questionsRes.data.flashcards || [],
        qaPairs: questionsRes.data.qaPairs || [],
        resume_bullets: resumeRes.data.resume_bullets || [],
      };

      // ✅ Navigate to next page with all API data
      navigate("/jd-analyzer/plan", {
        state: { planData: finalPlan, jobDescription }
      });

    } catch (err) {
      console.error("❌ API Error:", err);
      alert("Failed to generate interview plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Interview Plan Generator
        </h1>

        <textarea
          rows={10}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full border-2 border-indigo-400 rounded-md p-3 text-sm text-gray-700"
        />

        <div className="text-center mt-6">
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="bg-indigo-900 text-white py-2 px-6 rounded-md hover:bg-indigo-800"
          >
            {loading ? "Generating..." : "Generate Interview Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPlanGenerator;
