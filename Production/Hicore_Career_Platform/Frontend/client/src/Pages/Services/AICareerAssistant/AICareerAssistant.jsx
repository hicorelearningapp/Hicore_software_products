import React from "react";
import { Link, useNavigate } from "react-router-dom";
import aiHand from "../../../assets/AICareerPage/Hand.png";
import bgWave from "../../../assets/AICareerPage/Career-bg.jpg";
import heartIcon from "../../../assets/AICareerPage/Heart.png";
import thumbIcon from "../../../assets/AICareerPage/Thumbs.png";
import tickIcon from "../../../assets/AICareerPage/tick.png";
import arrowIcon from "../../../assets/AICareerPage/Arrow.png";
import bg from "../../../assets/AICareerPage/Downbg.jpg";
import hand from "../../../assets/AICareerPage/HandAI.png";

import { careerFeatures } from "./careerFeatures";

const AICareerAssistant = () => {
  const navigate = useNavigate();

  // ✅ Function to check login and navigate
  const handleNavigation = (path) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      // Redirect to login page
      navigate("/login", { state: { from: window.location.pathname } });
    } else {
      // Continue to target path
      navigate(path);
    }
  };

  return (
    <div className="w-full">
      {/* Banner Section */}
      <div
        className="w-full bg-no-repeat bg-cover bg-center border-b relative overflow-hidden"
        style={{
          backgroundImage: `url(${bgWave})`,
          borderBottom: "1px solid #C8ECF5",
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-16 py-12 md:py-24 max-w-[1440px] mx-auto relative z-10">
          <div className="md:w-1/2 text-center md:text-left z-10">
            <h2 className="text-[20px] md:text-[28px] lg:text-[25px] font-bold text-[#343079] mb-4 whitespace-nowrap">
              Not sure where to start? Let AI guide your next career move.
            </h2>
            <p className="text-lg text-[#343079] leading-[32px] mb-6">
              Take the guesswork out of career planning. Our smart AI Assistant
              analyzes your skills, interests, and goals – and gives you a
              personalized roadmap to land your dream role faster.
            </p>
            <button
              onClick={() => handleNavigation("/course")}
              className="bg-[#343079] text-white px-5 py-2 rounded-md shadow hover:bg-[#282655] transition"
            >
              Launch My Career Assistant
            </button>
          </div>
          <div className="hidden md:block absolute right-[-60px] bottom-0 z-0">
            <img
              src={aiHand}
              alt="AI Hand"
              className="max-h-[290px] object-contain pointer-events-none select-none"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 pt-16 pb-24">
        <div
          className="bg-white rounded-3xl shadow-sm p-6 md:p-12"
          style={{ border: "1px solid #EBEAF2" }}
        >
          <h2 className="text-center text-[20px] md:text-[26px] font-semibold text-[#343079] mb-12">
            Discover, Plan, and Launch Your Dream Career — with AI
          </h2>

          {careerFeatures.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center justify-between mb-16 ${
                feature.imgLeft ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="md:w-1/2">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="rounded-xl w-full max-w-[400px] object-cover mx-auto"
                />
              </div>
              <div className="md:w-1/2 text-center ml-12 mr-12 md:text-left">
                <h3 className="text-lg md:text-xl font-semibold text-[#343079] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#555] text-sm md:text-base leading-relaxed mb-4">
                  {feature.description}
                </p>
                <button
                  onClick={() => handleNavigation(feature.route)}
                  className="text-white w-full py-2 rounded shadow transition duration-300 bg-[#282655] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC]"
                >
                  {feature.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Box Section */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 mt-[-20px] flex flex-col md:flex-row gap-6">
        {/* Left Box */}
        <div
          className="flex-1 rounded-xl p-6 shadow-sm bg-white"
          style={{ border: "1px solid #EBEAF2" }}
        >
          <div className="mb-4">
            <img src={heartIcon} alt="heart" className="w-8 h-8 mb-2" />
            <h3 className="font-semibold text-[#343079] text-lg">
              Why Users Love It?
            </h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-[#343079]">
            {[
              "Saves time",
              "Personalized and accurate",
              "Aligned with global hiring trends",
              "Integrated with resume builder and job fit tools",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <img src={tickIcon} alt="tick" className="w-4 h-4 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Box */}
        <div
          className="flex-1 rounded-xl p-6 shadow-sm bg-white"
          style={{ border: "1px solid #EBEAF2" }}
        >
          <div className="mb-4">
            <img src={thumbIcon} alt="thumbs up" className="w-8 h-8 mb-2" />
            <h3 className="font-semibold text-[#343079] text-lg">
              Perfect For:
            </h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-[#343079]">
            {[
              "Students planning career paths",
              "Job seekers exploring role switches",
              "Professionals upskilling with purpose",
              "Mentors guiding career journeys",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <img src={arrowIcon} alt="tick" className="w-4 h-4 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="w-full px-6 md:px-16 pb-10 pt-10">
        <div
          className="rounded-2xl overflow-hidden relative text-white px-6 md:px-12 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="md:w-2/3 text-center md:text-left text-[#343079]">
            <h2 className="font-bold text-xl md:text-2xl mb-3">
              Empower your career journey with our AI-powered assistant
            </h2>
            <p className="text-sm md:text-base mb-6">
              – your personal career coach that helps you plan smarter, make
              informed decisions, and take confident steps toward your ideal job
              role.
            </p>
            <button
              onClick={() => handleNavigation("/course")}
              className="bg-[#343079] text-white px-6 py-2 rounded shadow hover:bg-[#282655] transition"
            >
              Launch My Career Assistant
            </button>
          </div>
          <div className="md:w-1/3 flex justify-center mt-0 md:-mt-6">
            <img
              src={hand}
              alt="AI Icon"
              className="w-[180px] md:w-[270px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICareerAssistant;
