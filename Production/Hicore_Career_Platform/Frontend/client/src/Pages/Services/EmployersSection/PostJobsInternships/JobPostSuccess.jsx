// src/pages/Employer/JobPostSuccess.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// Import icons from assets
import viewIcon from "../../../../assets/Employer/PostJobs/Eye.png";
import editIcon from "../../../../assets/Employer/PostJobs/Edit.png";
import boostIcon from "../../../../assets/Employer/PostJobs/Global.png";
import manageIcon from "../../../../assets/Employer/PostJobs/Resume.png";

const JobPostSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Success Icon */}
      <div className="mb-6 mt-6">
        <div className="bg-green-800 rounded-full w-20 mb-8 h-20 flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-green-800 font-bold text-3xl mb-4 text-center">
        🎉 Your Job Post Is Live!
      </h2>
      <p className="text-blue-900 text-xl text-center mb-8">
        Your listing has been successfully published and is now visible to
        candidates on the platform.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-8 mb-10">
        <button
          onClick={() => navigate("/employer/dashboard")}
          className="border border-blue-900 rounded-md px-6 md:px-20 py-2 hover:bg-gray-100 transition"
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => navigate("/post-jobs")}
          className="bg-indigo-900 text-white rounded-md md:px-14 px-6 py-2 hover:bg-indigo-800 transition"
        >
          Post Another Job/Internship
        </button>
      </div>

      {/* What You Can Do Next */}
      <div className="w-full max-w-7xl bg-white border border-gray-300 shadow-lg rounded-lg p-8">
        <h3 className="text-center text-blue-900 text-xl font-semibold mb-6">
          What You Can Do Next
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-start">
          {/* View Post Performance */}
          <div className="bg-blue-50 p-10 border border-blue-900 rounded-md shadow-sm hover:shadow-xl transition">
            <img
              src={viewIcon}
              alt="View Post Performance"
              className="w-10 h-10 mb-4"
            />
            <div className="text-blue-900 font-semibold mb-2">
              View Post Performance
            </div>
            <p className="text-md text-blue-900">
              Monitor applications, views & engagement
            </p>
          </div>

          {/* Edit This Job Post */}
          <div className="bg-yellow-50 p-10 border border-blue-900 rounded-md shadow-sm hover:shadow-xl transition">
            <img
              src={editIcon}
              alt="Edit This Job Post"
              className="w-10 h-10 mb-4"
            />
            <div className="text-blue-900 font-semibold mb-2">
              Edit This Job Post
            </div>
            <p className="text-md text-blue-900">Make changes anytime</p>
          </div>

          {/* Boost Visibility */}
          <div className="bg-blue-50 p-10 border border-blue-900 rounded-md shadow-sm hover:shadow-xl transition">
            <img
              src={boostIcon}
              alt="Boost Visibility"
              className="w-10 h-10 mb-4"
            />
            <div className="text-blue-900 font-semibold mb-2">
              Boost Visibility
            </div>
            <p className="text-md text-blue-900">
              Promote your post to reach more talent
            </p>
          </div>

          {/* Manage Applications */}
          <div className="bg-green-50 p-10 border border-blue-900 rounded-md shadow-sm hover:shadow-xl transition">
            <img
              src={manageIcon}
              alt="Manage Applications"
              className="w-10 h-10 mb-4"
            />
            <div className="text-blue-900 font-semibold mb-2">
              Manage Applications
            </div>
            <p className="text-md text-blue-900">
              Review resumes and shortlist candidates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostSuccess;
