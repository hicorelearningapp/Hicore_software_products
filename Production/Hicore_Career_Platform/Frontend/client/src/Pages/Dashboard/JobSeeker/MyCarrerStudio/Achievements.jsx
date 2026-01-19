// 📂 src/components/Achievements/Achievements.jsx
import React, { useState } from "react";

// ✅ Import icons from assets
import ongoingIcon from "../../../../assets/StudentQuizs/Ongoing.png";
import savedIcon from "../../../../assets/StudentQuizs/Save.png";
import completedIcon from "../../../../assets/StudentQuizs/Complete.png";
import achievementIcon from "../../../../assets/StudentQuizs/Certificate.png"; 

const achievementStats = [
  {
    id: 1,
    icon: ongoingIcon,
    count: 2,
    title: "Certificates Earned",
    description: "Certificates you’ve achieved for completing your courses.",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    icon: savedIcon,
    count: 8,
    title: "Badges Collected",
    description: "Special recognition badges you’ve earned so far.",
    bgColor: "bg-yellow-50",
  },
  {
    id: 3,
    icon: completedIcon,
    count: 5,
    title: "Milestones Completed",
    description:
      "Key milestones you’ve successfully completed on your learning journey.",
    bgColor: "bg-green-50",
  },
];

const AchievementCard = ({ icon, count, title, description, bgColor }) => (
  <div
    className={`${bgColor} rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center p-8`}
  >
    <img src={icon} alt={title} className="w-16 h-16 mb-3" />
    <p className="text-2xl font-bold text-blue-900 mt-2">{count}</p>
    <h3 className="text-xl font-semibold text-blue-900 mt-2">{title}</h3>
    <p className="text-md text-blue-900 mt-2">{description}</p>
  </div>
);

const Achievements = () => {
  const [showAchievements, setShowAchievements] = useState(false);

  if (!showAchievements) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <img
          src={achievementIcon}
          alt="Achievements"
          className="w-24 h-24 mb-6"
        />
        <p className="text-md text-gray-600 mb-6">
          No achievements yet. Finish courses, projects, and milestones to
          unlock badges , certificates and rewards.
        </p>
        <button
          onClick={() => setShowAchievements(true)}
          className="bg-indigo-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
        >
          Start Learning
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow">
      {achievementStats.map((item) => (
        <AchievementCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default Achievements;
