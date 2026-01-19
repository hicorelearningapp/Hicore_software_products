// src/AITools/CareerAssistance/CareerAssistanceLayout.jsx
import React, { useState } from "react";

// Import dashboards
import SmartRoleSuggestionsDashboard from "./SmartRoleSuggestionsDashboard";
import SkillGapAnalysisDashboard from "./SkillGapAnalysisDashboard";
import ViewMyLearningRoadmapDashboard from "./ViewMyLearningRoadmapDashboard";
import StartmyMockInterviewDashboard from "./StartmyMockInterview/StartmyMockInteviewDashboard";

const CareerAssistanceLayout = () => {
  const [activeTab, setActiveTab] = useState("smart");

  const renderContent = () => {
    switch (activeTab) {
      case "smart":
        return <SmartRoleSuggestionsDashboard />;
      case "skill":
        return <SkillGapAnalysisDashboard />;
      case "roadmap":
        return <ViewMyLearningRoadmapDashboard />;
      case "interview":
        return <StartmyMockInterviewDashboard />;
      default:
        return <SmartRoleSuggestionsDashboard />;
    }
  };

  return (
    <div className="p-4">
      {/* Top Tabs */}
      <div className="flex  rounded-md bg-white">
        <button
          onClick={() => setActiveTab("smart")}
          className={`px-5 py-2 text-sm font-medium transition ${
            activeTab === "smart"
              ? "text-white bg-blue-900 rounded-tl rounded-tr border-purple-700"
              : "text-blue-900 hover:bg-gray-100"
          }`}
        >
          Smart Role Suggestions
        </button>
        <button
          onClick={() => setActiveTab("skill")}
          className={` px-5 py-2 text-sm font-medium transition ${
            activeTab === "skill"
              ? "text-white bg-blue-900 rounded-tl rounded-tr  border-purple-700"
              : "text-blue-900 hover:bg-gray-100"
          }`}
        >
          Show My Skill Gaps
        </button>
        <button
          onClick={() => setActiveTab("roadmap")}
          className={` px-5 py-2 text-sm font-medium transition ${
            activeTab === "roadmap"
              ? "text-white bg-blue-900 rounded-tl rounded-tr  border-purple-700"
              : "text-blue-900 hover:bg-gray-100"
          }`}
        >
          View My Learning Roadmap
        </button>
        <button
          onClick={() => setActiveTab("interview")}
          className={` px-5 py-2 text-sm font-medium transition ${
            activeTab === "interview"
              ? "text-white bg-blue-900 rounded-tl rounded-tr  border-purple-700"
              : "text-blue-900 hover:bg-gray-100"
          }`}
        >
          Interview Readiness Tips
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="border border-blue-900 md  bg-white shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};

export default CareerAssistanceLayout;
