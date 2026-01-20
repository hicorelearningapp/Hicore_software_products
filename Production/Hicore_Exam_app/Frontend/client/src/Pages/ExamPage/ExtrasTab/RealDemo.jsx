import React from "react";
import { Play } from "lucide-react"; // for play icon (you can remove if using custom SVG)

const demoVideos = [
  {
    title: "How rockets apply Newton's Third Law",
    duration: "3 min",
  },
  {
    title: "How X-rays are used in hospitals",
    duration: "4 min",
  },
];

const RealDemo = () => {
  return (
    <div className="w-full bg-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {demoVideos.map((video, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[#1d3b8b] font-semibold text-[16px] leading-snug">
                {video.title}
              </h3>
              <span className="text-gray-500 text-sm">{video.duration}</span>
            </div>

            {/* Video Placeholder */}
            <div className="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-10 h-10 border border-[#b8c4d8] rounded-full flex items-center justify-center text-[#1d3b8b]">
                <Play size={20} />
              </div>
            </div>

            {/* Watch Button */}
            <button className="w-full bg-[#1d4fb0] text-white text-[14px] font-medium py-2.5 rounded-full hover:opacity-90 transition-all">
              Watch Video
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealDemo;
