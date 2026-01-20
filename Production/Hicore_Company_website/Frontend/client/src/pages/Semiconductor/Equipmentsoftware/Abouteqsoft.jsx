import React from "react";
import arrowicon from "../../../assets/Semiconductor/Arrow.png";
import bluearrowicon from "../../../assets/Semiconductor/bluearrow.png";
import eqsoftimg from "../../../assets/Semiconductor/eqsoft.png";

const Abouteqsoft = () => {
  return (
    <div className="flex flex-col p-[20px] sm:p-[36px] md:p-[64px] gap-[36px] md:gap-[64px]">
      
      <div className="flex flex-col gap-[28px] md:gap-[36px] p-[20px] sm:p-[36px] md:p-[64px]">
        
        {/* Heading + Description */}
        <div className="flex flex-col gap-[12px] md:gap-[16px]">
          <h1
            className="
              font-semibold
              text-[22px] sm:text-[28px] md:text-[40px]
              leading-[32px] sm:leading-[40px] md:leading-[52px]
              tracking-[-0.3px]
              text-[#053C61]
              text-center
            "
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Equipment Software for{" "}
            <span className="text-[#0A6CFF] font-bold">
              SECS/GEM-Based
            </span>{" "}
            Control & Monitoring
          </h1>

          <p
            className="
              font-normal
              text-[14px] sm:text-[16px] md:text-[18px]
              leading-[22px] sm:leading-[28px] md:leading-[36px]
              tracking-[0.2px]
              text-[#6C6C6C]
              text-center
              max-w-[900px]
              mx-auto
            "
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            A standards-compliant equipment software platform enabling real-time
            monitoring, remote control, recipe management, and automation for
            industrial and semiconductor equipment.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] md:gap-[16px]">
          
          <button className="
            w-full sm:w-[260px] md:w-[280px]
            flex items-center justify-center
            bg-[#053C61]
            border
            hover:border-[#F0F0F0]
            hover:shadow-[4px_4px_4px_0px_#053C6180]
            transition-all duration-300
            rounded-[4px]
            px-[20px] md:px-[24px]
            py-[10px]
            gap-[8px]
          ">
            <span
              className="font-semibold text-[14px] sm:text-[16px] md:text-[18px] text-white tracking-[0.3px]"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Request Demo
            </span>
            <img src={arrowicon} className="w-[18px] md:w-[20px] h-[18px] md:h-[20px]" alt="arrow" />
          </button>

          <button className="
            w-full sm:w-[260px] md:w-[280px]
            flex items-center justify-center
            border border-[#053C61]
            hover:bg-[#F0F0F0]
            hover:shadow-[4px_4px_4px_0px_#053C6180]
            transition-all duration-300
            rounded-[4px]
            px-[20px] md:px-[24px]
            py-[10px]
            gap-[8px]
          ">
            <span
              className="font-semibold text-[14px] sm:text-[16px] md:text-[18px] text-[#053C61] tracking-[0.3px]"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Contact Us
            </span>
            <img src={bluearrowicon} className="w-[18px] md:w-[20px] h-[18px] md:h-[20px]" alt="arrow" />
          </button>

        </div>

        {/* Image */}
        <img
          src={eqsoftimg}
          className="
            rounded-[4px]
            w-full
            h-[220px] sm:h-[360px] md:h-[600px]
            object-cover
          "
          alt="Protocol"
        />
      </div>
    </div>
  );
};

export default Abouteqsoft;
