import React, { useState } from "react";
import Page1 from "./IdentifyYourself";
import Page2 from "./CareerGoal";
import Page3 from "./ProgramDuration";

const Topbar = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

  const steps = [
    { id: 1, title: "Identify Yourself" },
    { id: 2, title: "Choose Your Goal" },
    { id: 3, title: "Select Duration" },
  ];

  const handleStepClick = (stepId) => {
    // ✅ Prevent jumping to duration without career
    if (stepId === 3 && !selectedCareer) return;
    setCurrentStep(stepId);
  };

  return (
    <div className="w-full flex flex-col items-center mt-10">

      {/* ==== TOP STEPPER ==== */}
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div
                onClick={() => handleStepClick(step.id)}
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-semibold cursor-pointer transition-all ${
                  isCompleted
                    ? "bg-green-600 border-green-600 text-white"
                    : isActive
                    ? "bg-[#343079] border-[#343079] text-white"
                    : "bg-white border-[#d4d4d4] text-[#9ca3af]"
                }`}
              >
                {isCompleted ? "✔" : step.id}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`w-48 h-[1.5px] ${
                    isCompleted ? "bg-green-600" : "bg-[#d4d4d4]"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* ==== STEP TITLES ==== */}
      <div className="flex justify-center w-full mt-3 gap-[7.5rem] text-[15px] font-medium">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`cursor-pointer ${
                isCompleted
                  ? "text-green-600 font-semibold"
                  : isActive
                  ? "text-[#343079] font-semibold"
                  : "text-[#6b6b6b]"
              }`}
            >
              {step.title}
            </div>
          );
        })}
      </div>

      {/* ==== CONTENT BOX ==== */}
      <div
        className="mt-10 mb-10 flex flex-col items-center w-full max-w-7xl"
        style={{
          border: "1px solid #C0BFD5",
          borderRadius: "8px",
          padding: "36px",
        }}
      >
        <div className="w-full flex justify-center items-start">

          {currentStep === 1 && (
            <Page1 onNext={() => setCurrentStep(2)} />
          )}

          {currentStep === 2 && (
            <Page2
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
              setSelectedCareer={setSelectedCareer}
            />
          )}

          {currentStep === 3 && (
            <Page3
              onBack={() => setCurrentStep(2)}
              selectedCareer={selectedCareer}
              setSelectedDuration={setSelectedDuration}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default Topbar;
