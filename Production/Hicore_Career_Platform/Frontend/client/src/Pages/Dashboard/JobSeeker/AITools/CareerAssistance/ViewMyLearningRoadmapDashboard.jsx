import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../../../../../assets/AICareerPage/Backarrow.png";
import arrowIcon from "../../../../../assets/AICareerPage/arrowicon.png";

const ViewMyLearningRoadmapDashboard = () => {
  const [inputValue, setInputValue] = useState("Java Developer");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://hicore.pythonanywhere.com/roadmap?goal=${encodeURIComponent(inputValue)}`
      );
      const data = await response.json();
      setRoadmapData(data.learningRoadmapData);
      setShowRoadmap(true);
    } catch (error) {
      console.error("Failed to fetch roadmap:", error);
      setRoadmapData(null);
      setShowRoadmap(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4  py-8 transition-all duration-500 ease-in-out">
      {/* Back Button */}
      

      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-6 transition-all duration-500 ease-in-out">
        {/* Input Section */}
        <div
          className={`bg-white rounded-xl  p-6 md:p-8  transition-all duration-500 ease-in-out ${
            showRoadmap ? "md:w-1/2" : "w-full"
          }`}
        >
          <h2 className="text-[#343079] text-base md:text-lg font-semibold mb-4">
            Tell us your current skills / interests or the job role.
          </h2>

          <textarea
            rows={5}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-[#3D3584] rounded-md p-4 text-[#343079] text-sm focus:outline-none focus:ring-2 focus:ring-[#3D3584]"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-[#3D3584] text-white text-sm rounded-md hover:bg-[#2f2a6e] transition"
          >
            {loading ? "Loading..." : "Generate My Learning Roadmap"}
          </button>
        </div>

        {/* Roadmap Display Section */}
        {showRoadmap && roadmapData && (
          <div className="bg-white rounded-xl border border-[#E2E1F3] p-6 md:p-8 shadow-sm md:w-1/2 transition-all duration-500 ease-in-out">
            <h2 className="text-[#343079] text-base md:text-lg font-semibold mb-2">
              {roadmapData.title}
            </h2>
            <p className="text-[#343079] text-sm mb-4">
              {roadmapData.description}
            </p>

            {/* Weeks List Container */}
            <div className="bg-white rounded-2xl p-4 space-y-4 border border-[#E2E1F3]">
              {roadmapData.weeks.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[#E2E1F3] overflow-hidden"
                >
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer font-medium text-[#343079] text-sm px-6 py-4 bg-white rounded-t-xl">
                      <span>{item.title}</span>
                      <img
                        src={arrowIcon}
                        alt="Toggle"
                        className="w-3 h-3 transition-transform duration-300 group-open:rotate-90"
                      />
                    </summary>

                    <div className="mt-0">
                      <div className="w-full h-[1px] bg-[#C6C5E1]" />
                      <ul className="list-disc list-inside px-6 py-4 space-y-2 text-sm text-[#343079]">
                        {item.points.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button 
            onClick={()=> navigate("/courses")}
            className="mt-6 px-4 py-2 bg-[#3D3584] text-white text-sm rounded-md hover:bg-[#2f2a6e] transition">
              Start Your {inputValue} Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMyLearningRoadmapDashboard;
