// src/components/AishortlistCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import locationIcon from "../../../assets/Employer/CandidateProfile/location.png";
import experienceIcon from "../../../assets/Employer/CandidateProfile/work.png";
import bookmarkIcon from "../../../assets/Employer/CandidateProfile/save.png";
import eyeicon from "../../../assets/Employer/CandidateProfile/Eye.png";
import tickicon from "../../../assets/Employer/CandidateProfile/Correct.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const AishortlistCard = ({ candidate }) => {
  const navigate = useNavigate();

  // 🚨 IMPORTANT: Prevent crash if candidate is undefined
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  // If profile_image missing, show fallback
  const imageUrl = candidate.profile_image
    ? `${API_BASE}/${candidate.profile_image}`
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <div className="flex flex-col justify-between h-[500px] p-5 border border-[#C0BFD5] rounded-lg hover:shadow-lg transition-shadow">

      {/* === Top Section === */}
      <div className="flex gap-5">
        <img
          src={imageUrl}
          alt={candidate?.name || "Candidate"}
          className="w-1/2 h-[190px] rounded-lg border object-cover"
        />

        <div className="w-1/2 flex flex-col gap-2">
          <h6 className="font-bold text-[16px] text-[#343079]">
            {candidate?.name || "Unknown Name"}
          </h6>

          <p className="font-semibold text-[14px] text-[#343079]">
            {candidate?.title || "Role not specified"}
          </p>

          <div className="flex items-center gap-2">
            <img src={locationIcon} className="w-4 h-4" alt="" />
            <span className="text-[14px]">
              {candidate?.location || "India"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img src={experienceIcon} className="w-4 h-4" alt="" />
            <span className="text-[14px]">
              {(candidate?.experience_years ?? 0) + " years"}
            </span>
          </div>
        </div>
      </div>

      {/* === Match + Save === */}
      <div className="flex items-center justify-between mt-3">
        <div className="bg-green-600 text-white rounded-full px-4 py-1 text-sm">
          {Math.round(candidate?.match_score || 0)}% Match
        </div>

        <img src={bookmarkIcon} alt="Bookmark" className="w-6 h-6 cursor-pointer" />
      </div>

      {/* === Bio === */}
      <p className="text-[15px] text-[#343079] leading-[22px] mt-2 line-clamp-3">
        {candidate?.professional_bio ||
          "Professional bio not available."}
      </p>

      {/* === Skills === */}
      <div className="flex flex-wrap gap-2 mt-2">
        {candidate?.skills?.length > 0 ? (
          candidate.skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-[#F0F7FF] text-[#3F6699] rounded-full px-4 py-1 text-sm"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">No skills listed</span>
        )}
      </div>

      {/* === Buttons === */}
      <div className="flex flex-row gap-2 mt-6">
        <button
          onClick={() =>
            navigate(`/view-top-talent/${candidate?.user_id || ""}`)
          }
          className="flex flex-row w-1/2 h-[40px] items-center justify-center cursor-pointer gap-2 border border-[#343079] rounded-lg hover:bg-[#F4F3FF] transition"
        >
          <img src={eyeicon} alt="eye" className="w-[20px] h-[20px]" />
          <h2 className="text-[14px] font-semibold text-[#343079]">
            Profile
          </h2>
        </button>

        <button className="flex flex-row w-1/2 h-[40px] items-center justify-center gap-2 bg-[#343079] rounded-lg hover:bg-[#2b276a] transition">
          <img src={tickicon} alt="tick" className="w-[20px] h-[20px]" />
          <h2 className="text-[14px] font-semibold text-white">
            Shortlist
          </h2>
        </button>
      </div>
    </div>
  );
};

export default AishortlistCard;
