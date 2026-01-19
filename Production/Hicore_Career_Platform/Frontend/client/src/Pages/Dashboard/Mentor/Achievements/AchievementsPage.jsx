import React, { useState } from "react";
import AllPage from "./AllPage";
import Unlocked from "./Unlocked";
import Locked from "./Locked";
import Inprogress from "./Inprogress";


const tabs = [
  "All",
  "Unlocked",
  "Locked",
  "In Progress",
];

const AchievementsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const renderContent = () => {
      switch (activeTab) {
        case 0:
          return <AllPage />;
        case 1:
          return <Unlocked />;
        case 2:
          return <Locked />;
        case 3:
          return <Inprogress />;
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

export default AchievementsPage;
