import React from "react";
import heroRightImage from "../../assets/heroRightImage.png";
import { Link, useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div
      id="home"
      className="w-full  figma-gradient-bg text-white py-16 px-4  md:px-25 
      flex flex-col md:flex-row items-center justify-between gap-4"
    >
      {/* Left Content */}
      <div className="flex-1 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-light leading-tight">
          Your Needs. Our Expertise.
        </h1>
        <h2
          className="text-3xl md:text-5xl font-bold mt-8 inline-block
           bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200
           text-transparent bg-clip-text"
        >
          A Perfect Match.
        </h2>

        <p className="text-sm md:text-lg mt-12 leading-[3] text-gray-300">
          HiCoreSoft provide specialists with several years of experience in
          latest technologies for various domain using C, C++, VC++, C#, .NET
          Technologies, React JS, OOPS, OO design and coding skills, MFC, ATL,
          COM & Active X, STL, Multithreading, WCF, .Net Remoting, WPF, ADO
          .Net, Entity Framework, MEF, MERN, Prism, SQL Server, Oracle, python,
          WINDOWS, Linux, UNIX.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => {
            navigate("/contact");
            window.scrollTo({ top: 0, behavior: "smooth" });  }}
            className="relative cursor-pointer px-10 py-4 bg-[#0c0c2c] text-white font-medium text-xl rounded circuit-border 
    hover:bg-yellow-600 hover:text-white transition-all duration-300"
          >
            Start Your Project
          </button>

          <Link
            to="/products"
            className="bg-transparent cursor-pointer border border-white text-xl
    text-white px-10 py-4 rounded hover:bg-white hover:text-blue-900 font-medium transition-all duration-300 inline-block text-center"
          >
            Explore Our Products
          </Link>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex-1 w-full flex justify-center mr-20 md:mr-0 md:justify-end items-center mt-10 md:mt-0">
        <img
          src={heroRightImage}
          alt="Technology HUD icons"
          className="w-[90%] md:w-[120%] h-auto object-contain mx-auto md:mx-0"
        />
      </div>
    </div>
  );
};

export default HeroSection;
