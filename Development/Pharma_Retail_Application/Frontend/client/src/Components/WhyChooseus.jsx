import React from "react";
import tabletImg from "../assets/Home/tablet.png";
import outofstockImg from "../assets/Home/outofstock.png";
import wfhgirlImg from "../assets/Home/wfhgirl.png";
import workingmanImg from "../assets/Home/workingman.png";
import qualityImg from "../assets/Home/qualitycontrol.png";

const WhyChooseus = () => {
  const cardsData = [
    {
      id: 1,
      img: outofstockImg,
      problem: "Customers face medicine unavailability",
      solution: "Real-time inventory and nearest-store match",
    },
    {
      id: 2,
      img: wfhgirlImg,
      problem: "Retailers lose time managing stock manually",
      solution: "Smart auto-reorder & digital POS",
    },
    {
      id: 3,
      img: workingmanImg,
      problem: "Distributors lack visibility",
      solution: "Live demand forecasting & analytics",
    },
    {
      id: 4,
      img: qualityImg,
      problem: "Compliance is complex",
      solution: "Automated validation & audit reports",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center relative gap-[64px]">

      {/* TOP SECTION */}
      <div
        className="
          w-full relative flex justify-center items-center mt-10 mb-4
          max-md:flex-col max-md:gap-4 max-md:text-center
        "
      >
        <div className="flex flex-col text-center gap-[8px] max-md:px-4">
          <h2 className="text-[28px] font-bold text-green-800 max-md:text-[22px]">
            Why Choose Us
          </h2>
          <p className="text-[#6D6D6D] text-[16px] max-md:text-[14px] max-md:leading-[22px]">
            From Prescription to Delivery - We Make Healthcare Flow Smoothly.
          </p>
        </div>

        <img
          src={tabletImg}
          alt="medicines"
          className="
            absolute right-0 top-1/2 -translate-y-1/2 w-[330px] opacity-30
            max-md:static max-md:w-[160px] max-md:opacity-20
          "
        />
      </div>

      {/* CARDS GRID */}
      <div
        className="
          grid grid-cols-2 gap-8 w-full px-[128px] pb-12 items-center justify-center
          max-md:grid-cols-1 max-md:px-6 max-md:gap-6
        "
      >
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="
              flex rounded-[16px] border border-[#E7EFEA] p-6 gap-6 bg-white
              max-md:flex-col max-md:items-center max-md:text-center max-md:p-4
            "
          >
            <img
              src={card.img}
              className="
                rounded-xl object-contain
                w-auto h-auto           /* desktop unchanged */
                max-md:w-[80px] max-md:h-[80px]
              "
              alt=""
            />

            <div className="flex flex-col gap-2 justify-center max-md:items-center">
              <p className="text-[16px] leading-[26px] text-[#6D5D5D] max-md:text-[14px] max-md:leading-[22px]">
                <span className="font-bold">Your Problem: </span>
                {card.problem}
              </p>

              <p className="text-[16px] leading-[26px] text-[#30B130] max-md:text-[14px] max-md:leading-[22px]">
                <span className="font-bold">Our Solution: </span>
                {card.solution}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WhyChooseus;
