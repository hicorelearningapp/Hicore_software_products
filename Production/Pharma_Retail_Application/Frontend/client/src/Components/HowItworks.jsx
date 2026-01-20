import React from "react";
import leftImg from "../assets/Home/medicine.png";     
import rightImg from "../assets/Home/pill.png";   
import locationIcon from "../assets/Home/location.png"; 
import packageIcon from "../assets/Home/package.png"; 
import truckIcon from "../assets/Home/truck.png"; 
import uploadIcon from "../assets/Home/upload.png"; 
import circlearrowicon from "../assets/Home/circle-arrow.png"; 

const HowItworks = () => {
  const steps = [
    {
      id: 1,
      icon: locationIcon,
      title: "1. Find Nearest Availability",
      desc: "We locate the closest retailer or warehouse with your exact stock.",
    },
    {
      id: 2,
      icon: uploadIcon,
      title: "2. Upload or Search",
      desc: "Upload your prescription or search your medicine. Our AI reads and verifies instantly.",
    },
    {
      id: 3,
      icon: packageIcon,
      title: "3. Choose Delivery or Pickup",
      desc: "Get it today from a local store, or save with App Store delivery.",
    },
    {
      id: 4,
      icon: truckIcon,
      title: "4. Smart Fulfillment ",
      desc: "Retailer verifies, packs, delivers. Track in real time.",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center relative gap-[64px] mt-[128px]">

      {/* TITLE + IMAGES */}
      <div
        className="
          relative w-full flex justify-center items-center mb-4
          max-md:flex-col max-md:gap-4 max-md:text-center
        "
      >

        {/* Left Image */}
        <img
          src={leftImg}
          alt=""
          className="
            absolute left-0 top-1/2 mt-7 -translate-y-1/2 w-[310px] h-[180px] opacity-30
            max-md:static max-md:w-[150px] max-md:h-[90px] max-md:opacity-20
          "
        />

        {/* Title */}
        <div className="flex flex-col text-center px-4 gap-[8px]">
          <h2 className="text-[28px] font-bold text-[#115D29] max-md:text-[22px]">
            How It Works
          </h2>
          <p className="text-[#115D29] text-[16px] max-md:text-[14px] max-md:leading-[22px]">
            Simple steps to revolutionize your medicine access
          </p>
        </div>

        {/* Right Image */}
        <img
          src={rightImg}
          alt=""
          className="
            absolute right-0 top-1/2 mt-18 -translate-y-1/2 w-[311px] h-[266px] opacity-30
            max-md:static max-md:w-[160px] max-md:h-[130px] max-md:opacity-20
          "
        />
      </div>

      {/* CARDS GRID */}
      <div
        className="
          grid grid-cols-2 gap-8 w-full px-[128px] pb-2
          max-md:grid-cols-1 max-md:px-6 max-md:gap-6
        "
      >
        {steps.map((step) => (
          <div
            key={step.id}
            className="
              rounded-[16px] p-[36px] flex flex-col gap-[36px] border border-[#B5CDBD]
              bg-[#115D290D] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)_inset]
              max-md:p-6 max-md:gap-4 max-md:text-center max-md:items-center
            "
          >

            {/* ICON BOX */}
            <div
              className="
                flex items-center justify-center bg-[#115D29] w-[68px] h-[68px] rounded-[8px] p-4
                max-md:w-[58px] max-md:h-[58px]
              "
            >
              <img
                src={step.icon}
                alt="icon"
                className="w-[36px] h-[36px] max-md:w-[28px] max-md:h-[28px]"
              />
            </div>

            {/* TEXT CONTENT */}
            <div className="flex flex-col gap-2 max-md:items-center">
              <p className="font-semibold text-[#115D29] text-[20px] leading-[40px] max-md:text-[16px] max-md:leading-[26px]">
                {step.title}
              </p>
              <p className="text-[#115D29] text-[14px] leading-[28px] max-md:text-[13px] max-md:leading-[22px]">
                {step.desc}
              </p>
            </div>

          </div>
        ))}
      </div>

      {/* BUTTON */}
      <div>
        <button
          className="
            group flex flex-row h-[56px] gap-[12px] pt-[8px] pb-[8px] pr-[24px] pl-[24px]  
            bg-[#115D29] text-white hover:text-[#115D29] rounded-lg 
            items-center justify-center hover:bg-white hover:border 
            hover:border-[#30B130] hover:shadow-[10px_10px_10px_0px_#115920]
            transition-all duration-300
            max-md:h-[48px] max-md:gap-[8px] max-md:px-[16px]
          "
        >
          <label className="text-[20px] font-semibold max-md:text-[16px]">
            Experience the Future of Medical Supply
          </label>
          <img
            src={circlearrowicon}
            alt=""
            className="
              w-[24px] h-[24px] transition-all duration-300
              group-hover:[filter:invert(13%)_sepia(83%)_saturate(548%)_hue-rotate(83deg)_brightness(35%)_contrast(94%)]
              max-md:w-[20px] max-md:h-[20px]
            "
          />
        </button>
      </div>

    </div>
  );
};

export default HowItworks;
