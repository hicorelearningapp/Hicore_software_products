import React from "react";
import { FiChevronDown } from "react-icons/fi";

const Formulatab = ({ selectedTopic }) => {
  const formulas = selectedTopic?.formulas || [];

  return (
    <div className="flex flex-col gap-6">
      {formulas.length > 0 ? (
        formulas.map((item, index) => (
          <details
            key={index}
            className="group border border-[#B0CBFE] rounded-lg"
          >
            {/* Summary Section */}
            <summary className="flex justify-between items-center cursor-pointer px-4 py-3 font-semibold text-[#2758B3] text-[16px] gap-[16px]">
              <div className="w-full">
                <h2 className="text-[14px] text-[#2758B3] font-semibold mb-2">
                  {item.title}
                </h2>

                {/* Normal Text Box */}
                <div className="w-full bg-gradient-to-r from-[#E6EEFF] to-[#FFFFFF] border border-[#E6EEFF] rounded-lg px-4 py-2 text-[14px] text-[#2758B3] leading-relaxed break-words">
                  {item.formula}
                </div>
              </div>

              <FiChevronDown className="text-[#2758B3] text-[18px] transition-transform duration-300 group-open:rotate-180" />
            </summary>

            {/* Expanded Details */}
            <div className="px-6 py-4 border-t border-[#B0CBFE] text-[14px] text-[#2758B3] flex flex-col gap-5">
              {item.example && (
                <div className="w-full flex flex-col gap-2 p-4 rounded-[16px] bg-[#FCF3E5]">
                  <h2 className="text-[14px] font-semibold text-[#2758B3]">
                    Example:
                  </h2>
                  <p>{item.example}</p>
                </div>
              )}

              {item.explanation && (
                <div className="w-full flex flex-col gap-2 p-4 rounded-[16px] bg-[#F0FFF1]">
                  <h2 className="text-[14px] font-semibold text-[#2758B3]">
                    Explanation:
                  </h2>
                  <p>{item.explanation}</p>
                </div>
              )}
            </div>
          </details>
        ))
      ) : (
        <p className="text-gray-500">No formulas available for this topic.</p>
      )}
    </div>
  );
};

export default Formulatab;
