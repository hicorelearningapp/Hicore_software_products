import React from "react";
import icon1 from "../../../../assets/HicoreGlobal/domain.png";
import icon2 from "../../../../assets/HicoreGlobal/jobid.png";
import icon3 from "../../../../assets/HicoreGlobal/assignment.png";
import icon4 from "../../../../assets/HicoreGlobal/professional.png";

const fundingData = [
  {
    title: "Merit-Based Scholarships High Match",
    bg: "#F3F3FB",
    icon: icon1,
    points: [
      "Potential Funding: $15,000 - $50,000 per year",
      "High Match",
      "Deadline: Dec 1, 2025"
    ],
    text: "Based on your academic performance and test scores. Available at most universities."
  },
  {
    title: "Research Assistantships",
    bg: "#FFFAEF",
    icon: icon2,
    points: [
      "Potential Funding: $20,000 - $35,000 per year + Tuition Waiver",
      "High Match",
      "Application: With Admission"
    ],
    text: "Work with faculty on research projects while studying. Perfect for your CS background."
  },
  {
    title: "External Scholarships",
    bg: "#F0F7FF",
    icon: icon3,
    points: [
      "Potential Funding: $5,000 - $25,000",
      "Medium Match",
      "Various Deadlines"
    ],
    text: "Scholarships from government, foundations, and private organizations."
  },
  {
    title: "Education Loans",
    bg: "#E8FFDD",
    icon: icon4,
    points: [
      "Available Amount: Up to $200,000",
      "Pre-approved",
      "Interest: 7.5% - 12%"
    ],
    text: "Competitive interest rates with flexible repayment options."
  },
];

const Stepnine = ({onContinue}) => {
  return (
    <div className="w-full h-fit p-9 border-t border-r border-b border-[#C0BFD5] rounded-tr-[8px] rounded-br-[8px] flex flex-col gap-6">
      {/* Heading */}
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold leading-[36px] text-[#343079]">
          Step 9 : Funding & Scholarships
        </h2>
        <div className="bg-[#FFE4FF] px-4 py-2 rounded-[8px] w-fit">
          <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
            Discover financial aid opportunities based on your profile
          </p>
        </div>
      </div>

      <p className="text-[16px] font-medium text-[#343079] leading-[28px]">
        Based on your profile, here are personalized funding opportunities:
      </p>

      {/* Cards */}
      <div className="w-full flex flex-wrap gap-[36px]">
        {fundingData.map((item, index) => (
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
              <p className="text-[16px] text-[#343079] leading-[28px]">
                {item.text}
              </p>
            </div>
          </div>
        ))}
        {/* Continue Button */}
        <div className="w-full flex justify-end">
          <button onClick={onContinue}
           className="bg-[#282655] mt-4 text-white px-6 py-2 rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-[#8682D3] hover:border-white">
             Learn Visa Process
          </button>
        </div>

      </div>
    </div>
  );
};

export default Stepnine;
