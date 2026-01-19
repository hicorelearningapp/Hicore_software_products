import React, { useState } from "react";
import CoursesTab from "./CoursesTab";
import JobsTab from "./JobsTab"; 
import ResumeTab from "./ResumeTab";
import Interviews from "./Interviews"
import Quizs from "./Quizs";
import Achievements from "./Achievements";
import Flashcards from "./Flashcards";
import Projects from "./Projects";

const tabs = [
  "Courses",
  "Projects",
  "Jobs",
  "Resume",
  "Interviews",
  "Quiz",
  "Flashcards",
  "Achievements",
];

const MyCareer = () => {
  const [activeTab, setActiveTab] = useState("Courses");

  return (
    <div className="max-w-7xl m-4">
      <div className="w-full">
        {/* ✅ Tab Navigation */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-2 px-6 text-md font-medium transition-all duration-300 
                ${
                  activeTab === tab
                    ? "bg-indigo-900 text-white rounded-t-md"
                    : "text-gray-400 hover:text-indigo-900"
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-indigo-900"></span>
              )}
            </button>
          ))}
        </div>

        {/* ✅ Tab Content */}
        <div className="border border-blue-900 min-h-screen rounded-tr rounded-bl rounded-br p-8">
          {activeTab === "Courses" && <CoursesTab />}
          {activeTab === "Projects" && <Projects />}
          {activeTab === "Jobs" && <JobsTab />}
          {activeTab === "Resume" && <ResumeTab />}
          {activeTab === "Interviews" && <Interviews />}
          {activeTab === "Quiz" && <Quizs />}
          {activeTab === "Achievements" && <Achievements />}
          {activeTab === "Flashcards" && <Flashcards />}

          {activeTab !== "Courses" &&
            activeTab !== "Jobs" &&
            activeTab !== "Resume" &&
            activeTab !== "Interviews" &&
            activeTab !== "Quiz" &&
            activeTab !== "Achievements" &&
            activeTab !== "Flashcards" &&
            activeTab !== "Projects" && (
              <div className="flex items-center justify-center h-40 text-gray-500">
                <p>{activeTab} content coming soon...</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MyCareer;
