import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import interviewBg from "../../assets/interview_bg.png";
import targetImage from "../../assets/pngwing.png";
import RoadmapSection from "./RoadmapSection";
import InterviewQuestions from "./InterviewQuestions";
import ResumeBullets from "./ResumeBullets";

const GenerateInterviewPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Receive complete planData from previous page
  const planData = location.state?.planData || {
    job_title: "",
    skills: [],
    roadmap: [],
    writtenQuestions: [],
    mcqQuestions: [],
    flashcards: [],
    qaPairs: [],
    resume_bullets: [],
  };

  const [activeTab, setActiveTab] = useState("Skills");

  return (
    <div className="w-full min-h-screen bg-white">

      {/* HEADER */}
      <div
        className="relative w-full h-[360px] bg-no-repeat bg-cover bg-left-top flex items-start"
        style={{ backgroundImage: `url(${interviewBg})` }}
      >
        <img
          src={targetImage}
          alt="Target"
          className="absolute right-[220px] top-[70px] w-[220px] h-[210px] object-contain"
        />

        <div className="flex flex-col gap-4 pl-28 pt-8 z-10 w-full">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-700 underline text-sm"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-extrabold text-indigo-900">
            Interview Plan Generated
          </h1>

          <p className="text-gray-700">
            Complete preparation strategy for your next interview
          </p>

          <p className="font-semibold text-gray-900">
            Job Title:{" "}
            <span className="font-bold">
              {planData.job_title || "Loading..."}
            </span>
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="w-full flex justify-center mt-4">
        <div className="w-[90%] border border-indigo-200 rounded-md overflow-hidden">
          <div className="grid grid-cols-4 text-sm text-center cursor-pointer">
            {["Skills", "Roadmap", "Interview Questions", "Resume bullets"].map(
              (tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 border-r ${
                    activeTab === tab
                      ? "bg-indigo-100 text-indigo-800 font-semibold"
                      : ""
                  }`}
                >
                  {tab}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full flex justify-center mt-8">
        <div className="w-[90%] pb-16">
          {activeTab === "Skills" && (
            <>
              <h2 className="text-center text-lg font-semibold text-indigo-900 mb-6">
                Skills Extracted from Job Description
              </h2>

              <div className="space-y-6">
                {planData.skills?.length > 0 ? (
                  planData.skills.map((section, idx) => (
                    <div
                      key={idx}
                      className="border border-indigo-200 rounded-lg p-6 shadow-sm"
                    >
                      <h3 className="font-semibold text-gray-800 mb-3">
                        {section.title}
                      </h3>

                      <div className="flex flex-wrap gap-3">
                        {section.subtopics?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500 italic">
                    No skills found.
                  </p>
                )}
              </div>
            </>
          )}

          {activeTab === "Roadmap" && (
            <RoadmapSection roadmap={planData.roadmap} />
          )}

          {activeTab === "Interview Questions" && (
            <InterviewQuestions
              writtenQuestions={planData.writtenQuestions}
              mcqQuestions={planData.mcqQuestions}
              flashcards={planData.flashcards}
              qaPairs={planData.qaPairs}
            />
          )}

          {activeTab === "Resume bullets" && (
            <ResumeBullets bullets={planData.resume_bullets} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateInterviewPlan;
