// 📂 src/components/Quizs/Quizs.jsx
import React, { useState } from "react";

// ✅ Import icons from assets folder
import ongoingIcon from "../../../../assets/StudentQuizs/Ongoing.png";
import savedIcon from "../../../../assets/StudentQuizs/Save.png";
import completedIcon from "../../../../assets/StudentQuizs/Complete.png";
import failedIcon from "../../../../assets/StudentQuizs/Delete.png";
import quizIcon from "../../../../assets/StudentQuizs/program.png"; 

const quizStats = [
  {
    id: 1,
    icon: ongoingIcon,
    count: 2,
    title: "Ongoing Quiz",
    description: "Quizzes you started but haven't finished yet",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    icon: savedIcon,
    count: 10,
    title: "Saved Quiz",
    description: "Quizzes you've bookmarked to attempt later",
    bgColor: "bg-yellow-50",
  },
  {
    id: 3,
    icon: completedIcon,
    count: 5,
    title: "Completed Quiz",
    description:
      "Quizzes you've successfully finished - review your answers anytime.",
    bgColor: "bg-green-50",
  },
  {
    id: 4,
    icon: failedIcon,
    count: 1,
    title: "Failed Quiz",
    description:
      "Quizzes you attempted but didn't pass - retry to improve your score.",
    bgColor: "bg-red-50",
  },
];

const QuizCard = ({ icon, count, title, description, bgColor }) => (
  <div
    className={`${bgColor} rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center p-8`}
  >
    <img src={icon} alt={title} className="w-16 h-16 mb-3" />
    <p className="text-2xl font-bold text-blue-900 mt-2">{count}</p>
    <h3 className="text-xl font-semibold text-blue-900 mt-2">{title}</h3>
    <p className="text-md text-blue-900 mt-2">{description}</p>
  </div>
);

const Quizs = () => {
  const [showQuizzes, setShowQuizzes] = useState(false);

  if (!showQuizzes) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <img src={quizIcon} alt="Quiz Icon" className="w-24 h-24 mb-6" />
        <p className="text-md text-gray-600 mb-6">
          No quizzes list available yet. Start a course to unlock practice
          quizzes.
        </p>
        <button
          onClick={() => setShowQuizzes(true)}
          className="bg-indigo-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
        >
          Explore Courses
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow">
      {quizStats.map((quiz) => (
        <QuizCard key={quiz.id} {...quiz} />
      ))}
    </div>
  );
};

export default Quizs;
