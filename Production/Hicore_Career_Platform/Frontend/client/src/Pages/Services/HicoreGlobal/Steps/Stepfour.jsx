import React from "react";
import icon1 from "../../../../assets/HicoreGlobal/domain.png";
import icon2 from "../../../../assets/HicoreGlobal/jobid.png";
import icon3 from "../../../../assets/HicoreGlobal/assignment.png";
import icon4 from "../../../../assets/HicoreGlobal/professional.png";

const requirementsData = [
  {
    title: "Academic Requirements",
    bg: "#F3F3FB",
    icon: icon1,
    points: [
      "Minimum GPA: 3.5/4.0",
      "Bachelor's degree in related field",
      "Transcripts evaluation required",
      "Academic recommendation letters",
    ],
  },
  {
    title: "Language Requirements",
    bg: "#FFFAEF",
    icon: icon2,
    points: [
      "TOEFL iBT: 100+ or IELTS: 7.0+",
      "Test valid for 2 years",
      "Speaking section minimum scores",
      "Alternative: Duolingo English Test",
    ],
  },
  {
    title: "Test Requirements",
    bg: "#F0F7FF",
    icon: icon3,
    points: [
      "GRE General: 320+ recommended",
      "Subject GRE (if required)",
      "GMAT for business programs",
      "Portfolio for creative fields",
    ],
  },
  {
    title: "Documents Needed",
    bg: "#E8FFDD",
    icon: icon4,
    points: [
      "Statement of Purpose",
      "Resume/CV",
      "3 Letters of Recommendation",
      "Financial documentation",
    ],
  },
];

const Stepfour = ({onContinue}) => {
  return (
    <div className="w-full h-fit p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6">
      {/* Heading */}
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 4 : Requirements Analysis
        </h2>
        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Understand what you need for each selected university
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="w-full flex flex-wrap gap-[36px]">
        {requirementsData.map((item, index) => (
          <div
            key={index}
            className="w-full sm:w-[calc(50%-18px)] h-fix p-9 rounded-[8px] border border-[#65629E] flex flex-col gap-4"
            style={{ backgroundColor: item.bg }}
          >
            {/* Icon */}
            <img
              src={item.icon}
              alt={item.title}
              className="w-[48px] h-[48px]"
            />

            {/* Text Section */}
            <div className="flex flex-col gap-2">
              <h6 className="text-[16px] font-bold text-[#343079] leading-[32px]">
                {item.title}
              </h6>
              <ul className="list-disc pl-5 text-[16px] text-[#343079] leading-[32px]">
                {item.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        {/* Continue Button */}
        <div className="w-full flex justify-end">
          <button onClick={onContinue}
           className="bg-[#282655] mt-4 text-white px-6 py-2 rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-[#8682D3] hover:border-white">
             Start Test Preparation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stepfour;
