import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bgImage from "../../../assets/HicoreGlobal/wavebanner.png";

import StepSidebar from "./Steps/Stepsidebar";
import StepOne from "./Steps/Stepone";
import StepTwo from "./Steps/Steptwo";
import StepThree from "./Steps/Stepthree";
import StepFour from "./Steps/Stepfour";
import StepFive from "./Steps/Stepfive";
import StepSix from "./Steps/Stepsix";
import StepSeven from "./Steps/Stepseven";
import StepEight from "./Steps/Stepeight";
import StepNine from "./Steps/Stepnine";
import StepTen from "./Steps/Stepten";
import StepEleven from "./Steps/Stepeleven";
import StepTwelve from "./Steps/Steptwelve";

const StudyAbroad = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialStep = location.state?.step || 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const totalSteps = 12;

  // ✅ Global data for Step 1–3
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    educationLevel: "",
    fieldOfStudy: "",
    courseProgram: "",
    preferredCountries: [],
    budget: "",
    rankingImportance: "",
  });

  useEffect(() => {
    if (location.state?.step) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            onContinue={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <StepTwo
            onContinue={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return <StepThree onContinue={handleNext} formData={formData} />;
      case 4:
        return <StepFour onContinue={handleNext} />;
      case 5:
        return <StepFive onContinue={handleNext} />;
      case 6:
        return <StepSix onContinue={handleNext} />;
      case 7:
        return <StepSeven onContinue={handleNext} />;
      case 8:
        return <StepEight onContinue={handleNext} />;
      case 9:
        return <StepNine onContinue={handleNext} />;
      case 10:
        return <StepTen onContinue={handleNext} />;
      case 11:
        return <StepEleven onContinue={handleNext} />;
      case 12:
        return <StepTwelve onContinue={handleNext} />;
      default:
        return <div className="p-4 text-center">Step {currentStep} Content</div>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white font-[Poppins] overflow-x-hidden">
      {/* 🌍 Banner Section */}
      <div
        className="relative w-full flex flex-col items-center justify-center gap-4 bg-no-repeat mb-8 bg-cover bg-center border-b border-b-[#C8ECF5]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* 🔙 Back Button inside Banner */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-[#343079] px-4 py-2 font-semibold rounded bg-white/80 hover:bg-white transition-all"
        >
          ← Back
        </button>

        <h2 className="text-center text-[#343079] font-bold text-[20px] sm:text-[24px] leading-[32px] mt-12">
          Your Complete Study Abroad Journey
        </h2>
        <p className="text-[#343079] text-center text-[18px] leading-[28px] sm:leading-[36px] w-full px-4 pb-6">
          From discovery to arrival{" "}
          <span className="font-semibold">- we're with you in every step.</span>{" "}
          Your complete guide from university discovery to landing at your dream
          destination.
        </p>
      </div>

      {/* 📊 Progress Bar */}
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

      {/* 🧭 Steps Section */}
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

// ✅ Step Titles
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

export default StudyAbroad;
