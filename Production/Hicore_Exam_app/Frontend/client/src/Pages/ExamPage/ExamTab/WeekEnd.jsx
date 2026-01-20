import React, { useState } from "react";

// ✅ Import icons from assets
import headerIcon from "../../../assets/TestTab/image.png";
import timeIcon from "../../../assets/TestTab/Time.png";
import questionsIcon from "../../../assets/TestTab/quiz.png";
import difficultyIcon from "../../../assets/TestTab/difficulty.png";
import markingIcon from "../../../assets/TestTab/Circletick.png";
import aiIcon from "../../../assets/TestTab/AIfeatures.png";
import benefitIcon from "../../../assets/TestTab/Target.png";

import WeekendQuizCard from "./WeekendQuizCard";

const WeekEnd = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  if (showQuiz) {
    return <WeekendQuizCard onClose={() => setShowQuiz(false)} />;
  }

  return (
    <div className="p-6">
      {/* 🔹 Header */}
      <div className="flex items-center mt-4 mb-10">
        <img src={headerIcon} alt="weekend" className="w-20 h-20 mr-3" />
        <h2 className="text-lg md:text-xl font-semibold text-blue-800">
          Full NEET simulation with AI rank prediction
        </h2>
      </div>

      {/* 🔹 Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Time Span */}
        <div className="rounded-xl bg-blue-50 p-6 text-center shadow-sm">
          <img src={timeIcon} alt="time" className="mx-auto w-8 h-8 mb-3" />
          <p className="text-blue-800">Time Span</p>
          <p className=" text-blue-800 mt-2">3 Hours</p>
        </div>

        {/* Questions */}
        <div className="rounded-xl bg-cyan-50 p-6 text-center shadow-sm">
          <img src={questionsIcon} alt="questions" className="mx-auto w-8 h-8 mb-3" />
          <p className="text-blue-800">Questions</p>
          <p className="text-blue-800 mt-2">180</p>
        </div>

        {/* Difficulty */}
        <div className="rounded-xl bg-red-50 p-6 text-center shadow-sm">
          <img src={difficultyIcon} alt="difficulty" className="mx-auto w-8 h-8 mb-3" />
          <p className="text-blue-800">Difficulty</p>
          <p className="text-blue-800 mt-2">Mixed</p>
        </div>

        {/* Marking Scheme */}
        <div className="rounded-xl bg-yellow-50 p-6 text-center shadow-sm">
          <img src={markingIcon} alt="marking" className="mx-auto w-8 h-8 mb-3" />
          <p className="text-blue-800">Marking Scheme</p>
          <p className="text-blue-800 mt-2">+4 for correct, –1 for wrong</p>
        </div>
      </div>

      {/* 🔹 AI Features & Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* AI Features */}
        <div className="border border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <img src={aiIcon} alt="AI Features" className="w-6 h-6 mr-2" />
            <h3 className="text-blue-800 font-semibold">AI Features:</h3>
          </div>
          <ul className="text-sm text-blue-800 list-disc pl-5 space-y-2">
            <li>Real-time rank prediction</li>
            <li>Detailed performance analysis</li>
            <li>Comparison with other test-takers</li>
          </ul>
          <div className="mt-4">
            <span className="bg-yellow-300 text-gray-900 px-4 py-1 rounded-full text-sm font-medium">
              Weekend – Only Saturday & Sunday
            </span>
          </div>
        </div>

        {/* Benefits */}
        <div className="border border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <img src={benefitIcon} alt="Benefits" className="w-6 h-6 mr-2" />
            <h3 className="text-blue-800 font-semibold">Benefits:</h3>
          </div>
          <ul className="text-sm text-blue-800 list-disc pl-5 space-y-2">
            <li>Builds stamina</li>
            <li>Improves time management</li>
            <li>AI Rank Prediction</li>
            <li>Simulates real NEET</li>
          </ul>
        </div>
      </div>

      {/* 🔹 Bottom Section */}
      <div className="bg-green-50 text-center py-6 rounded-lg">
        <p className="text-green-600 font-semibold mb-4">
          Every weekend exam brings you one step closer to NEET success
        </p>
        <button
          onClick={() => setShowQuiz(true)}
          className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-full"
        >
          Start Weekend Exam &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default WeekEnd;
