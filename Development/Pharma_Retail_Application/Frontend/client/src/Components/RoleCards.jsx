import React from "react";
import { useNavigate } from "react-router-dom";

// Normal icons
import customerIcon from "../assets/Home/customericon.png";
import retailerIcon from "../assets/Home/retailericon.png";
import distributorIcon from "../assets/Home/distributoricon.png";

// Hover icons (required)
import customerHover from "../assets/Home/hover-Customer.png";
import retailerHover from "../assets/Home/hover-Retailer.png";
import distributorHover from "../assets/Home/hover-Distributor.png";

/* Inline arrow — uses currentColor so it follows text color (accent or white) */
const ArrowSVG = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M10 8l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const roles = [
  {
    id: "customer",
    title: "I'm a Customer",
    bullets: [
      "Order or Upload prescription.",
      "Find nearby medicines instantly.",
    ],
    border: "border-[#D22E2E]",
    cardBg: "hover:bg-[#D22E2E]",
    iconBg: "bg-[#D22E2E]",
    icon: customerIcon,
    hoverIcon: customerHover,
    cta: "Get Started",
    btnBgDefault: "bg-[#D22E2E]",
    btnTextDefault: "text-white",
    btnHoverText: "group-hover:text-[#D22E2E]",
    route: "/customers", // stays same
  },
  {
    id: "retailer",
    title: "I'm a Retailer",
    bullets: ["Digitize my pharmacy", "Manage stock and POS in one tap."],
    border: "border-[#1871C4]",
    cardBg: "hover:bg-[#1871C4]",
    iconBg: "bg-[#1871C4]",
    icon: retailerIcon,
    hoverIcon: retailerHover,
    cta: "Join Now",
    btnBgDefault: "bg-[#1871C4]",
    btnTextDefault: "text-white",
    btnHoverText: "group-hover:text-[#1871C4]",
    route: "/retailers", // <-- your required route
  },
  {
    id: "distributor",
    title: "I'm a Distributor",
    bullets: ["Grow my network.", "See real-time demand trends."],
    border: "border-[#AF840D]",
    cardBg: "hover:bg-[#AF840D]",
    iconBg: "bg-[#AF840D]",
    icon: distributorIcon,
    hoverIcon: distributorHover,
    cta: "Partner Up",
    btnBgDefault: "bg-[#AF840D]",
    btnTextDefault: "text-white",
    btnHoverText: "group-hover:text-[#AF840D]",
    route: "/distributors", 
  },
];

const RoleCards = () => {
  const navigate = useNavigate();

  return (
    <section className="py-30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {roles.map((r) => (
            <article
              key={r.id}
              className={`group border-2 ${r.border} rounded-lg p-8 
                bg-white flex flex-col items-center text-center
                transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg
                ${r.cardBg}
              `}
            >
              {/* ICON BLOCK */}
              <div
                className={`w-20 h-20 rounded-lg flex items-center justify-center mb-6
                  ${r.iconBg} group-hover:bg-white
                  transition-colors duration-300 relative
                `}
              >
                <img
                  src={r.icon}
                  alt={`${r.title} icon`}
                  className="w-8 h-8 object-contain transition-opacity duration-200 group-hover:opacity-0"
                />

                <img
                  src={r.hoverIcon}
                  alt={`${r.title} icon hover`}
                  className="w-8 h-8 object-contain absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
              </div>

              {/* TITLE */}
              <h3 className="text-[18px] font-semibold text-[#0F5F25] group-hover:text-white transition-colors duration-300 mb-4">
                {r.title}
              </h3>

              {/* BULLETS */}
              <ul className="text-sm space-y-3 mb-6">
                {r.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 justify-start">
                    <span className="text-[#0F5F25] group-hover:text-white transition-colors duration-300">
                      •
                    </span>
                    <span className="text-[#0F5F25] group-hover:text-white transition-colors duration-300">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA BUTTON */}
              <button
                onClick={() => navigate(r.route)} // <-- Navigation added here
                className={`w-full max-w-xs py-3 rounded-md cursor-pointer font-medium flex items-center justify-center gap-3
                  ${r.btnBgDefault} ${r.btnTextDefault}
                  group-hover:bg-white ${r.btnHoverText}
                  transition-all duration-300
                `}
                aria-label={`${r.cta} - ${r.title}`}
              >
                <span className="transition-colors duration-300">{r.cta}</span>

                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${r.btnTextDefault} ${r.btnHoverText}`}
                >
                  <ArrowSVG />
                </span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleCards;
