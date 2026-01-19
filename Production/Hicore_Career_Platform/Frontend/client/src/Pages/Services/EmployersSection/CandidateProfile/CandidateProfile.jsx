import React from "react";
import { useNavigate } from "react-router-dom";

import bannerBg from "../../../../assets/banner-bg.png";
import bannerImage from "../../../../assets/Employer/CandidateProfile/banner.png";

import filtericon from "../../../../assets/Employer/CandidateProfile/filters.png";
import messageicon from "../../../../assets/Employer/CandidateProfile/message.png";
import aiicon from "../../../../assets/Employer/CandidateProfile/ai.png";
import saveicon from "../../../../assets/Employer/CandidateProfile/save.png";

import applicationImage from "../../../../assets/Employer/CandidateProfile/application.png";
import faceImage from "../../../../assets/Employer/CandidateProfile/face-recognition.png";
import businessImage from "../../../../assets/Employer/CandidateProfile/businessman.png";
import photoImage from "../../../../assets/Employer/CandidateProfile/photo-selecting.png";
import bgImage from "../../../../assets/background.png";

const benefitCards = [
  {
    icon: filtericon,
    title: "Smart Filters",
    description: "Precision targeting of candidates",
    bg: "#F3F3FB",
  },
  {
    icon: messageicon,
    title: "Instant Messaging",
    description: "Reach candidates faster",
    bg: "#FFFAEF",
  },
  {
    icon: aiicon,
    title: "AI-Powered Ranking",
    description: "Focus only on top-matched profiles",
    bg: "#F0F7FF",
  },
  {
    icon: saveicon,
    title: "Shortlist & Save",
    description: "Build your own talent pool",
    bg: "#E8FFDD",
  },
];

const features = [
  {
    title: "Instant Access to Talent Pools",
    desc: "Quickly view pre-verified, job-ready candidates with relevant skills and experience. No more waiting for applications — talent comes to you",
    img: applicationImage,
  },
  {
    title: "Smart Filters & AI Match Scores",
    desc: "Easily narrow down candidates based on role, skills, location, salary expectations, and availability. Use AI-powered scores to instantly identify the best-fit profiles.",
    img: faceImage,
  },
  {
    title: "Built-in Actions",
    desc: "Message candidates directly, shortlist them, or invite them to apply — all from one screen.",
    img: businessImage,
  },
  {
    title: "Bulk Actions & Shortlisting",
    desc: "Select multiple candidates and take actions like exporting resumes, messaging, or shortlisting — with just a few clicks.",
    img: photoImage,
  },
];

const CandidateProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* ------------------- BANNER SECTION ------------------- */}
      <div
        className="w-full h-auto lg:h-[320px] bg-cover bg-center flex flex-col lg:flex-row gap-[36px]"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="w-full lg:w-[712px] h-auto p-6 lg:p-[48px] flex flex-col gap-[24px] lg:gap-[36px]">
          <div className="w-full lg:w-[616px] flex flex-col gap-[8px] lg:gap-[16px]">
            <h1 className="text-[#343079] font-poppins font-semibold text-[22px] lg:text-[28px] leading-[32px] lg:leading-[56px]">
              Build Your Dream Team Faster
            </h1>
            <p className="text-[#343079] font-poppins font-normal text-[16px] lg:text-[18px] leading-[28px] lg:leading-[48px]">
              Unlock powerful tools to filter, evaluate, and connect with job-ready candidates — all in one place.
            </p>
          </div>
          <div className="w-full lg:w-[616px] h-auto flex gap-[16px]">
            <button onClick={() => navigate("/candidate-profile/exploretalentpool")}
             className="w-full h-[40px] bg-[#343079] text-white font-poppins text-[14px] leading-[24px] rounded-[8px] border border-[#403B93] px-[16px] py-[8px] cursor-pointer transition-all duration-300 hover:bg-[#8682D3] hover:border-white">
              Explore Talent Pool Now
            </button>
          </div>
        </div>
        <div className="w-full lg:w-[712px] h-auto p-6 lg:p-[48px] flex justify-center items-center">
          <img
            src={bannerImage}
            alt="Internship Banner"
            className="w-full max-w-[566px] h-auto lg:h-[250px] object-cover rounded-[8px]"
          />
        </div>
      </div>

      {/* ------------------- BENEFITS SECTION ------------------- */}
      <div className="w-full pt-9 pb-9 px-4 sm:px-8">
        <div className="w-full p-4 sm:p-9 rounded-lg border border-[#EBEAF2]">
          <h2 className="text-center text-[#343079] font-bold text-[18px] sm:text-[24px] leading-[28px] sm:leading-[32px]">
            Benefits to Employers
          </h2>
          <div className="w-full mt-9 overflow-x-auto">
            <div className="flex flex-wrap sm:flex-nowrap gap-[24px] justify-center">
              {benefitCards.map((card, i) => (
                <div
                  key={i}
                  className="w-full sm:w-[285px] p-6 rounded-lg border border-[#65629E] flex flex-col"
                  style={{ backgroundColor: card.bg }}
                >
                  <img src={card.icon} alt="icon" className="w-12 h-12 mb-4" />
                  <h3 className="text-[#343079] font-bold text-[16px] leading-[24px] sm:leading-[32px] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[#343079] text-[14px] sm:text-[16px] leading-[24px] sm:leading-[32px]">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------- FEATURE SECTION ------------------- */}
      <div className="w-full flex justify-center px-4 lg:px-[36px] mt-[42px]">
        <div className="w-full lg:w-[1296px] border border-[#EBEAF2] rounded-[8px] p-4 lg:p-[36px] flex flex-col gap-[36px] bg-white">
          <h2 className="text-[#343079] text-[20px] lg:text-[28px] font-semibold font-poppins leading-[32px] lg:leading-[56px] text-center">
            Why This Feature is Helpful for Employers?
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-[16px] sm:gap-[24px] lg:gap-[36px]">
            {features.map((item, index) => (
              <div
                key={index}
                className="w-full rounded-[8px] bg-[#FFFAEF] flex flex-col shadow-sm"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-auto lg:h-[401px] object-cover rounded-t-[8px]"
                />
                <div className="w-full px-4 lg:px-[36px] py-4 lg:py-[36px] flex flex-col gap-[8px] lg:gap-[16px]">
                  <h3 className="text-[#343079] text-[14px] sm:text-[16px] font-semibold font-poppins leading-[20px] sm:leading-[32px]">
                    {item.title}
                  </h3>
                  <p className="text-[#343079] text-[12px] sm:text-[16px] leading-[20px] sm:leading-[32px] font-poppins">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------- FOOTER CTA SECTION ------------------- */}
      <div className="w-full flex justify-center px-4 lg:px-[36px] mt-[72px] mb-12">
        <div className="w-full lg:w-[1296px] border border-[#EBEAF2] rounded-[8px] p-4 lg:p-[36px] flex flex-col gap-[36px] bg-white">
          <div
            className="w-full h-full flex flex-col lg:flex-row gap-[16px] rounded-[8px] bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="w-full lg:w-1/2 flex flex-col justify-center gap-[12px] lg:gap-[16px] p-4 lg:pl-[20px] lg:pr-[20px]">
              <h3 className="text-[#343079] text-[22px] lg:text-[28px] leading-[32px] lg:leading-[56px] font-semibold font-poppins">
                Missing the Skills for Your Dream Role?
              </h3>
              <p className="text-[#343079] text-[16px] lg:text-[18px] leading-[28px] lg:leading-[36px] font-medium font-poppins">
                Browse curated candidate profiles, shortlist instantly, and move one step closer to the perfect hire.
              </p>
              <div>
                <button className="w-full h-[48px] rounded-[8px] bg-[#282655] hover:bg-[#1f1d44] transition-all text-white text-[14px] font-medium font-poppins">
                  Explore Talent Pool Now
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 h-auto p-4 lg:p-[48px] flex justify-center items-center">
              <img
                src={bannerImage}
                alt="Internship Banner"
                className="w-full h-auto lg:h-[250px] object-cover rounded-[8px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
