import React from 'react';
import topimg from "../assets/Home/topimg.png";
import injectionimg from "../assets/Home/injectionimg.png";
import arrowicon from "../assets/Home/arrow.png";

const Medicinenetwork = () => {
  return (
    <div className="w-full flex flex-col items-center gap-8">

      {/* Top Section */}
      <div className="
        w-full flex justify-between items-center gap-[24px] overflow-hidden
        max-md:flex-col max-md:items-center max-md:text-center
      ">
        
        {/* Left Image */}
        <img
          src={injectionimg}
          alt="Left Image"
          className="
            max-w-[175px] h-[282px] opacity-[15%] mt-16 ml-24 object-cover
            max-md:ml-0 max-md:mt-6 max-md:h-[200px] max-md:max-w-[120px]
          "
        />

        {/* Center Content */}
        <div className="
          flex flex-col items-center text-center gap-[24px] px-4
          max-md:gap-3
        ">
          <h2 className="font-bold text-[36px] leading-[56px] tracking-[1%] text-[#115D29]
            max-md:text-[24px] max-md:leading-[34px]
          ">
            Smartest Medicine Network
          </h2>

          <div className="flex flex-col items-center text-center gap-[2px]">
            <p className="
              font-normal text-[20px] leading-[40px] tracking-[1%] text-[#6D5D5D]
              max-md:text-[16px] max-md:leading-[26px]
            ">
              Get medicines faster, manage your pharmacy smarter, and predict demand with AI.
            </p>

            <p className="
              font-normal text-[20px] leading-[40px] tracking-[1%] text-[#6D5D5D]
              max-md:text-[16px] max-md:leading-[26px]
            ">
              All your medical supply needs — unified on one intelligent platform.
            </p>
          </div>
        </div>

        {/* Right Image */}
        <img
          src={topimg}
          alt="Right Image"
          className="
            max-w-[220px] h-[300px] opacity-[15%] rotate-[72deg] mt-0 object-cover
            max-md:h-[180px] max-md:max-w-[130px] max-md:rotate-[60deg]
          "
        />
      </div>

      {/* Connecting Box */}
      <div className="
        pr-9 pb-4 pl-9 gap-[8px] opacity-80 rounded-2xl border border-[#115D29] bg-[#E7EFEA]
        max-md:px-4 max-md:py-3
      ">
        <h2 className="
          font-semibold text-[20px] leading-[40px] tracking-[1%] text-[#115D29] text-center
          max-md:text-[18px] max-md:leading-[28px]
        ">
          Connecting
        </h2>

        <div className="
          flex flex-row gap-[16px] justify-center items-center
          max-md:flex-col max-md:gap-2
        ">
          <p className="
            font-normal text-[16px] leading-[32px] tracking-[1%] text-[#115D29]
            max-md:leading-[24px]
          ">
            Customers
          </p>

          <img
            src={arrowicon}
            alt=""
            className="w-[64px] h-[23px] object-cover max-md:w-[40px]"
          />

          <p className="
            font-normal text-[16px] leading-[32px] tracking-[1%] text-[#115D29]
            max-md:leading-[24px]
          ">
            Retailers
          </p>

          <img
            src={arrowicon}
            alt=""
            className="w-[64px] h-[23px] object-cover max-md:w-[40px]"
          />

          <p className="
            font-normal text-[16px] leading-[32px] tracking-[1%] text-[#115D29]
            max-md:leading-[24px]
          ">
            Distributors
          </p>
        </div>
      </div>

    </div>
  );
};

export default Medicinenetwork;
