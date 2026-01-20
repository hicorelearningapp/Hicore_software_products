import React from "react";
import bannerimg from "../../assets/Landingpage/bannerbg.png";
import bannertop from "../../assets/Landingpage/bannertop.png";
import bannerbottom from "../../assets/Landingpage/girlthinking.png";

const Beginjourney = () => {
  return (
    <div className="w-full h-[750px] relative pr-[100px] pl-[100px] flex flex-col gap-[64px]">
      {/* Background image with 3% opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bannerimg})`,
          opacity: 0.02,
          zIndex: 0,
        }}
      ></div>

      {/* Foreground content */}
      <div className="relative w-full h-full flex gap-[56px] items-center">
        {/* Left side */}
        <div className="relative w-[665px] h-[578px] flex flex-col gap-[24px] p-[32px]">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-[#2758B3]/5 rounded-[36px] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-[16px]">
            <h2 className="text-[#2758B3] font-bold text-[28px] leading-[64px]">
              Every Mark Counts.
            </h2>
            <h2 className="text-[#2758B3] font-bold text-[28px] leading-[64px]">
              Let’s Make Them Yours.
            </h2>
            <p className="text-[#2758B3] font-semibold text-[20px] leading-[48px] mt-6">
              From First Concept to Final Exam — Simplified
            </p>
            <p className="text-[#2758B3] font-regular text-[16px] leading-[48px]">
              Step-by-step roadmap to take you from learning basics to mastering exam-day strategy. Customized learning paths, AI-guided revision, and performance tracking built just for you.
            </p>
          </div>
          <div className="w-full h-[56px] flex justify-between items-center gap-[16px] text-center">
            <button className="w-1/2 h-[52px] flex justify-center items-center gap-2 px-4 py-2 rounded-[80px] bg-[#2758B3] hover:bg-[#08265F] transition cursor-pointer text-white text-[16px] font-semibold">
              Begin My Journey
            </button>
            <button className="w-1/2 h-[52px] flex justify-center items-center gap-2 px-4 py-2 rounded-[80px] bg-white border border-[#2758B3] hover:bg-[#E6EEFF] transition cursor-pointer text-[#2758B3] text-[16px] font-semibold">
              View Features
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex flex-col w-[330px] h-[750px] gap-[16px]">
          {/* Top image */}
          <div className="flex justify-center">
            <img
              src={bannertop}
              alt="Top"
              className="w-[220px] h-[276px] object-contain"
            />
          </div>
          {/* Bottom image full width */}
          <div className="flex justify-center">
            <img
              src={bannerbottom}
              alt="Bottom"
              className="w-[331px] h-[460px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beginjourney;