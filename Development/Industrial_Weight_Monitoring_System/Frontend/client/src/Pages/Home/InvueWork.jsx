import React from "react";
import weighticon from "../../assets/Home/weight.png";
import cloudicon from "../../assets/Home/store.png";
import aiicon from "../../assets/Home/artificial-intelligence.png";
import ordericon from "../../assets/Home/ordericon.png";

const stepsData = [
  {
    id: 1,
    titleBlue: "Sense →",
    title: "Smart Load Cells Measure Weight 24/7",
    description:
      "IoT-powered scales capture precise real-time stock levels for every SKU.",
    icon: weighticon,
  },
  {
    id: 2,
    titleBlue: "Connect →",
    title: "Data Sent Securely to the Cloud",
    description:
      "Edge devices transmit readings via MQTT/HTTPS to the InVue cloud.",
    icon: cloudicon,
  },
  {
    id: 3,
    titleBlue: "Analyze →",
    title: "AI Detects Trends, Anomalies & Reorder Needs",
    description:
      "Predictive and prescriptive algorithms forecast demand and highlight issues.",
    icon: aiicon,
  },
  {
    id: 4,
    titleBlue: "Automate →",
    title: "Alerts & Auto-Reordering via ERP Integration",
    description: "Generate purchase orders instantly.",
    icon: ordericon,
  },
];

const InvueWork = () => {
  return (
    <div id="howitworks" className="flex flex-col gap-[64px] px-[64px] py-[100px] max-md:px-[24px] max-md:py-[60px]">

      {/* Header */}
      <div className="flex flex-col gap-[8px] items-center justify-center text-center px-2">
        <h2 className="font-semibold text-[24px] tracking-[1%] text-[#0A2A43] max-md:text-[20px]">
          How Hicore InVue Works?
        </h2>
        <p className="text-[16px] leading-[28px] tracking-[1%] text-[#8A939B] max-md:text-[15px] max-md:leading-[24px]">
          Discover the four-layer system that monitors, predicts, and automates your stock operations.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-[24px] select-none">
        {stepsData.map((step) => (
          <div
            key={step.id}
            className="
              group relative bg-white hover:bg-[#E8F0FF]
              transition-all duration-300 p-[24px]
              rounded-[50px] border border-[#B7D1FF]
              flex items-start gap-[24px]
              hover:drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]

              /* ⭐ MOBILE FIX */
              max-md:flex-col max-md:items-center max-md:text-center 
              max-md:gap-[16px] max-md:p-[20px]
              max-md:rounded-[30px]
            "
          >
            {/* Left Icon */}
            <div className="
              w-[68px] h-[64px] rounded-full bg-[#E8F0FF]
              group-hover:bg-white transition-all duration-300
              shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
              flex items-center justify-center p-[8px]

              /* ⭐ MOBILE FIX */
              max-md:w-[60px] max-md:h-[60px]
            ">
              <img src={step.icon} alt={step.title} className="w-[32px] max-md:w-[28px]" />
            </div>

            {/* Text Column */}
            <div className="flex flex-col gap-[8px] max-md:items-center">
              <h3 className="text-[16px] text-[#0A2A43] max-md:text-[15px] max-md:leading-[22px]">
                <span className="text-[#1769FF] font-semibold">{step.titleBlue}</span>{" "}
                {step.title}
              </h3>
              <p className="text-[#1D1F22] text-[16px] leading-[24px] max-md:text-[14px] max-md:leading-[22px]">
                {step.description}
              </p>
            </div>

            {/* Step Badge - Desktop stays the same, Mobile moves below */}
            <div
              className="
                absolute right-[-20px] top-1/2 -translate-y-1/2 
                w-[112px] h-[112px] rounded-full 
                bg-[#E8EFF6] group-hover:bg-white 
                transition-all duration-300
                flex flex-col items-center justify-center

                /* ⭐ MOBILE FIX: move badge below card */
                max-md:static max-md:mt-[16px] max-md:right-0 max-md:top-auto 
                max-md:translate-y-0 max-md:w-[90px] max-md:h-[90px] max-md:self-center
              "
            >
              <span className="text-[#1D1F22] font-semibold text-[16px] max-md:text-[14px]">Step</span>
              <span className="text-[#1D1F22] text-[20px] font-semibold max-md:text-[18px]">
                {step.id}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default InvueWork;
