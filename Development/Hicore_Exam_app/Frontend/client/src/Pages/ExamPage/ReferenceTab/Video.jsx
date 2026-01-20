import React from "react";
import { Play } from "lucide-react"; // using lucide-react icon for play button

const videos = [
  {
    title: "Dimensional Analysis",
    author: "Physics Wallah",
    duration: "45 min",
  },
  { title: "Dimensional Analysis", author: "Khan Academy", duration: "32 min" },
  {
    title: "Dimensional Analysis",
    author: "Amoeba Sisters",
    duration: "18 min",
  },
  { title: "Dimensional Analysis", author: "Vedantu", duration: "52 min" },
];

const Video = () => {
  return (
    <div className="w-full bg-white p-6">
      <div className=" mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[#1d3b8b] font-semibold text-[16px]">
                {video.title}
              </h3>
              <span className="bg-[#eaf0ff] text-[#1d3b8b] text-[13px] font-medium px-3 py-1 rounded-full">
                {video.duration}
              </span>
            </div>

            <p className="text-gray-500 text-sm mb-4">by {video.author}</p>

            {/* Video Thumbnail */}
            <div className="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Play className="text-[#1d3b8b]" size={28} />
            </div>

            {/* Watch Button */}
            <button className="w-full bg-[#1d3b8b] text-white text-[14px] font-medium py-2.5 rounded-full hover:opacity-90 transition-all">
              Watch Video
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Video;
