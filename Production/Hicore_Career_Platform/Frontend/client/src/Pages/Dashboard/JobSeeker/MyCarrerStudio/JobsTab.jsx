// 📂 src/components/MyCareer/JobsTab.jsx
import React, { useState } from "react";

// ✅ Import icons from assets
import appliedIcon from "../../../../assets/StudentCourseTab/Applied.png";
import shortlistedIcon from "../../../../assets/StudentCourseTab/Shortlisted.png";
import offeredIcon from "../../../../assets/StudentCourseTab/Offered.png";
import rejectedIcon from "../../../../assets/StudentCourseTab/Rejected.png";
import jobsIcon from "../../../../assets/StudentCourseTab/Job.png"; // custom icon for first screen

const JobsTab = () => {
  const [showJobs, setShowJobs] = useState(false);

  const stats = [
    {
      count: 3,
      label: "Applied",
      description: "Jobs you’ve applied for - awaiting employer response.",
      bg: "bg-blue-50",
      icon: appliedIcon,
    },
    {
      count: 5,
      label: "Shortlisted",
      description: "Applications shortlisted by employers for the next stage.",
      bg: "bg-yellow-50",
      icon: shortlistedIcon,
    },
    {
      count: 2,
      label: "Offered",
      description: "Job offers you’ve received - review and respond.",
      bg: "bg-green-50",
      icon: offeredIcon,
    },
    {
      count: 2,
      label: "Rejected",
      description:
        "Applications that were not selected this time – keep trying!",
      bg: "bg-red-50",
      icon: rejectedIcon,
    },
  ];

  return (
    <div className="p-6">
      {!showJobs ? (
        // ✅ Initial Screen
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          {/* Icon */}
          <img
            src={jobsIcon}
            alt="Jobs"
            className="w-24 h-24 mb-6 object-contain"
          />

          <p className="text-md text-gray-600 mb-6">
            No saved or applied jobs yet. Browse opportunities to kickstart your
            career.
          </p>

          <button
            onClick={() => setShowJobs(true)}
            className="bg-indigo-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
          >
            Find Opportunities
          </button>
        </div>
      ) : (
        // ✅ Jobs Dashboard
        <div>
          {/* Search Bar */}
          <div className="bg-indigo-50 p-5 rounded-md mb-8">
            <input
              type="text"
              placeholder="Search by job title, company or location..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Stats Cards */}
          <div className="border border-gray-200 p-10 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.bg} rounded-lg shadow p-8 flex flex-col items-center text-center`}
                >
                  {/* Icon */}
                  <div className="w-18 h-18 flex items-center justify-center rounded-xl mb-3">
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-14 h-14"
                    />
                  </div>

                  {/* Count */}
                  <p className="text-2xl font-bold text-indigo-900">
                    {item.count}
                  </p>

                  {/* Label */}
                  <p className="font-semibold text-lg text-indigo-900 mb-3">
                    {item.label}
                  </p>

                  {/* Description */}
                  <p className="text-md text-blue-900">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsTab;
