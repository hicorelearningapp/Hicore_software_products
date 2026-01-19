import React from "react";
import { useNavigate } from "react-router-dom";

import interviewImg from "../../../assets/InterviewPreparation/interview.jpg";
import bannerBg from "../../../assets/InterviewPreparation/banner-bg.jpg";
import goalIcon from "../../../assets/InterviewPreparation/target.png";
import confidenceIcon from "../../../assets/InterviewPreparation/skill.png";
import expertIcon from "../../../assets/InterviewPreparation/secure.png";
import calendarIcon from "../../../assets/InterviewPreparation/calendar.png";
import img1 from "../../../assets/InterviewPreparation/img1.jpg";
import img2 from "../../../assets/InterviewPreparation/img2.png";
import img3 from "../../../assets/InterviewPreparation/img3.jpg";
import img4 from "../../../assets/InterviewPreparation/img4.jpg";
import finalBannerBg from "../../../assets/InterviewPreparation/final-banner-bg.jpg";
import jobIcon from "../../../assets/InterviewPreparation/job-icon.png";

const benefits = [
  {
    title: "Mock Interviews",
    desc: "Practice live or recorded mock interviews with instant feedback on your answers, communication, and confidence",
    img: img1,
  },
  {
    title: "Flash Card Activities",
    desc: "Revise key interview topics like DSA, OOPs, DBMS, OS, and Aptitude using bite-sized, swipeable flash cards.",
    img: img2,
  },
  {
    title: "Technical Quiz Challenges",
    desc: "Take quizzes designed by experts to simulate company screening rounds.",
    img: img3,
  },
  {
    title: "Real-Time Feedback & Hints",
    desc: "Receive hints, model answers, and AI-driven suggestions to improve your performance across every tool.",
    img: img4,
  },
];

const InterviewLanding = () => {
  const navigate = useNavigate();

  // ✅ Login check helper
  const checkLogin = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userEmail = localStorage.getItem("userEmail");

    if (!isLoggedIn || !userEmail) {
      alert("Please log in to access the interview preparation section.");
      navigate("/login", { state: { from: window.location.pathname } });
      return false;
    }
    return true;
  };

  // ✅ Handle navigation with login check
  const handleStartPreparation = () => {
    if (!checkLogin()) return;
    navigate("/practice-section");
  };

  return (
    <div className="flex flex-col items-center bg-white">
      {/* Banner Section */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "full",
          height: "364px",
          padding: "36px 64px",
          backgroundColor: "#eaf2fb",
        }}
      >
        <img
          src={bannerBg}
          alt="Background Design"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-100 z-0"
        />

        <div className="relative px-[16px] flex flex-col md:flex-row items-center justify-between w-full h-full">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d2c78] mb-4">
              Interview Preparation Zone
            </h2>

            <p className="text-[#343079] text-base md:text-lg mb-4 font-normal">
              Your Last Stop Before You Land the Job
            </p>

            <p className="text-[#343079] text-sm md:text-base mb-6 leading-relaxed font-normal">
              Get fully equipped for technical and HR interviews with interactive,
              hands-on preparation tools crafted by experts and hiring professionals.
            </p>

            <button
              onClick={handleStartPreparation}
              className="bg-[#1f1c5c] text-white px-60 py-2 rounded-md font-semibold hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC]"
            >
              Start Preparing Now
            </button>
          </div>

          <div className="md:w-1/2 flex justify-end">
            <img
              src={interviewImg}
              alt="Interview"
              className="rounded-[8px] w-[562px] h-[292px] object-cover opacity-100"
            />
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div
        className="mt-10 mx-auto border rounded-[8px] bg-white"
        style={{
          width: "1300px",
          height: "508px",
          padding: "36px",
          opacity: 1,
          border: "1px solid #EBEAF2",
        }}
      >
        <h2 className="text-[#343079] text-2xl font-bold text-center mb-9">
          Why Choose This Interview Preparation Program?
        </h2>

        <div className="flex justify-between gap-[36px]">
          {[goalIcon, confidenceIcon, expertIcon, calendarIcon].map(
            (icon, index) => {
              const titles = [
                "Tailored to Your Career Goals",
                "Confidence Boosting Practice",
                "Learn from the Best",
                "Flexible Scheduling",
              ];
              const descriptions = [
                "Whether you’re targeting tech, design, or business roles, our resources adapt to your job title, domain, and experience level.",
                "Reduce anxiety and build confidence with structured practice and expert tips for handling tough questions.",
                "All interviewers are working professionals or mentors from top companies, bringing insider knowledge to your preparation.",
                "Book mock interviews and attempt quizzes anytime — study at your pace, around your schedule.",
              ];
              const bgColor = ["#F3F3FB", "#FFFAEF", "#F0F7FF", "#E8FFDD"];

              return (
                <div
                  key={index}
                  className={`bg-[${bgColor[index]}] border rounded-[8px] transition-all duration-300 ease-linear hover:-translate-y-1 hover:shadow-[0_8px_16px_-4px_rgba(101,98,158,0.2)]`}
                  style={{
                    width: "297px",
                    height: "368px",
                    padding: "36px",
                    gap: "16px",
                    border: "1px solid #65629E",
                    backgroundColor: bgColor[index],
                  }}
                >
                  <img src={icon} alt="Icon" className="w-8 h-8 mb-4" />
                  <h3 className="text-[#343079] font-semibold mb-2">
                    {titles[index]}
                  </h3>
                  <p
                    className="text-[#343079]"
                    style={{
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "32px",
                    }}
                  >
                    {descriptions[index]}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="w-full flex justify-center px-[36px] mt-[72px]">
        <div className="w-[1296px] h-[1400px] border border-[#EBEAF2] rounded-[8px] p-[36px] flex flex-col gap-[36px] bg-white">
          <h2 className="text-[#343079] text-[28px] text-center font-semibold font-poppins leading-[56px] h-[56px] w-[1296px] ">
            Benefits of the Interview Preparation Zone
          </h2>

          <div className="flex flex-wrap gap-[36px] w-[1296px] h-[1300px]">
            {benefits.map((item, index) => (
              <div
                key={index}
                className="w-[590px] h-[600px] rounded-[8px] bg-[#FFFAEF] flex flex-col shadow-sm"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-[590px] h-[401px] object-cover rounded-t-[8px]"
                />
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

      {/* Final Banner Section */}
      <div className="w-full flex justify-center px-[27px] mt-[72px]">
        <div className="w-[1368px] h-auto p-[36px] bg-white border border-[#EBEAF2] rounded-[8px] shadow-md">
          <div
            className="w-full h-[288px] flex items-center justify-between px-[48px] rounded-[8px] bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${finalBannerBg})` }}
          >
            {/* Left Content */}
            <div className="flex flex-col gap-[16px] max-w-[520px] px-[50px]">
              <h2 className="text-[#343079] text-[24px] leading-[32px] font-semibold font-poppins">
                The Right Preparation = The Right Job
              </h2>
              <p className="text-[#343079] text-[16px] leading-[28px] font-medium font-poppins">
                Build confidence with quizzes, flashcards, and expert feedback.
              </p>
              <button
                onClick={handleStartPreparation}
                className="w-full px-[32px] h-[48px] rounded-[8px] bg-[#282655] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] text-white text-[14px] font-medium font-poppins"
              >
                Try It Now
              </button>
            </div>

            {/* Right Side Image */}
            <div className="w-1/2 flex justify-start items-center pl-[200px]">
              <img src={jobIcon} alt="Job Icon" className="w-[180px] h-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-[48px]"></div>
    </div>
  );
};

export default InterviewLanding;
