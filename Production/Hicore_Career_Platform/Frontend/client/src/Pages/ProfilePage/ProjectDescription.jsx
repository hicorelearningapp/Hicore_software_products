import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backcircle from "../../assets/profile/arrowcircle.png";
import ecommerce from "../../assets/profile/ecommerce.jpg";

const ProjectDescription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showVideo, setShowVideo] = useState(false);

  const project = location.state?.project;

  if (!project) {
    navigate("/profile");
    return null;
  }

  const details = project.details || {};

  const API_BASE = import.meta.env.VITE_API_BASE;

const getFullUrl = (path) => {
  if (!path) return null;

  // ✅ If already a complete URL or blob (local preview)
  if (path.startsWith("http") || path.startsWith("blob:")) return path;

  // ✅ Safely clean up the path
  const cleanPath = path.replace(/^\/+/, "");

  // ✅ Safely clean and normalize API_BASE
  const base =
    typeof API_BASE === "string"
      ? API_BASE.replace(/\/+$/, "")
      : "http://20.200.123.188:8000"; // fallback if env missing

  // ✅ Combine base + path
  return `${base}/${cleanPath}`;
};




  // ✅ File & Links Section
  const docs = {
    srs: getFullUrl(details.srsFile),
    report: getFullUrl(details.reportFile),
    github: details.codeFile || project.project_link || null,
    demo: getFullUrl(details.demoFile),
    projectVideo: getFullUrl(details.projectVideo),
  };

  const handleDownload = (url) => {
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col pt-[36px] pb-[36px] px-[64px] gap-[36px] min-h-screen">
      {/* Back Button */}
      <img
        src={backcircle}
        alt="back"
        className="w-[24px] h-[24px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/* Image/Video Section */}
      <div className="relative w-[calc(100%+128px)] ml-[-64px] h-[650px] bg-[#F3F3FB] p-[64px]">
        <div className="border border-[#343079] rounded-lg relative overflow-hidden flex items-center justify-center">
          {!showVideo ? (
            <>
              {/* ✅ Project Image */}
              <img
                src={getFullUrl(project.project_image) || ecommerce}
                alt={project.project_name}
                className="w-full h-[530px] object-cover rounded-lg opacity-90"
              />

              {/* ✅ Play Button (only if video exists) */}
              {docs.projectVideo && (
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setShowVideo(true)}
                >
                  <div className="w-[100px] h-[100px] bg-[#343079]/70 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-lg">
                    <div className="w-0 h-0 border-t-[18px] border-t-transparent border-b-[18px] border-b-transparent border-l-[36px] border-l-white ml-[6px]" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* ✅ Project Video */}
              <video
                src={docs.projectVideo}
                controls
                autoPlay
                className="w-full h-[530px] object-cover rounded-lg"
              />
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 bg-[#343079] text-white px-3 py-1 rounded-lg hover:bg-[#282655]"
              >
                ✕ Close Video
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-row gap-[24px] mt-[16px]">
        {/* LEFT SIDE */}
        <div className="flex flex-col w-[70%] h-fit gap-[20px]">
          {/* Abstract / Summary */}
          <div className="flex flex-col border border-[#EBEAF2] rounded-[8px] p-[24px] bg-white shadow-sm gap-[16px]">
            <h2 className="font-bold text-[24px] text-[#343079]">
              Abstract / Summary
            </h2>
            <p className="text-[16px] text-[#343079] leading-relaxed">
              {details.summary || "No summary provided."}
            </p>
          </div>

          {/* Objective */}
          <div className="flex flex-col border border-[#EBEAF2] rounded-[8px] p-[24px] bg-white shadow-sm gap-[16px]">
            <h2 className="font-bold text-[24px] text-[#343079]">
              Objective / Problem Statement
            </h2>
            <p className="text-[16px] text-[#343079] leading-relaxed">
              {details.objective || "No objective provided."}
            </p>
          </div>

          {/* Solution Approach */}
          <div className="flex flex-col border border-[#EBEAF2] rounded-[8px] p-[24px] bg-white shadow-sm gap-[16px]">
            <h2 className="font-bold text-[24px] text-[#343079]">
              Solution Approach
            </h2>
            <p className="text-[16px] text-[#343079] leading-relaxed">
              {details.solution || "No solution details available."}
            </p>
          </div>

          {/* Key Features */}
          <div className="flex flex-col border border-[#EBEAF2] rounded-[8px] p-[24px] bg-white shadow-sm gap-[16px]">
            <h2 className="font-bold text-[24px] text-[#343079]">
              Key Features
            </h2>
            {details.keyFeatures ? (
              <ul className="list-disc list-inside text-[#343079] text-[16px] leading-relaxed space-y-2">
                {details.keyFeatures.split(",").map((feature, i) => (
                  <li key={i}>{feature.trim()}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[16px] text-[#343079]">No key features added.</p>
            )}
          </div>

          {/* Outcome / Results */}
          <div className="flex flex-col border border-[#EBEAF2] rounded-[8px] p-[24px] bg-white shadow-sm gap-[16px]">
            <h2 className="font-bold text-[24px] text-[#343079]">
              Outcome / Results
            </h2>
            <p className="text-[16px] text-[#343079] leading-relaxed">
              {details.outcome || "No outcome/results provided."}
            </p>
          </div>

          {/* Documentation & Files */}
          <div className="flex flex-col border border-[#EBEAF2] rounded-[8px] p-[24px] bg-white shadow-sm gap-[16px]">
            <h2 className="font-bold text-[24px] text-[#343079]">
              Documentation & Files
            </h2>
            <ul className="list-disc list-inside text-[#343079] text-[16px] font-bold leading-relaxed space-y-3">
              <li className="flex items-center gap-3">
                SRS Document:
                <button
                  onClick={() => handleDownload(docs.srs)}
                  disabled={!docs.srs}
                  className={`${
                    docs.srs
                      ? "text-[#AEADBE] hover:text-[#343079]"
                      : "text-gray-400 cursor-not-allowed"
                  } transition`}
                >
                  {docs.srs ? "Download" : "Not Available"}
                </button>
              </li>

              <li className="flex items-center gap-3">
                Project Report:
                <button
                  onClick={() => handleDownload(docs.report)}
                  disabled={!docs.report}
                  className={`${
                    docs.report
                      ? "text-[#AEADBE] hover:text-[#343079]"
                      : "text-gray-400 cursor-not-allowed"
                  } transition`}
                >
                  {docs.report ? "Download" : "Not Available"}
                </button>
              </li>

              <li className="flex items-center gap-3">
                GitHub Repository:
                <button
                  onClick={() => handleDownload(docs.github)}
                  disabled={!docs.github}
                  className={`${
                    docs.github
                      ? "text-[#AEADBE] hover:text-[#343079]"
                      : "text-gray-400 cursor-not-allowed"
                  } transition`}
                >
                  {docs.github ? "View Repository" : "Not Available"}
                </button>
              </li>

              <li className="flex items-center gap-3">
                Demo Video / Output:
                <button
                  onClick={() => handleDownload(docs.demo)}
                  disabled={!docs.demo}
                  className={`${
                    docs.demo
                      ? "text-[#AEADBE] hover:text-[#343079]"
                      : "text-gray-400 cursor-not-allowed"
                  } transition`}
                >
                  {docs.demo ? "View Demo" : "Not Available"}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col w-[30%] h-fit gap-[20px]">
          {/* Technical Stack */}
          <div className="flex flex-col border border-[#EBEAF2] rounded-[12px] bg-white p-[36px] gap-[16px] shadow-sm">
            <h2 className="font-bold text-[24px] text-[#343079]">
              Technical Stack & Tools
            </h2>
            <ul className="space-y-2 text-[#343079] text-[16px] leading-relaxed">
              <li>
                <b>Frontend:</b> {details.frontend || "—"}
              </li>
              <li>
                <b>Backend:</b> {details.backend || "—"}
              </li>
              <li>
                <b>Database:</b> {details.database || "—"}
              </li>
              <li>
                <b>APIs / Integrations:</b> {details.apis || "—"}
              </li>
              <li>
                <b>Authentication:</b> {details.authentication || "—"}
              </li>
              <li>
                <b>Hosting:</b> {details.hosting || "—"}
              </li>
              <li>
                <b>Version Control:</b> {details.versionControl || "—"}
              </li>
              <li>
                <b>Development Tools:</b> {details.devTools || "—"}
              </li>
            </ul>
          </div>

          {/* Learning & Reflections */}
          <div className="flex flex-col border border-[#EBEAF2] rounded-[12px] bg-white p-[36px] gap-[16px] shadow-sm">
            <h2 className="font-bold text-[24px] text-[#343079]">
              Learning & Reflections
            </h2>

            <p className="font-bold text-[16px] text-[#343079]">
              Challenges Faced
            </p>
            <p className="text-[#343079] text-[16px] leading-relaxed">
              {details.challenges || "No challenges recorded."}
            </p>

            <p className="font-bold text-[16px] text-[#343079]">Key Learnings</p>
            <p className="text-[#343079] text-[16px] leading-relaxed">
              {details.learnings || "No learnings documented."}
            </p>

            <p className="font-bold text-[16px] text-[#343079]">
              Future Improvements
            </p>
            <p className="text-[#343079] text-[16px] leading-relaxed">
              {details.improvements || "No future improvements noted."}
            </p>
          </div>

          {/* Team & Collaboration */}
          <div className="flex flex-col border border-[#EBEAF2] rounded-[12px] bg-white p-[36px] gap-[16px] shadow-sm">
            <h2 className="font-bold text-[20px] text-[#343079]">
              Team & Collaboration
            </h2>
            <ul className="space-y-2 text-[#343079] text-[16px] leading-relaxed">
              <li>
                <b>Team Members:</b>{" "}
                {details.teamMembers ||
                  "Information not provided."}
              </li>
              <li>
                <b>Mentor:</b> {details.mentor || "Information not provided."}
              </li>
              <li>
                <b>Institution:</b> {details.institution || "Information not provided."}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDescription;
