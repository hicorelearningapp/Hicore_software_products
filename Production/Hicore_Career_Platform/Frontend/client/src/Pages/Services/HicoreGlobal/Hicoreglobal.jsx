import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Images
import bgImage from "../../../assets/HicoreGlobal/wavebanner.png";
import bannerImage from "../../../assets/HicoreGlobal/girl.png";
import workicon from "../../../assets/HicoreGlobal/work.png";
import secureicon from "../../../assets/HicoreGlobal/secure.png";
import globalicon from "../../../assets/HicoreGlobal/global.png";
import aboutusicon from "../../../assets/HicoreGlobal/aboutus.png";
import university from "../../../assets/HicoreGlobal/university.png";
import fingerpress from "../../../assets/HicoreGlobal/fingerpress.png";
import talkingmanager from "../../../assets/HicoreGlobal/talkingmanager.png";
import travelagency from "../../../assets/HicoreGlobal/travelagencyman.png";
import scholarship from "../../../assets/HicoreGlobal/scholarshipform.png";
import friends from "../../../assets/HicoreGlobal/friends.png";
import exploreIcon from "../../../assets/HicoreGlobal/explore.png";
import applyIcon from "../../../assets/HicoreGlobal/apply.png";
import answerIcon from "../../../assets/HicoreGlobal/answer.png";
import submitIcon from "../../../assets/HicoreGlobal/submit.png";
import footerImage from "../../../assets/HicoreGlobal/footer_bg.png";
import cloudImage from "../../../assets/HicoreGlobal/cloudimg.png";

const Hicoreglobal = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(null);

  // ✅ Why Cards
  const data = {
    whyCards: [
      {
        icon: secureicon,
        title: "Secure & Streamlined",
        description:
          "A trusted, secure platform that keeps your data safe while offering transparent progress tracking, document verification, and university updates in real time.",
        bg: "#FFFAEF",
      },
      {
        icon: globalicon,
        title: "Global Community",
        description:
          "Join a vibrant network of students, mentors, universities, and alumni from across the globe — collaborate, learn, and grow together.",
        bg: "#F0F7FF",
      },
      {
        icon: aboutusicon,
        title: "Personalized Expert Support",
        description:
          "Connect instantly with expert counselors via real-time chat and video meetings to get tailored advice on programs, scholarships, and career paths.",
        bg: "#E8FFDD",
      },
      {
        icon: workicon,
        title: "AI-Powered Guidance",
        description:
          "AI-driven recommendations match you with the best universities and programs based on your academic history, project experience, and career goals.",
        bg: "#E6EFE2",
      },
    ],
  };

  // ✅ Global Data with step mapping
  const globalData = [
    {
      title: "University Finder",
      subtitle: "Find Your Perfect University",
      description:
        "Discover universities based on course, country, budget, and ranking.",
      buttonText: "Start Exploring",
      image: university,
      pathStep: 2, // Step 2 - University Discovery
    },
    {
      title: "Application Manager",
      subtitle: "Track Your Applications",
      description:
        "Manage and monitor your university applications in one place.",
      buttonText: "View Applications",
      image: fingerpress,
      pathStep: 7, // Step 7 - Application Management
    },
    {
      title: "Counselor Chat & Video Meet",
      subtitle: "Talk to a Study Abroad Expert",
      description: "Get personalized advice via chat or video calls.",
      buttonText: "Schedule a Call",
      image: talkingmanager,
      pathStep: 8, // Step 8 - Expert Consultation
    },
    {
      title: "Visa & Country Guidance",
      subtitle: "Visa & Country Information",
      description: "Step-by-step visa processes and cultural insights.",
      buttonText: "Schedule a Call",
      image: travelagency,
      pathStep: 10, // Step 10 - Visa Process
    },
    {
      title: "Scholarship & Loan Finder",
      subtitle: "Find Scholarships and Loans",
      description:
        "Access funding options based on your profile and destination.",
      buttonText: "View Opportunities",
      image: scholarship,
      pathStep: 9, // Step 9 - Funding & Scholarships
    },
    {
      title: "Student Community",
      subtitle: "Join the Global Student Community",
      description: "Ask questions, connect, and learn from peers abroad.",
      buttonText: "Explore Community",
      image: friends,
      pathStep: 11, // Step 11 - Peer Network
    },
  ];

  // ✅ Steps Overview
  const steps = [
    {
      step: "Step 1",
      icon: exploreIcon,
      title: "Discover & Apply",
      desc: "Find universities and submit applications",
    },
    {
      step: "Step 2",
      icon: applyIcon,
      title: "Get Accepted",
      desc: "Receive offers and choose your university",
    },
    {
      step: "Step 3",
      icon: answerIcon,
      title: "Visa & Funding",
      desc: "Complete visa process and secure funding",
    },
    {
      step: "Step 4",
      icon: submitIcon,
      title: "Arrive & Succeed",
      desc: "Land safely and start your academic journey",
    },
  ];

  useEffect(() => {
    if (activeStep !== null) {
      const timer = setTimeout(() => setActiveStep(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  return (
    <div className="w-full min-h-screen bg-white font-[Poppins] overflow-x-hidden">
      {/* Banner Section */}
      <div
        className="w-full h-auto sm:h-[450px] flex flex-col sm:flex-row bg-no-repeat mb-8 bg-cover bg-center border-b border-b-[#C8ECF5]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="flex flex-col w-full sm:w-[750px] h-auto sm:h-[350px] gap-[10px] p-[24px] sm:p-[48px]">
          <h2 className="text-[#343079] font-semibold text-[20px] leading-[36px] sm:leading-[48px]">
            Study Abroad Hub
          </h2>
          <p className="text-[#343079] text-lg">
            Explore global education effortlessly with HiCore Global EdConnect,
            your all-in-one platform to discover universities, connect with
            experts, and prepare for your global career.
            <br />
            <span className="block mt-2">
              Featuring real-time Counselor Chat & Video Meet, personalized
              guidance, and verified HiCoreSoft credentials — your study abroad
              journey becomes smarter, faster, and future-ready.
            </span>
          </p>
          <p className="text-[#343079] text-lg">
            With HiCore Global EdConnect, your study abroad experience is
            streamlined, supported, and career-focused — every step of the way.
          </p>
          <button
            onClick={() =>
              navigate("/hicore-global-edconnect/study-abroad-plan", {
                state: { step: 1 },
              })
            }
            className="w-full sm:w-full bg-[#282655] mt-4 text-white text-[16px] font-medium leading-[28px] px-[24px] py-[8px] rounded-[8px] transition-all duration-300 hover:bg-[#8682D3]"
          >
            Launch My Journey
          </button>
        </div>
        <div className="flex flex-col w-full sm:w-[700px] h-[380px] items-center justify-center gap-[36px]">
          <img src={bannerImage} alt="Banner" className="w-[550px] h-[400px]" />
        </div>
      </div>

      {/* Why Cards Section */}
      <div className="max-w-8xl pt-9 pb-9 px-4 sm:px-12">
        <div className="w-full p-4 sm:p-9 rounded-lg border border-[#EBEAF2]">
          <h2 className="text-center text-[#343079] font-bold text-[20px] sm:text-[24px] leading-[32px]">
            Why HiCore Global EdConnect?
          </h2>
          {/* HiCoreSoft LOR Section */}
          <div className="w-full mt-8  sm:px-12">
            <div className="w-full p-4 sm:p-9 rounded-lg border border-gray-300">
              {/* Heading */}
              <h2 className="text-center text-[#343079] font-bold text-[20px] sm:text-[24px] leading-[32px]">
                HiCoreSoft Verified Recommendation Letters (LORs)
              </h2>

              {/* Paragraph */}
              <p className="text-center text-[#343079] text-[17px] leading-[28px] mt-4 max-w-7xl mx-auto">
                HiCore Global EdConnect empowers students to showcase their true
                potential with industry-endorsed Letters of Recommendation
                issued by HiCoreSoft (MNC).
                <br />
                Students completing Mini Projects, Major Projects, or Capstone
                Programs on the HiCore Career Portal receive personalized,
                verified LORs that strengthen their global university
                applications.
              </p>

              {/* Cards */}
              <div className="w-full mt-8 overflow-x-auto">
                <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-[36px] justify-center">
                  {[
                    {
                      icon: "🎓",
                      title: "Project Details",
                      description:
                        "Highlights the specific Mini/Major/Capstone Project and student’s technical contributions.",
                    },
                    {
                      icon: "🧠",
                      title: "Skill Showcase",
                      description:
                        "Lists technologies, problem-solving abilities, and teamwork performance.",
                    },
                    {
                      icon: "🔗",
                      title: "Verified Portfolio Link",
                      description:
                        "Direct access to the student’s live project portfolio hosted on HiCore Career Portal.",
                    },
                    {
                      icon: "👨‍🏫",
                      title: "Mentor Evaluation",
                      description:
                        "Includes mentor feedback and performance summary.",
                    },
                    {
                      icon: "🌐",
                      title: "Global Standard Format",
                      description:
                        "Accepted by leading universities worldwide.",
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="w-full sm:w-[240px] h-auto p-6 rounded-lg border border-[#65629E] flex flex-col cursor-default transition-all duration-300 ease-linear hover:shadow-[0px_4px_4px_0px_#00000040]"
                      style={{ backgroundColor: "#F3F3FB" }}
                    >
                      <div className="text-[32px] mb-4">{card.icon}</div>
                      <h3 className="text-[#343079] font-bold text-[16px] leading-[32px] mb-2">
                        {card.title}
                      </h3>
                      <p className="text-[#343079] text-[16px] leading-[28px]">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom paragraph */}
              <p className="text-center text-[#343079] text-[17px] leading-[28px] mt-8 max-w-7xl mx-auto">
                HiCoreSoft Recommendation Letters give students a unique edge —
                real projects, verified credentials, and industry recognition
                all in one document.
              </p>
            </div>
          </div>

          {/* Why Cards */}
          <div className="w-full mt-12 overflow-x-auto">
            <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-[54px] justify-center">
              {data.whyCards.map((card, i) => (
                <div
                  key={i}
                  className="w-full sm:w-[240px] h-auto p-6 rounded-lg border border-[#65629E] flex flex-col items-center cursor-default transition-all duration-300 hover:shadow-[0px_4px_4px_0px_#00000040]"
                  style={{ backgroundColor: card.bg }}
                >
                  <img src={card.icon} alt="icon" className="w-12 h-12 mb-4" />
                  <h3 className="text-center text-[#343079] font-bold text-[16px] leading-[32px] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-center text-[#343079] text-[16px] leading-[32px]">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Go Global Section */}
      <div className="w-full pt-4 pb-9 px-4 sm:px-12">
        <div className="w-full p-4 sm:p-9 rounded-lg border border-[#EBEAF2]">
          <h2 className="w-full font-bold text-2xl md:text-3xl text-center text-[#403B93]">
            Go Global with Confidence
          </h2>
          <div className="flex flex-col gap-[100px] mt-10">
            {globalData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`w-full flex flex-col lg:flex-row ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 lg:gap-[64px] items-center px-4 sm:px-12`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full lg:w-[520px] h-auto lg:h-[340px] rounded-[8px]"
                  />
                  <div className="max-w-[500px] flex flex-col justify-center gap-[10px] p-4 lg:p-[36px]">
                    <h2 className="text-[20px] leading-[36px] font-semibold text-[#343079]">
                      {item.title}
                    </h2>
                    <p className="text-[16px] leading-[32px] text-[#343079]">
                      {item.subtitle}
                    </p>
                    <p className="text-[16px] leading-[32px] text-[#343079]">
                      {item.description}
                    </p>

                    {/* ✅ Navigate to study-abroad-plan with step */}
                    <button
                      onClick={() =>
                        navigate("/hicore-global-edconnect/study-abroad-plan", {
                          state: { step: item.pathStep },
                        })
                      }
                      className="w-full sm:w-[440px] bg-[#282655] mt-4 text-white text-[16px] font-medium leading-[28px] px-[24px] py-[8px] rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-[#403B93]"
                    >
                      {item.buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="w-full pt-4 pb-9 px-4 sm:px-12">
        <div className="w-full p-4 sm:p-9 rounded-lg border border-[#EBEAF2]">
          <div
            className="w-full h-auto sm:h-[388px] bg-cover bg-no-repeat bg-center rounded-[8px] flex flex-col sm:flex-row px-[24px] sm:px-[64px] py-[24px] sm:py-[36px] gap-[24px] sm:gap-[36px]"
            style={{ backgroundImage: `url(${footerImage})` }}
          >
            <div className="flex flex-col w-full sm:w-1/2 justify-center">
              <h2 className="text-[#1B1C57] text-[20px] font-semibold mb-[12px]">
                Take Your First Step Toward Studying Abroad
              </h2>
              <p className="text-[#1B1C57] text-[16px] leading-[28px] sm:leading-[48px] mb-[24px]">
                Join thousands of students planning their global education
                journey with expert tools, guidance, and community support.
              </p>
              <button
                onClick={() =>
                  navigate("/hicore-global-edconnect/study-abroad-plan", {
                    state: { step: 1 },
                  })
                }
                className="w-full sm:w-[260px] h-[40px] rounded-[8px] bg-[#1B1C57] text-white text-[14px] font-medium shadow-md hover:bg-[#403B93] cursor-pointer transition duration-200"
              >
                Launch My Journey
              </button>
            </div>
            <div className="flex flex-col w-full sm:w-1/2 h-full items-center justify-center gap-[36px]">
              <img
                src={cloudImage}
                alt="Cloud"
                className="w-full sm:w-[450px] sm:h-[370px] h-auto mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hicoreglobal;
