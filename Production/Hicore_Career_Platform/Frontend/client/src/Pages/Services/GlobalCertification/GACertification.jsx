import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Assets
import gabanner from "../../../assets/GACertificationpng/gacertification_bg.jpg";
import gaImage from "../../../assets/GACertificationpng/gacertification.png";
import employericon from "../../../assets/GACertificationpng/employer.png";
import secureicon from "../../../assets/GACertificationpng/Secure.png";
import workicon from "../../../assets/GACertificationpng/Work.png";
import verifiedicon from "../../../assets/GACertificationpng/Verified.png";
import finalyearimg from "../../../assets/GACertificationpng/finalyrproject.jpg";
import skillimg from "../../../assets/GACertificationpng/skill_upgrade.png";
import certifiedimg from "../../../assets/GACertificationpng/certified_internship.png";
import computericon from "../../../assets/GACertificationpng/computer.png";
import tickicon from "../../../assets/GACertificationpng/tick.png";
import careericon from "../../../assets/GACertificationpng/career.png";
import gafootericon from "../../../assets/GACertificationpng/gafooter_bg.jpg";
import lockIcon from "../../../assets/GACertificationpng/Lock.png";
import certificateImg from "../../../assets/GACertificationpng/GACertificate.png";

const GACertification = () => {
  const data = {
    banner: {
      bgImage: gabanner,
      mainImage: gaImage,
      title: "Globally Recognized Certificate That Employers Trust.",
      subtitle: "Earn your certificate through real-world projects, internships, or skill-based courses.",
      note: "- All certified by HiCore Software Technologies (MNC).",
      buttons: [
        { label: "Earn My Certificate Now" },
        { label: "View Sample Certificate" },
      ],
    },
    whyCards: [
      {
        icon: employericon,
        title: "Issued by a Multinational Company",
        description: "Validate your skills with a certificate from HiCore Software Technologies, recognized across the US, Canada, India, and global markets.",
        bg: "#F3F3FB",
      },
      {
        icon: secureicon,
        title: "Secure & Verifiable Certificate",
        description: "Every certificate includes a unique ID and digital signature, so recruiters and institutions can instantly verify authenticity.",
        bg: "#FFFAEF",
      },
      {
        icon: workicon,
        title: "Built for Job Applications & Global Visibility",
        description: "Add your certificate to LinkedIn, job portals, resumes, and study abroad profiles - and stand out instantly.",
        bg: "#F0F7FF",
      },
      {
        icon: verifiedicon,
        title: "Industry-Validated. Employer-Approved",
        description: "Showcase hands-on experience, not just theory - certificates are granted only after completing real-world projects and internships.",
        bg: "#E8FFDD",
      },
    ],
    paths: [
      {
        image: finalyearimg,
        title: "Build a Final Year Project",
        description: "Build your own capstone or submit an approved project guided by mentors.",
        button: "Get Started",
        path: "/major-projects"
      },
      {
        image: skillimg,
        title: "Take a Skill Upgrade Program",
        description: "Complete a structured learning course with assessments and certification.",
        button: "View Courses",
        path: "/courses"
      },
      {
        image: certifiedimg,
        title: "Complete a Certified Internship",
        description: "Work on real projects, gain skills, and earn your internship certificate.",
        button: "Browse Internships",
        path: "/internship-opportunities"
      },
    ],
    acceptance: {
      icon: computericon,
      title: "Who Accepts It?",
      points: [
        "MNCs and global tech firms",
        "Hiring partners in the US, Canada & India",
        "EdTech & upskilling platforms",
        "Startup and freelance networks",
      ],
    },
    growth: {
      icon: careericon,
      title: "Why It Grows Your Career?",
      points: [
        "Students join to gain global recognition before graduation",
        "Job Seekers use certificates to boost credibility and job match rate",
        "Mentors trust us to certify real talent",
        "Employers rely on certified profiles for hiring faster",
      ],
    },
    tickIcon: tickicon,
    footer: {
      bgImage: gafootericon,
    },
  };

  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setShowOverlay(false);
      }
    };

    if (showOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOverlay]);

  return (
    <div className="w-full min-h-screen bg-white font-[Poppins] overflow-x-hidden">
      {/* Banner */}
      <div className="w-full h-auto sm:h-[350px] flex flex-col sm:flex-row bg-no-repeat mb-8 bg-cover bg-center border-b border-b-[#C8ECF5]" style={{ backgroundImage: `url(${data.banner.bgImage})` }}>
        <div className="flex flex-col w-full sm:w-[720px] h-auto sm:h-[350px] gap-[8px] opacity-100 p-[24px] sm:p-[48px]">
          <h2 className="text-[#343079] font-semibold text-[20px] leading-[36px] sm:leading-[48px]">{data.banner.title}</h2>
          <p className="text-[#343079] text-[18px] leading-[28px] sm:leading-[36px]">{data.banner.subtitle}</p>
          <p className="text-[#343079] text-[18px] leading-[36px] mt-[2px]">
            <span className="font-semibold">{data.banner.note}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-12">
            {data.banner.buttons.map((btn, index) => (
              <button
                key={index}
                onClick={() => {
                  index === 0 ? navigate("/courses") : setShowOverlay(true);
                }}
                className={`w-full sm:w-[304px] h-[40px] flex items-center justify-center gap-[5px] rounded-[8px] border ${
                  index === 0 ? "bg-[#282655] text-white border-[#403B93] hover:bg-[#403B93]" : "border-[#282655] text-[#282655] hover:bg-[#EBEAF2]"
                } px-[16px] py-[8px]`}
              >
                <span className="text-[14px]">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full h-full py-4 flex items-center justify-center sm:justify-center">
          <img src={data.banner.mainImage} alt="Certificate Preview" className="w-[300px] h-[220px] sm:w-[400px] sm:h-[300px] object-contain" />
        </div>
      </div>

      {/* Why Certificate */}
      <div className="w-full pt-9 pb-9 px-4 sm:px-8">
        <div className="w-full p-4 sm:p-9 rounded-lg border border-[#EBEAF2]">
          <h2 className="text-center text-[#343079] font-bold text-[20px] sm:text-[24px] leading-[32px]">Why This Certificate Matters?</h2>
          <div className="w-full mt-9 overflow-x-auto">
            <div className="flex flex-wrap sm:flex-nowrap gap-[24px] justify-center">
              {data.whyCards.map((card, i) => (
                <div key={i} className="w-full sm:w-[285px] h-auto sm:h-[400px] p-6 rounded-lg border border-[#65629E] flex flex-col" style={{ backgroundColor: card.bg }}>
                  <img src={card.icon} alt="icon" className="w-12 h-12 mb-4" />
                  <h3 className="text-[#343079] font-bold text-[16px] leading-[32px] mb-2">{card.title}</h3>
                  <p className="text-[#343079] text-[16px] leading-[32px]">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Choose Path */}
      <div className="w-full p-4 sm:p-[32px]">
        <div className="w-full p-4 sm:p-[36px] rounded-[8px] border border-[#EBEAF2]">
          <h2 className="text-center text-[20px] sm:text-[24px] font-bold text-[#343079] mb-[36px]">Choose Your Path to a Globally Accepted Certificate</h2>
          <div className="w-full flex flex-col sm:flex-row gap-[24px] justify-center items-center">
            {data.paths.map((card, i) => (
              <div key={i} className="w-full sm:w-[408px] h-auto rounded-[8px] border border-[#C0BFD5] flex flex-col items-center">
                <img src={card.image} alt="path" className="w-full h-[200px] sm:h-[272px] rounded-[8px] object-cover" />
                <div className="flex flex-col gap-[8px] p-[16px]">
                  <h3 className="text-[#343079] text-[20px] leading-[36px] font-semibold">{card.title}</h3>
                  <p className="text-[#343079] text-[16px] leading-[32px] font-normal mb-6">{card.description}</p>
                </div>
                <button onClick={() => navigate(card.path)} className="w-full bg-[#282655] text-white text-[16px] rounded-b-[8px] font-medium h-[48px] hover:bg-[#403B93] transition-colors duration-200">
                  {card.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acceptance + Growth */}
      <div className="w-full pt-6 pb-6 px-4 sm:px-10">
        <div className="flex flex-col sm:flex-row gap-[30px] items-center">
          {[data.acceptance, data.growth].map((section, index) => (
            <div key={index} className="w-full  rounded-[8px] border border-[#EBEAF2] p-[24px] sm:p-[36px]">
              <img src={section.icon} alt="icon" className="w-[60px] h-[60px] mb-4" />
              <h2 className="text-[20px] font-semibold mb-4 text-[#343079]">{section.title}</h2>
              <div className="flex flex-col gap-[16px]">
                {section.points.map((point, i) => (
                  <div key={i} className="flex items-center gap-[8px]">
                    <img src={data.tickIcon} alt="tick" className="w-[24px] h-[24px]" />
                    <p className="text-[#343079] text-[16px]">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="m-[24px] sm:m-[36px]">
        <div className="w-full h-auto sm:h-[388px] bg-cover bg-no-repeat bg-center rounded-[8px] flex flex-col sm:flex-row px-[24px] sm:px-[64px] py-[24px] sm:py-[36px] gap-[24px] sm:gap-[36px]" style={{ backgroundImage: `url(${data.footer.bgImage})` }}>
          <div className="flex flex-col w-full justify-center">
            <h2 className="text-[#1B1C57] text-[20px] font-semibold mb-[12px]">Show the world what you’ve achieved</h2>
            <p className="text-[#1B1C57] text-[16px] leading-[28px] sm:leading-[48px] mb-[24px]">
              – Demonstrate your skills and accomplishments to the world by earning a globally recognized certificate that highlights your expertise and sets you apart in today’s competitive job market.
            </p>
            <button onClick={() => navigate("/login")} className="w-full sm:w-[260px] h-[40px] rounded-[8px] bg-[#1B1C57] text-white text-[14px] font-medium shadow-md hover:bg-[#403B93] transition duration-200">
              Unlock the Certificate Now
            </button>
          </div>

          <div className="w-full flex justify-center sm:justify-end items-center">
            <div className="relative w-full sm:w-[422px] h-[200px] sm:h-[270px] rounded-[8px] overflow-hidden border border-[#343079] bg-white">
              <div className="absolute inset-0 bg-white z-[1]" />
              <img src={certificateImg} alt="Locked Certificate" className="w-full h-full object-cover opacity-25 relative z-[2]" />
              <div className="absolute inset-0 bg-white opacity-80 z-[3]" />
              <div className="absolute inset-0 flex items-center justify-center z-[4]">
                <div className="w-[56px] h-[56px] bg-[#F4F3FA] rounded-full flex items-center justify-center shadow-sm">
                  <img src={lockIcon} alt="Lock Icon" className="w-[24px] h-[24px] opacity-90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Sample Certificate Viewer */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div className="fixed inset-0 z-50 flex justify-center items-center " initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4, ease: "easeOut" }}>
            <div ref={overlayRef} className="flex justify-center items-center">
              <img src={certificateImg} alt="Sample Certificate" className="w-[80%] sm:max-w-full sm:max-h-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GACertification;
