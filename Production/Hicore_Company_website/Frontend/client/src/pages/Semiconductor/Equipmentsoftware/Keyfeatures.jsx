import React from "react";

// Example icons (replace with your actual icons)
import equipmentIcon from '../../../assets/Semiconductor/equipment.png';
import messageIcon from '../../../assets/Semiconductor/message.png';
import svidIcon from '../../../assets/Semiconductor/svid.png';
import remoteIcon from '../../../assets/Semiconductor/remote.png';
import alarmIcon from '../../../assets/Semiconductor/alarm.png';
import eventIcon from '../../../assets/Semiconductor/event.png';
import ecidIcon from '../../../assets/Semiconductor/ecid.png';
import recipeIcon from '../../../assets/Semiconductor/recipe.png';
import smlIcon from '../../../assets/Semiconductor/sml.png';
import scriptIcon from '../../../assets/Semiconductor/script.png';

const features = [
  {
    icon: equipmentIcon,
    title: "Equipment Dashboard",
    desc:
      "Real-time equipment state monitoring with communication status, link state, and system health indicators.",
  },
  {
    icon: messageIcon,
    title: "Message Monitoring",
    desc:
      "Live SECS message trace (Tx/Rx) with validation, logging, and debugging support for commissioning.",
  },
  {
    icon: svidIcon,
    title: "SVID Monitoring & Trending",
    desc:
      "Real-time and historical SVID data visualization with threshold-based condition detection.",
  },
  {
    icon: remoteIcon,
    title: "Remote Command Execution",
    desc:
      "Standard GEM remote commands with permission-controlled execution and full audit trail.",
  },
  {
    icon: alarmIcon,
    title: "Alarm Management",
    desc:
      "Alarm detection, classification, and acknowledgement with linked parameter snapshots.",
  },
  {
    icon: eventIcon,
    title: "Event & Report Handling",
    desc:
      "CEID-based event monitoring with automatic RPTID data capture and SEMI-compliant reporting.",
  },
  {
    icon: ecidIcon,
    title: "ECID Constants Management",
    desc:
      "View, edit, and validate equipment constants with change control and dependency checks.",
  },
  {
    icon: recipeIcon,
    title: "Recipe Management",
    desc:
      "Recipe upload, download, and execution with version control and validated deployment.",
  },
  {
    icon: smlIcon,
    title: "SML Editor",
    desc:
      "SECS Message Language editor with syntax validation, execution, and response inspection.",
  },
  {
    icon: scriptIcon,
    title: "Script Engine",
    desc:
      "Event-driven and scheduled execution with conditional logic based on SVIDs and alarms.",
  },
];

const Keyfeatures = () => {
  return (
    <div id="key-features" className="flex flex-col gap-[32px] md:gap-[64px] p-[24px] md:p-[64px]">
      
      {/* Header */}
      <div className="flex flex-col gap-[6px] items-center justify-center">
        <h2 className="font-bold text-[18px] md:text-[20px] leading-[32px] md:leading-[48px] text-[#053C61] text-center">
          KEY FEATURES
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[36px]">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-[16px] p-[16px] border border-[#B2C3CE] bg-white hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.25)] rounded-[4px] bg-white"
          >
            {/* Icon */}
            <img
              src={item.icon}
              alt={item.title}
              className="w-[36px] h-[36px]"
            />

            {/* Title */}
            <h3 className="font-bold text-[16px] leading-[32px] tracking-[1%] text-[#053C61]" style={{ fontFamily: "Arial, sans-serif" }}>
              {item.title}
            </h3>

            {/* Description */}
            <p className="font-normal text-[16px] leading-[32px] tracking-[1%] text-[#053C61]" style={{ fontFamily: "Arial, sans-serif" }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyfeatures;
