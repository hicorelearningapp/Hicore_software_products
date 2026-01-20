import React from "react";
import rightArrow from "../assets/Home/downarrow.png";

const Footer = () => {
  const quickLinks = [
    "Home",
    "Best Sellers",
    "Offers & Deals",
    "Contact Us",
    "FAQs",
  ];

  const needHelp = [
    "Delivery Information",
    "Return & Refund Policy",
    "Payment Methods",
    "Track your Order",
    "Contact Us",
  ];

  const followUs = ["Instagram", "Twitter", "Facebook", "YouTube"];

  return (
    <div
      className="
        w-full bg-[#115D29] pt-[64px] pb-[64px] px-[78px] rounded-t-[8px]
        max-md:px-6 max-md:pt-[48px] max-md:pb-[48px]
      "
    >
      <div
        className="
          flex flex-col md:flex-row gap-[64px] justify-between items-start
          max-md:gap-[48px]
        "
      >
        {/* LEFT TEXT BLOCK */}
        <div
          className="
            w-[50%] flex flex-col items-center text-center gap-[8px] mx-auto md:mx-0
            max-md:w-full max-md:px-2
          "
        >
          <h2
            className="
              text-white text-[28px] font-semibold leading-[48px]
              max-md:text-[20px] max-md:leading-[30px]
            "
          >
            Simplify Medical Supply. Connect Smarter.
            <br />
            Deliver Faster.
          </h2>

          <p
            className="
              text-white font-regular text-[16px] leading-[32px]
              max-md:text-[14px] max-md:leading-[22px]
            "
          >
            Order. Relax. Recover. We connect you to trusted pharmacies that
            deliver genuine medicines to your door.
          </p>
        </div>

        {/* RIGHT LINKS BLOCK */}
        <div
          className="
            w-[50%] grid grid-cols-1 sm:grid-cols-3 gap-[64px] text-white
            max-md:w-full max-md:grid-cols-1 max-md:gap-[32px] max-md:text-center
          "
        >
          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold mb-4 text-[14px]">Quick links</h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((item) => (
                <li
                  key={item}
                  className="
                    flex items-center gap-2 cursor-pointer
                    hover:text-[#B7D5F0] hover:underline hover:decoration-[#B7D5F0]
                    transition-all duration-200
                    max-md:justify-center
                  "
                >
                  <span className="text-[12px] font-regular">{item}</span>
                  <img src={rightArrow} alt="" className="w-[16px] h-[16px]" />
                </li>
              ))}
            </ul>
          </div>

          {/* NEED HELP */}
          <div>
            <h3 className="font-semibold mb-4 text-[14px]">Need help?</h3>
            <ul className="flex flex-col gap-2">
              {needHelp.map((item) => (
                <li
                  key={item}
                  className="
                    flex items-center gap-2 cursor-pointer
                    hover:text-[#B7D5F0] hover:underline hover:decoration-[#B7D5F0]
                    transition-all duration-200
                    max-md:justify-center
                  "
                >
                  <span className="text-[12px] font-regular">{item}</span>
                  <img src={rightArrow} alt="" className="w-[16px] h-[16px]" />
                </li>
              ))}
            </ul>
          </div>

          {/* FOLLOW US */}
          <div>
            <h3 className="font-semibold mb-4 text-[14px]">Follow Us</h3>
            <ul className="flex flex-col gap-2">
              {followUs.map((item) => (
                <li
                  key={item}
                  className="
                    flex items-center gap-2 cursor-pointer
                    hover:text-[#B7D5F0] hover:underline hover:decoration-[#B7D5F0]
                    transition-all duration-200
                    max-md:justify-center
                  "
                >
                  <span className="text-[12px] font-regular">{item}</span>
                  <img src={rightArrow} alt="" className="w-[16px] h-[16px]" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
