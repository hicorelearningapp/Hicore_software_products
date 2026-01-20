import React from "react";

import aiimg from "../assets/Home/ai.png"; 
import ocrIcon from "../assets/Home/ocr.png";
import demandIcon from "../assets/Home/demand.png";
import medicinesIcon from "../assets/Home/medicines.png";
import fraudIcon from "../assets/Home/fraud.png";
import packIcon from "../assets/Home/package_delivery.png";
import aiIcon from "../assets/Home/aiicon.png";
import verifyIcon from "../assets/Home/bill.png";
import packageaddIcon from "../assets/Home/add_package.png";

const AIFeatures = () => {
  const cards = [
    { id: 1, title: "OCR Prescription Reader", desc: "Extracts medicine names automatically from your prescriptions", icon: ocrIcon },
    { id: 2, title: "Demand Forecasting", desc: "Visual insights on sales by region for distributors.", icon: demandIcon },
    { id: 3, title: "Smart Substitutes", desc: "Suggests safe, affordable alternatives when needed.", icon: medicinesIcon },
    { id: 4, title: "Fraud & Compliance Detection", desc: "Verifies prescriptions and flags duplicates automatically.", icon: fraudIcon },
    { id: 5, title: "Auto Reorder (Retailers)", desc: "Predicts what to restock next week based on trends.", icon: packIcon },
    { id: 6, title: "AI-Driven Insights", desc: "Real-time analytics and predictive intelligence for all users.", icon: aiIcon },
    { id: 7, title: "Scan billing", desc: "AI reads and generates bills in seconds by Instantly scanning invoices.", icon: verifyIcon },
    { id: 8, title: "Update inventory", desc: "Inventory updates automatically after every sale or restock.", icon: packageaddIcon },
  ];

  return (
    <div className="relative w-full">

      {/* LEFT IMAGE */}
      <img
        src={aiimg}
        alt=""
        className="
          absolute mr-[14px] h-[267px] w-[230px] object-cover opacity-15 mt-2
          max-md:static max-md:mx-auto max-md:w-[150px] max-md:h-[120px] max-md:opacity-20
        "
      />

      {/* MAIN CONTENT */}
      <div className="w-full flex flex-col items-center gap-[64px] relative z-10">

        {/* TOP SECTION */}
        <div className="flex flex-col text-center gap-[8px] px-4 mt-[128px] max-md:mt-[64px]">
          <h2 className="text-[32px] font-bold text-[#115D29] max-md:text-[24px]">
            AI-Powered Features
          </h2>
          <p className="text-[#115D29] text-[16px] max-md:text-[14px] max-md:leading-[22px]">
            Intelligent technology driving smarter healthcare
          </p>
        </div>

        {/* CARDS GRID */}
        <div
          className="
            grid grid-cols-1 md:grid-cols-2 gap-[36px] w-full px-[128px] pb-[64px]
            max-md:px-6 max-md:gap-6 max-md:pb-10
          "
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="
                group flex flex-row gap-[16px] border border-[#115D29] rounded-[8px]
                p-[20px] bg-white hover:bg-[#115D29] transition-all duration-300
                max-md:p-[16px] max-md:gap-4
              "
            >
              {/* ICON */}
              <div
                className="
                  w-[76px] h-[76px] rounded-[8px] p-[16px] bg-[#115D29]
                  group-hover:bg-white transition-all duration-300 flex items-center justify-center
                  max-md:w-[60px] max-md:h-[60px] max-md:p-[12px]
                "
              >
                <img
                  src={card.icon}
                  className="
                    w-[36px] h-[36px] transition-all duration-300
                    group-hover:brightness-0 group-hover:sepia group-hover:hue-rotate-[90deg]
                    max-md:w-[28px] max-md:h-[28px]
                  "
                  alt=""
                />
              </div>

              {/* TEXT */}
              <div className="flex flex-col gap-[8px] max-md:gap-[4px]">
                <h3 className="
                  text-[20px] font-semibold leading-[40px] text-[#115D29]
                  group-hover:text-white transition-all duration-300
                  max-md:text-[16px] max-md:leading-[24px]
                ">
                  {card.title}
                </h3>
                <p className="
                  text-[14px] leading-[28px] text-[#115D29]
                  group-hover:text-white transition-all duration-300
                  max-md:text-[13px] max-md:leading-[20px]
                ">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AIFeatures;
