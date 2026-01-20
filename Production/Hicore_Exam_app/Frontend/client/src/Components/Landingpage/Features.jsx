import React from "react";
import learnIcon from "../../assets/Landingpage/book.png";
import practiceIcon from "../../assets/Landingpage/practice.png";
import aiIcon from "../../assets/Landingpage/ai.png";
import reviseIcon from "../../assets/Landingpage/test.png";
import mockIcon from "../../assets/Landingpage/quiz.png";
import insightsIcon from "../../assets/Landingpage/performance.png";

const features = [
  {
    title: "Learn Smarter",
    description:
      "Access well-structured notes with clear explanations and real-life examples for each concept.",
    icon: learnIcon,
    iconWidth: 102.37,
    iconHeight: 100,
  },
  {
    title: "Practice Effectively",
    description:
      "Build confidence with quick quizzes and full-length chapter tests designed to match the original exam pattern.",
    icon: practiceIcon,
    iconWidth: 131.41,
    iconHeight: 100,
  },
  {
    title: "AI Smart Revision",
    description:
      "Let AI act as your personal study coach. Based on your quiz and test history, it pinpoints your weakest areas and creates a custom revision plan.",
    icon: aiIcon,
    iconWidth: 102.37,
    iconHeight: 102.37,
  },
  {
    title: "Revise Quickly",
    description:
      "Revise smarter with interactive flashcards and neatly designed formula banks that break down complex topics. Perfect for last-minute preparation.",
    icon: reviseIcon,
    iconWidth: 102.3,
    iconHeight: 92.5,
  },
  {
    title: "Mock & Custom Tests",
    description:
      "Train under real exam conditions with timed mock tests and weekend exams that mirror the NEET environment. You can also create custom tests.",
    icon: mockIcon,
    iconWidth: 153.87,
    iconHeight: 100,
  },
  {
    title: "Performance Insights",
    description:
      "Turn your performance into progress with detailed analytics. Track your accuracy, average time per question, strongest subjects, and weakest topics.",
    icon: insightsIcon,
    iconWidth: 185.42,
    iconHeight: 100,
  },
];

const Features = () => {
  return (
    <div className="w-full h-auto gap-[64px] pt-16 pr-24 pb-16 pl-24 opacity-100 flex flex-col">
      {/* Title */}
      <h2 className="text-[#2758B3] text-[20px] font-semibold leading-[48px] tracking-[0.015em] flex items-center gap-6">
        <div id='features'
         className="relative flex items-center w-[300px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="w-3 h-3 rounded-full bg-[#2758B3] z-10"></div>
          <div className="flex-1 h-[3px] bg-[#2758B3]"></div>
          <div className="border-t-[8px] border-b-[10px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#2758B3]"></div>
        </div>
        Features
      </h2>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="w-full h-[336px] p-[36px] border border-[#2758B3] rounded-[36px] bg-[#F9FAFB] flex flex-col justify-between hover:bg-white hover:shadow-[0px_4px_4px_0px_#2758B340] transition-none"
          >
            {/* Title + Description */}
            <div>
              <h3 className="text-[20px] font-semibold text-[#2758B3] mb-4">
                {feature.title}
              </h3>
              <p className="text-[#2758B3] text-[14px] font-normal leading-[36px] tracking-[0.015em]">
                {feature.description}
              </p>
            </div>
            {/* Icon */}
            <div className="mt-6 flex justify-end">
              <img className="object-contain"
                src={feature.icon}
                alt={feature.title}
                style={{
                  width: `${feature.iconWidth}px`,
                  height: `${feature.iconHeight}px`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;