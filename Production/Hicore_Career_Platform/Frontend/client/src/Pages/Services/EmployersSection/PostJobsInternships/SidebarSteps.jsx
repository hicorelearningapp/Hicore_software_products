// src/components/Employer/PostJob/SidebarSteps.jsx
import React from "react";

const SidebarSteps = ({ currentStep, setCurrentStep }) => {
  const steps = [
    "Basic Details",
    "Job Description",
    "Job Details",
    "Preview & Publish",
  ];

  return (
    <div className="w-72 rounded-l-xl border border-gray-200 p-4">
      {steps.map((label, index) => {
        const isActive = currentStep === index + 1;
        return (
          <button
            key={index}
            onClick={() => setCurrentStep(index + 1)}
            className={`w-full text-left px-4 py-2 mb-4 rounded-lg text-[16px] whitespace-nowrap transition ${
              isActive
                ? "bg-[#F2F0FB] text-[#343079] font-medium"
                : "text-[#343079] hover:bg-gray-50"
            }`}
          >
            {index + 1}. {label}
          </button>
        );
      })}
    </div>
  );
};

export default SidebarSteps;
