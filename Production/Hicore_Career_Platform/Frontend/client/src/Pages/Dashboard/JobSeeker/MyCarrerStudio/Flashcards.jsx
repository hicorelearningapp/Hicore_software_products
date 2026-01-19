// 📂 src/components/Flashcards/Flashcards.jsx
import React, { useState } from "react";

// ✅ Import icons from assets folder
import ongoingIcon from "../../../../assets/StudentQuizs/Ongoing.png";
import savedIcon from "../../../../assets/StudentQuizs/Save.png";
import completedIcon from "../../../../assets/StudentQuizs/Complete.png";
import failedIcon from "../../../../assets/StudentQuizs/Delete.png";
import flashcardIcon from "../../../../assets/StudentQuizs/Jobid.png"; 

const flashcardStats = [
  {
    id: 1,
    icon: ongoingIcon,
    count: 2,
    title: "Ongoing Flashcard",
    description: "Flashcards you started but haven't finished yet",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    icon: savedIcon,
    count: 10,
    title: "Saved Flashcard",
    description: "Flashcards you've bookmarked to review later",
    bgColor: "bg-yellow-50",
  },
  {
    id: 3,
    icon: completedIcon,
    count: 5,
    title: "Completed Flashcard",
    description:
      "Flashcards you've successfully reviewed - keep practicing regularly.",
    bgColor: "bg-green-50",
  },
  {
    id: 4,
    icon: failedIcon,
    count: 1,
    title: "Failed Flashcard",
    description:
      "Flashcards you struggled with - retry to strengthen your memory.",
    bgColor: "bg-red-50",
  },
];

const FlashcardCard = ({ icon, count, title, description, bgColor }) => (
  <div
    className={`${bgColor} rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center p-8`}
  >
    <img src={icon} alt={title} className="w-16 h-16 mb-3" />
    <p className="text-2xl font-bold text-blue-900 mt-2">{count}</p>
    <h3 className="text-xl font-semibold text-blue-900 mt-2">{title}</h3>
    <p className="text-md text-blue-900 mt-2">{description}</p>
  </div>
);

const Flashcards = () => {
  const [showFlashcards, setShowFlashcards] = useState(false);

  if (!showFlashcards) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <img src={flashcardIcon} alt="Flashcards" className="w-24 h-24 mb-6" />
        <p className="text-md text-gray-600 mb-6">
          No flashcards yet. Complete lessons to generate flashcards for quick
          revision.
        </p>
        <button
          onClick={() => setShowFlashcards(true)}
          className="bg-indigo-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
        >
          View Lessons
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow">
      {flashcardStats.map((card) => (
        <FlashcardCard key={card.id} {...card} />
      ))}
    </div>
  );
};

export default Flashcards;
