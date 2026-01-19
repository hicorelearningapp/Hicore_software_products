import React from "react";
import confusedPerson from "../assets/CarrerChoose/image-one.png"; // replace with your actual image name
import questionIcon from "../assets/CarrerChoose/question-icon.png"; // replace with your icon
import identifyIcon from "../assets/CarrerChoose/User.png"; // replace with your icons
import goalIcon from "../assets/CarrerChoose/Target.png";
import durationIcon from "../assets/CarrerChoose/Calendar.png";
import roadmapIcon from "../assets/CarrerChoose/learn.png";
import bgBanner from "../assets/CarrerChoose/bg-banner.jpg"; // background banner
import { useNavigate } from "react-router-dom";

const CareerChoose = () => {
  const navigate = useNavigate();
  return (
    <div
      className="relative bg-cover bg-center py-16 px-6 md:px-10"
      style={{ backgroundImage: `url(${bgBanner})` }}
    >
      {/* White transparent overlay to dull the background */}
      <div className="absolute inset-0 bg-white/80"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto rounded-2xl shadow-md border border-gray-300 p-14">
        {/* Top Section */}
        <div className="text-center mt-6 mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-[#343079] mb-6">
            Confused About Which Career to Choose?
          </h2>

          {/* Decorative line with cubes */}
          <div className="flex items-center justify-center ">
            {/* Left cube */}
            <div className="w-2 h-2 bg-[#343079] rotate-45"></div>

            {/* Center line */}
            <div className="w-40 md:w-190 h-[2px] bg-[#343079]"></div>

            {/* Right cube */}
            <div className="w-2 h-2 bg-[#343079] rotate-45"></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-14">
          {/* Left Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={confusedPerson}
              alt="Confused person"
              className="rounded-lg w-[90%] md:w-[100%] object-cover"
            />
          </div>

          {/* Right Text Section */}
          <div className="md:w-1/2 text-gray-700 space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={questionIcon}
                alt="question"
                className="md:w-[93px] md:h-[100px]"
              />
              <h3 className="text-lg md:text-[24px] font-bold text-[#343079]">
                Feeling Lost!!!
              </h3>
            </div>

            <p className="leading-[32px] text-[18px] text-[#343079]">
              Whether you're a college student exploring options, a fresh
              graduate unsure what’s next, or a professional planning to switch
              careers – we’ll help you find your perfect roadmap.
            </p>
            <p className="leading-[32px] text-[18px] text-[#343079]">
              Many learners feel stuck – unsure which skills to learn or which
              tech role suits them best.
            </p>
            <p className="leading-[32px] text-[18px] text-[#343079]">
              Stop being confused – start your journey with clarity and
              confidence.
            </p>

             <button 
            onClick={() => navigate("/steps-career")}
            className="bg-[#282655] w-full text-white px-6 py-3 rounded-md border mt-4 font-medium hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 hover:border-white cursor-pointer">
              Find My Career
            </button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16">
          <h3 className="text-[#343079] font-semibold text-xl mb-8">
            How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="border border-[#65629E] rounded-lg p-8 text-start bg-[#F3F3FB]">
              <img
                src={identifyIcon}
                alt="identify"
                className="w-12 h-12 mb-3"
              />
              <h4 className="text-[#343079] text-[18px] font-bold">Step 1:</h4>
              <p className="text-[#343079] text-[18px] mt-3">
                Identify Yourself
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-[#65629E] rounded-lg p-8 text-start bg-[#FFFAEF]">
              <img src={goalIcon} alt="goal" className="w-12 h-12 mb-3" />
              <h4 className="text-[#343079] text-[18px] font-semibold">
                Step 2:
              </h4>
              <p className="text-[#343079] text-[18px] mt-3">
                Choose Your Goal
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-[#65629E] rounded-lg p-8 text-start bg-[#F0F7FF]">
              <img
                src={durationIcon}
                alt="duration"
                className="w-12 h-12 mb-3"
              />
              <h4 className="text-[#343079] text-[18px] font-semibold">
                Step 3:
              </h4>
              <p className="text-[#343079] text-[18px] mt-3">Select Duration</p>
            </div>

            {/* Step 4 */}
            <div className="border border-[#65629E] rounded-lg p-8 text-start bg-[#E8FFDD]">
              <img src={roadmapIcon} alt="roadmap" className="w-12 h-12 mb-3" />
              <h4 className="text-[#343079] text-[18px] font-semibold">
                Step 4:
              </h4>
              <p className="text-[#343079] text-[18px] mt-3">
                View Your Roadmap
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerChoose;
