// src/components/Internships/InternshipItem.jsx
import React from "react";
import { FaMapMarkerAlt, FaMoneyBillAlt, FaCalendarAlt } from "react-icons/fa";
import Save from "../../../assets/Save.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// ✅ Helper — Build a clean full URL for logos
const getFullLogoUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const cleanPath = path.replace(/^app\//, "").replace(/^\/+/, "");
  const base = API_BASE.replace(/\/+$/, "");
  return `${base}/${cleanPath}`;
};

const InternshipItem = ({ job, onClick, isSelected }) => {
  if (!job) return null;

  const {
    title = "Untitled Internship",
    company_name = "Unknown Company",
    company_logo = "",
    location = "Not specified",
    stipend = "Unpaid",
    duration = "Not specified",
    postedAgo = "N/A",
  } = job;

  const logoUrl = getFullLogoUrl(company_logo);

  return (
    <div
      onClick={onClick}
      className={`p-4 mb-4 rounded-xl border cursor-pointer transition-all font-[Poppins] ${
        isSelected
          ? "bg-[#F7F7FF] border-[#343079] shadow-md"
          : "bg-white border-[#E6E6E6] hover:border-[#343079]/50 hover:shadow-md"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* ===== Left Section ===== */}
        <div className="flex-1">
          <h3 className="text-[#343079] font-semibold text-base md:text-lg mb-1">
            {title}
          </h3>
          <p className="text-sm text-[#3B82F6] font-medium mb-2">
            {company_name}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm text-[#343079]">
            <FaCalendarAlt className="text-xs" />
            <span>{duration}</span>

            <FaMoneyBillAlt className="text-xs ml-3" />
            <span>{stipend}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#343079] mt-1">
            <FaMapMarkerAlt className="text-xs" />
            <span>{location}</span>
          </div>
        </div>

        {/* ===== Company Logo ===== */}
        {logoUrl && (
          <img
            src={logoUrl}
            alt={company_name}
            className="h-10 w-10 object-contain rounded-md border border-gray-100"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
      </div>

      {/* ===== Footer Section ===== */}
      <div className="flex items-center justify-between mt-3 border-t border-gray-100 pt-2">
        <p className="text-[12px] text-[#A0A0A0]">Posted {postedAgo}</p>
        <img src={Save} alt="save" className="h-5 w-5 object-contain" />
      </div>
    </div>
  );
};

export default InternshipItem;
