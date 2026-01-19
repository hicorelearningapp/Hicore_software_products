import React, { useState, useEffect } from "react";
import bannerBg from "../../../assets/banner-bg.png";
import girlImage from "../../../assets/Freelance/girlimage.png"

import exploreIcon from "../../../assets/Freelance/exploreI.png";
import applyIcon from "../../../assets/Freelance/EditI.png";
import answerIcon from "../../../assets/Freelance/answerI.png";
import submitIcon from "../../../assets/Freelance/submitI.png";

import realWorldImage from "../../../assets/Freelance/img1.jpg";
import mentorImage from "../../../assets/Freelance/img2.jpg";
import globeImage from "../../../assets/Freelance/img3.jpg";
import certificateImage from "../../../assets/Freelance/img4.jpg";
import img5 from "../../../assets/Freelance/img5.jpg";
import img6 from "../../../assets/Freelance/img6.jpg";

import bgImage from "../../../assets/background.png"; 
import { useNavigate } from "react-router-dom";

const steps = [
  {
    step: "Step 1",
    icon: applyIcon,
    title: "Complete Your Profile",
    desc: "Add skills, resume, and portfolio links.",
  },
  {
    step: "Step 2",
    icon: exploreIcon,
    title: "Browse or Match Gigs",
    desc: "Let AI suggest projects that fit your skillset.",
  },
  {
    step: "Step 3",
    icon: answerIcon,
    title: "Apply & Deliver",
    desc: "Use pre-filled tools or upload custom proposals.",
  },
  {
    step: "Step 4",
    icon: submitIcon,
    title: "Get Rated & Certified",
    desc: "Earn feedback, payment, and a certificate.",
  },
];

const benefits = [
  {
    title: "Earn While You Learn",
    desc: "Get paid for your contributions. Freelance work helps you earn income while growing professionally.",
    img: realWorldImage,
  },
  {
    title: "Verified Projects & Feedback",
    desc: "Get ratings and testimonials on completion - useful for job applications and internship opportunities.",
    img: mentorImage,
  },
  {
    title: "Real-World Experience",
    desc: "Work on actual industry-relevant tasks that help bridge the gap between academics and hands-on practice.",
    img: globeImage,
  },
  {
    title: "Skill-Based Matching",
    desc: "Projects tailored to your current skills in design, development, writing, data, marketing, and more - no experience barriers.",
    img: certificateImage,
  },
   {
    title: "Client Collaboration",
    desc: "Work directly with startups, small businesses, and creators. Learn client communication and remote collaboration.",
    img: img5,
  },
   {
    title: "Flexible Timelines",
    desc: "Choose projects that fit your schedule - weekend-only, part-time, or short-term tasks designed for students.",
    img: img6,
  },
  
];

const Intro = () => {
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    if (activeStep !== null) {
      const timer = setTimeout(() => {
        setActiveStep(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  const navigate = useNavigate();


  return (
    <div className="w-full bg-[#F9F9FF] overflow-x-hidden">
      {/* ------------------- BANNER SECTION ------------------- */}
     <div
  className="w-full h-[300px] bg-cover bg-center flex justify-between items-center px-[60px]"
  style={{ backgroundImage: `url(${bannerBg})` }} // your light background image
>
  {/* Left Text Section */}
  <div className="max-w-[600px] flex flex-col gap-[16px]">
    <h1 className="text-[#343079] font-poppins font-semibold text-[20px]">
      Freelance Projects for Students
    </h1>
    <p className="text-[#343079] font-poppins text-[16px] leading-[28px]">
      Turn your classroom skills into real income, find short-term gigs, build your portfolio, and earn certificates.
    </p>
    <p className="text-[#343079] font-poppins text-[14px] leading-[24px]">
      <span className="font-bold text-[#343079]">Earn Early</span> →
      <span className="font-bold text-[#343079]"> Real Experience</span> →
      <span className="font-bold text-[#343079]"> Skill Growth</span> →
      <span className="font-bold text-[#343079]"> Global Exposure</span>
    </p>

    <button
      onClick={() => navigate("/freelance-projects")}
      className="w-full h-[40px] bg-[#343079] text-white font-poppins text-[14px] rounded-[8px]"
    >
      Find My First Gig
    </button>
  </div>

  {/* Right Image Section */}
  <div className="w-[400px] h-auto">
    <img
      src={girlImage} 
      alt="Girl Working"
      className="w-full h-auto object-contain"
    />
  </div>
</div>


      {/* -------------------Freelance Project Process------------------- */}
      <div className="w-full px-[36px] mt-[72px] flex justify-center">
        <div className="w-[1296px] bg-white border border-[#EBEAF2] rounded-[8px] px-[36px] py-[36px] flex flex-col gap-[36px]">
          <h2 className="text-[28px] leading-[56px] font-semibold font-poppins text-[#343079] text-center self-center">
  Freelance Project Process
</h2>

          <div className="flex gap-[36px]">
            {steps.map((item, index) => {
              const isActive = activeStep === index;
              return (
                <div key={index} className="relative w-[297px]">
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
                      width:
                        index === 0
                          ? "254px"
                          : index === 1 || index === 2
                          ? "251px"
                          : "250px",
                      height: "156px",
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
                    <h3 className="font-poppins font-semibold text-[14px] text-[#1E1E1E]">
                      {item.title}
                    </h3>
                    <p
                      className={`font-poppins text-[12px] leading-[20px] ${
                        isActive ? "text-[#1E1E1E]" : "text-[#4D4D4D]"
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

      {/* ------------------- Freelance BENEFITS ------------------- */}
      <div className="w-full flex justify-center px-[36px] mt-[72px]">
  <div className="w-[1296px] h-[2200px] border border-[#EBEAF2] rounded-[8px] p-[36px] flex flex-col gap-[36px] bg-white">
    {/* Header */}
   <h2 className="text-[#343079] text-[28px] font-semibold font-poppins leading-[56px] text-center self-center">
  Why Join Freelance Projects?
</h2>


    {/* Grid Layout */}
    <div className="flex flex-wrap gap-[36px] w-[1296px] h-[1324px]">
      {benefits.map((item, index) => (
        <div
          key={index}
          className="w-[590px] h-[649px] rounded-[8px] bg-[#FFFAEF] flex flex-col shadow-sm"
        >
          {/* Image Section */}
          <img
            src={item.img}
            alt={item.title}
            className="w-[590px] h-[401px] object-cover rounded-t-[8px]"
          />

          {/* Text Section */}
          <div className="w-[630px] h-[232px] px-[36px] py-[36px] flex flex-col gap-[16px]">
            <h3 className="w-[558px] h-[48px] text-[#343079] text-[16px] font-semibold font-poppins leading-[32px]">
              {item.title}
            </h3>
            <p className="w-[558px] h-[96px] text-[#343079] text-[16px] leading-[32px] font-poppins">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


      {/* ------------------- SKILLS UPGRADE CTA ------------------- */}
 <div className="w-full flex justify-center px-[36px] mt-[72px] mb-[72px]"> 
  <div className="w-[1296px] h-[356px] border border-[#EBEAF2] rounded-[8px] p-[36px] bg-white shadow-sm flex items-center justify-center">
    <div
      className="w-full h-[284px] rounded-[8px] bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center gap-[24px]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h2 className="text-[#343079] text-[24px] font-semibold font-poppins text-center">
        Let’s Make That First Paycheck Happen!
      </h2>
      <p className="text-[#4A4A68] text-[16px] leading-[28px] text-center font-poppins">
        Explore beginner-friendly freelance gigs designed just for students. <br />
        Build your skills, boost your resume, and start earning today.
      </p>
      <button
        onClick={() => navigate("/freelance-projects")}
        className="w-[450px] h-[44px] bg-[#282655] hover:bg-[#1f1d44] transition-all text-white text-[14px] font-medium font-poppins rounded-[8px]"
      >
        Find My First Gig
      </button>
    </div>
  </div>
</div>


    </div>
  );
};
export default Intro;
