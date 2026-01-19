import React from "react";
import { useNavigate } from "react-router-dom";

const RoadmapSummary = ({ duration, selectedCareer, onBack }) => {
  const navigate = useNavigate();

  const roadmapPhases = [
    "Phase 1: Foundation and Core Concepts",
    "Phase 2: Intermediate Projects and Tools",
    "Phase 3: Advanced Topics and Integration",
    "Phase 4: Capstone Project and Professional Preparation",
  ];

  const handleStartJourney = () => {
    if (!duration?.path) {
      console.error("❌ No path found in selected duration", duration);
      return;
    }

    navigate(duration.path);
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col justify-between px-6 md:px-16 py-10">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#343079] text-center mb-2">
          {selectedCareer.title} Roadmap – {duration.title}
        </h2>

        <p className="text-gray-500 text-center mb-8">
          The {duration.title} program duration that works best for you
        </p>

        <div className="space-y-4 text-[#343079] text-base md:text-lg font-medium max-w-2xl">
          {roadmapPhases.map((phase, index) => (
            <p key={index}>{phase}</p>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-12">
        <button
          onClick={onBack}
          className="border border-[#343079] text-[#343079] px-6 py-2 rounded-md hover:bg-[#343079] hover:text-white transition"
        >
          Back
        </button>

        <button
          onClick={handleStartJourney}
          className="bg-[#343079] text-white px-6 py-2 rounded-md hover:bg-[#2a2568] transition"
        >
          Start My Journey
        </button>
      </div>
    </div>
  );
};

export default RoadmapSummary;
