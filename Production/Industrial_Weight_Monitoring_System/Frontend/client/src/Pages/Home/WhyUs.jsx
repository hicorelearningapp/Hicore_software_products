import React from "react";
import weighticon from "../../assets/Home/weight.png";
import nohandicon from "../../assets/Home/no-hand.png";
import aiicon from "../../assets/Home/artificial-intelligence.png";
import storeicon from "../../assets/Home/store.png";

const cardData = [
  {
    title: "Autonomous Monitoring",
    desc: "Real-time weight sensing from IoT-enabled scales.",
    icon: weighticon,
  },
  {
    title: "Zero Manual Counting",
    desc: "Live stock levels updated automatically - no scanning, no spreadsheets.",
    icon: nohandicon,
  },
  {
    title: "AI-Powered Replenishment",
    desc: "Predict usage, prevent stockouts, and automate purchase orders.",
    icon: aiicon,
  },
  {
    title: "Works Anywhere",
    desc: "Supports multi-site warehouses, factories, shops, and mobile inventory.",
    icon: storeicon,
  },
];

const WhyUs = () => {
  return (
    <div id="whyus"
      className="
        flex flex-col gap-[64px] px-[64px] py-[100px] items-center justify-center
        max-md:px-[24px] max-md:py-[60px] max-md:gap-[40px]
      "
    >
      {/* Header */}
      <div className="flex flex-col gap-[8px] items-center justify-center text-center px-4">
        <h2 className="text-[#0A2A43] font-semibold text-[24px] max-md:text-[20px]">
          WHY US?
        </h2>
        <p className="font-regular text-[#8A939B] text-[16px] max-md:text-[15px] leading-[26px]">
          The smarter, faster way to manage your inventory with unmatched accuracy and real-time insights.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="
              flex items-center gap-[24px] bg-[#E8F0FF] p-[24px] rounded-[80px]
              shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
              max-md:flex-col max-md:items-center max-md:text-center max-md:gap-[16px]
              max-md:p-[20px] max-md:rounded-[40px]
            "
          >
            {/* Circle with Icon */}
            <div
              className="
                bg-white p-[16px] w-[92px] h-[92px] rounded-full 
                shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
                flex items-center justify-center
                max-md:w-[72px] max-md:h-[72px] max-md:p-[12px]
              "
            >
              <img
                src={card.icon}
                alt={card.title}
                className="w-[48px] h-[48px] max-md:w-[36px] max-md:h-[36px]"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-[8px] max-md:items-center">
              <h3
                className="
                  text-[#1D1F22] font-semibold text-[16px] leading-[28px]
                  max-md:text-[15px] max-md:leading-[24px]
                "
              >
                {card.title}
              </h3>
              <p
                className="
                  text-[#4A4C50] text-[16px] leading-[28px]
                  max-md:text-[14px] max-md:leading-[22px]
                "
              >
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyUs;
