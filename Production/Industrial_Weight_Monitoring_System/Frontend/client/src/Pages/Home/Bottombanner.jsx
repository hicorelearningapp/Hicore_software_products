import React from "react";
import bannerImg from "../../assets/Home/bottom-banner.png";
import rightArrow from "../../assets/Home/right-arrow.png";
import whiterightArrow from "../../assets/Home/white-rightarrow.png";
import { useLocation, useNavigate } from "react-router-dom";

const Bottombanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleStartCounting = () => {
    const token = localStorage.getItem("token");

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
  return (
    <div
      className="
        w-full flex flex-row rounded-[80px] p-[100px]
        bg-[conic-gradient(from_45.75deg_at_0%_100%,rgba(234,239,250,0.1)_0deg,#C4D6F8_180deg,rgba(134,169,233,0.5)_270deg,rgba(234,239,250,0.1)_360deg)]

        /* ⭐ Mobile layout fix */
        max-md:flex-col max-md:p-[32px] max-md:rounded-[40px]
        max-md:items-center max-md:gap-[32px]
      "
    >
      {/* LEFT SIDE */}
      <div className="w-1/2 flex items-center justify-center max-md:w-full">
        <div className="flex flex-col gap-6 w-full items-center">
          
          {/* TEXT BLOCK */}
          <div className="flex flex-col gap-2 text-center">
            <h2
              className="
                font-semibold text-[24px] leading-[36px] tracking-[1%]
                text-[#0A2A43] max-md:text-[20px]
              "
            >
              Ready to Make Your Inventory Autonomous?
            </h2>

            <p
              className="
                font-normal text-[16px] leading-[28px] tracking-[1%]
                text-[#8A939B] max-md:text-[15px]
              "
            >
              Stop counting. Start automating
            </p>
          </div>

          {/* BUTTONS */}
          <div
            className="
              flex flex-row gap-[20px] text-[20px] font-semibold w-full
              max-md:flex-col max-md:gap-[16px] items-center justify-center
            "
          >
            {/* Primary Button */}
            <button onClick={handleStartCounting}
              className="
                group relative w-[298px] bg-[#1769FF] rounded-[80px] text-white 
                py-[16px] px-[36px] cursor-pointer flex items-center justify-center 
                border hover:border-[#B7D1FF]
                hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.25)] transition-all overflow-hidden
                max-md:w-full
              "
            >
              <div className="flex items-center justify-center">
                <span
                  className="transition-transform group-hover:-translate-x-[6px] group-hover:duration-300"
                  style={{ letterSpacing: "0.01em" }}
                >
                  Start Counting
                </span>

                <span
                  className="
                    flex items-center justify-center bg-white p-[4px] rounded-full 
                    ml-0 w-0 opacity-0 scale-75 overflow-hidden 
                    transition-all group-hover:ml-[12px] group-hover:w-auto 
                    group-hover:opacity-100 group-hover:scale-100 
                    group-hover:duration-300 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
                  "
                >
                  <img src={rightArrow} alt="arrow" className="w-[24px] h-[24px]" />
                </span>
              </div>
            </button>

            {/* Secondary Button */}
            <button onClick={handleHowItWorks}
              className="
                group relative w-[298px] border border-[#1769FF] rounded-[80px] text-[#1769FF]
                py-[16px] px-[36px] cursor-pointer flex items-center justify-center 
                transition-all overflow-hidden
                max-md:w-full
              "
            >
              <div className="flex items-center justify-center">
                <span
                  className="transition-transform group-hover:-translate-x-[6px] group-hover:duration-300"
                  style={{ letterSpacing: "0.01em" }}
                >
                  How It Works?
                </span>

                <span
                  className="
                    flex items-center justify-center bg-[#1769FF] p-[4px] rounded-full 
                    ml-0 w-0 opacity-0 scale-75 overflow-hidden 
                    transition-all group-hover:ml-[12px] group-hover:w-auto 
                    group-hover:opacity-100 group-hover:scale-100 
                    group-hover:duration-300 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
                  "
                >
                  <img src={whiterightArrow} alt="icon" className="w-[24px] h-[24px]" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="w-1/2 flex items-center justify-center max-md:w-full">
        <img
          src={bannerImg}
          className="
            w-[437px] h-[344px] object-contain scale-x-[-1]
            max-md:w-full max-md:h-auto max-md:scale-x-100
          "
          alt="banner"
        />
      </div>
    </div>
  );
};

export default Bottombanner;
