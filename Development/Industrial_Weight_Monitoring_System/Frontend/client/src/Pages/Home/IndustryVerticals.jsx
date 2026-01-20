import React, { useState } from "react";
import ivone from "../../assets/Home/iv-1.jpg";
import ivtwo from "../../assets/Home/iv-2.jpg";
import ivthree from "../../assets/Home/iv-3.jpg";
import ivfour from "../../assets/Home/iv-4.jpg";
import ivfive from "../../assets/Home/iv-5.jpg";
import ivsix from "../../assets/Home/iv-6.jpg";

const industries = [
  {
    id: 1,
    title: "Manufacturing",
    description: "Track components, raw materials, and WIP in real-time.",
    image: ivone,
  },
  {
    id: 2,
    title: "Pharmaceuticals",
    description: "Monitor medicines, cold-storage inventory, and consumables.",
    image: ivtwo,
  },
  {
    id: 3,
    title: "Retail",
    description: "Avoid empty shelves and optimize replenishment cycles.",
    image: ivthree,
  },
  {
    id: 4,
    title: "Logistics & Warehousing",
    description: "Multi-site visibility with zero manual audits.",
    image: ivfour,
  },
  {
    id: 5,
    title: "Vendor Managed Inventory (VMI)",
    description: "Automate refilling for customer locations.",
    image: ivfive,
  },
  {
    id: 6,
    title: "Food & Beverages",
    description:
      "Track ingredients, liquids, powders & perishables instantly",
    image: ivsix,
  },
];

const IndustryVerticals = () => {
  const [active, setActive] = useState(1);

  return (
    <div id="industries" className="flex flex-col gap-[24px] px-[64px] py-[100px] max-md:px-[24px] max-md:py-[60px]">
      {/* Header */}
      <div className="flex flex-col gap-[8px] items-center justify-center text-center">
        <h2 className="font-semibold text-[24px] tracking-[1%] text-[#0A2A43] max-md:text-[20px]">
          INDUSTRY VERTICALS
        </h2>
        <p className="text-[16px] font-regular leading-[28px] tracking-[1%] text-[#8A939B] max-md:text-[15px] max-md:leading-[24px] px-4">
          A flexible solution built for industries that demand precision and uninterrupted stock flow.
        </p>
      </div>

      {/* Cards Row */}
      <div className="flex flex-row gap-[24px] py-4 items-center justify-center max-md:flex-col max-md:gap-[16px]">
        {industries.map((item) => {
          const isActive = active === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`
                flex items-center cursor-pointer transition-all duration-300 ease-out
                overflow-hidden rounded-[80px]
                ${
                  isActive
                    ? "w-[550px] h-[404px] bg-white shadow-[4px_4px_4px_rgba(0,0,0,0.25)] border border-[#8A939B]"
                    : "w-[140px] h-[404px] bg-white shadow-[4px_4px_4px_rgba(0,0,0,0.25)] border border-[#B7D1FF]"
                }

                /* ✅ Mobile overrides */
                max-md:w-full max-md:h-auto max-md:flex-col max-md:items-stretch max-md:rounded-[40px]
              `}
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className={`
                  object-cover transition-all duration-300
                  ${
                    isActive
                      ? "w-[266px] h-full rounded-r-[80px]"
                      : "w-full h-full rounded-[80px]"
                  }

                  /* ✅ Mobile image behavior */
                  max-md:w-full max-md:h-[220px] max-md:rounded-[40px]
                `}
              />

              {/* Content (only visible when active) */}
              {isActive && (
                <div className="flex flex-col justify-center px-[16px] py-[64px] gap-4 max-md:px-[16px] max-md:py-[16px] max-md:gap-[8px] max-md:text-center">
                  <h3 className="text-[#0A2A43] font-semibold text-[22px] leading-[32px] max-md:text-[18px] max-md:leading-[24px]">
                    {item.title}
                  </h3>

                  <p className="text-[#0A2A43] text-[16px] leading-[26px] max-md:text-[14px] max-md:leading-[22px]">
                    {item.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndustryVerticals;
