import React from "react";
// ✅ Import your icons from assets
import plusIcon from "../../../../assets/EmployeerDashboardPage/Add.png";
import lightIcon from "../../../../assets/EmployeerDashboardPage/Innovation.png";
import userIcon from "../../../../assets/EmployeerDashboardPage/Profile.png";
import briefcaseIcon from "../../../../assets/EmployeerDashboardPage/Work.png";

const DashboardEmployer = () => {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-[#EBEAF2] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h2 className="font-semibold text-xl text-[#343079] mb-4">
            Create a Job Post
          </h2>

          <div className="bg-[#F9F9FC] border border-[#EBEAF2] rounded-lg h-full md:min-h-40 flex flex-col justify-between p-3">
            <div className="flex-grow flex items-center justify-center">
              <img
                src={plusIcon}
                alt="Add Job"
                className="w-6 h-6 text-[#2B2160]"
              />
            </div>
            <div className="flex justify-end">
              <button className="text-md text-[#343079] font-medium flex items-center gap-1">
                AI Suggestions <span>&gt;&gt;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hackathon Hub */}
        <div className="bg-white border border-[#EBEAF2] h-full md:min-h-100 rounded-xl p-5 shadow-sm flex flex-col items-center text-center">
          <h2 className="font-semibold text-xl text-[#343079] mt-3 mb-4">
            Hackathon Hub
          </h2>

          {/* Centered Section */}
          <div className="flex flex-col items-center justify-center flex-grow">
            <img src={lightIcon} alt="Hackathon" className="w-12 h-12 mb-3" />

            <p className="text-[#A4A2B3] text-[14px] mb-4 max-w-xs mx-auto">
              No hackathons partnered yet. Collaborate with top talent by
              hosting or sponsoring a challenge.
            </p>

            <button className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-5 py-2 rounded-md text-sm font-semibold">
              Create Partnership
            </button>
          </div>
        </div>
      </div>

      {/* Center Column - Manage Applications */}
      <div className="lg:col-span-2 bg-white border border-[#EBEAF2] rounded-lg p-6 shadow-sm flex flex-col text-center relative">
        {/* Heading pinned to top-left */}
        <h2 className="font-semibold mb-6 text-xl text-[#343079] text-left">
          Manage Applications
        </h2>

        {/* Centered content */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <img
            src={briefcaseIcon}
            alt="No Applications"
            className="w-12 h-12 mb-3 opacity-70"
          />
          <p className="text-[#A4A2B3] text-[14px] mb-4">
            No applications yet.
            <br /> Share your job posting to attract candidates.
          </p>
          <button className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 md:w-40 text-white px-5 py-2 rounded-md text-sm font-medium">
            Post a Job
          </button>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
        {/* View Top Talent */}
        <div className="bg-white border border-[#EBEAF2] md:min-h-80 rounded-lg p-4 shadow-sm flex flex-col text-center">
          {/* Heading at top-left */}
          <h2 className="font-semibold text-xl mb-3 text-[#343079] text-left">
            View Top Talent
          </h2>

          {/* Centered Content */}
          <div className="flex flex-col items-center justify-center flex-grow">
            <img
              src={userIcon}
              alt="Top Talent"
              className="w-10 h-10 mb-2 opacity-70"
            />
            <p className="text-[#A4A2B3] text-[14px] max-w-xs">
              No top talent showcased yet. Keep an eye here for
              platform-recommended candidates based on performance and ratings.
            </p>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white border border-[#EBEAF2] rounded-lg p-4 md:min-h-80 shadow-sm flex flex-col text-center">
          {/* Heading at top-left */}
          <h2 className="font-semibold text-xl mb-3 text-[#343079] text-left">Upcoming Deadlines</h2>

          {/* Centered Content */}
          <div className="flex flex-col items-center justify-center flex-grow">
            <img
              src={userIcon}
              alt="Deadlines"
              className="w-10 h-10 mb-2 opacity-70"
            />
            <p className="text-[#A4A2B3] text-[14px] max-w-xs">
              No upcoming deadlines. All your postings are up to date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmployer;
