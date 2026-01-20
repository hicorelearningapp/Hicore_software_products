// src/components/ToolSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toolSections } from "../../data/toolData";

const ToolSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const handleToolClick = (path) => {
    navigate(`/tools/${path}`);
  };

  return (
    <div className="py-16 bg-white min-h-screen">
      <h2 className="text-center text-[36px] font-bold text-red-700 mb-4">
        Complete PDF Toolbox
      </h2>
      <p className="text-center text-[20px] text-gray-600 mb-12">
        Smart, Simple, and Powerful Tools for Every Task
      </p>

      <div className="flex justify-center">
        <div className="flex gap-6 w-full max-w-7xl">
          {toolSections.map((section, idx) => (
            <div
              key={idx}
              className={`transition-all duration-300 ease-in-out 
                flex flex-col items-center justify-start 
                ${
                  activeIndex === idx
                    ? "w-[540px] p-8 bg-white"
                    : "w-[140px] bg-gradient-to-br from-[#e7dcdc] to-white hover:shadow cursor-pointer"
                }
                h-[600px] border border-1 border-[#B2011E] text-lg rounded-xl
                ${idx === 0 ? "ml-10" : ""}
              `}
              onClick={() => setActiveIndex(idx)}
            >
              {activeIndex === idx ? (
                <>
                  <h3 className="text-xl font-medium text-[#B2011E] mb-6 text-center">
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {section.tools.map(({ icon: Icon, label, path }, i) => (
                      <div
                        key={i}
                        onClick={() => handleToolClick(path)}
                        className="flex items-center gap-3 bg-gradient-to-br from-[#f3eded] to-white
      p-4 md:h-[88px] rounded-md cursor-pointer"
                      >
                        {typeof Icon === "string" ? (
                          <img src={Icon} alt={label} className="w-8 h-8" />
                        ) : (
                          <Icon className="text-red-700 w-6 h-6" />
                        )}

                        <span className="font-medium text-gray-800">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div
                  className="h-full flex items-center justify-center px-2 font-bold text-2xl text-[#B2011E]"
                  style={{
                    writingMode: "vertical-lr",
                    transform: "rotate(180deg)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {section.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolSection;
