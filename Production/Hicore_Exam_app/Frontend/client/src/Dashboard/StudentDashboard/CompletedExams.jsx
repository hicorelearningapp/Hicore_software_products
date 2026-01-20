import React from "react";

/* ICONS */
import calendarIcon from "../../assets/StudentDashboard/StudentDashHome/Calendar.png";
import timeIcon from "../../assets/StudentDashboard/StudentDashHome/Time.png";
import questionIcon from "../../assets/StudentDashboard/StudentDashHome/Topic.png";
import scoreIcon from "../../assets/StudentDashboard/StudentDashHome/Timer.png";
import correctIcon from "../../assets/StudentDashboard/StudentDashHome/circle-tick.png";
import wrongIcon from "../../assets/StudentDashboard/StudentDashHome/cancel.png";
import performanceIcon from "../../assets/StudentDashboard/StudentDashHome/Analyze.png";
import warningIcon from "../../assets/StudentDashboard/StudentDashHome/Target.png";
import aiIcon from "../../assets/StudentDashboard/StudentDashHome/Idea.png";

const completedExamData = [
  {
    id: 1,
    title: "Physics Unit 1 Exam",
    completedOn: "September 25",
    timeTaken: "45mins",
    totalQuestions: 40,
    score: "85%",
    correctAnswers: 35,
    wrongAnswers: 5,
    performance: {
      accuracy: "72%",
      accuracyText: "(14/20 correct)",
      avgTime: "54sec",
    },
    weakTopics: [
      "Dimensional Analysis – struggled with derived unit conversions",
      "Significant Figures – frequent mistakes in counting rules",
    ],
    aiRecommendation:
      "Before moving ahead, spend 5 minutes revising Significant Figures and practice 10 targeted questions in Dimensional Analysis for better accuracy.",
  },
  {
    id: 2,
    title: "Physics Unit 1 Exam",
    completedOn: "September 25",
    timeTaken: "45mins",
    totalQuestions: 40,
    score: "85%",
    correctAnswers: 35,
    wrongAnswers: 5,
    performance: {
      accuracy: "72%",
      accuracyText: "(14/20 correct)",
      avgTime: "54sec",
    },
    weakTopics: [
      "Dimensional Analysis – struggled with derived unit conversions",
      "Significant Figures – frequent mistakes in counting rules",
    ],
    aiRecommendation:
      "Before moving ahead, spend 5 minutes revising Significant Figures and practice 10 targeted questions in Dimensional Analysis for better accuracy.",
  },
];

const CompletedExams = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {completedExamData.map((exam) => (
        <div
          key={exam.id}
          className="border border-[#BFD6FF] rounded-2xl bg-white max-w-5xl"
        >
          {/* HEADER */}
          <div className="bg-[#EEF3FF] rounded-2xl rounded-b-none py-4 mb-8 text-center">
            <h2 className="text-xl font-bold text-[#2758B3]">{exam.title}</h2>
          </div>

          {/* TOP DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-18 m-6 mb-10 text-[#2758B3]">
            <div className="flex items-center gap-3">
              <img src={calendarIcon} className="w-5 h-5" />
              <span>
                Completed – <strong>{exam.completedOn}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img src={timeIcon} className="w-5 h-5" />
              <span>
                Time Taken: <strong>{exam.timeTaken}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img src={questionIcon} className="w-5 h-5" />
              <span>
                Total Questions – <strong>{exam.totalQuestions}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img src={scoreIcon} className="w-5 h-5" />
              <span>
                Score – <strong>{exam.score}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img src={correctIcon} className="w-5 h-5" />
              <span>
                Correct Answers: <strong>{exam.correctAnswers}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img src={wrongIcon} className="w-5 h-5" />
              <span>
                Wrong Answers – <strong>{exam.wrongAnswers}</strong>
              </span>
            </div>
          </div>

          {/* DETAILED FEEDBACK */}
          <div className="bg-[#FAFBFF]  rounded-2xl mb-8">
            {/* Heading without extra padding */}
            <h3 className="text-lg font-semibold text-[#2758B3] px-6 pt-6">
              Detailed Feedback
            </h3>

            {/* Content with consistent padding */}
            <div className="p-6">
              {/* PERFORMANCE */}
              <div className="bg-[#FFFDEB] rounded-2xl p-6 mb-8 border border-[#E6EEFF]">
                <div className="flex items-center gap-3 mb-6">
                  <img src={performanceIcon} className="w-6 h-6" />
                  <h4 className="font-semibold text-[#2758B3]">
                    Your Performance Snapshot
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-[#E6EEFF] rounded-xl p-6 text-center">
                    <p className="text-[#2758B3] mb-3">Accuracy %</p>
                    <p className="text-sm mb-3 text-[#2758B3]">
                      {exam.performance.accuracyText}
                    </p>
                    <p className="text-green-600 text-xl font-semibold">
                      {exam.performance.accuracy}
                    </p>
                  </div>

                  <div className="border border-[#E6EEFF] rounded-xl p-6 text-center">
                    <p className="text-[#2758B3] mb-3">Average Time</p>
                    <p className="text-sm mb-3 text-[#2758B3]">per Question</p>
                    <p className="text-green-600 text-xl font-semibold">
                      {exam.performance.avgTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* WEAK TOPICS */}
              <div className="bg-[#FFF3F3] rounded-2xl p-6 mb-8 border border-[#E6EEFF]">
                <div className="flex items-center gap-3 mb-4">
                  <img src={warningIcon} className="w-6 h-6" />
                  <h4 className="font-semibold text-[#2758B3]">
                    Weak Topics Detected
                  </h4>
                </div>

                <ul className="list-disc text-[#2758B3] text-[14px] list-inside space-y-3">
                  {exam.weakTopics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>

              {/* AI RECOMMENDATION */}
              <div className="bg-[#EFFFF2] rounded-2xl p-6 border border-[#E6EEFF]">
                <div className="flex items-center gap-3 mb-4">
                  <img src={aiIcon} className="w-6 h-6" />
                  <h4 className="font-semibold text-[#2758B3]">
                    AI Smart Recommendation
                  </h4>
                </div>
                <p className="text-[14px] leading-[32px] text-[#2758B3]">
                  {exam.aiRecommendation}
                </p>
              </div>
            </div>
          </div>

          {/* DOWNLOAD BUTTON */}
          <div className="px-6 pb-6">
            <button className="w-full bg-[#2B56B5] text-white py-2 rounded-full font-semibold text-lg">
              Download Result
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompletedExams;
