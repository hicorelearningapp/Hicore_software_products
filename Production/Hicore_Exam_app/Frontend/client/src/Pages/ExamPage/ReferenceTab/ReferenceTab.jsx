import React, { useState } from "react";

/* TAB CONTENT */
import NCERT from "./NCERT";
import Video from "./Video";
import Articles from "./Articles";
import Extra from "./Extra";

/* TOP ICON */
import headerIcon from "../../../assets/Reference/top-icon.png";

const tabs = [
  "NCERT Official PDFs",
  "Video Lessons & Animations",
  "Curated Articles & Websites",
  "Extra Reading Material",
];

const ReferenceTab = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "NCERT Official PDFs":
        return <NCERT />;
      case "Video Lessons & Animations":
        return <Video />;
      case "Curated Articles & Websites":
        return <Articles />;
      case "Extra Reading Material":
        return <Extra />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#f7f9ff] py-8">
      {/* OUTER CONTAINER */}
      <div className="mx-5 bg-white rounded-2xl">
        {/* TOP HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <img src={headerIcon} alt="Reference" className="w-20 h-20" />
          <p className="text-[#1d3b8b] text-md font-medium">
            Access complete NCERT textbooks for Class 11 & 12. The most trusted
            source for NEET preparation.
          </p>
        </div>

        {/* MAIN CONTENT (FULL WIDTH) */}
        <div>
          {/* TABS — FULL WIDTH */}
          <div className="grid grid-cols-4 rounded-t-xl overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-sm font-medium text-center transition
                  ${
                    activeTab === tab
                      ? "bg-[#b7cdfd] text-[#1d3b8b]"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB CONTENT BOX */}
          <div className="border border-blue-200 rounded-b-2xl  p-4 bg-white">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceTab;
