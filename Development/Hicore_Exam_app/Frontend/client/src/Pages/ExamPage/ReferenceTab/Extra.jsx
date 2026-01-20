import React from "react";

const extras = [
  { title: "Previous NEET toppers' suggested reference books" },
  { title: "Chapter-wise solved examples PDFs" },
  { title: "Short research notes on real-life applications of topics" },
  { title: "Short research notes on real-life applications of topics" },
  { title: "Short research notes on real-life applications of topics" },
  { title: "Short research notes on real-life applications of topics" },
];

const Extra = () => {
  return (
    <div className="w-full bg-white p-6">
      <div className=" mx-auto flex flex-col gap-4">
        {extras.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Left - Title */}
            <h3 className="text-[#1d3b8b] font-semibold text-[16px]">
              {item.title}
            </h3>

            {/* Right - Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-5 py-2 bg-[#0663ff] text-white text-[14px] rounded-full hover:opacity-90 transition-all">
                Download
              </button>
              <button className="px-5 py-2 bg-[#22c55e] text-white text-[14px] rounded-full hover:opacity-90 transition-all">
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Extra;
