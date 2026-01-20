import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import rightArrow from "../../assets/Home/right-arrow.png";
import whiterightArrow from "../../assets/Home/white-rightarrow.png";
import slide1 from "../../assets/Home/heroslideone.png";
import slide2 from "../../assets/Home/heroslidetwo.png";
import slide3 from "../../assets/Home/heroslidethree.png";
import slide4 from "../../assets/Home/heroslidefour.jpg";
import slide5 from "../../assets/Home/heroslidefive.jpg";

const slides = [slide1, slide2, slide3, slide4, slide5];

const InventoryCount = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const nextSlide = () => {
    if (index < slides.length - 1) setIndex(index + 1);
  };

  const handleStartCounting = () => {
    const token = localStorage.getItem("token"); // or user data

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

   const handleHowItWorks = () => {
    if (location.pathname !== "/") {
      navigate("/#howitworks");
    }

    setTimeout(() => {
      const section = document.getElementById("howitworks");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  const isFirst = index === 0;
  const isLast = index === slides.length - 1;

  return (
    <div
      className="
        flex flex-row py-[100px] px-[64px]
        max-md:flex-col max-md:py-[60px] max-md:px-[24px] max-md:gap-[40px]
      "
    >
      {/* LEFT COLUMN */}
      <div
        className="
          w-[50%] h-[439px] flex flex-col gap-[36px] justify-center
          max-md:w-full max-md:h-auto
        "
      >
        <div className="flex flex-col gap-[16px]">
          <h2
            className="font-semibold text-[42px] leading-[54px] text-black max-md:text-[32px] max-md:leading-[42px]"
            style={{ letterSpacing: "0.01em" }}
          >
            Inventory That <span className="text-[#1769FF]">Counts Itself</span>
          </h2>

          <p
            className="text-[20px] text-[#8A939B] font-semibold leading-[32px] max-md:text-[18px] max-md:leading-[28px]"
            style={{ letterSpacing: "0.01em" }}
          >
            Fully Autonomous. Real-Time. AI-Powered.
          </p>
        </div>

        <p
          className="
            font-regular text-[16px] leading-[28px] text-[#1D1F22]
            max-md:text-[15px] max-md:leading-[26px]
          "
          style={{ letterSpacing: "0.01em" }}
        >
          <span className="font-semibold">HiCore InVue </span>
          combines Smart IoT Scales, Cloud Intelligence, and AI Analytics to
          automate inventory tracking, prevent stockouts, and streamline
          procurement – across every warehouse, store, and branch.
        </p>

        {/* BUTTONS */}
        <div
          className="
            w-full flex flex-row gap-[20px] text-[20px] font-semibold
            max-md:flex-col max-md:gap-[12px]
          "
        >
          {/* Primary Button */}
          <button onClick={handleStartCounting}
            className="
              group relative w-[50%] bg-[#1769FF] rounded-[80px] text-white 
              py-[16px] px-[36px] cursor-pointer flex items-center justify-center
              border hover:border-[#B7D1FF] hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.25)]
              transition-all duration-0 overflow-hidden
              max-md:w-full
            "
          >
            <div className="flex items-center justify-center">
              <span
                className="transition-transform duration-0 group-hover:-translate-x-[6px] group-hover:duration-300"
                style={{ letterSpacing: "0.01em" }}
              >
                Start Counting
              </span>

              <span
                className="
                  flex items-center justify-center bg-white p-[4px] rounded-full 
                  ml-0 w-0 opacity-0 scale-75 overflow-hidden 
                  transition-all duration-0
                  group-hover:ml-[12px] group-hover:w-auto group-hover:opacity-100 
                  group-hover:scale-100 group-hover:duration-300 
                  group-hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
                "
              >
                <img src={rightArrow} alt="arrow" className="w-[24px] h-[24px]" />
              </span>
            </div>
          </button>

          {/* Secondary Button */}
          <button  onClick={handleHowItWorks}
            className="
              group relative w-[50%] border border-[#1769FF] rounded-[80px] text-[#1769FF] 
              py-[16px] px-[36px] cursor-pointer flex items-center justify-center 
              transition-all duration-0 overflow-hidden
              max-md:w-full
            "
          >
            <div className="flex items-center justify-center">
              <span
                className="transition-transform duration-0 group-hover:-translate-x-[6px] group-hover:duration-300"
                style={{ letterSpacing: "0.01em" }}
              >
                How It Works?
              </span>

              <span
                className="
                  flex items-center justify-center bg-[#1769FF] p-[4px] rounded-full 
                  ml-0 w-0 opacity-0 scale-75 overflow-hidden 
                  transition-all duration-0
                  group-hover:ml-[12px] group-hover:w-auto group-hover:opacity-100 
                  group-hover:scale-100 group-hover:duration-300 
                  group-hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
                "
              >
                <img src={whiterightArrow} alt="icon" className="w-[24px] h-[24px]" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN (SLIDER) */}
      <div
        className="
          w-[50%] flex items-center justify-center relative
          max-md:w-full max-md:flex-col max-md:gap-[20px]
        "
      >
        {/* IMAGE */}
        <img
          src={slides[index]}
          alt=""
          className="
            w-[440px] h-[439px] rounded-[80px] border border-[#8A939B]
            transition-all duration-300
            max-md:w-full max-md:h-[200px] max-md:rounded-[40px]
          "
        />

        {/* MOBILE ARROWS BELOW IMAGE */}
        <div
          className="
            hidden max-md:flex flex-row gap-[20px] mt-[16px]
          "
        >
          {/* Previous */}
          <span
            onClick={!isFirst ? prevSlide : undefined}
            className={`
              flex items-center justify-center p-[12px] rounded-full
              ${isFirst ? "bg-gray-200 cursor-not-allowed" : "bg-white cursor-pointer"}
              shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
            `}
          >
            <img src={rightArrow} className="w-[24px] h-[24px] rotate-[-90deg]" />
          </span>

          {/* Next */}
          <span
            onClick={!isLast ? nextSlide : undefined}
            className={`
              flex items-center justify-center p-[12px] rounded-full
              ${isLast ? "bg-gray-200 cursor-not-allowed" : "bg-white cursor-pointer"}
              shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
            `}
          >
            <img src={rightArrow} className="w-[24px] h-[24px] rotate-[90deg]" />
          </span>
        </div>

        {/* DESKTOP ARROWS (unchanged, exact same) */}
        <div
          className="
            absolute mr-[-440px] top-1/2 -translate-y-1/2
            flex flex-col gap-[24px] p-[8px]
            rounded-[80px] border border-[#B7D1FF] bg-[#E8F0FF]
            max-md:hidden
          "
        >
          {/* PREVIOUS */}
          <span
            onClick={!isFirst ? prevSlide : undefined}
            className={`flex items-center justify-center p-[4px] rounded-full
              ${isFirst ? "bg-gray-200 cursor-not-allowed" : "bg-white cursor-pointer"}
              shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]`}
          >
            <img src={rightArrow} className="w-[24px] h-[24px] rotate-[-90deg]" />
          </span>

          {/* NEXT */}
          <span
            onClick={!isLast ? nextSlide : undefined}
            className={`flex items-center justify-center p-[4px] rounded-full
              ${isLast ? "bg-gray-200 cursor-not-allowed" : "bg-white cursor-pointer"}
              shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]`}
          >
            <img src={rightArrow} className="w-[24px] h-[24px] rotate-[90deg]" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default InventoryCount;
