// src/components/TalentProfileCard.jsx
import React from "react";
import { FiEye, FiBookmark, FiMapPin, FiBriefcase } from "react-icons/fi";

const TalentProfileCard = ({ profile }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 w-full">
      {/* Top: Image (left) + details (right) */}
      <div className="flex gap-6">
        {/* Left: Portrait */}
        <div className="flex-shrink-0">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-[210px] h-[250px] object-cover rounded-xl"
          />
        </div>

        {/* Right: Header & quick facts */}
        <div className="flex flex-col justify-between">
          <div>
            <h4 className="text-[#2b2b5f] font-bold text-xl leading-7">
              {profile.name}
            </h4>
            <p className="text-gray-400 text-md mt-2">{profile.company}</p>
            <p className="text-[#2b2b5f] font-semibold text-md mt-2">
              {profile.role}
            </p>
          </div>

          {/* Location / Experience / Actively looking */}
          <div className="mt-4 space-y-3 text-sm text-[#2b2b5f]">
            <div className="flex items-center gap-2">
              <FiMapPin size={16} className="text-gray-500" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiBriefcase size={16} className="text-gray-500" />
              <span>{profile.experience}</span>
            </div>
            {profile.activelyLooking && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-green-600" />
                <span className="text-[#236e3e]">Actively looking for job</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Match score pill (below the header area, left-aligned) */}
      <div className="mt-4">
        <span className="inline-block bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full">
          {profile.matchScore} Match
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-[#2b2b5f] text-[16px] leading-7">
        {profile.description}
      </p>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-3">
        {profile.skills?.map((skill, idx) => (
          <span
            key={idx}
            className="px-4 py-2 text-sm rounded-full bg-[#eef2ff] text-[#2b2b5f]"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-5 flex gap-3">
        <button className="flex-1 py-3 rounded-xl border border-[#4631A1] text-[#4631A1] text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-[#f3f1ff]">
          <FiEye className="text-current" />
          View Full Profile
        </button>
        <button className="flex-1 py-3 rounded-xl bg-[#4631A1] text-white text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-[#38258a]">
          <FiBookmark className="text-current" />
          Save to Shortlist
        </button>
      </div>
    </div>
  );
};

export default TalentProfileCard;
