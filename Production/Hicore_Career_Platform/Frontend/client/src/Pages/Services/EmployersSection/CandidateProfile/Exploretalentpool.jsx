import React, { useState } from "react";
import backArrow from "../../../../assets/back-arrow.png";
import find from "../../../../assets/Employer/CandidateProfile/find.png";
import { Search } from "lucide-react";
import jobIcon from "../../../../assets/Employer/CandidateProfile/work.png";
import skillIcon from "../../../../assets/Employer/CandidateProfile/skill.png";
import locationIcon from "../../../../assets/Employer/CandidateProfile/location.png";
import starIcon from "../../../../assets/Employer/CandidateProfile/stars.png";
import sortIcon from "../../../../assets/Employer/CandidateProfile/sort.png";
import workhistoryIcon from "../../../../assets/Employer/CandidateProfile/work-history.png";
import settingsIcon from "../../../../assets/Employer/CandidateProfile/settings.png";
import timeIcon from "../../../../assets/Employer/CandidateProfile/time.png";
import profitIcon from "../../../../assets/Employer/CandidateProfile/profit.png";
import ViewCandidateProfile from "./Viewcandidateprofile";
import { useNavigate } from "react-router-dom";

const Exploretalentpool = () => {
  const navigate = useNavigate();
  const [isOn, setIsOn] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    jobTitle: "",
    skills: "",
    location: "",
    aiScore: false,
    sortBy: "",
    jobType: [],
    jobPreference: [],
    experience: 0,
    salary: 0,
  });

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  };

  // Handle click for Experience & Salary slider line (same visual)
  const handleSliderClick = (e, key) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max(x / rect.width, 0), 1);
    const value = Math.round(percentage * 25); // 0–25 range
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full h-auto pt-9 pr-16 pb-9 pl-16 bg-white opacity-100">
      {/* Back row */}
      <div className="w-full h-8 flex items-center opacity-100">
        <img
          src={backArrow}
          alt="Back"
          onClick={() => navigate(-1)}
          className="w-6 h-6 opacity-100 cursor-pointer"
        />
        <span className="ml-2 font-poppins font-normal text-base leading-8 text-[#343079]">
          Back
        </span>
      </div>

      {/* Center image */}
      <div className="flex justify-center items-center mt-4">
        <img
          src={find}
          alt="Centered"
          className="w-[259.39px] h-[159.77px] opacity-100"
        />
      </div>

      {/* Heading */}
      <div className="flex justify-center items-center mt-4">
        <h1 className="text-[#343079] font-poppins font-normal text-[28px] leading-[56px]">
          Find Top Talent Faster
        </h1>
      </div>

      {/* Paragraph */}
      <div className="flex justify-center items-center mt-2 text-center">
        <p className="text-[#343079] font-poppins text-[18px] leading-[28px]">
          Instantly browse, filter, and connect with candidates who meet your
          exact hiring needs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-[1307.7px] h-[120px] mt-8 mx-auto px-[100px] py-9 flex items-center gap-9 rounded-lg bg-[#F0F7FF]">
        <div className="w-full h-12 flex items-center justify-between px-4 py-2 rounded-lg border border-[#A4A2B3]">
          <div className="flex items-center w-full">
            <Search size={16} color="#A4A2B3" className="mr-3" />
            <input
              type="text"
              placeholder="Search for profiles, roles, skills..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full border-none outline-none text-[#343079] font-poppins text-base placeholder-[#A4A2B3]"
            />
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="w-full max-w-[1307.7px] mx-auto mt-8 flex">
        {/* Left Filter Panel */}
        <div className="w-[290px] h-[1160px] p-4 flex flex-col gap-4 border border-[#C0BFD5] rounded-tl-lg rounded-bl-lg overflow-y-auto">
          {/* Job Title */}
          <div className="w-full h-24 gap-2 p-2 rounded-lg bg-white">
            <div className="flex items-center gap-2 w-[92px] h-8">
              <img src={jobIcon} alt="Job Icon" className="w-6 h-6" />
              <span className="font-poppins font-semibold text-[14px] text-[#343079]">
                Job Title
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter job title"
              value={filters.jobTitle}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, jobTitle: e.target.value }))
              }
              className="w-full mt-2 p-2 border border-[#CBCDCF] rounded-lg text-sm"
            />
          </div>

          {/* Skills */}
          <div className="w-full h-24 gap-2 p-2 rounded-lg bg-white">
            <div className="flex items-center gap-2">
              <img src={skillIcon} alt="Skill Icon" className="w-6 h-6" />
              <span className="font-poppins font-semibold text-[14px] text-[#343079]">
                Skills
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter skills"
              value={filters.skills}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, skills: e.target.value }))
              }
              className="w-full mt-2 p-2 border border-[#CBCDCF] rounded-lg text-sm"
            />
          </div>

          {/* Location */}
          <div className="w-full h-24 gap-2 p-2 rounded-lg bg-white">
            <div className="flex items-center gap-2">
              <img src={locationIcon} alt="Location Icon" className="w-6 h-6" />
              <span className="font-poppins font-semibold text-[14px] text-[#343079]">
                Location
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter location"
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              className="w-full mt-2 p-2 border border-[#CBCDCF] rounded-lg text-sm"
            />
          </div>

          {/* AI Toggle */}
          <div className="w-full p-2 rounded-lg bg-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={starIcon} alt="Star" className="w-6 h-6" />
              <span className="font-poppins font-semibold text-[14px] text-[#343079]">
                Resume with AI Score
              </span>
            </div>
            <div
              onClick={() =>
                setIsOn((prev) => {
                  setFilters((f) => ({ ...f, aiScore: !prev }));
                  return !prev;
                })
              }
              className={`w-[54px] border border-[#C0BFD5] rounded-full flex items-center cursor-pointer ${
                isOn ? "bg-green-500 justify-end" : "bg-white justify-start"
              }`}
            >
              <div className="w-[20px] h-[20px] bg-[#C0BFD5] rounded-full"></div>
            </div>
          </div>

          {/* Sort By */}
          <div className="w-full p-2 rounded-lg bg-white">
            <div className="flex items-center gap-2">
              <img src={sortIcon} alt="Sort" className="w-6 h-6" />
              <span className="font-semibold text-[14px] text-[#343079]">
                Sort By
              </span>
            </div>
            <div className="w-full px-8 flex flex-col mt-2">
              {["Relevance", "Latest", "Best Match"].map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sortBy"
                    checked={filters.sortBy === opt}
                    onChange={() =>
                      setFilters((prev) => ({ ...prev, sortBy: opt }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-[14px] text-[#343079]">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Type */}
          <div className="w-full p-2 rounded-lg bg-white">
            <div className="flex items-center gap-2">
              <img src={workhistoryIcon} alt="Job Type" className="w-6 h-6" />
              <span className="font-semibold text-[14px] text-[#343079]">
                Job Type
              </span>
            </div>
            <div className="w-full px-8 flex flex-col gap-[8px] mt-2">
              {["Full time", "Part time", "Freelance"].map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.jobType.includes(opt)}
                    onChange={() => handleCheckboxChange("jobType", opt)}
                    className="w-4 h-4"
                  />
                  <span className="text-[14px] text-[#343079]">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Preference */}
          <div className="w-full p-2 rounded-lg bg-white">
            <div className="flex items-center gap-2">
              <img src={settingsIcon} alt="Pref" className="w-6 h-6" />
              <span className="font-semibold text-[14px] text-[#343079]">
                Job Preference
              </span>
            </div>
            <div className="w-full px-8 flex flex-col gap-[10px] mt-2">
              {["Onsite", "Hybrid", "Remote"].map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.jobPreference.includes(opt)}
                    onChange={() => handleCheckboxChange("jobPreference", opt)}
                    className="w-4 h-4"
                  />
                  <span className="text-[14px] text-[#343079]">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Filter (unchanged design) */}
          <div
            className="w-full h-fit gap-2 p-2 rounded-lg bg-white"
            onClick={(e) => handleSliderClick(e, "experience")}
          >
            <div className="flex items-center gap-2">
              <img src={timeIcon} alt="Exp" className="w-6 h-6" />
              <span className="font-semibold text-[14px] text-[#343079]">
                Experience
              </span>
            </div>
            <div className="w-full pl-6 pt-8 relative mt-3">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#C0BFD5]"></div>
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] h-[12px] bg-[#C0BFD5] absolute top-1/2"
                  style={{
                    left: `${(i / 8) * 100}%`,
                    transform: "translateY(-50%)",
                  }}
                ></div>
              ))}
              <div
                className="w-[16px] h-[16px] bg-[#343079] rounded-full absolute top-1/2 -translate-y-1/2"
                style={{ left: `${(filters.experience / 25) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[12px] text-[#343079] mt-1">
              <span>0</span>
              <span>{filters.experience}+ years</span>
            </div>
          </div>

          {/* Salary Filter (unchanged design) */}
          <div
            className="w-full h-fit gap-2 p-2 rounded-lg bg-white"
            onClick={(e) => handleSliderClick(e, "salary")}
          >
            <div className="flex items-center gap-2">
              <img src={profitIcon} alt="Salary" className="w-6 h-6" />
              <span className="font-semibold text-[14px] text-[#343079]">
                Salary Range
              </span>
            </div>
            <div className="w-full pl-6 pt-8 relative mt-3">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#C0BFD5]"></div>
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] h-[12px] bg-[#C0BFD5] absolute top-1/2"
                  style={{
                    left: `${(i / 8) * 100}%`,
                    transform: "translateY(-50%)",
                  }}
                ></div>
              ))}
              <div
                className="w-[16px] h-[16px] bg-[#343079] rounded-full absolute top-1/2 -translate-y-1/2"
                style={{ left: `${(filters.salary / 25) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[12px] text-[#343079] mt-1">
              <span>0</span>
              <span>{filters.salary}+ LPA</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 h-[1160px] p-4 gap-4 border-t border-r border-b border-[#C0BFD5] rounded-tr-lg rounded-br-lg overflow-x-auto">
          <ViewCandidateProfile filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Exploretalentpool;
