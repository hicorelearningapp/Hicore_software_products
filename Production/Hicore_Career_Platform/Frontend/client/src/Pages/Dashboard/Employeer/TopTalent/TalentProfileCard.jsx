// src/components/TalentProfileCard.jsx
import React from "react";
import { FiEye, FiBookmark, FiMapPin, FiBriefcase } from "react-icons/fi";

const TalentProfileCard = ({ profile }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl mx-auto mt-10 shadow-md p-5 w-full max-w-[480px] hover:shadow-lg transition">
      {/* Top Section: Image + Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left: Portrait */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-[160px] h-[200px] object-cover rounded-xl"
          />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h4 className="text-[#2b2b5f] font-bold text-lg leading-snug">
              {profile.name}
            </h4>
            <p className="text-gray-400 text-sm mt-1">{profile.company}</p>
            <p className="text-[#2b2b5f] font-semibold text-sm mt-1">
              {profile.role}
            </p>
          </div>

          {/* Quick Facts */}
          <div className="mt-3 space-y-2 text-sm text-[#2b2b5f]">
            <div className="flex items-center gap-2">
              <FiMapPin size={14} className="text-gray-500" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiBriefcase size={14} className="text-gray-500" />
              <span>{profile.experience}</span>
            </div>
            {profile.activelyLooking && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-600" />
                <span className="text-[#236e3e] text-xs font-medium">
                  Actively looking
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Match Score + Description */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="inline-block bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full self-start">
          {profile.matchScore} Match
        </span>
      </div>

      <p className="mt-3 text-[#2b2b5f] text-[15px] leading-6">
        {profile.description}
      </p>

      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-2">
        {profile.skills?.map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 text-xs rounded-full bg-[#eef2ff] text-[#2b2b5f] font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex gap-3">
        <button className="flex-1 py-2.5 rounded-lg border border-[#4631A1] text-[#4631A1] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#f3f1ff] active:scale-95 transition">
          <FiEye size={16} />
          View Profile
        </button>
        <button className="flex-1 py-2.5 rounded-lg bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white text-sm font-medium flex items-center justify-center gap-2 ">
          <FiBookmark size={16} />
          Shortlist
        </button>
      </div>
    </div>
  );
};

export default TalentProfileCard;
