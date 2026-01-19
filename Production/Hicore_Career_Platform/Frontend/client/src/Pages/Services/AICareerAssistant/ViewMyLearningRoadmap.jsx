import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import backArrow from "../../../assets/AICareerPage/Backarrow.png";
import arrowIcon from "../../../assets/AICareerPage/arrowicon.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const ViewMyLearningRoadmap = () => {
  const [inputValue, setInputValue] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);

  const navigate = useNavigate();

  // ✅ ULTRA SAFE PARSER (handles string → json → object)
  const parseRoadmapSafely = (raw) => {
    if (!raw) return null;

    // If already object ✅
    if (typeof raw === "object") return raw;

    try {
      // Remove markdown wrappers
      let cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // First parse attempt
      let parsed = JSON.parse(cleaned);

      // If still string → parse again ✅
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      return parsed;
    } catch (e) {
      console.error("❌ Roadmap parsing failed:", e);
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const url = `${API_BASE}/ai/career-roadmap?goal=${encodeURIComponent(
        inputValue
      )}`;

      const response = await fetch(url);
      const data = await response.json();

      const parsedRoadmap = parseRoadmapSafely(
        data?.learningRoadmapData
      );

      if (parsedRoadmap?.title) {
        setRoadmapData(parsedRoadmap);
        setShowRoadmap(true);
        console.log("✅ Parsed Roadmap:", parsedRoadmap);
      } else {
        console.warn("⚠️ Roadmap parsed but invalid shape:", parsedRoadmap);
        setRoadmapData(null);
        setShowRoadmap(false);
      }
    } catch (error) {
      console.error("Failed to fetch roadmap:", error);
      setRoadmapData(null);
      setShowRoadmap(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-16 py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#343079] text-sm font-medium mb-6"
      >
        <img src={backArrow} alt="Back" className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Input Section */}
        <div
          className={`bg-white rounded-xl border border-[#E2E1F3] p-6 md:p-8 shadow-sm ${
            showRoadmap ? "md:w-1/2" : "w-full"
          }`}
        >
          <h2 className="text-[#343079] text-[20px] md:text-[20px] font-semibold mb-4">
            Tell us your current skills / interests or the job role.
          </h2>

          <textarea
            rows={3}
            value={inputValue}
            placeholder="Enter your current skills/ interests"
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-[#343079] rounded-[8px] p-[36px] text-[#343079] font-regular text-[16px]"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-[#3D3584] text-white rounded-[8px] disabled:opacity-60"
          >
            {loading ? "Loading..." : "Generate My Learning Roadmap"}
          </button>
        </div>

        {/* Roadmap Section */}
        {showRoadmap && roadmapData && (
          <div className="bg-white rounded-[8px] border border-[#E2E1F3] p-6 md:p-8 shadow-sm md:w-1/2">
            <h2 className="text-[#343079] text-[20px] font-semibold mb-2">
              {roadmapData.title}
            </h2>

            <p className="text-[#343079] text-[16px] font-regular mb-4">
              {roadmapData.description}
            </p>

            {/* Weeks */}
            <div className="rounded-[8px] p-[36px] space-y-4 border border-[#C0BFD5]">
              {roadmapData.weeks?.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[8px] border border-[#C0BFD5]"
                >
                  <details className="group">
                    <summary className="flex items-center text-[#343079] justify-between cursor-pointer font-[regular] text-[16px] px-6 py-4">
                      <span>{item.title}</span>
                      <img
                        src={arrowIcon}
                        alt="Toggle"
                        className="w-3 h-3 transition-transform duration-300 group-open:rotate-90"
                      />
                    </summary>

                    <div>
                      <div className="w-full h-[1px] bg-[#C6C5E1]" />
                      <ul className="list-disc list-inside px-6 py-4 font-[regular] text-[16px] text-[#343079]">
                        {item.points?.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/courses")}
              className="mt-6 px-4 py-2 bg-[#3D3584] text-white rounded-[8px]"
            >
              Start Your {inputValue || "Learning"} Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMyLearningRoadmap;
