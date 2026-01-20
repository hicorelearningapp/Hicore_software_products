// 📂 src/components/MainSection.jsx
import React from "react";
import chipImage from "../../assets/chipImage.png";
import teamImage from "../../assets/teamImage.png";
import satisfaction from "../../assets/satisfaction.jpg";
import roi from "../../assets/roi.png";
import ClientsAndPartners from "./ClientsAndPartners";

// ✅ Data for content sections
const sections = [
  {
    title: "Semiconductor Software Expertise",
    subtitle:
      "Specialized in Semiconductor Software. Building for the AI Future.",
    description: `We specialize in building and supporting service-based software applications tailored for the semiconductor industry. We're actively working on next-generation, AI-powered applications designed to optimize decision-making, automate workflows, and enhance business intelligence across industries.`,
    highlight: "We don’t just build software – we optimize performance.",
    image: chipImage,
    imageFirst: false,
  },
  {
    title: "Technical Expertise",
    subtitle: "Reliable. Scalable. Built for your success.",
    description: `Technology evolves and we evolve with it. At HiCore, our team brings deep, hands-on experience across operating systems, networks, databases, and development platforms.`,
    highlight: "We don’t just understand tech – we make it work for you.",
    image: teamImage,
    imageFirst: true,
  },
  {
    title: "Satisfaction Guaranteed",
    subtitle: "Your satisfaction is our promise.",
    description: `Technology moves fast and we’re here to make it simple. At HiCore, we tailor every solution to fit your business, goals, and budget. No matter the size of the project, our commitment to quality, transparency, and customer service remains the same.`,
    highlight: "We don’t just deliver projects – we deliver peace of mind.",
    image: satisfaction,
    imageFirst: false,
  },
  {
    title: "Maximize ROI, Minimize IT Overhead",
    subtitle: "Smarter spending. Stronger returns.",
    description: `Your technology should drive growth, not drain your budget. At HiCore, we help you cut down on costly maintenance by streamlining IT operations and modernizing legacy systems.`,
    highlight: "We turn IT costs into strategic investments.",
    image: roi,
    imageFirst: true,
  },
];

const MainSection = () => {
  return (
    <div className="py-16 px-6 md:px-24 bg-white mt-16">
      {/* Header */}
      <h2 className="text-4xl font-bold text-center text-[#E09F2b] mb-6">
        Who we are?
      </h2>

      {/* Description */}
      <p className="text-center text-lg md:text-xl font-medium text-[#230970] mx-auto max-w-7xl px-4">
        At HiCore Software Technologies Private Limited, we build scalable,
        intelligent, and cost-effective solutions across CAD, AI, IoT, Embedded
        Systems and Full-Cycle Software Development, built for performance and
        precision.
      </p>

      {/* Dynamic Sections */}
      {sections.map((section, index) => (
        <div
          key={index}
          className="mt-20 p-[2px] rounded-sm bg-gradient-to-b from-yellow-200 to-yellow-600 shadow-md"
        >
          <div className="p-6 bg-white rounded-md flex flex-col md:flex-row items-center gap-10">
            {section.imageFirst && (
              <div className="flex-1 text-center">
                <img
                  src={section.image}
                  alt={section.title}
                  className="rounded-md w-full max-w-xs md:max-w-xl h-auto mx-auto"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-3xl font-medium text-[#E09F2b] mb-3">
                {section.title}
              </h3>
              <p className="text-[#230970] font-light text-lg mb-10">
                {section.subtitle}
              </p>
              <p className="text-[#230970] text-lg font-light mb-4">
                {section.description}
              </p>
              <p className="font-bold text-xl mt-10 text-[#230970]">
                {section.highlight}
              </p>
            </div>
            {!section.imageFirst && (
              <div className="flex-1 text-center">
                <img
                  src={section.image}
                  alt={section.title}
                  className="rounded-md w-full max-w-xs md:max-w-xl h-auto mx-auto"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainSection;
