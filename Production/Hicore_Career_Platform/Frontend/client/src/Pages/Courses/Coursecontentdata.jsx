import React, { useEffect, useState } from "react";
import QuickQuiz from "./QuickQuiz";
import LessonContent from "./LessonContent";
import ProjectIdeas from "./ProjectIdeas";

const tabs = ["lesson", "quickquiz", "projectideas"];

const Coursecontentdata = ({ topicId, onTopicComplete, menuData }) => {
  const [activeTab, setActiveTab] = useState("lesson");
  const [visitedTabs, setVisitedTabs] = useState({
    lesson: false,
    quickquiz: false,
    projectideas: false,
  });
  const [reported, setReported] = useState(false);

  /* ✅ FIX: MARK lesson AS VISITED ON LOAD */
  useEffect(() => {
    setActiveTab("lesson");
    setVisitedTabs({
      lesson: true,              // ✅ CRITICAL FIX
      quickquiz: false,
      projectideas: false,
    });
    setReported(false);
  }, [topicId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setVisitedTabs((prev) => {
      const updated = { ...prev, [tab]: true };

      const allDone =
        updated.lesson &&
        updated.quickquiz &&
        updated.projectideas;

      if (allDone && !reported) {
        setReported(true);
        onTopicComplete(topicId);   // ✅ NOW FIRES IMMEDIATELY
      }

      return updated;
    });
  };

  // Find topic item
  let topicItem = null;
  menuData.forEach((module) => {
    module.items?.forEach((item) => {
      if (item.path === topicId) topicItem = item;
    });
  });

  const topicContent = topicItem?.[activeTab] || [];
  const notes = topicItem?.notes || [];

  return (
    <div className="rounded-[8px] border border-[#EBEAF2] p-2 flex flex-col gap-2 bg-white">
      {/* Tabs */}
      <div className="flex justify-between items-center w-full h-[40px] p-1 rounded-[4px] border border-[#EBEAF2]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`w-[222px] h-[32px] px-4 py-1 rounded-[4px] text-sm font-medium ${
              activeTab === tab
                ? "bg-[#F4F3FA] border border-[#343079] text-[#4F80BF]"
                : "text-[#343079]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="flex flex-col rounded-[4px] border border-[#EBEAF2] p-4 overflow-y-auto"
        style={{ height: "790px" }}
      >
        {activeTab === "lesson" && (
          <LessonContent content={topicContent} notes={notes} />
        )}
        {activeTab === "quickquiz" && (
          <QuickQuiz questions={topicContent} />
        )}
        {activeTab === "projectideas" && (
          <ProjectIdeas content={topicContent} />
        )}
      </div>
    </div>
  );
};

export default Coursecontentdata;
