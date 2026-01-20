import React from "react";
import { useNavigate } from "react-router-dom";

import leftGraphic from "../../../assets/Distributors/DistributorsHome/hero-left.png"; 
import rightGraphic from "../../../assets/Distributors/DistributorsHome/hero-right.png"; 

const ArrowSvg = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M10 8l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeroCustomer = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/customers-dashboard");
  };

  return (
    <header className="relative overflow-hidden py-20 bg-white">
      {/* Decorative left graphic */}
      <img
        src={leftGraphic}
        alt=""
        aria-hidden="true"
        className="pointer-events-none hidden md:block absolute left-6 top-1/4 w-40 opacity-20"
      />

      {/* Decorative right graphic */}
      <img
        src={rightGraphic}
        alt=""
        aria-hidden="true"
        className="pointer-events-none hidden md:block absolute right-6 -top-8 w-48 opacity-20 rotate-100"
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto mt-20 px-6">
        <div className="text-center">
          <h1 className="text-[#115D29] font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
Order Medicines in Minutes - From Nearby Pharmacies or Our App Store          </h1>

          <p className="max-w-3xl mx-auto text-[16px] md:text-[18px] text-gray-500 mb-8">
Upload your prescription or search manually. Get live availability, fast delivery, and trusted medicines — all in one app.          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleRegisterClick}
              className={`
                inline-flex items-center gap-4 
                bg-[#115D29] text-white font-semibold 
                rounded-xl px-8 py-4 
                border border-transparent
                transition-all duration-300 ease-out
                hover:bg-white hover:text-[#115D29] hover:border-[#115D29]
                hover:shadow-[0_12px_25px_3px_rgba(17,93,41,0.55)]
              `}
              aria-label="Get Started as a Distributor"
            >
              <span className="text-base md:text-lg">Order Now</span>

              <span className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300">
                <ArrowSvg className="w-6 h-6" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroCustomer;
