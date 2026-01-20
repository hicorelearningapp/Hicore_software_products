import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const mainMenu = [
    { name: "Home", id: "hero" },
    { name: "Why Us?", id: "whyus" },
    { name: "Features", id: "features" },
    { name: "Industries", id: "industries" },
    { name: "How It Works?", id: "howitworks" },
  ];

  const legalMenu = [
    { name: "Terms & Conditions" },
    { name: "Privacy Policy"},
    { name: "Download Application", id: "downloadapp" },
  ];

  const footerText = "© 2025 Hicore InVue. All Rights Reserved";

  const handleNavClick = (item) => {
    if (item.id) {
      const el = document.getElementById(item.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/", { state: { scrollTo: item.id } });
      }
    } else if (item.path) {
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className="
        flex flex-col p-[100px] gap-[64px] opacity-100 
        rounded-tl-[80px] rounded-tr-[80px] bg-[#F4F6F8] select-none
        max-md:p-[40px] max-md:gap-[40px]
      "
    >
      {/* MAIN ROW */}
      <div
        className="
          flex flex-row gap-[64px] items-center justify-center
          max-md:flex-col max-md:gap-[32px] max-md:items-center
        "
      >
        {/* LEFT INFO BOX */}
        <div
          className="
            flex flex-col w-[70%] rounded-[80px] border border-[#B7D1FF] 
            p-[36px] gap-[16px] bg-white 
            shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] items-center justify-center
            text-center
            max-md:w-full max-md:rounded-[40px] max-md:p-[24px]
          "
        >
          <h2
            className="font-semibold text-[20px] leading-[32px] text-[#0A2A43]"
            style={{ letterSpacing: "0.01em" }}
          >
            <span className="text-[#1769FF]">Hicore InVue</span> – Real Time,
            Reliable, Autonomous Inventory Management.
          </h2>

          <p className="text-[#8A939B] text-[16px] leading-[28px] tracking-[1%] max-md:text-[14px]">
            Powering smarter decisions with IoT intelligence and AI-driven
            automation.
          </p>
        </div>

        {/* RIGHT MENU SECTION */}
        <div className="flex flex-row w-[30%] gap-[64px] items-start justify-center text-center
          max-md:w-full max-md:flex-col max-md:gap-[24px] max-md:items-center max-md:justify-center"
        >
          {/* MAIN MENU */}
          <div className="flex flex-col gap-[8px] items-center max-md:items-center">
            {mainMenu.map((item, index) => (
              <p
                key={index}
                onClick={() => handleNavClick(item)}
                className="
                  text-[#1D1F22] text-[14px] leading-[26px] tracking-[1%] font-normal
                  hover:underline decoration-[#1769FF] hover:text-[#1769FF] cursor-pointer
                  max-md:text-[14px]
                "
              >
                {item.name}
              </p>
            ))}
          </div>

          {/* LEGAL MENU */}
          <div className="flex flex-col gap-[8px] items-center justify-center max-md:items-center">
            {legalMenu.map((item, index) => (
              <p
                key={index}
                onClick={() => handleNavClick(item)}
                className="
                  text-[#1D1F22] text-[14px] leading-[26px] tracking-[1%] font-normal
                  hover:underline decoration-[#1769FF] hover:text-[#1769FF] cursor-pointer
                  max-md:text-[14px]
                "
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="flex justify-center items-center text-center">
        <p className="text-[#8A939B] text-[14px] leading-[26px] tracking-[1%] font-normal max-md:text-[12px]">
          {footerText}
        </p>
      </div>
    </div>
  );
};

export default Footer;