import React from "react";

const resources = [
  { title: "Physics - Class 11", chapters: "15 chapters", size: "12.5 MB" },
  { title: "Physics - Class 12", chapters: "15 chapters", size: "12.5 MB" },
  { title: "Chemistry - Class 11", chapters: "15 chapters", size: "12.5 MB" },
  { title: "Chemistry - Class 12", chapters: "15 chapters", size: "12.5 MB" },
  { title: "Biology - Class 11", chapters: "15 chapters", size: "12.5 MB" },
  { title: "Biology - Class 12", chapters: "15 chapters", size: "12.5 MB" },
];

const NCERT = () => {
  return (
    <div className="w-full bg-white p-6">
      <div className=" mx-auto flex flex-col gap-4">
        {resources.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Left - Title */}
            <div className="flex flex-col">
              <h3 className="text-[#14457a] font-semibold text-[16px]">
                {item.title}
              </h3>
            </div>

            {/* Middle - Chapters & Size */}
            <div className="flex items-center gap-12 text-[14px] text-gray-500">
              <p>{item.chapters}</p>
              <p>{item.size}</p>
            </div>

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

export default NCERT;
