import React, { useState } from "react";
import shortlistedData from "./RejectedData";
import pinIcon from "../../../../assets/EmployeerDashboard/EmployerApplication/pin.png";
import briefcaseIcon from "../../../../assets/EmployeerDashboard/EmployerApplication/briefcase.png";
import eyeIcon from "../../../../assets/EmployeerDashboard/EmployerApplication/eye.png";
import bookmarkIcon from "../../../../assets/EmployeerDashboard/EmployerApplication/bookmark.png";

export default function Rejected() {
  const [roleFilter, setRoleFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [aiMatchOnly, setAiMatchOnly] = useState(false);

  // destructure meta and candidates from the data file
  const { totalRejected, ribbonLabel, candidates } = shortlistedData;

  const filtered = candidates.filter((c) => {
    if (aiMatchOnly && c.matchPercent < 70) return false;
    if (roleFilter && !c.role.toLowerCase().includes(roleFilter.toLowerCase()))
      return false;
    if (
      experienceFilter &&
      !c.experience.toLowerCase().includes(experienceFilter.toLowerCase())
    )
      return false;
    if (
      statusFilter &&
      !c.status.toLowerCase().includes(statusFilter.toLowerCase())
    )
      return false;
    if (
      locationFilter &&
      !c.location.toLowerCase().includes(locationFilter.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="p-6 min-h-screen text-gray-100">
      {/* Top filter row */}
      <div className="bg-transparent border border-transparent rounded-lg px-2 pb-4 mb-6">
        <div className="flex flex-wrap items-center gap-4 border-b border-[#343079] pb-4">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#343079]">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="ml-2 bg-white text-sm text-gray-700 px-3 py-2 rounded shadow-sm"
            >
              <option value="">Select option</option>
              <option>Data Analyst</option>
              <option>Frontend Developer</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#343079]">Experience</label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="ml-2 bg-white text-sm text-gray-700 px-3 py-2 rounded shadow-sm"
            >
              <option value="">Select option</option>
              <option>1 year</option>
              <option>2 years</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#343079]">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ml-2 bg-white text-sm text-gray-700 px-3 py-2 rounded shadow-sm"
            >
              <option value="">Select option</option>
              <option>Actively looking</option>
              <option>Not looking</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#343079]">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="ml-2 bg-white text-sm text-gray-700 px-3 py-2 rounded shadow-sm"
            >
              <option value="">Select option</option>
              <option>Bengaluru</option>
              <option>Hyderabad</option>
            </select>
          </div>

          {/* AI Match Toggle */}
          <div className="ml-auto flex items-center gap-3">
            <label className="text-sm text-[#343079]">AI Match %</label>
            <button
              onClick={() => setAiMatchOnly((s) => !s)}
              className={`w-12 h-6 rounded-full p-0.5 transition ${
                aiMatchOnly ? "bg-[#3D2C8D]" : "bg-gray-300"
              }`}
              aria-pressed={aiMatchOnly}
              title="Toggle AI match filter"
            >
              <div
                className={`h-5 w-5 rounded-full bg-white transform transition ${
                  aiMatchOnly ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl text-left font-semibold text-[#FF0000] mb-6">
        {totalRejected} Applications {ribbonLabel}
      </h2>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="relative bg-white rounded-xl shadow-md border border-gray-200 p-6"
          >
            {/* Ribbon badge */}
            <div className="absolute top-4 right-0">
              <span className="bg-[#FF0000] rounded-tl-full rounded-bl-full text-[#FFFFFF] px-4 py-2 text-sm font-medium whitespace-nowrap">
                {ribbonLabel}
              </span>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mt-2">
              <img
                src={c.avatar}
                alt={c.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>

            {/* Name + Match Badge */}
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h3 className="text-[#2E235E] font-semibold text-lg">
                  {c.name}
                </h3>
                <p className="text-gray-400 text-sm">{c.company}</p>
                <p className="text-[#2E235E] font-semibold mt-1 whitespace-nowrap truncate max-w-[160px]">
                  {c.role}
                </p>
              </div>

              <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium h-fit whitespace-nowrap">
                {c.matchPercent}% AI Match
              </span>
            </div>

            {/* Location & Experience */}
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <img src={pinIcon} alt="location" className="w-4 h-4" />
                <span>{c.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <img src={briefcaseIcon} alt="experience" className="w-4 h-4" />
                <span>{c.experience}</span>
              </div>
            </div>

            {/* Status */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <span className="text-gray-600">{c.status}</span>
            </div>

            {/* Skills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {c.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="bg-[#EEF5FF] text-[#4B6A93] text-xs px-3 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 border border-[#2E235E] rounded-md py-2 flex items-center justify-center gap-2 text-[#2E235E]">
                <img src={eyeIcon} alt="view profile" className="w-4 h-4" />
                <span className="text-sm font-medium">Profile</span>
              </button>

              <button className="flex-1 bg-[#3D2C8D] text-white rounded-md py-2 flex items-center justify-center gap-2">
                <img src={bookmarkIcon} alt="save" className="w-4 h-4" />
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">
            No candidates match the filters.
          </div>
        )}
      </div>
    </div>
  );
}
