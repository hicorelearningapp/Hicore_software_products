import React, { useState } from "react";
import OngoingProjects from "./OngoingProjects";
import ApprovedProjects from "./ApprovedProjects";
import RejectedProjects from "./RejectedProjects";
import ReviewAndFeedback from "./ReviewAndFeedback";
import ExploreProjects from "./ExploreProjects";


const tabs = [
  "Ongoing Projects",
  "Approved Projects",
  "Rejected Projects",
  /*"Reviews & Feedback",
  "Explore Projects",*/
];

const MentorProjectsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <OngoingProjects />;
      case 1:
        return <ApprovedProjects />;
      case 2:
        return <RejectedProjects />;
      //case 3:
        return <ReviewAndFeedback />;
      case 4:
        return <ExploreProjects />;//
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-md font-medium transition ${
              activeTab === index
                ? "text-white bg-blue-900 rounded-t-lg"
                : "text-gray-500 hover:text-[#3D2C8D]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Container for Content */}
      <div className="border border-blue-900 rounded-b-lg p-10 min-h-screen flex overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default MentorProjectsPage;
