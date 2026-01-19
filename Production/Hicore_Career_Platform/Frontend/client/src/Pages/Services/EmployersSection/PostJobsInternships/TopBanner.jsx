import React from "react";
import jobIcon from "../../../../assets/Employer/PostJobs/topjob.png"; 

const TopBanner = () => {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <img src={jobIcon} alt="Job Icon" className="w-20 h-20 mb-4" />
      <h1 className="text-2xl font-semibold text-[#343079]">
        Post a Job or Internship
      </h1>
      <p className="text-[#343079]">
        Reach top talent by listing your open roles for free
      </p>
    </div>
  );
};

export default TopBanner;
