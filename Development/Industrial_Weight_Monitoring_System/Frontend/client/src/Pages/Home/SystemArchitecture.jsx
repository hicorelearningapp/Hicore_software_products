import React from "react";
import smartscale from "../../assets/Home/smart-scale.png";
import iot from "../../assets/Home/iot.png";
import cloud from "../../assets/Home/cloud.png";
import aiengine from "../../assets/Home/ai-engine.png";
import webimg from "../../assets/Home/web_mobile.png";
import doublearrow from "../../assets/Home/doublearrow.png";

const systems = [
  { title: "Smart Scale", img: smartscale },
  { title: "IoT Gateway", img: iot },
  { title: "Cloud", img: cloud },
  { title: "AI Engine", img: aiengine },
  { title: "Web/Mobile App", img: webimg },
  { title: "Smart Scale", img: smartscale },
];

// ARROW — Desktop same, only rotate on mobile
const Arrow = () => (
  <div
    className="
      w-[48px] h-[32px]
      max-md:rotate-90
    "
    style={{
      maskImage: `url(${doublearrow})`,
      WebkitMaskImage: `url(${doublearrow})`,
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskSize: "contain",
      WebkitMaskSize: "contain",
      backgroundImage:
        "linear-gradient(180deg, #1769FF 7.69%, #E6EFFF 26.92%, #92B8FF 50%, #E6EFFF 66.83%, #7FACFF 85.58%, #1769FF 100%)",
      backgroundSize: "100% 300%",
      animation: "gradientEaseFlow 8s ease-in-out infinite",
    }}
  />
);

const SystemArchitecture = () => {
  return (
    <div className="flex flex-col py-[100px] px-[64px] gap-[24px] max-md:px-[24px] max-md:py-[60px]">
      
      {/* Animation */}
      <style>
        {`
          @keyframes gradientEaseFlow {
            0% { background-position: 0% 0%; }
            100% { background-position: 0% 300%; }
          }
        `}
      </style>

      {/* Heading */}
      <div className="flex flex-col gap-[8px] items-center justify-center">
        <h2
          className="text-[24px] font-semibold text-[#0A2A43] text-center leading-[36px] max-md:text-[20px]"
          style={{ letterSpacing: "0.01em" }}
        >
          SYSTEM ARCHITECTURE
        </h2>

        <p className="font-regular text-[16px] leading-[28px] text-[#8A939B] text-center max-w-[820px] max-md:text-[15px]">
          A unified architecture connecting IoT sensors, AI analytics, and
          enterprise systems to deliver a fully autonomous inventory experience.
        </p>
      </div>

      {/* Cards */}
      <div
        className="
          flex flex-row items-center justify-center gap-[12px] flex-nowrap whitespace-nowrap
          max-md:flex-col max-md:gap-[24px]
        "
      >
        {systems.map((item, index) => (
          <React.Fragment key={index}>
            
            {/* CARD */}
            <div
              className="
                flex flex-col rounded-[80px] gap-[16px]
                w-[130px] h-[290px] items-center justify-center px-[16px] py-[64px]
                border border-[#B7D1FF] bg-white rounded-full
                drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
                max-md:w-full max-md:h-auto max-md:py-[40px] max-md:rounded-[60px]
              "
            >
              {/* ICON */}
              <span
                className="
                  flex items-center justify-center
                  w-[96px] h-[96px]
                  bg-[#F3F4F5]
                  rounded-full
                  shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
                "
              >
                <img
                  src={item.img}
                  alt=""
                  className="w-[64px] h-[64px] object-contain"
                />
              </span>

              <p className="text-[#0A2A43] font-semibold text-[16px] text-center max-md:text-[15px] break-words whitespace-normal">
                {item.title}
              </p>
            </div>

            {/* ARROW */}
            {index !== systems.length - 1 && (
              <div className="flex justify-center">
                <Arrow />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SystemArchitecture;
