import React, { useState, useMemo, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import JobCard from "./jobCard";
import JobDetails from "./JobDetails";
import null_image from "../../../assets/Null_image.png";
import applyforjobsicon from "../../../assets/ApplyforJobs/applyforjobs.png";

const JobBoard = ({ jobs = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // ✅ Auto-select the first job initially
  useEffect(() => {
    if (jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs]);

  // ✅ Filter jobs based on title, company, or skills
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const titleMatch = job.title
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const companyMatch = job.company_name
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 🧠 Safely handle skills (can be array of strings or objects)
      const skillsArray =
        Array.isArray(job.skills)
          ? job.skills
          : Array.isArray(job.must_have_skills)
          ? job.must_have_skills
          : [];

      const skillMatch = skillsArray.some((skill) => {
        if (!skill) return false;
        if (typeof skill === "string") {
          return skill.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof skill === "object" && skill.name) {
          return skill.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });

      return !searchTerm || titleMatch || companyMatch || skillMatch;
    });
  }, [jobs, searchTerm]);

  // ✅ Auto-update selection when list changes
  useEffect(() => {
    if (filteredJobs.length > 0) {
      if (
        !selectedJob ||
        !filteredJobs.some((job) => job.id === selectedJob.id)
      ) {
        setSelectedJob(filteredJobs[0]);
      }
    } else {
      setSelectedJob(null);
    }
  }, [filteredJobs]);

  return (
    <div className="flex flex-col w-full min-h-screen font-poppins overflow-x-hidden  gap-6">
      <div className="flex flex-col gap-4 items-center justify-center px-[100px]">
      <img src={applyforjobsicon} alt="apply" className="w-[398px] h-[174px]"/>
      <h1 className="text-[#343079] font-regular text-[36px]">
        Smart Search. Fast Apply. Bright Future
      </h1>
      <p className="text-[#343079] font-regular text-[18px]">
        Unlock curated job matches and apply in seconds.
      </p>
      
      {/* 🔍 Search Bar */}
      <div className="flex items-center w-full border border-[#A4A2B3] px-2 py-[16px] rounded-[8px] mb-[36px]">
        <FaSearch className="w-[20px] md:w-[24px] h-[20px] md:h-[24px] text-[#A4A2B3]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for roles, companies, or skills..."
          className="ml-2 md:ml-[8px] w-full text-[#343079] text-[14px] md:text-[16px] bg-transparent outline-none placeholder:text-[#A4A2B3]"
        />
      </div>
      </div>

      {/* ===== List + Details Section ===== */}
      <div className="flex flex-col lg:flex-row gap-[24px] md:gap-[36px]">
        {/* ===== Left Panel - Job List ===== */}
        <div className="w-full lg:w-1/3 max-h-[80vh] overflow-y-auto pr-1 scrollbar-hide">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                selected={selectedJob?.id === job.id}
                onClick={setSelectedJob}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center mt-16">
              <img
                src={null_image}
                alt="No Jobs"
                className="w-60 opacity-80 mb-4"
              />
              <p className="text-[#A4A2B3] text-[15px]">
                No jobs found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* ===== Right Panel - Job Details ===== */}
        <div className="w-full lg:w-2/3 border border-blue-900 p-6 rounded-md bg-white min-h-[400px]">
          {selectedJob ? (
            <JobDetails job={selectedJob} />
          ) : (
            <div className="text-center text-[#A4A2B3] mt-20">
              Select a job to view more details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
