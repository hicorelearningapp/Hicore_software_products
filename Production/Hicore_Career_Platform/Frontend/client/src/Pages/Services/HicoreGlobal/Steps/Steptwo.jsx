import React from "react";

const Step2 = ({onContinue}) => {
  return (
    <div className="w-full h-fit p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6">
      {/* Top Heading */}
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 2: University Discovery
        </h2>
        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Find universities that match your preferences and goals
          </p>
        </div>
      </div>

      {/* Form Body */}
      <div className="w-full flex flex-col gap-6">
        {/* Desired Course/Program */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-[16px] text-[#343079]">
            Desired Course/Program <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Master’s in Computer Science"
            className="h-[48px] px-4 border border-[#C0BFD5] rounded-md"
          />
        </div>

        {/* Preferred Countries */}
        <div className="w-full flex flex-col gap-[4px]">
          <label className="text-[16px] leading-[32px] text-[#343079]">
            Preferred Countries <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-[4px]">
            {[
              "United States",
              "Canada",
              "United Kingdom",
              "Australia",
              "Germany",
              "Netherlands",
            ].map((country, i) => (
              <label key={i} className="flex items-center gap-2 text-[16px] text-[#343079]">
                <input
                  type="checkbox"
                  className="w-[16px] h-[16px] border-[1.5px]  border-[#343079] rounded relative top-[2.08px] left-[2.08px]"
                />
                {country}
              </label>
            ))}
          </div>
        </div>

        {/* Budget and Ranking */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Budget Dropdown */}
          <div className="w-full flex flex-col gap-1">
            <label className="text-[16px] text-[#343079]">
              Budget Range (Annual Tuition) <span className="text-red-500">*</span>
            </label>
            <select
              className="h-[40px] px-3 border border-[#DAD8EE] rounded-md text-[16px] text-[#343079]"
              defaultValue="Default"
            >
              <option value="Default" className="">Select option</option>
              <option>$0 to $10,000</option>
              <option>$10,000 to $25,000</option>
              <option>$25,000 to $50,000</option>
              <option>$50,000 to $75,000</option>
              <option>$75,000+</option>
            </select>
          </div>

          {/* Ranking Importance Dropdown */}
          <div className="w-full flex flex-col gap-1">
            <label className="text-[16px] text-[#343079]">
              Importance of University Ranking for you <span className="text-red-500">*</span>
            </label>
            <select
              className="h-[40px] px-3 border border-[#DAD8EE] rounded-md text-[16px] text-[#343079]"
              defaultValue="Default"
            >
              <option value="Default">Select option</option>
              <option>Very High (Top 50 only)</option>
              <option>High (Top 200)</option>
              <option>Moderate (Any-well ranked)</option>
              <option>Low (Focus on other factors)</option>
            </select>
          </div>
        </div>
        {/* Continue Button */}
        <div className="w-full flex justify-end">
          <button onClick={onContinue}
           className="bg-[#282655] mt-4 text-white px-6 py-2 rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-[#8682D3] hover:border-white">
            Search Universities
          </button>
        </div>

      </div>
    </div>
  );
};

export default Step2;
