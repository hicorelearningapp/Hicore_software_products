import React from "react";
import tickicon from '../../../assets/Semiconductor/Tick.png';
import step1 from '../../../assets/Semiconductor/Step1.png';
import step2 from '../../../assets/Semiconductor/Step2.png';
import step3 from '../../../assets/Semiconductor/Step3.png';
import step4 from '../../../assets/Semiconductor/Step4.png';
import step5 from '../../../assets/Semiconductor/Step5.png';
import step6 from '../../../assets/Semiconductor/Step6.png';

// --- Data Constants ---
const HOW_IT_WORKS_DATA = [
  {
    step: "Step 1: Equipment Communication",
    pointsTitle: "Connects to equipment using:",
    points: [
      "SECS-II (SEMI E5)",
      "HSMS-SS / HSMS-GS (SEMI E37)",
      "GEM (SEMI E30)",
    ],
    icon: step1
  },
  {
    step: "Step 2: Equipment Data Modeling",
    pointsTitle: "Builds a real-time equipment model using:",
    points: [
      "SVIDs – status & process variables",
      "ECIDs – configurable constants",
      "CEIDs – event identification",
      "Alarms – fault and warning states",
      "Recipes – process definitions",
    ],
    icon: step2
  },
  {
    step: "Step 3: Real-Time Monitoring",
    pointsTitle: "Enables:",
    points: [
      "Equipment state tracking",
      "SVID trend visualization",
      "Alarm and event monitoring",
      "Communication health indicators",
    ],
    icon: step3
  },
  {
    step: "Step 4: Remote Command Execution",
    pointsTitle: "Supports:",
    points: [
      "GEM-compliant remote commands",
      "Start / stop / pause operations",
      "Recipe load and parameter control",
      "Permission-based execution",
    ],
    icon: step4
  },
  {
    step: "Step 5: Automation & Control Logic",
    pointsTitle: "Using:",
    points: [
      "Script Engine",
      "SML Editor",
      "Visual Script Builder",
      "Event, alarm & threshold-based automation",
    ],
    icon: step5
  },
  {
    step: "Step 6: Host & Factory Integration",
    pointsTitle: "Integrates with:",
    points: [
      "MES",
      "SPC / APC",
      "RMS",
      "Databases, cloud & REST APIs",
    ],
    icon: step6
  },
];

const Howitworks = () => {
  return (
    <div id="howitworks" className='flex flex-col gap-[32px] md:gap-[64px] p-[24px] md:p-[64px]'>
      
      {/* ---------- Title ---------- */}
      <div className="flex flex-col gap-[6px] items-center justify-center">
        <h2 className="font-bold text-[18px] md:text-[20px] leading-[32px] md:leading-[48px] text-[#053C61] text-center">
          HOW IT WORKS
        </h2>
        <svg
          viewBox="0 0 300 8"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[60px] md:w-[10%] h-[8px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0 4 C70 0, 230 0, 300 4 C230 8, 70 8, 0 4 Z"
            fill="#053C61"
          />
        </svg>
      </div>

      {/* ---------- Cards Grid ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[36px]">
        {HOW_IT_WORKS_DATA.map((card, index) => (
          <div
            key={index}
            className="flex flex-col border border-[#B2C3CE] rounded-[4px] bg-white overflow-hidden"
          >
            {/* ----- Card Header ----- */}
            <div className="flex items-center bg-[#FAFAFA] justify-between p-[16px] border-b border-[#B2C3CE]">
              <span className="font-semibold text-[15px] md:text-[16px] leading-[24px] md:leading-[32px] text-[#053C61]"
              style={{ fontFamily: "Arial, sans-serif" }}>
                {card.step}
              </span>
              <img
                src={card.icon}
                alt="step icon"
                className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] object-contain"
              />
            </div>

            {/* ----- Card Body ----- */}
            <div className="flex flex-col p-[16px] md:p-[20px] gap-[12px] md:gap-[16px] flex-grow">
              <span className="font-medium text-[14px] md:text-[16px] leading-[24px] md:leading-[32px] text-[#053C61]"
              style={{ fontFamily: "Arial, sans-serif" }}>
                {card.pointsTitle}
              </span>

              <div className="flex flex-col gap-[8px] md:gap-[4px]">
                {card.points.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-[12px] md:gap-[16px]"
                  >
                    <img
                      src={tickicon}
                      alt="tick"
                      className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] mt-[4px] md:mt-[4px]"
                    />
                    <span
                      className="font-normal text-[14px] md:text-[16px] leading-[24px] md:leading-[32px] tracking-[1%] text-[#053C61]"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Howitworks;