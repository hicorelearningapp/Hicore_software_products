import React from "react";
import bannerBg from "../assets/Home/bottom-banner.jpg";
import rightIcon from "../assets/Home/circle-arrow.png";
import rightbannerimg from "../assets/Home/bottom-bannerimg.png";

const Bottombanner = () => {
  return (
    <div className="px-[128px] pt-[128px] pb-[128px] max-md:px-6 max-md:pt-[64px] max-md:pb-[64px]">

      <div
        className="
          flex flex-row w-full bg-cover bg-center p-[36px] rounded-lg
          max-md:flex-col max-md:p-[20px]
        "
        style={{ backgroundImage: `url(${bannerBg})` }}
      >

        {/* LEFT CONTENT */}
        <div
          className="
            w-[65%] px-[128px] flex flex-col items-center justify-center
            max-md:w-full max-md:px-4 max-md:text-center
          "
        >
          <h2 className="font-semibold text-[20px] leading-[40px] text-[#115D29] max-md:text-[18px] max-md:leading-[28px]">
            Join the Future of Connected Healthcare.
          </h2>

          <p className="mt-[8px] text-[14px] leading-[28px] text-center text-[#115D29] max-md:leading-[22px]">
            From customers to retailers and distributors. Manage, track, and
            deliver medicines seamlessly on one smart platform.
          </p>

          {/* BUTTON */}
          <button
            className="
              group mt-[24px] flex flex-row items-center gap-[12px]
              bg-[#115D29] hover:bg-white text-white rounded-[8px]
              py-[8px] px-[24px] hover:border hover:border-[#30B130]
              hover:shadow-[10px_10px_10px_0px_#115920] hover:text-[#115D29]
              transition-all duration-300
              max-md:mt-[16px] max-md:px-[20px]
            "
          >
            <span className="font-semibold text-[20px] leading-[40px] max-md:text-[16px]">
              Get Started for Free
            </span>

            <img
              src={rightIcon}
              alt="arrow"
              className="
                w-[24px] h-[24px] transition-all duration-300
                group-hover:[filter:invert(13%)_sepia(83%)_saturate(548%)_hue-rotate(83deg)_brightness(35%)_contrast(94%)]
                max-md:w-[20px] max-md:h-[20px]
              "
            />
          </button>
        </div>

        {/* RIGHT IMAGE — EXACT SAME LOOK ON MOBILE */}
        <div
          className="
            w-[35%] items-center justify-center flex
            max-md:w-full max-md:flex max-md:justify-center max-md:mt-[24px]
          "
        >
          <img
            src={rightbannerimg}
            alt=""
            className="
              w-[361px] h-[219px] object-cover
              max-md:w-[361px] max-md:h-[219px]   /* SAME AS DESKTOP */
            "
          />
        </div>
      </div>
    </div>
  );
};

export default Bottombanner;
