// src/components/Internships/OpenInternships.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import axios from "axios";

import bannerImage from "../../../assets/browse_open_internship.jpg";
import openinternshipimg from "../../../assets/internship.png";
import InternshipDetails from "./InternshipDetails";
import InternshipItem from "./InternshipItem";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// ✅ Helper: Safely build logo URL
const getFullLogoUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;

  const cleanPath = path.replace(/^app\//, "").replace(/^\/+/, "");
  const base = API_BASE.replace(/\/+$/, "");
  return `${base}/${cleanPath}`;
};

const OpenInternships = () => {
  const navigate = useNavigate();

  const [internshipList, setInternshipList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Internship Data from API
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/internships`);

        if (Array.isArray(res.data)) {
          // ✅ Normalize backend response with consistent field names
          const formattedData = res.data.map((item) => ({
            id: item.id,
            title: item.title,
            company_name: item.company_name || "Unknown Company",
            company_logo: getFullLogoUrl(item.company_logo),
            location: item.location || "Not specified",
            stipend:
              item.stipend_min && item.stipend_max
                ? `₹${item.stipend_min} - ₹${item.stipend_max}/month`
                : "Unpaid",
            duration:
              item.duration_min_months && item.duration_max_months
                ? `${item.duration_min_months}-${item.duration_max_months} Months`
                : "Not specified",
            postedAgo: new Date(item.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            details: item,
          }));

          setInternshipList(formattedData);
          setSelectedJob(formattedData[0] || null);
        } else {
          console.warn("⚠️ Unexpected response format:", res.data);
        }
      } catch (error) {
        console.error("❌ Error fetching internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // ✅ Filter Logic (Search)
  const filteredInternships = useMemo(() => {
    return internshipList.filter((job) => {
      const titleMatch = job.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const companyMatch = job.company_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return !searchTerm || titleMatch || companyMatch;
    });
  }, [internshipList, searchTerm]);

  // ✅ Auto-select first internship in filtered list
  useEffect(() => {
    if (filteredInternships.length > 0) {
      if (
        !selectedJob ||
        !filteredInternships.some((job) => job.id === selectedJob.id)
      ) {
        setSelectedJob(filteredInternships[0]);
      }
    } else {
      setSelectedJob(null);
    }
  }, [filteredInternships]);

  // ---------- UI ----------
  return (
    <div className="w-full min-h-screen font-poppins overflow-x-hidden">
      {/* ===== Banner ===== */}
      <div
        className="w-full h-auto md:h-[288px] bg-cover bg-center border-b border-[#EBEAF2] relative"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="flex flex-col md:flex-row justify-between h-full">
          <div className="w-full md:w-[852px] px-4 md:px-[64px] pt-[24px] md:pt-[36px] pb-[24px] md:pb-[48px] flex flex-col gap-[24px] md:gap-[48px]">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/internship-opportunities")}
            >
              <FaArrowLeft className="text-[#343079] text-[14px]" />
              <span className="text-[#343079] text-[14px] font-medium">
                Back
              </span>
            </div>

            <div className="flex flex-col gap-[16px] md:gap-[36px]">
              <h1 className="text-[#343079] text-[20px] md:text-[24px] font-bold leading-[28px] md:leading-[32px]">
                Explore Internships Tailored to Your Skills
              </h1>
              <p className="text-[#343079] text-[14px] leading-[22px] md:leading-[24px]">
                Browse high-quality internship roles from across domains, gain
                real-world experience, mentorship, and certification from HiCore
                Software Technologies.
              </p>
            </div>
          </div>

          <div className="w-full md:w-[572px] px-4 md:px-[48px] flex items-start justify-center md:justify-end">
            <img
              src={openinternshipimg}
              alt="Internship"
              className="max-h-full object-contain w-[240px] md:w-auto"
            />
          </div>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="w-full px-4 md:px-[64px] py-[24px] md:py-[36px]">
        {/* 🔍 Search Bar */}
        <div className="flex items-center w-full border border-blue-200 bg-[#F0F7FF] px-4 md:px-[100px] py-[16px] rounded-[8px] mb-[24px] md:mb-[36px]">
          <FaSearch className="w-[20px] md:w-[24px] h-[20px] md:h-[24px] text-[#A4A2B3]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for roles, companies..."
            className="ml-2 md:ml-[8px] w-full text-[#A4A2B3] text-[14px] md:text-[16px] bg-transparent outline-none placeholder:text-[#A4A2B3]"
          />
        </div>

        {/* ===== List + Details Section ===== */}
        <div className="flex flex-col lg:flex-row gap-[24px] md:gap-[36px]">
          {/* Internship List */}
          <div className="w-full lg:w-1/3 max-h-[80vh] overflow-y-auto pr-0 md:pr-2">
            {loading ? (
              <p className="text-center text-[#A4A2B3]">Loading internships...</p>
            ) : filteredInternships.length > 0 ? (
              filteredInternships.map((job) => (
                <InternshipItem
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onClick={() => setSelectedJob(job)}
                />
              ))
            ) : (
              <p className="text-center text-[#A4A2B3]">No internships found.</p>
            )}
          </div>

          {/* Internship Details */}
          <div className="w-full lg:w-2/3 max-h-[80vh] overflow-y-auto">
            {selectedJob ? (
              <InternshipDetails job={selectedJob.details} />
            ) : (
              <div className="text-center text-[#A4A2B3] mt-10">
                Select an internship to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenInternships;
