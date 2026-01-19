import React from "react";

const StepOne = ({ onContinue }) => {
  return (
    <div className="w-full h-full p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6">
      {/* Top Heading */}
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 1: Profile Setup
        </h2>
        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Let's start by understanding your academic background and goals
          </p>
        </div>
      </div>

      {/* Form Body */}
      <div className="w-full flex flex-col gap-6">
        {/* Full Name */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-[16px] text-[#343079]">Full Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter Your Full Name"
            className="h-[48px] px-4 border border-[#C0BFD5] rounded-md"
          />
        </div>

        {/* Email & Mobile */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full flex flex-col gap-1">
            <label className="text-[16px] text-[#343079]">Email address <span className="text-red-500">*</span></label>
            <input
              type="email"
              placeholder="abc@email.com"
              className="h-[48px] px-4 border border-[#C0BFD5] rounded-md"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="text-[16px] text-[#343079]">Mobile Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              placeholder="Enter Your 10-digit Mobile number"
              className="h-[48px] px-4 border border-[#C0BFD5] rounded-md"
            />
          </div>
        </div>

        {/* Education Level */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-[16px] text-[#343079]">Current Education Level <span className="text-red-500">*</span></label>
         <select placeholder="Select option" className="h-[48px] px-4 border border-[#C0BFD5] rounded-md text-[#343079]">
          <option value="Select option" className="text-[#DAD8EE]">Select option</option>
          <option value="highschool">High School</option>
          <option value="juniorcollege">Junior College</option>
          <option value="associatedegree">Associate Degree</option>
          <option value="bachelors">Bachelor’s Degree</option>
          <option value="masters">Master’s Degree</option>
          <option value="doctorate">Doctorate</option>
          <option value="workingprofessional">Working Professional</option>
         </select>
        </div>

        {/* Field of Study */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-[16px] text-[#343079]">Current/Previous Field of Study <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="e.g., Computer Science, Business, Engineering"
            className="h-[48px] px-4 border border-[#C0BFD5] rounded-md"
          />
        </div>

        {/* GPA */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-[16px] text-[#343079]">GPA/Academic Score <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="e.g., 3.5/4.0 or 85%"
            className="h-[48px] px-4 border border-[#C0BFD5] rounded-md"
          />
        </div>

        {/* Continue Button */}
        <div className="w-full flex justify-end">
          <button onClick={onContinue}
           className="bg-[#282655] mt-4 text-white px-6 py-2 rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-[#8682D3] hover:border-white">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
