import React from "react";
import {
  FaBriefcase,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRegBookmark,
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const JobCard = ({ job, selected, onClick }) => {
  // ✅ Normalize API fields
  const {
    title = "Untitled Role",
    company_name = "Unknown Company",
    company_logo = "",
    location = "Not specified",
    location_type = "",
    salary_min_lpa = "",
    salary_max_lpa = "",
    experience_min_years = "",
    experience_max_years = "",
    application_deadline = "",
  } = job || {};

  // ✅ Format Experience
  const formatExperience = () => {
    if (!experience_min_years && !experience_max_years) return "Not specified";
    const min = experience_min_years ? `${experience_min_years} yr` : "";
    const max = experience_max_years ? `${experience_max_years} yr` : "";
    return min && max ? `${min} - ${max}` : min || max;
  };

  // ✅ Format Salary
  const formatSalary = () => {
    if (!salary_min_lpa && !salary_max_lpa) return "Not disclosed";
    const min = salary_min_lpa ? `₹${salary_min_lpa}` : "";
    const max = salary_max_lpa ? `₹${salary_max_lpa}` : "";
    return min && max ? `${min} - ${max} LPA` : min || max;
  };

  // ✅ Format Date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ Build Proper Logo URL
  const getFullLogoUrl = (path) => {
    if (!path) return null;

    // If already a full URL
    if (path.startsWith("http") || path.startsWith("blob:")) return path;

    // If backend returns path like "app/uploads/...", remove "app/"
    const cleanPath = path.replace(/^app\//, "").replace(/^\/+/, "");

    // Ensure no double slashes
    const base = API_BASE.replace(/\/+$/, "");

    return `${base}/${cleanPath}`;
  };

  const logoUrl = getFullLogoUrl(company_logo);

  return (
    <div
      onClick={() => onClick(job)}
      className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer
      ${
        selected
          ? "border-[#343079] bg-[#F7F7FF] shadow-md"
          : "border-gray-200 hover:border-[#343079]/50 hover:shadow-md"
      }
      `}
      style={{ marginBottom: "20px" }}
    >
      {/* ===== Header ===== */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-[#343079] mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-[#65629E] text-sm font-medium mb-2">
            {company_name}
          </p>
          <p className="flex items-center gap-2 text-sm text-[#343079]/80">
            <FaMapMarkerAlt className="text-[#A4A2B3]" />
            {location}
            {location_type && ` (${location_type})`}
          </p>
        </div>

        {/* ✅ Company Logo */}
        {logoUrl && (
          <img
            src={logoUrl}
            alt={company_name}
            className="w-12 h-12 object-contain rounded-md border border-gray-100"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
      </div>

      {/* ===== Job Highlights ===== */}
      <div className="flex flex-wrap gap-4 text-sm text-[#343079] mt-4">
        <div className="flex items-center gap-2">
          <FaBriefcase className="text-[#A4A2B3]" />
          <span>{formatExperience()}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-[#A4A2B3]" />
          <span>{formatSalary()}</span>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-[#6B6B9E]">
          <FaCalendarAlt />
          <span>Apply Before: {formatDate(application_deadline)}</span>
        </div>
        <FaRegBookmark className="text-[#A4A2B3] hover:text-[#343079] cursor-pointer" />
      </div>
    </div>
  );
};

export default JobCard;
