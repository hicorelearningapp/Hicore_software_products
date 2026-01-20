import React from "react";

const voiceModes = [
  { title: "Chapter Summaries", duration: "Duration: 15–20 min" },
  { title: "Formula Reviews", duration: "Duration: 8–12 min" },
  { title: "Key Concepts", duration: "Duration: 10–15 min" },
];

const VoiceMode = () => {
  return (
    <div className="w-full bg-white p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        {voiceModes.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Left - Title */}
            <h3 className="text-[#1d3b8b] font-semibold text-[16px]">
              {item.title}
            </h3>

            {/* Center - Duration */}
            <p className="text-sm text-gray-500">{item.duration}</p>

            {/* Right - Button */}
            <button className="px-5 py-2 bg-[#22c55e] text-white text-[14px] rounded-full hover:opacity-90 transition-all">
              Start Listening
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceMode;
