import React from 'react'
import growthIcon from "../../../../assets/EmployeerDashboard/Insights/growth.png";

const Insights = () => {
  return (
    <div className="flex flex-col m-4 items-center justify-center min-h-screen text-center bg-white rounded-lg border border-[#343079] p-6">
      <div className="flex items-center justify-center">
        <img
          src={growthIcon}
          alt="Growth"
          className="w-[100px] h-[100px] object-cover opacity-100"
        />
      </div>
      <p className="w-full h-8 text-center text-[#A4A2B3] font-poppins font-bold text-[16px] leading-8">
        Insights & Analytics
      </p>
      <p className="w-full text-center text-[#A4A2B3] font-poppins font-normal text-[16px] leading-8">
        Post a job and track recruitment performance and make data-driven hiring
        decisions
      </p>
      <button className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-6 py-2 rounded-md mt-4">
        Post a Job
      </button>
    </div>
  );
};

export default Insights;
