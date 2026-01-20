import React from "react";

const challenges = [
  {
    title: "Physics Lightning Round",
    duration: "5 mins",
    difficulty: "Advanced",
  },
  {
    title: "Physics Quick Quiz",
    duration: "4 mins",
    difficulty: "Medium",
  },
  {
    title: "Physics Rapid Fire",
    duration: "6 mins",
    difficulty: "Hard",
  },
];

const DailyChallenge = () => {
  return (
    <div className="w-full bg-white p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        {challenges.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Left - Challenge Title */}
            <h3 className="text-[#1d3b8b] font-semibold text-[16px]">
              {item.title}
            </h3>

            {/* Middle - Duration & Difficulty */}
            <div className="flex items-center gap-8 text-sm text-[#1d3b8b]">
              <p>{item.duration}</p>
              <p>Difficulty: {item.difficulty}</p>
            </div>

            {/* Right - Button */}
            <button className="px-5 py-2 bg-[#22c55e] text-white text-[14px] rounded-full hover:opacity-90 transition-all">
              Take Challenge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyChallenge;
