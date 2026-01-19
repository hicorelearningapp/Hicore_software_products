import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  internshipList as staticInternships,
  domainOptions as staticDomains,
  locationOptions as staticLocations,
  stipendOptions as staticStipends,
  durationOptions as staticDurations,
} from "../../../../../../data/Internship";
import InternshipDetails from "../../../../Services/Internship Opportunities/InternshipDetails";
import InternshipItems from "./IntershipItems";

const Filter = ({ label, options, value, onChange }) => (
  <div className="flex items-center gap-[8px]">
    <label className="text-[#343079] font-medium text-sm">{label}</label>
    <select
      className="w-[140px] md:w-[180px] h-[36px] md:h-[40px] border border-[#CBCDCF] rounded px-2 text-sm text-[#343079] outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select Option</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const InternshipJobseeker = () => {
  const navigate = useNavigate();
  const [internshipList, setInternshipList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [domainOptions, setDomainOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [stipendOptions, setStipendOptions] = useState([]);
  const [durationOptions, setDurationOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStipend, setSelectedStipend] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);

  // ✅ new state for profile preference filter
  const [filterByProfile, setFilterByProfile] = useState(false);

  useEffect(() => {
    setInternshipList(staticInternships);
    setDomainOptions(staticDomains);
    setLocationOptions(staticLocations);
    setStipendOptions(staticStipends);
    setDurationOptions(staticDurations);
    if (staticInternships.length > 0) {
      setSelectedJob(staticInternships[0]);
    }
  }, []);

  const filteredInternships = internshipList.filter((job) => {
    const matchesSearchTerm =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilters =
      (!selectedDomain || job.domain === selectedDomain) &&
      (!selectedLocation || job.location === selectedLocation) &&
      (!selectedStipend || job.stipend === selectedStipend) &&
      (!selectedDuration || job.duration === selectedDuration) &&
      (!remoteOnly || job.remote);

    // ✅ Here you can add logic for filterByProfile later if needed
    return matchesSearchTerm && matchesFilters;
  });

  return (
    <div className="border border-[#343079] rounded-lg m-4">
      {/* Content */}
      <div className="w-full px-4 ">
        {/* Search and Filters */}
        <div className="flex flex-col gap-[24px] md:gap-[36px] mb-[24px] md:mb-[36px] ">
          <div className="flex flex-col md:flex-row items-center mt-6 w-full bg-[#F0F7FF] px-4 md:px-[100px] py-[16px] rounded-[8px] gap-[16px] md:gap-[36px]">
            <div className="flex-grow w-full flex items-center rounded-[8px] border border-[#A4A2B3] px-[16px] py-[8px]">
              <FaSearch className="w-[20px] md:w-[24px] h-[20px] md:h-[24px] text-[#A4A2B3]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for roles, companies, skills..."
                className="ml-2 md:ml-[8px] w-full text-[#A4A2B3] text-[14px] md:text-[16px] bg-transparent outline-none placeholder:text-[#A4A2B3]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 justify-center border-b border-[#343079] pb-4">
            <Filter
              label="Domain"
              options={domainOptions}
              value={selectedDomain}
              onChange={setSelectedDomain}
            />
            <Filter
              label="Location"
              options={locationOptions}
              value={selectedLocation}
              onChange={setSelectedLocation}
            />
            <Filter
              label="Stipend"
              options={stipendOptions}
              value={selectedStipend}
              onChange={setSelectedStipend}
            />
            <Filter
              label="Duration"
              options={durationOptions}
              value={selectedDuration}
              onChange={setSelectedDuration}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-fit gap-[24px] px-4 md:px-[50px] py-[12px] md:gap-[36px]">
        <div className="w-full lg:w-1/3 h-full overflow-y-auto pr-0 md:pr-2">
          {/* ✅ Filter by Profile Toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Filter by my profile preferences
            </span>

            <button
              onClick={() => setFilterByProfile(!filterByProfile)}
              className={`w-[58px] h-[28px] flex items-center rounded-full border border-[#C0BFD5] px-[4px] transition-colors duration-300 ${
                filterByProfile ? "bg-green-500" : "bg-[#C0BFD5]"
              }`}
            >
              <div
                className={`w-[20px] h-[20px] rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  filterByProfile ? "translate-x-[30px]" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Internship Items */}
          {filteredInternships.map((job) => (
            <InternshipItems
              key={job.id}
              job={job}
              isSelected={selectedJob?.id === job.id}
              onClick={() => setSelectedJob(job)}
            />
          ))}
        </div>

        <div className="w-full lg:w-2/3 h-full overflow-y-auto">
          {selectedJob && <InternshipDetails job={selectedJob} />}
        </div>
      </div>
    </div>
  );
};

export default InternshipJobseeker;
