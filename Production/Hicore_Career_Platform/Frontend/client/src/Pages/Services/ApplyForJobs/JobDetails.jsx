import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import departmenticon from "../../../assets/ApplyforJobs/department.png";
import employmenticon from "../../../assets/ApplyforJobs/employment.png";
import locationicon from "../../../assets/ApplyforJobs/Location.png";
import salaryicon from "../../../assets/ApplyforJobs/Profit.png";
import experienceicon from "../../../assets/ApplyforJobs/Target.png";
import openingsicon from "../../../assets/ApplyforJobs/Verified.png";
import calendaricon from "../../../assets/ApplyforJobs/Calendar.png";
import globalicon from "../../../assets/ApplyforJobs/Global.png";
import webicon from "../../../assets/ApplyforJobs/Web.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const JobDetails = ({ job }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!job) return null;

  // ✅ Destructure backend response
  const {
    id: job_id,
    title,
    company_name,
    company_logo,
    company_website,
    department,
    eligibility,
    employment_type,
    location_type,
    location,
    job_overview,
    about_company,
    key_responsibilities = [],
    must_have_skills = [],
    preferred_skills = [],
    what_we_offer = [],
    benefits = [],
    salary_min_lpa,
    salary_max_lpa,
    experience_min_years,
    experience_max_years,
    openings,
    application_deadline,
    industry_type,
    created_at,
    posting_type = "Job",
    user_id: poster_user_id,
  } = job;

  // ✅ Format helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = () => {
    if (!salary_min_lpa && !salary_max_lpa) return "Not disclosed";
    const min = salary_min_lpa ? `₹${salary_min_lpa} LPA` : "";
    const max = salary_max_lpa ? `₹${salary_max_lpa} LPA` : "";
    return min && max ? `${min} - ${max}` : min || max;
  };

  const formatExperience = () => {
    if (!experience_min_years && !experience_max_years) return "Not specified";
    const min = experience_min_years ? `${experience_min_years} yr` : "";
    const max = experience_max_years ? `${experience_max_years} yr` : "";
    return min && max ? `${min} - ${max}` : min || max;
  };

  // ✅ Handle Logo URL
  const getFullLogoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const cleanPath = path.replace(/^app\//, "").replace(/^\/+/, "");
    return `${API_BASE.replace(/\/+$/, "")}/${cleanPath}`;
  };

  const logoUrl = getFullLogoUrl(company_logo);

  // ✅ LOGIN CHECK
  const checkLogin = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userEmail = localStorage.getItem("userEmail");

    if (!isLoggedIn || !userEmail) {
      alert("Please log in to continue.");
      navigate("/login", { state: { from: window.location.pathname } });
      return false;
    }
    return true;
  };

  // ✅ Quick Apply Handler
  const handleQuickApply = async () => {
    if (!checkLogin()) return;

    try {
      setLoading(true);

      const loggedInEmail = localStorage.getItem("userEmail");

      // 1️⃣ Get logged in user
      const userRes = await axios.get(`${API_BASE}/auth/users`);
      const currentUser = userRes.data.find((u) => u.email === loggedInEmail);

      if (!currentUser) {
        alert("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      const applyer_id = currentUser.id;
      let applicant_name = "";

      // 2️⃣ Get profile info (fetch first + last name from basicInfo)
      try {
        const profileRes = await axios.get(`${API_BASE}/profile/${applyer_id}`);
        const p = profileRes?.data;
        if (p && p.basicInfo) {
          const { first_name = "", last_name = "" } = p.basicInfo;
          applicant_name = `${first_name} ${last_name}`.trim();
        }
      } catch {
        // fallback: /profile?user_id=
        const profileRes = await axios.get(
          `${API_BASE}/profile?user_id=${applyer_id}`
        );
        const profileData = Array.isArray(profileRes.data)
          ? profileRes.data[0]
          : profileRes.data;
        if (profileData?.basicInfo) {
          const { first_name = "", last_name = "" } = profileData.basicInfo;
          applicant_name = `${first_name} ${last_name}`.trim();
        }
      }

      if (!applicant_name) applicant_name = "Unknown";

      console.log("🧩 Applicant Name:", applicant_name);

      // 3️⃣ Prepare payload
      const payload = {
        applyer_id,
        job_id,
        posting_type: posting_type || "Job",
        poster_user_id: poster_user_id || 0,
        applicant_name,
        job_title: title,
      };

      console.log("🟢 Applying with payload:", payload);

      // 4️⃣ POST request
      const res = await axios.post(`${API_BASE}/applications/apply`, payload);

      if (res.status === 201 || res.status === 200) {
        alert(`✅ Successfully applied for ${title}!`);
      } else {
        alert("⚠️ Something went wrong while applying.");
      }
    } catch (error) {
      console.error("❌ Apply Error:", error.response?.data || error);
      alert("Failed to apply. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Generate Interview Plan
  const handleGeneratePlan = () => {
    if (!checkLogin()) return;

    if (!job_overview) {
      alert("No job overview available to generate an interview plan.");
      return;
    }

    navigate("/generate-interview", { state: { jobDescription: job_overview } });
  };

  // ✅ Reusable List Renderer
  const renderList = (title, items) =>
    items?.length > 0 && (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-[#343079]">{title}</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className="bg-white text-[#343079] rounded-lg shadow-md p-10 border border-gray-200">
      {/* ===== Header Section ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 mb-8">
        <div className="flex items-start gap-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={company_name}
              className="w-16 h-16 rounded-md border object-cover"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {company_name && (
              <p className="text-indigo-700 text-lg font-medium">
                {company_name}
              </p>
            )}
            {industry_type && (
              <p className="text-sm text-gray-500">{industry_type}</p>
            )}
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <button
            onClick={handleQuickApply}
            disabled={loading}
            className={`ml-auto px-5 py-2 cursor-pointer text-sm mt-4 text-white rounded-lg transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#343079] hover:bg-gradient-to-r hover:from-[#403B93] hover:to-[#8682D3]"
            }`}
          >
            {loading ? "Applying..." : "Quick Apply"}
          </button>

          {job_overview && (
            <button
              onClick={handleGeneratePlan}
              className="ml-auto px-5 py-2 cursor-pointer text-sm mt-4 border border-[#343079] text-[#343079] rounded-md hover:bg-[#E1E0EB] transition"
            >
              Generate Interview Plan
            </button>
          )}
        </div>
      </div>

      {/* ===== Job Summary ===== */}
      <div className="bg-[#F9F9FC] p-6 rounded-lg mb-8 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-[#343079]">
          Job Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[15px] text-[#343079] leading-relaxed">
          {department && (
            <div className="flex items-center gap-3">
              <img
                src={departmenticon}
                alt="department"
                className="w-[20px] h-[20px]"
              />
              <span>
                <strong>Department:</strong> {department}
              </span>
            </div>
          )}
          {employment_type && (
            <div className="flex items-center gap-3">
              <img
                src={employmenticon}
                alt="employment"
                className="w-[20px] h-[20px]"
              />
              <span>
                <strong>Employment:</strong> {employment_type}
              </span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-3">
              <img
                src={locationicon}
                alt="location"
                className="w-[20px] h-[20px]"
              />
              <span>
                <strong>Location:</strong>{" "}
                {location_type ? `${location} (${location_type})` : location}
              </span>
            </div>
          )}
          {(salary_min_lpa || salary_max_lpa) && (
            <div className="flex items-center gap-3">
              <img
                src={salaryicon}
                alt="salary"
                className="w-[20px] h-[20px]"
              />
              <span>
                <strong>Salary:</strong> {formatSalary()}
              </span>
            </div>
          )}
          {(experience_min_years || experience_max_years) && (
            <div className="flex items-center gap-3">
              <img
                src={experienceicon}
                alt="experience"
                className="w-[20px] h-[20px]"
              />
              <span>
                <strong>Experience:</strong> {formatExperience()}
              </span>
            </div>
          )}
          {openings && (
            <div className="flex items-center gap-3">
              <img
                src={openingsicon}
                alt="openings"
                className="w-[20px] h-[20px]"
              />
              <span>
                <strong>Openings:</strong> {openings}
              </span>
            </div>
          )}
          {application_deadline && (
            <div className="flex items-center gap-3">
              <img
                src={calendaricon}
                alt="deadline"
                className="w-[20px] h-[20px]"
              />
              <span>
                <strong>Apply Before:</strong> {formatDate(application_deadline)}
              </span>
            </div>
          )}
          {company_website && (
            <div className="flex items-center gap-3">
              <img
                src={globalicon}
                alt="website"
                className="w-[20px] h-[20px]"
              />
              <a
                href={company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-indigo-600 truncate"
              >
                {company_website}
              </a>
            </div>
          )}
          {created_at && (
            <div className="flex items-center gap-3">
              <img src={webicon} alt="posted" className="w-[20px] h-[20px]" />
              <span>
                <strong>Posted on:</strong> {formatDate(created_at)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ===== Eligibility ===== */}
      {eligibility && (
        <div className="bg-[#F0F7FF] p-4 rounded-md mb-8 border border-blue-100">
          <h4 className="text-lg font-semibold text-[#343079] mb-1">
            Eligibility
          </h4>
          <p className="text-[#343079] text-[15px] leading-relaxed">
            {eligibility}
          </p>
        </div>
      )}

      {/* ===== About Company ===== */}
      {about_company && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">
            About {company_name}
          </h3>
          <p className="text-gray-700 leading-relaxed">{about_company}</p>
        </div>
      )}

      {/* ===== Job Overview ===== */}
      {job_overview && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Job Overview</h3>
          <p className="text-gray-700 leading-relaxed">{job_overview}</p>
        </div>
      )}

      {renderList("Key Responsibilities", key_responsibilities)}
      {renderList("What We Offer", what_we_offer)}
      {renderList("Additional Benefits", benefits)}
    </div>
  );
};

export default JobDetails;
