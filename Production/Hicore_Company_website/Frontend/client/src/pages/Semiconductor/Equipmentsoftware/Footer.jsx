import React from "react";
import arrowicon from "../../../assets/Semiconductor/Arrow.png";
import bluearrowicon from "../../../assets/Semiconductor/bluearrow.png";

const Footer = () => {
  return (
    <div className="flex flex-col gap-[24px] md:gap-[64px] p-[16px] sm:p-[24px] md:p-[64px]">
      <div className="flex flex-col rounded-[4px] p-[20px] sm:p-[28px] md:p-[36px] gap-[24px] md:gap-[36px] bg-[#F0F0F0]">
        
        {/* Text Section */}
        <div className="flex flex-col gap-[12px] md:gap-[16px] items-center text-center">
          <h2
            className="font-bold text-[18px] sm:text-[20px] md:text-[24px] leading-[28px] sm:leading-[36px] md:leading-[48px] text-[#053C61]"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Control and Automate Your Equipment with Confidence
          </h2>

          <p
            className="text-[14px] sm:text-[16px] md:text-[18px] leading-[22px] sm:leading-[28px] md:leading-[36px] text-[#6C6C6C]"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Deploy a reliable, standards-compliant equipment software platform
            built for industrial environments.
          </p>
        </div>

        {/* Button Section */}
        <div className="flex flex-col md:flex-row gap-[12px] md:gap-[16px] px-0 sm:px-[24px] md:px-[100px]">
          
          <button className="w-full md:w-[50%] flex flex-row items-center justify-center bg-[#053C61] border hover:border-[#F0F0F0] hover:shadow-[4px_4px_4px_0px_#053C6180] transition-shadow duration-300 rounded-[4px] px-[16px] md:px-[24px] py-[10px] gap-[8px]">
            <span
              className="font-semibold text-[14px] sm:text-[16px] md:text-[18px] text-white"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Request Technical Demo
            </span>
            <img src={arrowicon} className="w-[18px] md:w-[20px] h-[18px] md:h-[20px]" alt="arrow" />
          </button>

          <button className="w-full md:w-[50%] flex flex-row items-center justify-center border border-[#053C61] hover:bg-[#F0F0F0] hover:shadow-[4px_4px_4px_0px_#053C6180] transition-shadow duration-300 rounded-[4px] px-[16px] md:px-[24px] py-[10px] gap-[8px]">
            <span
              className="font-semibold text-[14px] sm:text-[16px] md:text-[18px] text-[#053C61]"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Speak with an Automation Expert
            </span>
            <img src={bluearrowicon} className="w-[18px] md:w-[20px] h-[18px] md:h-[20px]" alt="arrow" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default Footer;
