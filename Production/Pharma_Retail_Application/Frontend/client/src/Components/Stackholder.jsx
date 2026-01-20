import React from "react";

import customerIcon from "../assets/Home/customericon.png"; 
import retailerIcon from "../assets/Home/retailericon.png"; 
import distributorIcon from "../assets/Home/distributoricon.png"; 
import tickIcon from "../assets/Home/circle-check.png"; 
import rightArrow from "../assets/Home/circle-arrow.png";

import leftImg from "../assets/Home/pharmacy.png";
import rightImg from "../assets/Home/distributortruck.png";

const Stackholder = () => {
  const cards = [
    {
      id: 1,
      title: "For Customers",
      explanation: "Get your medicines on time, every time.",
      color: "#D22E2E",
      btnBg: "#D22E2E",
      btnText: "Find my Medicine",
      icon: customerIcon,
      points: [
        "Upload prescriptions or search medicines easily",
        "View nearby pharmacies with real-time stock",
        "Choose delivery or store pickup",
        "Track your orders live",
      ],
    },
    {
      id: 2,
      title: "For Retailers",
      explanation: "Run your pharmacy the smart way.",
      color: "#2874BA",
      btnBg: "#2874BA",
      btnText: "Register my Pharmacy",
      icon: retailerIcon,
      points: [
        "Manage inventory, billing, expiry",
        "Receive B2C orders directly",
        "Auto-order from distributors",
        "Stay compliant with digital reports",
      ],
    },
    {
      id: 3,
      title: "For Distributors",
      explanation: "Grow your reach with live market insights.",
      color: "#AF840D",
      btnBg: "#AF840D",
      btnText: "Get Started",
      icon: distributorIcon,
      points: [
        "Get retailer orders in one place",
        "Sync inventory automatically",
        "Predict future demand by SKU",
        "Visual analytics dashboard",
      ],
    },
  ];

  return (
    <div className="w-full flex flex-col items-center relative gap-[64px] pt-[128px]">

      {/* TITLE + SIDE IMAGES */}
      <div
        className="
          relative w-full flex justify-center items-center mb-[48px]
          max-md:flex-col max-md:gap-4 max-md:text-center
        "
      >
        {/* Left Image */}
        <img
          src={leftImg}
          alt=""
          className="
            absolute left-0 top-1/2 -translate-y-1/2 w-[387px] h-[210px] mt-[50px] opacity-30
            max-md:static max-md:w-[180px] max-md:h-[100px] max-md:opacity-20
          "
        />

        {/* Center Title */}
        <div className="flex flex-col text-center gap-[8px] px-4">
          <h2 className="text-[32px] font-bold text-[#115D29] max-md:text-[24px]">
            For Every Stakeholder
          </h2>
          <p className="text-[#115D29] text-[16px] max-md:text-[14px] max-md:leading-[22px]">
            Tailored solutions for customers, retailers, and distributors
          </p>
        </div>

        {/* Right Image */}
        <img
          src={rightImg}
          alt=""
          className="
            absolute right-0 top-1/2 -translate-y-1/2 w-[208px] h-[200px] mt-[58px] mr-[35px] scale-x-[-1] opacity-20
            max-md:static max-md:w-[150px] max-md:h-[120px] max-md:opacity-20 max-md:mt-0 max-md:mr-0
          "
        />
      </div>

      {/* GRID FOR CARDS */}
      <div
        className="
          grid grid-cols-1 md:grid-cols-3 gap-8 w-full h-fix px-[128px]
          max-md:px-6 max-md:gap-6
        "
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="
              rounded-lg p-[32px] flex flex-col gap-[24px] h-fix border border-[#E9E7E7] bg-white
              max-md:p-[24px]
            "
          >
            {/* ICON */}
            <div className="flex items-center justify-center">
              <div
                className="w-[64px] h-[64px] rounded-[12px] flex items-center justify-center"
                style={{ backgroundColor: card.color }}
              >
                <img src={card.icon} className="w-[36px] h-[36px]" alt="" />
              </div>
            </div>

            {/* TITLE */}
            <h3
              className="font-bold text-[22px] text-center max-md:text-[18px]"
              style={{ color: card.color }}
            >
              {card.title}
            </h3>

            <p
              className="font-regular text-[14px] text-center max-md:text-[13px] max-md:leading-[20px]"
              style={{ color: card.color }}
            >
              "{card.explanation}"
            </p>

            {/* POINTS */}
            <div className="flex flex-col gap-2 max-md:gap-1">
              {card.points.map((p, i) => (
                <div key={i} className="flex flex-row gap-3 items-start max-md:items-center">
                  <img src={tickIcon} alt="" className="w-[20px] h-[20px]" />
                  <p
                    className="font-regular text-[14px] leading-[28px] max-md:text-[13px] max-md:leading-[20px]"
                    style={{ color: card.color }}
                  >
                    {p}
                  </p>
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <button
              className="
                group flex flex-row items-center h-[56px] justify-center gap-2 text-white rounded-lg py-[12px] mt-auto
                max-md:h-[48px] max-md:text-[14px] max-md:gap-1
              "
              style={{ backgroundColor: card.btnBg }}
            >
              <span className="font-semibold">{card.btnText}</span>

              <img
                src={rightArrow}
                className="w-[20px] h-[20px] max-md:w-[16px] max-md:h-[16px]"
                alt=""
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stackholder;
