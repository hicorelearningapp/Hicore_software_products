import React from "react";
import { useNavigate } from "react-router-dom";
import { allToolsData } from "../data/allToolsData";

const AllTools = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#F7E6E9]/30">
      {/* ================= HEADER ================= */}
      <section className="w-full py-16 text-center">
        <h1 className="text-[36px] md:text-[42px] font-semibold text-red-700">
          Explore all the tools of HiPDF
        </h1>
      </section>

      {/* ================= TOOLS GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allToolsData.map((tool) => (
            <div
              key={tool.path}
              onClick={() => navigate(`/tools/${tool.path}`)} // ✅ FIX HERE
              className="
                flex items-center gap-4 px-6 py-8 rounded-xl cursor-pointer
                bg-gradient-to-br from-[#FAFAFA] to-[#EBE6E6]
                hover:shadow-md hover:scale-[1.01]
                transition-all duration-300
              "
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/${tool.path}`); // ✅ FIX HERE TOO
                }
              }}
            >
              <img
                src={tool.icon}
                alt={tool.title}
                className="w-8 h-8 flex-shrink-0"
              />
              <span className="text-gray-800 font-medium">{tool.title}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AllTools;
