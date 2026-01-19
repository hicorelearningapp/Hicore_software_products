import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import banner from "../../../../assets/resume-banner.png";
import smartIcon from "../../../../assets/smart-icon.png";
import previewIcon from "../../../../assets/preview-icon.png";
import layoutIcon from "../../../../assets/layout-icon.png";
import DownloadIcon from "../../../../assets/Download.png";
import axios from "axios";
import transformBackendData from "./transformBackendData";

const ResumeBuilder = () => {
  const [progress, setProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  // Get userId
  const userId = localStorage.getItem("userId");
  const PROFILE_URL = `${API_BASE}/profile/${userId || ""}`;

  // -------------------------------
  // 🔍 Check Profile Exists + Fetch
  // -------------------------------
  const fetchProfileData = async () => {
    if (!userId) {
      alert("⚠️ User ID not found. Please log in again.");
      setImporting(false);
      return null;
    }

    try {
      const res = await axios.get(PROFILE_URL, {
        headers: { Accept: "application/json" },
        validateStatus: () => true,
      });

      // ❌ Profile Not Found
      if (res.status === 404 || !res.data) {
        alert("⚠️ Profile not created. First create profile");
        setImporting(false);
        navigate("/create-profile");
        return null;
      }

      // ❌ Invalid response
      if (typeof res.data !== "object") {
        alert("❌ Profile API returned invalid data.");
        return null;
      }

      return res.data;
    } catch (error) {
      console.error("❌ Error Fetching Profile:", error);
      alert("Failed to fetch profile data.");
      return null;
    }
  };

  // -------------------------------
  // 🔄 Import Progress Animation
  // -------------------------------
  useEffect(() => {
    let timer;

    if (importing && progress < 100) {
      timer = setTimeout(() => setProgress((p) => p + 10), 250);
    } else if (progress === 100) {
      setTimeout(async () => {
        if (!importing) return;

        const backendData = await fetchProfileData();

        if (!backendData) {
          setImporting(false);
          setProgress(0);
          return;
        }

        const mapped = transformBackendData(backendData);

        setImporting(false);
        setProgress(0);

        navigate("/resume-editor", { state: { importedResume: mapped } });
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [importing, progress]);

  const handleImportClick = () => {
    setImporting(true);
    setProgress(0);
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <section className="w-full h-auto bg-white relative">
      <img
        src={banner}
        alt="Resume Banner"
        className="w-full h-auto object-contain"
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 px-4 mt-8 mb-8">
        {/* Left Info Cards */}
        <div className="flex flex-col gap-6 flex-shrink-0">
          {[
            {
              icon: smartIcon,
              title: "Smart Assist",
              desc: "AI-Powered Content Upgrades.",
            },
            {
              icon: layoutIcon,
              title: "Expert Layouts",
              desc: "Polished Templates, Pro Results.",
            },
            {
              icon: previewIcon,
              title: "Instant Preview",
              desc: "Edit and See the Magic Live.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="w-[270px] rounded-[8px] border border-[#C4C2D6] bg-[#FFFFFF] p-6 flex flex-col gap-4 text-center hover:bg-[#F3F3FB] hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="flex justify-center mb-2">
                <img src={item.icon} alt={item.title} className="w-10 h-10" />
              </div>
              <h3 className="font-semibold text-[#343079] text-[16px]">
                {item.title}
              </h3>
              <p className="text-[14px] text-[#343079] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Import Section */}
        <div className="flex-1 bg-[#FFFAEF] rounded-[8px] px-10 py-12 flex flex-col items-center">
          <h2 className="text-[24px] font-bold text-[#343079] mt-4 mb-8 text-center">
            Welcome to AI Resume Builder
          </h2>

          <div className="bg-white border border-[#C0BFD5] rounded-[8px] px-10 py-10 w-full max-w-[718px] text-center shadow flex flex-col items-center">
            <h4 className="text-[16px] font-bold text-[#343079] mb-4">
              Craft a Smarter Resume — Instantly
            </h4>
            <p className="text-[16px] text-[#83828F] mb-8">
              Build or enhance your resume with the power of AI.
            </p>

            {/* Centered Button */}
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center gap-2 bg-[#343079] text-white py-3 px-6 rounded-md font-medium text-md border border-[#2D3A63]"
            >
              <img
                src={DownloadIcon}
                alt="download"
                className="w-[20px] h-[20px]"
              />
              Import Profile
            </button>
          </div>
        </div>
      </div>

      {/* Progress Overlay */}
      {importing && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-[500px]">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-4 bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-700 font-medium">Importing...</p>
              <p className="text-blue-600 font-bold">{progress}%</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ResumeBuilder;
