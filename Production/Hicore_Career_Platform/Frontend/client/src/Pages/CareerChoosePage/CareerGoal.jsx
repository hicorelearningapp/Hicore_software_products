import React, { useState } from "react";
import careerRouteConfig from "../../Routes/careerrouteConfig";

const CareerGoal = ({ onNext, onBack, setSelectedCareer }) => {
  const [selectedCareerLocal, setSelectedCareerLocal] = useState(null);

  const handleSelect = (career) => {
    setSelectedCareerLocal(career.title);
    setSelectedCareer(career); // pass full career object
  };

  return (
    <div className="p-8 pt-4">
      <h2 className="text-[24px] font-bold text-[#343079] text-center mb-4">
        What's your career goal?
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Select the career path you want to pursue
      </p>

      {/* Career cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {careerRouteConfig.map((career) => (
          <div
            key={career.id}
            onClick={() => handleSelect(career)}
            className={`cursor-pointer flex items-center bg-white rounded-2xl border h-40 border-gray-300 p-6 transition-all duration-200 hover:shadow-sm hover:-translate-y-1 ${
              selectedCareerLocal === career.title
                ? "border-[#343079] ring-2 ring-[#343079]/20"
                : ""
            }`}
          >
            <img
              src={career.image}
              alt={career.title}
              className="w-20 h-20 object-contain flex-shrink-0"
            />

            <div className="ml-4 text-left">
              <h3 className="text-[#343079] font-bold text-[18px] mb-2">
                {career.title}
              </h3>
              <p className="text-gray-500 text-[16px] mt-1 leading-snug">
                {career.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg font-semibold text-[#343079] border border-[#343079] hover:bg-[#343079] hover:text-white transition"
        >
          Back
        </button>

        <button
          disabled={!selectedCareerLocal}
          onClick={onNext}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
            selectedCareerLocal
              ? "bg-[#343079] hover:bg-[#292467]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CareerGoal;
