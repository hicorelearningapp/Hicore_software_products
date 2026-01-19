import React, { useState } from "react";
import StepOne from "../../../../Services/HicoreGlobal/Steps/Stepone";
import StepTwo from "../../../../Services/HicoreGlobal/Steps/Steptwo";
import Stepthree from "../../../../Services/HicoreGlobal/Steps/Stepthree";
import Stepfour from "../../../../Services/HicoreGlobal/Steps/Stepfour";
import Stepfive from "../../../../Services/HicoreGlobal/Steps/Stepfive";
import Stepsix from "../../../../Services/HicoreGlobal/Steps/Stepsix";
import Stepseven from "../../../../Services/HicoreGlobal/Steps/Stepseven";
import Stepeight from "../../../../Services/HicoreGlobal/Steps/Stepeight";
import Stepnine from "../../../../Services/HicoreGlobal/Steps/Stepnine";
import Stepten from "../../../../Services/HicoreGlobal/Steps/Stepten";
import Stepeleven from "../../../../Services/HicoreGlobal/Steps/Stepeleven";
import Steptwelve from "../../../../Services/HicoreGlobal/Steps/Steptwelve";
import StepSidebar from "./Stepsidebar";

const HigherstudyJobseeker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 12;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onContinue={handleNext} />;
      case 2:
        return <StepTwo onContinue={handleNext} />;
      case 3:
        return <Stepthree onContinue={handleNext} />;
      case 4:
        return <Stepfour onContinue={handleNext} />;
      case 5:
        return <Stepfive onContinue={handleNext} />;
      case 6:
        return <Stepsix onContinue={handleNext} />;
      case 7:
        return <Stepseven onContinue={handleNext} />;
      case 8:
        return <Stepeight onContinue={handleNext} />;
      case 9:
        return <Stepnine onContinue={handleNext} />;
      case 10:
        return <Stepten onContinue={handleNext} />;
      case 11:
        return <Stepeleven onContinue={handleNext} />;
      case 12:
        return <Steptwelve onContinue={handleNext} />;
      default:
        return (
          <div className="p-4 text-center">Step {currentStep} Content</div>
        );
    }
  };

  return (
    <div className="md:max-w-7xl min-h-screen bg-white border m-4  rounded-lg border-[#343079] font-[Poppins] overflow-x-hidden">
      {/* Progress Bar */}
      <div className="w-full px-4 sm:px-12 pt-9 pb-9">
        <div className="w-full">
          <div className="flex justify-between items-center gap-[12px] mb-4">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-[12px] rounded-[4px] ${
                  index < currentStep - 1
                    ? "bg-[#008000]"
                    : index === currentStep - 1
                    ? "bg-[#282655]"
                    : "bg-[#E9E8F3]"
                }`}
              />
            ))}
          </div>
          <p className="text-[14px] font-poppins text-[#343079] font-semibold">
            Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
          </p>
        </div>
      </div>

      {/* Form Section with Sidebar + Step Component */}
      <div className="w-full pt-9 pb-9 px-4 sm:px-12">
        <div className="w-full flex flex-col lg:flex-row gap-0 sm:gap-0 rounded-lg overflow-hidden">
          <StepSidebar
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
          />

          {renderStepComponent()}
        </div>
      </div>
    </div>
  );
};

const getStepTitle = (step) => {
  const titles = {
    1: "Profile Setup",
    2: "University Discovery",
    3: "University Results",
    4: "Requirements Analysis",
    5: "Test Preparation",
    6: "Document Preparation",
    7: "Application Management",
    8: "Expert Consultation",
    9: "Funding & Scholarships",
    10: "Visa Process",
    11: "Peer Network",
    12: "Pre-Departure & Landing",
  };
  return titles[step] || "Step";
};

export default HigherstudyJobseeker;
