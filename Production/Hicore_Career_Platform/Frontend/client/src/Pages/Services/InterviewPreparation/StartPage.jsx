import React, { useState } from "react";
import bgWave from "../../../assets/InterviewPreparation/banner-bg.jpg";
import interviewLady from "../../../assets/InterviewPreparation/interview-lady.jpg";
import TechQuiz from "./TechQuiz";
import FlashCardActivity from "./FlashCardActivity"; // ✅ import FlashCardActivity
import MockInterviewPage from "./MockInterview";

const StartPage = () => {
  const [activeTab, setActiveTab] = useState("quiz");

  const tabs = [
    { id: "quiz", label: "Tech Quizzes" },
    { id: "flashcards", label: "Flash Card Activities" },
    { id: "mock", label: "Mock Interview" },
  ];

  return (
    <div className="w-full bg-[#F5FAFF]">
      {/* Banner Section */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          backgroundImage: `url(${bgWave})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full px-20 flex flex-col md:flex-row items-center justify-between  py-16 gap-8">
          {/* Left Text Section */}
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[#343079] mb-6">
              Practice Smarter. Perform Better.
            </h2>
            <p className="text-[#343079] font-poppins font-normal text-[18px] leading-[36px] text-justify mb-4 max-w-[100%]">
              Unlock a complete interview toolkit designed for success – from realistic mock interviews and skill-based quizzes to fast, effective flashcard reviews. Practice under real pressure, get personalized feedback, and walk into your next interview with total confidence.
            </p>
            <p className="text-[#343079] font-poppins font-normal text-[18px] leading-[36px] text-justify mb-6 max-w-[90%]">
              Get job-ready with realistic practice and smart prep tools.
            </p>
          </div>

          {/* Right-side Image */}
          <div className="flex-shrink-0 w-[562px] h-[292px] rounded-[8px] overflow-hidden opacity-100">
            <img
              src={interviewLady}
              alt="Interview with candidate"
              className="w-full h-full object-cover rounded-[8px]"
            />
          </div>
        </div>
      </div>
      <div className="h-4" />

      {/* Bottom White Section with Tabs */}
      <div className="w-full bg-white rounded-t-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-10 pt-8">
          {/* Tabs */}
          <div className="flex justify-start items-center gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-w-[390px] px-6 py-3 rounded-md font-semibold border text-sm transition-all
                  ${
                    activeTab === tab.id
                      ? "bg-[#ECECFA] text-[#2E2E51] border-[#3E3F81]"
                      : "bg-transparent text-[#3E3F81] border-[#3E3F81]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="pb-10">
            {activeTab === "quiz" && <TechQuiz />}
            {activeTab === "flashcards" && <FlashCardActivity />}
       {activeTab === "mock" && <MockInterviewPage />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
