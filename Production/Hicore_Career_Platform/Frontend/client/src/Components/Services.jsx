import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bannerbg from "../assets/ServiceLandingpng/service_bannerbg.jpg";
import rightImg from "../assets/ServiceLandingpng/service_banner.png";
import routes from "../Routes/routesConfig";

const Services = () => {
  // ✅ Get the Services route from routesConfig
  const servicesRoute = routes.find((route) => route.label === "Services");
  const tabs = servicesRoute?.tabs || [];
  const servicesData = servicesRoute?.items || {};

  const navigate = useNavigate();

  // ✅ Get last active tab from localStorage or default to first tab
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeServiceTab") || tabs[0]
  );

  // ✅ When tab changes, save to localStorage
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("activeServiceTab", activeTab);
    }
  }, [activeTab]);

  return (
    <div className="w-full min-h-screen bg-white font-[Poppins] overflow-x-hidden">
      {/* ---------- Banner Section ---------- */}
      <div
        className="w-full h-auto sm:h-[367.31px] flex flex-col sm:flex-row bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerbg})` }}
      >
        {/* Left Banner Content */}
        <div className="w-full sm:w-1/2 h-full px-[24px] sm:px-[64px] pt-[24px] sm:pt-[36px] pb-[24px] sm:pb-[36px] flex flex-col gap-4 sm:gap-6 text-[#343079]">
          <h1 className="text-[28px] sm:text-[36px] font-normal leading-[36px] sm:leading-[84px]">
            Explore Our Services
          </h1>
          <div className="text-[20px] font-semibold leading-[32px] sm:leading-[48px]">
            Everything You Need to Succeed
          </div>
          <p className="text-[19px] font-normal leading-[28px] sm:leading-[36px] w-full ">
            Internships, job matching, mentoring, project support, AI tools, and
            more — discover what our platform can do for you.
          </p>
        </div>

        {/* Right Banner Image */}
        <div className="w-full sm:w-1/2 h-full flex items-center justify-center p-[24px] sm:p-[36px]">
          <img
            src={rightImg}
            alt="Services Visual"
            className="w-full sm:w-[550px]  h-auto sm:h-[295.31px] rounded-[8px] object-cover"
          />
        </div>
      </div>

      {/* ---------- Main Services Section ---------- */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center mb-10 mt-16 px-5">
        {/* Tabs */}
        <div className="w-full">
          <div className="grid grid-cols-4 rounded-t-xl overflow-hidden">
            {tabs.map((label) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center justify-center gap-2 py-3 text-[16px] font-medium transition-all duration-300 ${
                  activeTab === label
                    ? "bg-[#343079] text-white"
                    : "text-[#343079] hover:bg-[#e4e2f2]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Section */}
        <div className="w-full border border-[#C0BFD5] rounded-b-[8px] mt-0 p-[24px] sm:p-[64px] flex flex-col gap-[48px] sm:gap-[64px]">
          {/* Section Heading */}
          <h2 className="text-center text-[18px] sm:text-[20px] font-semibold leading-[32px] sm:leading-[48px] text-[#343079]">
            {servicesData[activeTab]?.heading}
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[24px] sm:gap-[64px] justify-items-center">
            {servicesData[activeTab]?.cards?.map((item, index) => (
              <div
                key={index}
                className="w-full sm:w-[352px] h-auto p-[16px] border border-[#C0BFD5] rounded-[8px] flex flex-col justify-between"
              >
                <div className="w-full flex flex-col gap-[16px]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[200px] sm:h-[213.12px] rounded-[8px] object-cover"
                  />
                  <div className="flex flex-col gap-[12px] text-[#343079]">
                    <div className="flex justify-between">
                      <h3>{item.add}</h3>
                      <h3>{item.new}</h3>
                    </div>
                    <h3 className="text-[16px] font-bold leading-[28px] sm:leading-[32px]">
                      {item.title}
                    </h3>
                    <p className="text-[16px] leading-[24px] mb-4 sm:leading-[28px]">
                      {item.description}
                    </p>
                  </div>
                </div>
                <button
                  className="w-full bg-[#282655]  cursor-pointer transition-all duration-300 hover:border-white hover:bg-gradient-to-r hover:from-[#403B93] hover:to-[#8682D3] text-white text-[14px] font-semibold py-2 rounded-[4px] mt-[16px]"
                  onClick={() => {
                    if (item.path) {
                      // ✅ Save tab before navigating away
                      localStorage.setItem("activeServiceTab", activeTab);
                      navigate(item.path);
                    }
                  }}
                >
                  {item.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
