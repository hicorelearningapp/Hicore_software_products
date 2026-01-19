import React from "react";

const steps = [
  "Profile Setup",
  "University Discovery",
  "University Results",
  "Requirements Analysis",
  "Test Preparation",
  "Document Preparation",
  "Application Management",
  "Expert Consultation",
  "Funding & Scholarships",
  "Visa Process",
  "Peer Network",
  "Pre-Departure & Landing"
];

const Stepsidebar = ({ currentStep = 1, onStepClick }) => {
  return (
    <div className="w-[327px] h-fix p-9 border border-[#C0BFD5] rounded-tl-[8px] rounded-bl-[8px] flex flex-col gap-6">
      <ul className="flex flex-col gap-3">
        {steps.map((label, idx) => {
          const isActive = currentStep === idx + 1;
          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => onStepClick(idx + 1)}
                className={`w-full text-left rounded-[8px] px-2 py-1 transition-colors ${
                  isActive
                    ? "bg-[#EBEAF2] text-[#343079]"
                    : "hover:bg-[#F5F4FA] text-[#343079]"
                }`}
              >
                <span className="text-[14px] font-medium">
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Stepsidebar;