import React, { useState, useEffect } from "react";
import bannerBg from "../../../assets/banner-bg.png";
import bannerImage from "../../../assets/Internship_banner.png";

import exploreIcon from "../../../assets/exploreI.png";
import applyIcon from "../../../assets/applyI.png";
import answerIcon from "../../../assets/answerI.png";
import submitIcon from "../../../assets/submitI.png";

import realWorldImage from "../../../assets/college_concept.jpg";
import mentorImage from "../../../assets/womenchatting.png";
import globeImage from "../../../assets/Globe.png";
import certificateImage from "../../../assets/Certificate_ribbon.png";
import bgImage from "../../../assets/background.png";
import tickIcon from "../../../assets/circle_tick.png";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    step: "Step 1",
    icon: exploreIcon,
    title: "Explore Internship Roles",
    desc: "Browse available internships based on domain, eligibility, duration, location, or AI-suggested matches",
  },
  {
    step: "Step 2",
    icon: applyIcon,
    title: "Choose How to Apply",
    desc: "Apply your way — use your profile resume, build a new one, or upload custom version.",
  },
  {
    step: "Step 3",
    icon: answerIcon,
    title: "Answer Quick Questions",
    desc: "To help mentors and hiring teams understand you better.",
  },
  {
    step: "Step 4",
    icon: submitIcon,
    title: "Submit Your Application",
    desc: "Once everything is ready, hit Submit Application",
  },
];

const benefits = [
  {
    title: "Real-World Projects",
    desc: "Interns at HiCore Software Tech tackle meaningful real-world projects from day one. This hands-on experience accelerates your learning and builds a strong portfolio.",
    img: realWorldImage,
  },
  {
    title: "Mentor Support",
    desc: "You won’t work alone at ABC. Every intern is paired with an experienced mentor who guides your project and professional growth.",
    img: mentorImage,
  },
  {
    title: "Global Exposure",
    desc: "Join a diverse, global intern community. Collaborate with team members and clients around the world and participate in company-wide events and hackathons.",
    img: globeImage,
  },
  {
    title: "Certification",
    desc: "Complete your internship with an industry-recognized certificate. This credential highlights your skills and accomplishment, making you stand out to future employers.",
    img: certificateImage,
  },
];

const InternshipOpportunities = () => {
  const [activeStep, setActiveStep] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeStep !== null) {
      const timer = setTimeout(() => {
        setActiveStep(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  /** ✅ Login check wrapper for navigation */
  const handleProtectedNavigate = (path) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login", { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* ------------------- BANNER SECTION ------------------- */}
      <div
        className="w-full h-[500px] bg-cover bg-center flex justify-center items-center gap-[36px]"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="w-[712px] h-[522px] p-[48px] flex flex-col justify-center gap-[36px]">
          <div className="w-[616px] h-[312px] flex flex-col gap-[16px]">
            <h1 className="text-[#343079] font-poppins font-semibold text-[28px] leading-[56px]">
              Build Skills. Earn Certification. Get Hired.
            </h1>
            <p className="text-[#343079] font-poppins font-normal text-[18px] leading-[48px]">
              Launch your tech career with project-based internships at{" "}
              <span className="font-bold text-[16px] leading-[32px]">
                HiCore Software Technologies.
              </span>{" "}
              Our interns dive into real-world projects from day one, gaining
              practical skills under expert mentors. Like leading tech programs,
              we ensure your work “makes an impact…through real projects”.
            </p>
          </div>
          <div className="w-[616px] h-[40px] flex gap-[16px]">
            <button
              onClick={() => handleProtectedNavigate("/browse-open-internships")}
              className="w-full h-[48px] cursor-pointer rounded-[8px] bg-[#282655] border border-[#403B93] hover:border-white hover:bg-[#403B93] transition-all text-white text-[16px] font-medium font-poppins"
            >
              Browse Open Internships
            </button>
            <button
              onClick={() => handleProtectedNavigate("/internship-project")}
              className="w-full h-[48px] cursor-pointer rounded-[8px] border border-[#282655] hover:border-[#343079] hover:bg-gray-300 transition-all text-[#282655] text-[16px] font-medium font-poppins"
            >
              Explore by Domain
            </button>
          </div>
        </div>
        <div className="w-[712px] h-[522px] p-[48px] flex justify-center items-center">
          <img
            src={bannerImage}
            alt="Internship Banner"
            className="w-[616px] h-[426px] object-cover rounded-[8px]"
          />
        </div>
      </div>

      {/* ------------------- INTERNSHIP APPLICATION PROCESS ------------------- */}
      <div className="w-full px-10 mt-16 flex justify-center">
        <div className="max-w-full bg-white border border-gray-300 rounded-lg px-8 py-10 flex flex-col gap-10">
          <h2 className="text-[28px] leading-[56px] font-semibold font-poppins text-[#343079] text-center">
            Internship Application Process
          </h2>

          {/* Step Cards */}
          <div className="grid grid-cols-4 gap-12">
            {steps.map((item, index) => (
              <div
                key={index}
                className="relative rounded-lg p-6 shadow-sm flex flex-col gap-3 cursor-pointer 
                  transition-all duration-300 bg-[#FFFAEF] border border-transparent 
                  hover:border-[#E0E0E0] hover:shadow-md group"
              >
                <div
                  className="absolute -top-0 -right-6 bg-[#343079] text-white text-sm font-medium 
                    px-4 py-2 rounded-md shadow-md transform transition-transform duration-300 
                    group-hover:scale-110"
                >
                  {item.step}
                </div>

                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-6 h-6 transition-transform duration-300 group-hover:scale-105"
                />
                <h3 className="font-poppins font-semibold text-[16px] text-[#1E1E1E]">
                  {item.title}
                </h3>
                <p className="font-poppins text-[15px] leading-[22px] text-[#4D4D4D]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------- INTERNSHIP BENEFITS ------------------- */}
      <div className="w-full bg-white flex justify-center px-10 mt-[72px]">
        <div className="w-full border border-[#EBEAF2] rounded-[8px] p-[36px] flex flex-col gap-[36px] bg-white">
          <h2 className="text-[#343079] text-[28px] font-semibold font-poppins leading-[56px] text-center">
            Why Join Our Internship Program?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[36px] w-full">
            {benefits.map((item, index) => (
              <div
                key={index}
                className="w-full rounded-[8px] bg-[#FFFAEF] flex flex-col shadow-sm hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full max-h-[400px] object-cover rounded-t-[8px]"
                />
                <div className="px-[36px] py-[28px] flex flex-col gap-[16px]">
                  <h3 className="text-[#343079] text-[18px] font-semibold font-poppins leading-[32px]">
                    {item.title}
                  </h3>
                  <p className="text-[#343079] text-[16px] leading-[28px] font-poppins">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------- SKILLS UPGRADE CTA ------------------- */}
      <div className="w-full flex justify-center px-10 mt-[72px] mb-[72px]">
        <div className="w-full p-[36px] bg-white border border-[#EBEAF2] rounded-[12px] shadow-sm">
          <div
            className="w-full rounded-[12px] flex flex-col items-center gap-[32px] px-10 py-10 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <h3 className="text-[#2B2B5F] text-[28px] font-semibold font-poppins text-center leading-[48px]">
              Explore job opportunities across top companies and locations.
            </h3>

            <div className="flex flex-col md:flex-row justify-between w-full gap-[32px]">
              <div className="flex flex-col justify-center gap-[16px] md:w-1/2 pl-2">
                {[
                  "Work with Leading Companies",
                  "Earn Competitive Packages",
                  "Grow Your Career Faster",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-[12px]">
                    <img src={tickIcon} alt="tick" className="w-[24px] h-[24px]" />
                    <p className="text-[#2B2B5F] text-[18px] leading-[32px] font-poppins">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-center gap-[20px] md:w-1/2">
                <p className="text-[#2B2B5F] text-[18px] leading-[30px] font-poppins text-left md:text-justify">
                  Kickstart your career with top industry roles and unlock your potential in the tech world.
                </p>
                <button
                  onClick={() => handleProtectedNavigate("/applyforjobs")}
                  className="w-full h-[48px] cursor-pointer rounded-[8px] bg-[#1C1B43] hover:bg-[#282655] transition-all text-white text-[15px] font-medium font-poppins shadow-sm"
                >
                  Unlock your dream career
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipOpportunities;
