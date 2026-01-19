import React from "react";
import { useNavigate } from "react-router-dom";

import bannerBg from "../../../../assets/Employer/ManageApplications/banner-bg.jpg";
import bannerImage from "../../../../assets/Employer/ManageApplications/banner.jpg";

import filtericon from "../../../../assets/Employer/ManageApplications/img1.png";
import messageicon from "../../../../assets/Employer/ManageApplications/img2.png";
import aiicon from "../../../../assets/Employer/ManageApplications/img3.png";
import saveicon from "../../../../assets/Employer/ManageApplications/img4.png";

import applicationImage from "../../../../assets/Employer/ManageApplications/img11.jpg";
import faceImage from "../../../../assets/Employer/ManageApplications/img22.jpg";
import businessImage from "../../../../assets/Employer/ManageApplications/img33.jpg";
import photoImage from "../../../../assets/Employer/ManageApplications/img44.jpg";
import bgImage from "../../../../assets/Employer/ManageApplications/bottom-banner.jpg";
import bannerinnerimage from "../../../../assets/Employer/ManageApplications/bg-inner-image.png";

const benefitCards = [
  {
    icon: filtericon,
    title: "Saves Time",
    description:
      "No need to open each resume individually - preview and compare candidates instantly.",
    bg: "#F3F3FB",
  },
  {
    icon: messageicon,
    title: "Reduces Hiring Costs",
    description:
      "By identifying the most relevant candidates early, you avoid unnecessary interview rounds.",
    bg: "#FFFAEF",
  },
  {
    icon: aiicon,
    title: "Ensures Fair Hiring",
    description:
      "Standardized filters and AI matching help reduce bias and ensure consistent evaluation.",
    bg: "#F0F7FF",
  },
  {
    icon: saveicon,
    title: "Enhances Candidate Experience",
    description:
      "Quick responses and streamlined processes improve your employer brand.",
    bg: "#E8FFDD",
  },
];

const features = [
  {
    title: "Centralized Application Tracking",
    desc: "Keep all candidate applications in one organized dashboard - no more lost resumes or scattered emails.",
    img: applicationImage,
  },
  {
    title: "Faster Shortlisting & Decision-Making",
    desc: "Instantly filter candidates by job role, experience, skills, salary expectations, and status to quickly find top talent.",
    img: faceImage,
  },
  {
    title: "Streamlined Candidate Communication",
    desc: "Send messages, schedule interviews, or invite candidates to apply directly from the dashboard.",
    img: businessImage,
  },
  {
    title: "Data-Driven Insights",
    desc: "Use AI-powered match scores and application analytics to prioritize candidates who best fit your requirements.",
    img: photoImage,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  // ✅ Helper function to handle login check
  const handleNavigation = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      navigate("/manage-applications/manage");
    } else {
      navigate("/login", { state: { from: "/manage-applications/manage" } });
    }
  };

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
              Don’t Let Top Talent Slip Away
            </h1>
            <p className="text-[#343079] font-poppins font-normal text-[16px] lg:text-[18px] leading-[28px] lg:leading-[30px]">
              From first glance to final offer, manage your talent pipeline with
              real-time updates, AI-powered match scores, and collaboration
              tools that help your team make the right hiring decisions faster.
            </p>
          </div>
          <div className="w-full lg:w-[616px] h-auto flex gap-[16px]">
            <button
              onClick={handleNavigation}
              className="w-full h-[40px] bg-[#343079] text-white font-poppins text-[14px] leading-[24px] rounded-[8px] border border-[#403B93] px-[16px] py-[8px] cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC]"
            >
              Start Managing Applications
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
      <div className="w-full pt-9 pb-9 px-4 sm:px-10">
        <div className="w-full p-4 sm:p-9 rounded-lg border border-[#EBEAF2]">
          <h2 className="text-center text-[#343079] font-bold text-[18px] sm:text-[24px] leading-[28px] sm:leading-[32px]">
            Benefits of Managing Applications
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
      <div className="w-full flex justify-center px-10  mt-[42px]">
        <div className="w-full border border-[#EBEAF2] rounded-[8px] p-4 lg:p-[36px] flex flex-col gap-[36px] bg-white">
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
      <div className="w-full flex justify-center px-10 mt-[72px] mb-12">
        <div className="w-full border border-[#EBEAF2] rounded-[8px] p-4 lg:p-[36px] flex flex-col gap-[36px] bg-white">
          <div
            className="w-full h-full flex flex-col lg:flex-row gap-[16px] rounded-[8px] bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="w-full lg:w-1/2 flex flex-col justify-center gap-[12px] lg:gap-[16px] p-4 lg:pl-[20px] lg:pr-[20px]">
              <h3 className="text-[#343079] text-[22px] lg:text-[28px] leading-[32px] lg:leading-[56px] font-semibold font-poppins">
                Take Charge of Your Hiring Pipeline
              </h3>
              <p className="text-[#343079] text-[16px] lg:text-[18px] leading-[28px] lg:leading-[36px] font-medium font-poppins">
                Manage all your shortlisted applications in one place and move
                the right candidates forward faster.
              </p>
              <div>
                <button
                  onClick={handleNavigation}
                  className="w-full h-[48px] rounded-[8px] bg-[#282655] hover:bg-[#1f1d44] transition-all text-white text-[14px] font-medium font-poppins hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC]"
                >
                  Start Managing Applications
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 h-auto p-4 lg:p-[48px] flex justify-center items-center">
              <img
                src={bannerinnerimage}
                alt="Internship Banner"
                className="w-[300px] h-[300px] object-cover rounded-[8px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
