import React, { useState, useEffect } from "react";
import axios from "axios";

import jobIcon from "../../../../assets/EmployeerDashboard/Jobposts/job.png";
import calendar from "../../../../assets/EmployeerDashboard/Jobposts/calendar.png";
import locationIcon from "../../../../assets/EmployeerDashboard/Jobposts/location.png";
import applicationsIcon from "../../../../assets/EmployeerDashboard/Jobposts/jobid.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const Jobposts = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [showJobs, setShowJobs] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Allowed status for dashboard
  const tabs = ["All", "Active", "Closed"];

  // Fetch logged in user ID
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/users`);
        const match = res.data.find((u) => u.email === email);
        if (match) setUserId(match.id);
      } catch (e) {
        console.log("User fetch error", e);
      }
    };
    fetchUser();
  }, []);

  // Fetch Jobs from API
  useEffect(() => {
    if (!showJobs || !userId) return;

    const fetchJobs = async () => {
      try {
        setLoading(true);

        const status =
          activeTab === "All" ? "all" : activeTab.toLowerCase(); // active | closed | all

        const res = await axios.get(
          `${API_BASE}/applications/by-poster/${userId}/status/${status}`
        );

        const apps = res.data;

        // fetch job details for each application
        const jobDetails = await Promise.all(
          apps.map(async (app) => {
            if (!app.job_id) return { ...app, jobData: null };

            try {
              const jobRes = await axios.get(`${API_BASE}/jobs/${app.job_id}`);
              return { ...app, jobData: jobRes.data };
            } catch {
              return { ...app, jobData: null };
            }
          })
        );

        setJobs(jobDetails);
      } catch (err) {
        console.log("Fetch jobs error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [showJobs, activeTab, userId]);

  // Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-[#E8FFDD] text-[#008000]";
      case "closed":
        return "bg-[#FFE4FF] text-[#FF0000]";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="w-full h-[844px] opacity-100 rounded-tl-[8px] p-6">
      {/* Tabs */}
      <div className="w-full h-[37px] flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowJobs(false);
            }}
            className={`h-[37px] px-6 py-2 font-poppins font-medium text-sm 
              ${
                activeTab === tab
                  ? "bg-[#343079] text-white rounded-tl-[8px] rounded-tr-[8px]"
                  : "text-[#C0BFD5]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-full h-[750px] p-[20px] border rounded-lg border-[#343079]">
        {!showJobs ? (
          <div className="flex flex-col items-center justify-center h-[600px] text-center">
            <img src={jobIcon} className="w-[100px] h-[100px]" />
            <p className="text-[#A4A2B3] font-bold text-[16px] mt-2">
              No job posts yet.
            </p>
            <p className="text-[#A4A2B3] text-[16px]">
              Start by creating your first job to attract candidates.
            </p>

            <button
              onClick={() => setShowJobs(true)}
              className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] 
              hover:to-[#918ECC] text-white px-6 py-2 rounded-md mt-4"
            >
              Post a Job
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Post a Job Button */}
            <div className="flex justify-start mb-4">
              <button className="bg-[#008000] text-white px-6 py-2 rounded-md">
                + Post a Job
              </button>
            </div>

            {/* Loading */}
            {loading && <p className="text-center text-gray-500">Loading...</p>}

            {/* Job Cards */}
            <div className="grid grid-cols-3 gap-6 mt-4 overflow-y-auto">
              {jobs.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#C0BFD5] rounded-lg p-5 bg-white flex flex-col gap-4"
                >
                  <h3 className="font-bold text-[16px] text-[#343079]">
                    {item.jobData?.title || "Untitled Job"}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm">
                    <img src={locationIcon} className="w-5 h-5" />
                    <span>
                      Location:{" "}
                      <span className="font-semibold text-[#343079]">
                        {item.jobData?.location || "N/A"}
                      </span>
                    </span>
                  </div>

                  {/* Expiry */}
                  <div className="flex items-center gap-2 text-sm">
                    <img src={calendar} className="w-5 h-5" />
                    <span>
                      Expiry:{" "}
                      <span className="font-semibold text-[#343079]">
                        {item.jobData?.application_deadline
                          ? item.jobData.application_deadline
                          : "N/A"}
                      </span>
                    </span>
                  </div>

                  {/* Applications */}
                  <div className="flex items-center gap-2 text-sm">
                    <img src={applicationsIcon} className="w-5 h-5" />
                    <span>
                      Applications:{" "}
                      <span className="font-semibold text-[#343079]">
                        {item.match || 0}
                      </span>
                    </span>
                  </div>

                  {/* Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                      ${getStatusColor(item.posting_status)}`}
                  >
                    Status: {item.posting_status}
                  </span>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-2">
                    <button className="flex-1 bg-[#343079] text-white px-5 py-2 rounded-md text-sm">
                      Edit
                    </button>
                    <button className="flex-1 border border-[#343079] text-[#343079] px-5 py-2 rounded-md text-sm">
                      View Applications
                    </button>
                  </div>
                </div>
              ))}

              {jobs.length === 0 && !loading && (
                <p className="text-center w-full text-gray-500">No jobs found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobposts;
