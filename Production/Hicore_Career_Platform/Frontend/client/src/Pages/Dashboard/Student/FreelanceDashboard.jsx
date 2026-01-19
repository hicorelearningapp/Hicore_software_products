import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import JobBoard from "../../../Pages/Services/ApplyForJobs/JobBoard";
import JobFilterPanel from "../../../Pages/Services/ApplyForJobs/JobFilterPanel";

const FreelanceDashboard = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(false);
  const filterRef = useRef(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://hicore.pythonanywhere.com/api/search?q=${searchValue}`);
      const data = await res.json();
      setJobData(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchValue.trim() !== "") {
      fetchJobs();
    }
  };

  const handleSearchClick = () => {
    if (searchValue.trim() !== "") {
      fetchJobs();
    }
  };

  // Close filter panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  return (
    <div className="min-h-screen border border-blue-900 rounded-lg m-4 bg-[#fdfdfd] relative">
     {showFilter && (
  <>
    {/* Dull gray-white transparent background */}
    <div className="fixed inset-0 bg-[#f3f4f6]/90 backdrop-blur-md z-40" />

    {/* Fixed filter panel on top center */}
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full px-4 z-50">
      <div
        ref={filterRef}
        className="w-full max-w-5xl mx-auto mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-300"
      >
        <JobFilterPanel />
      </div>
    </div>
  </>
)}



      {/* Header and Search */}
      <div className="flex flex-col items-center mt-6 justify-start px-4 text-center ">
        

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-6xl bg-white border border-gray-300 rounded-md 
          px-4 py-3 shadow-sm focus-within:border-blue-900 transition-colors duration-200">
          <FaSearch className="text-gray-500  mr-3 cursor-pointer" onClick={handleSearchClick} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for roles, companies, skills......"
            className="flex-grow font-light text-sm md:text-xl outline-none bg-transparent
             text-gray-500 placeholder-gray-400"
          />
          <FaSlidersH className="text-gray-400 ml-3 cursor-pointer" onClick={() => setShowFilter(true)} />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-indigo-600 text-md mt-10">
          Searching for jobs, please wait...
        </div>
      )}

      {/* Job Results */}
      {showResults && !loading && (
        <div className="mt-10 ml-10 mr-8 px-4">
          <JobBoard jobs={jobData} />
        </div>
      )}
    </div>
  );
};

export default FreelanceDashboard;
