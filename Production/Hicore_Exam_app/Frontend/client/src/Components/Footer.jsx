import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import bannerbg from "../assets/Landingpage/bannerbg.png";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle scrolling/navigation
  const handleScrollClick = (section) => {
    if (location.pathname === "/") {
      // Already on home → just scroll
      scroller.scrollTo(section, {
        smooth: true,
        duration: 600,
        offset: -80,
      });
    } else {
      // Navigate home, then scroll
      navigate("/");
      setTimeout(() => {
        scroller.scrollTo(section, {
          smooth: true,
          duration: 600,
          offset: -80,
        });
      }, 300);
    }
  };

  return (
    <div className="w-full h-[500px] flex flex-col gap-[64px] p-[100px] items-center justify-center rounded-t-[36px] bg-[#2758B3]">
      {/* Top Image Box */}
      <div className="flex w-full max-w-[697px] h-full max-h-[194px] gap-2 p-4 rounded-[16px] bg-[#BCCBE7]">
        <div className="w-full h-full relative rounded-[8px] bg-white shadow-[0px_4px_4px_0px_#2758B3] overflow-hidden">
          <div className="w-full h-full relative">
            <img
              src={bannerbg}
              alt="Sample"
              className="w-full h-full object-cover opacity-8 object-[center_30%] rounded-[8px]"
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <h2 className="font-semibold text-[20px] leading-[44px] tracking-[0.015em] text-[#2758B3]">
                HiCore Exam AI
              </h2>
              <p className="font-normal text-[16px] leading-[32px] tracking-[0.015em] text-[#2758B3]">
                Every weekend exam brings you one step closer to NEET success
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="w-full h-[42px] flex justify-between items-center opacity-100">
        {/* Left text */}
        <span className="text-white text-[14px] font-normal">
          © 2025 HiCore Exam AI. All Rights Reserved.
        </span>

        {/* Right side items */}
        <div className="flex gap-6">
          {/* Scroll links */}
          <span
            onClick={() => handleScrollClick("features")}
            className="relative text-white text-[14px] cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#17356B] hover:text-[#17356B] after:transition-all after:duration-0 hover:after:w-full"
          >
            Features
          </span>
          <span
            onClick={() => handleScrollClick("roadmap")}
            className="relative text-white text-[14px] cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#17356B] hover:text-[#17356B] after:transition-all after:duration-0 hover:after:w-full"
          >
            Roadmap
          </span>
          <span
            onClick={() => handleScrollClick("exams")}
            className="relative text-white text-[14px] cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#17356B] hover:text-[#17356B] after:transition-all after:duration-0 hover:after:w-full"
          >
            Exams
          </span>
          <span
            onClick={() => handleScrollClick("pricing")}
            className="relative text-white text-[14px] cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#17356B] hover:text-[#17356B] after:transition-all after:duration-0 hover:after:w-full"
          >
            Pricing
          </span>
          <span
            onClick={() => handleScrollClick("about")}
            className="relative text-white text-[14px] cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#17356B] hover:text-[#17356B] after:transition-all after:duration-0 hover:after:w-full"
          >
            About Us
          </span>

          {/* Normal routes */}
          <span className="text-white text-[14px]  hover:text-[#17356B]"
          >
            Terms & Conditions
          </span>
          <span className="text-white text-[14px]  hover:text-[#17356B]"
          >
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
