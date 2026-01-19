import React from "react";

const StepProgressBar = ({ currentStep }) => {
  const totalSteps = 4;

  return (
    <div className="flex justify-center items-center gap-4 px-6 mb-6">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const isActive = idx + 1 === currentStep;
        return (
          <div
            key={idx}
            className={`flex-1 h-2 rounded-full transition-all ${
              isActive ? "bg-[#343079]" : "bg-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
};

export default StepProgressBar;
