import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import departmenticon from "../../../assets/ApplyforJobs/department.png";
import employmenticon from "../../../assets/ApplyforJobs/employment.png";
import locationicon from "../../../assets/ApplyforJobs/Location.png";
import stipendicon from "../../../assets/ApplyforJobs/Profit.png";
import durationicon from "../../../assets/ApplyforJobs/Target.png";
import openingsicon from "../../../assets/ApplyforJobs/Verified.png";
import calendaricon from "../../../assets/ApplyforJobs/Calendar.png";
import globalicon from "../../../assets/ApplyforJobs/Global.png";
import webicon from "../../../assets/ApplyforJobs/Web.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const InternshipDetails = ({ job }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // states for applied check
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplyStatus, setCheckingApplyStatus] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  if (!job) return null;

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
    internship_overview,
    about_company,
    highlights = [],
    required_skills = [],
    preferred_skills = [],
    what_we_offer = [],
    benefits = [],
    stipend_min,
    stipend_max,
    duration_min_months,
    duration_max_months,
    openings,
    application_deadline,
    industry_type,
    created_at,
    posting_type = "Internship",
    user_id: poster_user_id,
  } = job;

  // Helper: read applied jobs store from localStorage
  const readAppliedStore = () => {
    try {
      return JSON.parse(localStorage.getItem("applied_jobs_store") || "{}");
    } catch {
      return {};
    }
  };

  // Helper: write applied jobs store to localStorage
  const writeAppliedStore = (store) => {
    try {
      localStorage.setItem("applied_jobs_store", JSON.stringify(store));
    } catch (e) {
      console.error("Failed to write applied_jobs_store:", e);
    }
  };

  // Find or fetch current user id (prefers cached userId in localStorage)
  useEffect(() => {
    let mounted = true;

    const resolveUserId = async () => {
      setCheckingApplyStatus(true);
      try {
        const cachedId = localStorage.getItem("userId");
        const loggedInEmail = localStorage.getItem("userEmail");
        if (cachedId) {
          if (mounted) setCurrentUserId(String(cachedId));
          return;
        }

        if (!loggedInEmail) {
          // Not logged in (or email missing) — no user id
          if (mounted) setCurrentUserId(null);
          return;
        }

        // Fetch users and find by email
        try {
          const usersRes = await axios.get(`${API_BASE}/auth/users`);
          const users = usersRes.data || [];
          const found = users.find((u) => u.email === loggedInEmail);
          if (found && mounted) {
            const uid = String(found.id);
            setCurrentUserId(uid);
            try {
              localStorage.setItem("userId", uid);
            } catch (e) {
              // ignore storage errors
            }
          } else if (mounted) {
            setCurrentUserId(null);
          }
        } catch (err) {
          console.error("Error fetching users to resolve userId:", err);
          if (mounted) setCurrentUserId(null);
        }
      } finally {
        // don't flip checkingApplyStatus here — actual applied check runs next
      }
    };

    resolveUserId();

    return () => {
      mounted = false;
    };
  }, []); // only once on mount — userId cached or fetched

  // Check applied status whenever job_id or currentUserId changes
  useEffect(() => {
    let mounted = true;

    const checkApplied = async () => {
      // start checking
      if (mounted) {
        setCheckingApplyStatus(true);
        setHasApplied(false); // reset until we confirm
      }

      try {
        const loggedInEmail = localStorage.getItem("userEmail");
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        // If not logged in, can't be applied for this user
        if (!isLoggedIn || !loggedInEmail) {
          if (mounted) {
            setHasApplied(false);
            setCheckingApplyStatus(false);
          }
          return;
        }

        // Prefer to use resolved user id
        let uid = currentUserId;

        // If we don't have uid yet, try to fetch it (defensive)
        if (!uid) {
          try {
            const usersRes = await axios.get(`${API_BASE}/auth/users`);
            const users = usersRes.data || [];
            const found = users.find((u) => u.email === loggedInEmail);
            if (found) {
              uid = String(found.id);
              try {
                localStorage.setItem("userId", uid);
              } catch {}
              if (mounted) setCurrentUserId(uid);
            }
          } catch (err) {
            console.error("Error fetching users in checkApplied:", err);
          }
        }

        // If still no uid, fallback: don't mark applied
        if (!uid) {
          if (mounted) {
            setHasApplied(false);
            setCheckingApplyStatus(false);
          }
          return;
        }

        // Read per-user applied jobs from localStorage
        const store = readAppliedStore();
        const userApplied = Array.isArray(store[uid]) ? store[uid] : [];

        // If local record says applied, mark it applied immediately
        if (userApplied.includes(String(job_id))) {
          if (mounted) {
            setHasApplied(true);
            setCheckingApplyStatus(false);
          }
          return;
        }

        // As an optional consistency check, try to confirm with server (non-blocking)
        // This helps if the user applied on another device and store isn't updated.
        // But we keep local-check primary to avoid flicker.
        try {
          const appliedRes = await axios.get(`${API_BASE}/applications?applyer_id=${uid}`);
          const appliedList = appliedRes.data || [];

          const alreadyApplied = appliedList.some((app) => Number(app.job_id) === Number(job_id));

          if (alreadyApplied) {
            // Update local store
            const newStore = { ...store };
            newStore[uid] = Array.isArray(newStore[uid]) ? newStore[uid] : [];
            if (!newStore[uid].includes(String(job_id))) {
              newStore[uid].push(String(job_id));
              writeAppliedStore(newStore);
            }
            if (mounted) setHasApplied(true);
          } else {
            if (mounted) setHasApplied(false);
          }
        } catch (err) {
          // If server check fails, we already used local store result — keep that
          console.error("Server check for applications failed:", err);
          if (mounted) setHasApplied(false);
        }
      } catch (err) {
        console.error("Unexpected error in checkApplied:", err);
        if (mounted) setHasApplied(false);
      } finally {
        if (mounted) setCheckingApplyStatus(false);
      }
    };

    // Only run the check if job_id is defined
    if (typeof job_id !== "undefined" && job_id !== null) {
      checkApplied();
    } else {
      setHasApplied(false);
      setCheckingApplyStatus(false);
    }

    return () => {
      mounted = false;
    };
  }, [job_id, currentUserId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStipend = () => {
    if (!stipend_min && !stipend_max) return "Unpaid";
    const min = stipend_min ? `₹${stipend_min}` : "";
    const max = stipend_max ? `₹${stipend_max}` : "";
    return min && max ? `${min} - ${max}/month` : min || max;
  };

  const formatDuration = () => {
    if (!duration_min_months && !duration_max_months) return "Not specified";
    const min = duration_min_months ? `${duration_min_months} mo` : "";
    const max = duration_max_months ? `${duration_max_months} mo` : "";
    return min && max ? `${min} - ${max}` : min || max;
  };

  const getFullLogoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    return `${API_BASE.replace(/\/+$/, "")}/${path.replace(/^app\//, "").replace(/^\/+/, "")}`;
  };

  const logoUrl = getFullLogoUrl(company_logo);

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

  // QUICK APPLY
  const handleQuickApply = async () => {
    if (!checkLogin()) return;

    try {
      setLoading(true);

      const loggedInEmail = localStorage.getItem("userEmail");

      const userRes = await axios.get(`${API_BASE}/auth/users`);
      const currentUser = userRes.data.find((u) => u.email === loggedInEmail);

      if (!currentUser) {
        alert("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      const applyer_id = currentUser.id;
      let applicant_name = "";

      try {
        const profileRes = await axios.get(`${API_BASE}/profile/${applyer_id}`);
        const p = profileRes?.data;

        if (p?.basicInfo) {
          const { first_name = "", last_name = "" } = p.basicInfo;
          applicant_name = `${first_name} ${last_name}`.trim();
        }
      } catch {
        const profileRes = await axios.get(`${API_BASE}/profile?user_id=${applyer_id}`);
        const data = Array.isArray(profileRes.data)
          ? profileRes.data[0]
          : profileRes.data;

        if (data?.basicInfo) {
          const { first_name = "", last_name = "" } = data.basicInfo;
          applicant_name = `${first_name} ${last_name}`.trim();
        }
      }

      if (!applicant_name) applicant_name = "Unknown";

      const payload = {
        applyer_id,
        job_id,
        posting_type: posting_type || "Internship",
        poster_user_id: poster_user_id || 0,
        applicant_name,
        job_title: title,
      };

      const res = await axios.post(`${API_BASE}/applications/apply`, payload);

      if (res.status === 200 || res.status === 201) {
        alert(`✅ Successfully applied for ${title}!`);

        // update local UI
        setHasApplied(true);

        // update per-user local store
        const uid = String(applyer_id);
        const store = readAppliedStore();
        store[uid] = Array.isArray(store[uid]) ? store[uid] : [];
        if (!store[uid].includes(String(job_id))) {
          store[uid].push(String(job_id));
          writeAppliedStore(store);
        }

        // also cache userId for next time
        try {
          localStorage.setItem("userId", uid);
        } catch (e) {}
      } else {
        alert("⚠️ Something went wrong while applying.");
      }
    } catch (err) {
      console.error("❌ Apply error:", err.response?.data || err);
      alert("Failed to apply. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
      {/* ===== Header ===== */}
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
            {industry_type && <p className="text-sm text-gray-500">{industry_type}</p>}
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          {checkingApplyStatus ? (
            <button className="px-5 py-2 text-sm bg-gray-300 rounded-md cursor-not-allowed">
              Checking...
            </button>
          ) : hasApplied ? (
            <span className="px-5 py-2 text-sm bg-green-100 text-green-700 rounded-md font-semibold">
              ✔ Applied
            </span>
          ) : (
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
          )}
        </div>
      </div>

      {/* ===== Internship Summary ===== */}
      <div className="bg-[#F9F9FC] p-6 rounded-lg mb-8 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-[#343079]">
          Internship Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[15px] text-[#343079] leading-relaxed">
          {department && (
            <div className="flex items-center gap-3">
              <img src={departmenticon} className="w-[20px] h-[20px]" />
              <span>
                <strong>Department:</strong> {department}
              </span>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-3">
              <img src={locationicon} className="w-[20px] h-[20px]" />
              <span>
                <strong>Location:</strong>{" "}
                {location_type ? `${location} (${location_type})` : location}
              </span>
            </div>
          )}

          {(stipend_min || stipend_max) && (
            <div className="flex items-center gap-3">
              <img src={stipendicon} className="w-[20px] h-[20px]" />
              <span>
                <strong>Stipend:</strong> {formatStipend()}
              </span>
            </div>
          )}

          {(duration_min_months || duration_max_months) && (
            <div className="flex items-center gap-3">
              <img src={durationicon} className="w-[20px] h-[20px]" />
              <span>
                <strong>Duration:</strong> {formatDuration()}
              </span>
            </div>
          )}

          {openings && (
            <div className="flex items-center gap-3">
              <img src={openingsicon} className="w-[20px] h-[20px]" />
              <span>
                <strong>Openings:</strong> {openings}
              </span>
            </div>
          )}

          {application_deadline && (
            <div className="flex items-center gap-3">
              <img src={calendaricon} className="w-[20px] h-[20px]" />
              <span>
                <strong>Apply Before:</strong> {formatDate(application_deadline)}
              </span>
            </div>
          )}

          {company_website && (
            <div className="flex items-center gap-3">
              <img src={globalicon} className="w-[20px] h-[20px]" />
              <a
                href={company_website}
                className="underline text-indigo-600 truncate"
                target="_blank"
                rel="noopener noreferrer"
              >
                {company_website}
              </a>
            </div>
          )}

          {created_at && (
            <div className="flex items-center gap-3">
              <img src={webicon} className="w-[20px] h-[20px]" />
              <span>
                <strong>Posted on:</strong> {formatDate(created_at)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Eligibility */}
      {eligibility && (
        <div className="bg-[#F0F7FF] p-4 rounded-md mb-8 border border-blue-100">
          <h4 className="text-lg font-semibold text-[#343079] mb-1">Eligibility</h4>
          <p className="text-[#343079]">{eligibility}</p>
        </div>
      )}

      {/* About company */}
      {about_company && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">About {company_name}</h3>
          <p className="text-gray-700">{about_company}</p>
        </div>
      )}

      {/* Overview */}
      {internship_overview && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Internship Overview</h3>
          <p className="text-gray-700">{internship_overview}</p>
        </div>
      )}

      {renderList("Highlights", highlights)}

      {/* Required Skills */}
      {required_skills.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {required_skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preferred Skills */}
      {preferred_skills.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Preferred Skills</h3>
          <div className="flex flex-wrap gap-2">
            {preferred_skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-[#343079] px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {renderList("What We Offer", what_we_offer)}
      {renderList("Additional Benefits", benefits)}

      {/* APPLY SECTION */}
      <div className="mb-5">
        <h3 className="font-semibold text-[16px]">How to Apply</h3>
        <p className="text-sm mt-1 text-[#343079]">
          Click on <b>Quick Apply</b>. Shortlisted candidates will be contacted within 48 hours.
        </p>

        {checkingApplyStatus ? (
          <button className="px-5 py-2 text-sm bg-gray-300 rounded-md cursor-not-allowed mt-4">
            Checking...
          </button>
        ) : hasApplied ? (
          <span className="px-5 py-2 mt-4 text-sm bg-green-100 text-green-700 rounded-md font-semibold inline-block">
            ✔ Applied
          </span>
        ) : (
          <button
            onClick={handleQuickApply}
            disabled={loading}
            className={`px-5 py-2 cursor-pointer text-sm mt-4 text-white rounded-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#343079] hover:bg-[#2c276a]"
            }`}
          >
            {loading ? "Applying..." : "Quick Apply"}
          </button>
        )}
      </div>
    </div>
  );
};

export default InternshipDetails;
