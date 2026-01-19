import React from "react";
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import dropboxIcon from "../../../../assets/JDBaesdAi/button-one.png";
import driveIcon from "../../../../assets/JDBaesdAi/button-two.png";
import cloudIcon from "../../../../assets/JDBaesdAi/button-three.png";

// Added props to control visibility of banner and back button
const JDbasedshortlisting = ({ showBanner = true, showBackBtn = true }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">

      {/*<div className="flex justify-end w-full mx-auto px-6 mt-10 mb-10">
        <button
          onClick={() => navigate("/ai-assistant")}
          className="flex items-center gap-2 bg-[#2C63B6] text-white font-medium px-5 py-2 rounded-md shadow hover:bg-[#1e4c8f] transition"
        >
          <Sparkles size={18} />
          AI Assistant
        </button>
      </div>*/}

      <div className="flex-1 bg-white">
        <div className="max-w-8xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 px-10">
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-7">
            <h2 className="text-xl font-semibold text-[#2C297D] mb-4">
              Job Description
            </h2>
            <textarea
              placeholder={`Paste the job description here...\n\nExample:\n\nJob Title: Frontend Developer (React.js)\nCompany: ABC Software Technologies\nLocation: Remote\nExperience: 2–4 years\nJob Type: Full-Time\n\nAbout the Role:`}
              className="w-full h-70 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C297D] text-md text-gray-700 text-leading resize-none overflow-y-scroll scrollbar-hide"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-5 flex flex-col items-center justify-center text-center">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#2C297D] text-[#2C297D] rounded-md hover:bg-[#2C297D] hover:text-white transition">
              <FiUpload />
              Upload Your Job Description
            </button>

            <div className="flex gap-6 mt-5 text-2xl text-[#2C297D]">
              <img
                src={dropboxIcon}
                alt="Dropbox"
                className="w-12 h-12 cursor-pointer hover:scale-110 transition"
              />
              <img
                src={driveIcon}
                alt="Google Drive"
                className="w-12 h-12 cursor-pointer hover:scale-110 transition"
              />
              <img
                src={cloudIcon}
                alt="Cloud"
                className="w-12 h-12 cursor-pointer hover:scale-110 transition"
              />
            </div>

            <p className="text-gray-500 text-sm mt-4">
              Supported formats: <b>.pdf</b> (max 100MB)
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-10 mb-12">
          <button
            onClick={() => navigate("/ai-shortlisting")}
            className="bg-[#2C297D] text-white font-medium px-8 py-3 rounded-md hover:bg-[#1e1a5c] transition"
          >
            Start AI Shortlisting
          </button>
        </div>
      </div>
    </div>
  );
};

export default JDbasedshortlisting;