import React from "react";
import benefiticon from "../../../assets/Semiconductor/Benefit.png";

/* ================= DATA ================= */

const operationalBenefits = [
  "Faster equipment integration",
  "Reduced manual operations",
  "Improved uptime and reliability",
  "Standardized factory communication",
  "Scalable deployment across fabs",
];

const differentiationData = [
  { left: "Hard-coded logic", right: "Full data transparency" },
  { left: "Limited visibility", right: "Configurable & script-based" },
  { left: "Manual responses", right: "Automated reactions" },
  { left: "Vendor-dependent", right: "SEMI standards-based" },
];

/* ================= COMPONENT ================= */

const Benefits = () => {
  return (
    // Reduced padding on mobile (p-4) vs desktop (p-16/64px)
    <div className="flex flex-col gap-[32px] md:gap-[64px] p-4 md:p-[64px]">
      
      {/* Wrapper: Stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col md:flex-row gap-[36px]">
        
        {/* ================= LEFT : OPERATIONAL BENEFITS ================= */}
        {/* Removed heavy padding on mobile to save horizontal space */}
        <div className="w-full md:w-[50%] flex flex-col gap-[24px] md:gap-[36px] p-0 md:p-[36px] rounded-[4px]">
          
          {/* Title */}
          <div className="flex flex-col gap-[6px] items-center justify-center">
            <h2 className="font-bold text-[18px] md:text-[20px] leading-[28px] md:leading-[48px] text-[#053C61] text-center" style={{ fontFamily: "Arial, sans-serif" }}>
              OPERATIONAL BENEFITS
            </h2>
            <svg
              viewBox="0 0 300 8"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[80px] md:w-[40%] h-[8px]"
              preserveAspectRatio="none"
            >
              <path d="M0 4 C70 0, 230 0, 300 4 C230 8, 70 8, 0 4 Z" fill="#053C61" />
            </svg>
          </div>

          {/* Benefits List */}
          <div className="flex flex-col gap-[12px] md:gap-[16px]">
            {operationalBenefits.map((item, index) => (
              <div
                key={index}
                className="flex flex-row rounded-[4px] p-[12px] md:p-[16px] gap-[12px] md:gap-[16px] border border-[#B2C3CE] bg-white hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.25)] items-center"
              >
                <img
                  src={benefiticon}
                  alt="benefit"
                  className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0"
                />
                <p className="text-[14px] md:text-[16px] leading-[22px] md:leading-[32px] text-[#053C61]" style={{ fontFamily: "Arial, sans-serif" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT : DIFFERENTIATION ================= */}
        <div className="w-full md:w-[50%] flex flex-col gap-[24px] md:gap-[36px] p-0 md:p-[36px] rounded-[4px]">
          
          {/* Title */}
          <div className="flex flex-col gap-[6px] items-center justify-center">
            <h2 className="font-bold text-[18px] md:text-[20px] leading-[28px] md:leading-[48px] text-[#053C61] text-center" style={{ fontFamily: "Arial, sans-serif" }}>
              DIFFERENTIATION
            </h2>
            <svg
              viewBox="0 0 300 8"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[80px] md:w-[30%] h-[8px]"
              preserveAspectRatio="none"
            >
              <path d="M0 4 C70 0, 230 0, 300 4 C230 8, 70 8, 0 4 Z" fill="#053C61" />
            </svg>
          </div>

          {/* Comparison Table */}
          <div className="flex flex-col rounded-[4px] border border-[#B2C3CE] overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-row bg-[#053C61]">
              <div className="w-[50%] py-[12px] md:py-[16px] px-2 flex items-center justify-center border-r border-white/20">
                <h3 className="font-bold text-[13px] md:text-[16px] leading-tight md:leading-[32px] text-white text-center" style={{ fontFamily: "Arial, sans-serif" }}>
                  Conventional Systems
                </h3>
              </div>
              <div className="w-[50%] py-[12px] md:py-[16px] px-2 flex items-center justify-center">
                <h3 className="font-bold text-[13px] md:text-[16px] leading-tight md:leading-[32px] text-white text-center" style={{ fontFamily: "Arial, sans-serif" }}>
                  This Equipment Software
                </h3>
              </div>
            </div>

            {/* Rows */}
            {/* Reduced p-4 on mobile to prevent boxes from being too narrow */}
            <div className="flex flex-col gap-[16px] md:gap-[36px] p-4 md:p-[36px]">
              {differentiationData.map((row, index) => (
                <div key={index} className="flex flex-row gap-[8px] md:gap-[20px]">
                  
                  {/* Left (Conventional) */}
                  <div className="w-[50%] px-[8px] md:px-[16px] py-[12px] md:py-[8px] bg-[#E6272708] hover:shadow-[4px_4px_4px_rgba(0,0,0,0.25)] border border-[#E62727] flex items-center justify-center">
                    <p className="text-[12px] md:text-[16px] leading-tight md:leading-[32px] text-[#E62727] text-center" style={{ fontFamily: "Arial, sans-serif" }}>
                      {row.left}
                    </p>
                  </div>

                  {/* Right (Modern) */}
                  <div className="w-[50%] px-[8px] md:px-[16px] py-[12px] md:py-[8px] bg-[#17981708] hover:shadow-[4px_4px_4px_rgba(0,0,0,0.25)] border border-[#179817] flex items-center justify-center">
                    <p className="text-[12px] md:text-[16px] leading-tight md:leading-[32px] text-[#179817] text-center" style={{ fontFamily: "Arial, sans-serif" }}>
                      {row.right}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Benefits;