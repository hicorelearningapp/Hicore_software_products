import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import images from "../../assets/assets";

const HeroSection = ({ onExploreTools }) => {
  const navigate = useNavigate(); // ✅ ADD THIS

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/alltools");
    } else {
      navigate("/login?redirect=/alltools");
    }
  };

  const handleExploreTools = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/alltools"); // or onExploreTools() if you want to scroll
    } else {
      navigate("/login?redirect=/alltools");
    }
  };

  return (
    <section
      className="flex flex-col md:flex-row items-center justify-between px-8 
    py-16 bg-gradient-to-b from-[#eae4e6] to-white mb-20"
    >
      {/* Left Content */}
      <div className="max-w-1/2 ml-10 text-center md:text-left">
        <h1 className="text-2xl md:text-[64px] leading-tight mb-8 text-gray-900">
          The Only <span className="text-red-500">PDF Toolkit</span>
          <br />
          You’ll Ever Need
        </h1>

        <p className="mt-8 text-gray-700 leading-[38px] text-2xl">
          Convert files, clean up content, summarize lengthy docs, and manage
          everything in one place — designed for the modern multitasker in
          education, business, and beyond.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center
         md:justify-start gap-6"
        >
          {/* ✅ GET STARTED → /alltools */}
          <button
            onClick={handleGetStarted}
            className="group bg-red-700 text-white px-6 py-3 rounded-md 
            transition max-w-75 w-full relative overflow-hidden border border-red-700"
          >
            <span
              className="absolute inset-0 bg-gradient-to-l from-red-200 to-red-700 
              transition-transform duration-300 transform translate-x-full 
              group-hover:translate-x-0"
            ></span>

            <span className="inline-block relative z-10 text-[20px]">
              Get Started
            </span>

            <span
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white 
              opacity-0 group-hover:opacity-100 translate-x-4 
              group-hover:translate-x-0 transition-all duration-300 z-10"
            >
              &gt;&gt;&gt;
            </span>
          </button>

          {/* Explore Tools → scroll */}
          <button
            onClick={handleExploreTools}
            className="group border border-red-700 text-red-700 max-w-75 w-full px-6 py-3 
            rounded-md font-semibold hover:bg-red-100 transition relative overflow-hidden"
          >
            <span className="inline-block relative text-[20px] z-10">
              Explore Tools
            </span>
            <span
              className="absolute right-6 top-1/2 -translate-y-1/2 text-red-700 
              opacity-0 group-hover:opacity-100 translate-x-4 
              group-hover:translate-x-0 transition-all duration-300"
            >
              &gt;&gt;&gt;
            </span>
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className="mt-10 md:mt-0 md:ml-16 mr-22">
        <img
          src={images.image_one}
          alt="PDF Toolkit"
          className="w-full h-[60vh] max-w-lg drop-shadow-2xl"
        />
      </div>
    </section>
  );
};

export default HeroSection;
