import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import bannerBg from "../../../../assets/For Mentor/ReviewLandingPage/banner-bg.png";
import bannerImage from "../../../../assets/For Mentor/ReviewLandingPage/bannerimg.jpg";

import targeticon from "../../../../assets/For Mentor/ReviewLandingPage/target.png";
import learnicon from "../../../../assets/For Mentor/ReviewLandingPage/learn.png";
import skillicon from "../../../../assets/For Mentor/ReviewLandingPage/skill.png";
import badgeicon from "../../../../assets/For Mentor/ReviewLandingPage/badge.png";

import bgImage from "../../../../assets/For Mentor/ReviewLandingPage/background.jpg";

import learnstepIcon from "../../../../assets/For Mentor/ReviewLandingPage/learnstep.png";
import editIcon from "../../../../assets/For Mentor/ReviewLandingPage/edit.png";
import circleIcon from "../../../../assets/For Mentor/ReviewLandingPage/circle-tick.png";
import mentorIcon from "../../../../assets/For Mentor/ReviewLandingPage/mentor.png";

import footerImage from "../../../../assets/For Mentor/ReviewLandingPage/footerimg.png";

const benefitCards = [
  {
    icon: targeticon,
    title: "Boost Credibility",
    description: "Build your profile as an industry expert.",
    bg: "#F3F3FB",
  },
  {
    icon: learnicon,
    title: "Earn Recognition",
    description: "Gain badges for consistent and quality reviews.",
    bg: "#FFFAEF",
  },
  {
    icon: skillicon,
    title: "Influence Careers",
    description: "Help students enhance their portfolios and get job-ready.",
    bg: "#F0F7FF",
  },
  {
    icon: badgeicon,
    title: "Networking Opportunities",
    description: "Connect with top-performing students and potential collaborators.",
    bg: "#E8FFDD",
  },
];

  const steps = [
    {
      step: "Step 1",
      icon: learnstepIcon,
      title: "Choose Project",
      desc: "Browse submitted projects from students.",
    },
    {
      step: "Step 2",
      icon: editIcon,
      title: "Open Details",
      desc: "Open details (proposal, code, documentation, demo link).",
    },
    {
      step: "Step 3",
      icon: circleIcon,
      title: "Review & Feedback",
      desc: "Add structured feedback (strengths, areas of improvement, suggestions).",
    },
    {
      step: "Step 4",
      icon: mentorIcon,
      title: "Rate & Endorse",
      desc: "Rate and endorse projects that meet high standards.",
    },
  ];

const ReviewLandingPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
      if (activeStep !== null) {
        const timer = setTimeout(() => {
          setActiveStep(null);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [activeStep]);

  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* ------------------- BANNER SECTION ------------------- */}
      <div
        className="w-full h-auto lg:h-[400px] bg-cover bg-center flex flex-col lg:flex-row gap-[36px]"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="w-full lg:w-[712px] h-auto p-6 lg:p-[48px] flex flex-col gap-[24px] lg:gap-[36px]">
          <div className="w-full lg:w-[616px] flex flex-col gap-[8px] lg:gap-[16px]">
            <h1 className="text-[#343079] font-poppins font-semibold text-[22px] lg:text-[28px] leading-[32px] lg:leading-[56px]">
              Shape Futures by Reviewing Student Projects            </h1>
            <p className="text-[#343079] font-poppins font-normal text-[16px] lg:text-[18px] leading-[28px] lg:leading-[38px]">
              Provide constructive feedback, guide improvements, and make a lasting impact on students’ careers.            </p>
          </div>
          <div className="w-full lg:w-[616px] h-auto flex gap-[16px]">
            <button onClick={() => navigate("/student-review/review-project")}
             className="w-full h-[40px] bg-[#343079] text-white font-poppins text-[16px] leading-[24px] rounded-[8px] border border-[#403B93] px-[16px] py-[8px] cursor-pointer transition-all duration-300 hover:bg-[#8682D3] hover:border-white">
               Start Reviewing Projects            </button>
          </div>
        </div>
        <div className="w-full lg:w-[712px] h-auto p-6 lg:p-[48px] flex justify-center items-center">
          <img
            src={bannerImage}
            alt="Internship Banner"
            className="w-full max-w-[566px] h-auto lg:h-[290px] object-cover rounded-[8px]"
          />
        </div>
      </div>

     
        <div className="w-full flex justify-center px-4 lg:px-[36px] mt-[32px] mb-12">
        <div className="w-full p-4 sm:p-9 rounded-lg border border-[#EBEAF2]">
          <h2 className="text-center text-[#343079] font-bold text-[20px] sm:text-[24px] leading-[32px]">
            Steps for Mentors – Guide Final Year Projects          </h2>
          <div className="flex flex-wrap justify-center sm:flex-nowrap gap-4 sm:gap-[36px] mt-8">
            {steps.map((item, index) => {
              const isActive = activeStep === index;
              return (
                <div key={index} className="relative w-full sm:w-[297px]">
                  {/* Step Button */}
                  <div
                    onClick={() => setActiveStep(index)}
                    className="absolute top-9 right-0 z-10 bg-[#343079] text-white text-[14px] font-medium
                      px-[16px] py-[4px] rounded-tr-[8px] rounded-br-[8px]
                      transition-transform duration-300 ease-in-out hover:scale-110 origin-right cursor-pointer"
                    style={{
                      width:
                        index === 0
                          ? "79px"
                          : index === 1 || index === 2
                            ? "82px"
                            : "83px",
                      height: "36px",
                    }}
                  >
                    {item.step}
                  </div>

                  {/* Step Card */}
                  <div
                    className={`mt-[36px] rounded-[8px] p-[16px] shadow-sm flex flex-col gap-[12px] transition-all duration-300
                    ${
                      isActive
                        ? "bg-[#D3EBFF] border-2 border-[#2196F3]"
                        : "bg-[#FFFAEF] border border-transparent"
                    }`}
                    style={{
                      width: "220px",
                      height: "180px",
                    }}
                  >
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-[24px] h-[24px]"
                      style={{
                        filter: isActive
                          ? "brightness(0) saturate(100%) hue-rotate(180deg)"
                          : "none",
                      }}
                    />
                    <h3 className="font-poppins font-semibold text-[14px] text-[#343079]">
                      {item.title}
                    </h3>
                    <p
                      className={`font-poppins text-[12px] leading-[20px] ${
                        isActive ? "text-[#343079]" : "text-[#343079]"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* ------------------- BENEFITS SECTION ------------------- */}
      <div className="w-full pt-9 pb-9 px-4 sm:px-8">
        <div className="w-full p-4 sm:p-9 rounded-lg border border-[#EBEAF2]">
          <h2 className="text-center text-[#343079] font-bold text-[18px] sm:text-[24px] leading-[28px] sm:leading-[32px]">
             Benefits for Mentors          </h2>
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


      {/* ------------------- FOOTER CTA SECTION ------------------- */}
      <div className="w-full flex justify-center px-4 lg:px-[36px] mt-[2px] mb-12">
        <div className="w-full lg:w-[1296px] border border-[#EBEAF2] rounded-[8px] p-4 lg:p-[36px] flex flex-col gap-[36px] bg-white">
          <div
            className="w-full h-full flex flex-col lg:flex-row gap-[16px] rounded-[8px] bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="w-full lg:w-1/2 flex flex-col justify-center gap-[12px] lg:gap-[16px] p-4 lg:pl-[60px] lg:pr-[20px]">
              <h3 className="text-[#343079] text-[18px] lg:text-[22px] leading-[28px] lg:leading-[36px] font-semibold font-poppins">
                Ready to Empower Students with Your Expertise?
              </h3>

              <p className="text-[#343079] text-[16px] lg:text-[18px] leading-[28px] lg:leading-[36px] font-medium font-poppins">
                Start reviewing projects today and leave a meaningful impact.              </p>
              <div>
                <button
                 className="w-full h-[48px] rounded-[8px] bg-[#282655] hover:bg-[#1f1d44] transition-all text-white text-[14px] font-medium font-poppins">
                  Start Mentoring Projects
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 h-auto p-4 lg:p-[48px] flex justify-center items-center">
            <img
             src={footerImage}
             alt="Internship Banner"
             className="max-w-full h-[250px] object-contain rounded-[8px]"
            />
           </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewLandingPage;