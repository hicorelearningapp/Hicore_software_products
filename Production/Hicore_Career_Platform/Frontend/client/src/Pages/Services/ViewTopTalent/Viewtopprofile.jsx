// src/Pages/Services/EmployersSection/CandidateProfile/ViewProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";

// Icons
import locationicon from "../../../assets/profile/location.png";
import jobicon from "../../../assets/profile/job.png";
import contacticon from "../../../assets/profile/contact.png";
import messageicon from "../../../assets/profile/message.png";
import downloadicon from "../../../assets/profile/download.png";
import usericon from "../../../assets/profile/user.png";
import workicon from "../../../assets/profile/work.png";
import skillicon from "../../../assets/profile/brain.png";
import educationicon from "../../../assets/profile/education.png";
import certificationicon from "../../../assets/profile/certification.png";
import calendaricon from "../../../assets/profile/calendar.png";
import projecticon from "../../../assets/profile/file.png";
import linkicon from "../../../assets/profile/link.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// ✅ Helper to safely build image/file URLs
const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const cleanPath = path.replace(/^\/+/, "");
  const base = API_BASE.replace(/\/+$/, "");
  return `${base}/${cleanPath}`;
};

const Viewtopprofile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/profile/${userId}`);
        const data = res.data;

        // ✅ Parse project.details safely if stringified
        if (data?.projects?.length > 0) {
          data.projects = data.projects.map((p) => {
            if (typeof p.details === "string") {
              try {
                p.details = JSON.parse(p.details);
              } catch {
                p.details = {};
              }
            }
            return p;
          });
        }

        setProfileData(data);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        setError("Failed to load this candidate’s profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // === STATES ===
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-[#343079] font-semibold">
        Loading candidate profile...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600">
        {error}
        <button
          onClick={() => navigate("/candidate-profile/exploretalentpool")}
          className="mt-4 bg-[#343079] text-white px-4 py-2 rounded-lg"
        >
          Back to Candidates
        </button>
      </div>
    );

  if (!profileData)
    return (
      <div className="text-center py-10 text-gray-500">
        No profile data found for this candidate.
      </div>
    );

  // === Destructure Data ===
  const { basicInfo, workExperience, education, skillsResume, certifications, projects } =
    profileData;

  const parsedSkills =
    Array.isArray(skillsResume?.resume_skills) && skillsResume.resume_skills.length > 0
      ? skillsResume.resume_skills
      : typeof skillsResume?.resume_skills === "string"
      ? skillsResume.resume_skills.split(",").map((s) => s.trim())
      : [];

  return (
    <div className="w-full flex flex-col items-center gap-9 pb-10">
      {/* === Search Bar === */}
      <div className="max-w-7xl w-full px-4 pt-4">
        <div className="flex items-center border border-[#A4A2B3] rounded-lg px-4 py-2">
          <Search size={18} color="#A4A2B3" />
          <input
            type="text"
            placeholder="Search for Candidate Name, Company Name..."
            className="ml-2 w-full outline-none text-[#343079]"
          />
        </div>
      </div>

      {/* === Header Section === */}
      <div className="w-full bg-[#F3F3FB] py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4">
          {/* Profile Image */}
          <div className="relative w-[200px] h-[248px]">
            <img
              src={getFullUrl(basicInfo?.profile_image)}
              alt="Profile"
              className="w-full h-full object-cover rounded-lg border border-[#343079]"
            />
          </div>

          {/* Info Section */}
          <div className="w-[390px] flex flex-col gap-3">
            <h1 className="text-[32px] font-bold text-[#343079]">
              {basicInfo.first_name} {basicInfo.last_name}
            </h1>
            <p className="font-semibold text-[#343079]">{basicInfo.professional_title}</p>

            <div className="flex items-center gap-2">
              <img src={locationicon} alt="" className="w-4 h-4" />
              <span className="text-[#83828F]">{basicInfo.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <img src={jobicon} alt="" className="w-4 h-4" />
              <span className="text-[#83828F]">
                {basicInfo.job_alerts
                  ? "Open to Opportunities"
                  : "Not Open to Opportunities"}
              </span>
            </div>

            {/* ✅ Contact Buttons (Same as Student View) */}
            <div className="flex gap-3 mt-2">
              <button className="w-[300px] bg-[#343079] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                Contact <img src={messageicon} className="w-4 h-4" alt="" />
              </button>
              {skillsResume?.resume_file && (
                <button
                  onClick={() =>
                    window.open(getFullUrl(skillsResume.resume_file), "_blank")
                  }
                  className="w-[300px] border border-[#343079] text-[#343079] px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  Resume <img src={downloadicon} className="w-4 h-4" alt="" />
                </button>
              )}
            </div>
          </div>

          {/* Self Intro Video */}
          <div className="w-[500px] border border-[#343079] rounded-lg bg-[#A4A2B3] ml-[100px] flex flex-col items-center justify-center p-4">
            {basicInfo.selfintro_video ? (
              <video
                src={getFullUrl(basicInfo.selfintro_video)}
                controls
                className="rounded-lg w-[300px] max-h-[300px] object-cover shadow-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-white py-10">
                <p className="text-lg font-semibold">No video uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === Sections === */}
      <div className="w-full flex flex-row gap-6 p-16">
        {/* LEFT COLUMN */}
        <div className="w-[60%] flex flex-col gap-6">
          {/* About Me */}
          <div className="border border-[#EBEAF2] p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <img src={usericon} className="w-6 h-6" alt="" />
              <h2 className="font-bold text-[22px] text-[#343079]">About Me</h2>
            </div>
            <p className="text-[#343079]">{basicInfo.professional_bio}</p>
          </div>

          {/* Work Experience */}
          <div className="border border-[#EBEAF2] p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <img src={workicon} className="w-6 h-6" alt="" />
              <h2 className="font-bold text-[22px] text-[#343079]">Work Experience</h2>
            </div>

            <div className="flex flex-col gap-6">
              {workExperience?.length > 0 ? (
                workExperience.map((exp, index) => (
                  <div
                    key={index}
                    className="p-5 border border-[#EBEAF2] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        {exp.company_image && (
                          <img
                            src={getFullUrl(exp.company_image)}
                            alt="Company Logo"
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <h3 className="text-[#343079] font-bold text-[16px]">
                            {exp.job_title}
                          </h3>
                          <p className="text-[#69AAFF] font-bold text-[16px]">
                            {exp.company_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row gap-[8px] items-center justify-center">
                        <img src={calendaricon} alt="" className="w-[16px] h-[16px]" />
                        <p className="text-[#343079] text-[16px]">
                          {exp.start_year} -{" "}
                          {exp.currently_working ? "Present" : exp.end_year}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#343079] mt-3 text-[16px] leading-relaxed">
                      {exp.responsibilities}
                    </p>
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.technologies.split(",").map((tech, i) => (
                          <span
                            key={i}
                            className="bg-[#EBEAF2] border border-[#343079] text-[#343079] text-[12px] px-3 py-1 rounded-full"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[#83828F] text-sm">No work experience added.</p>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="border border-[#EBEAF2] p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <img src={projecticon} className="w-6 h-6" alt="" />
              <h2 className="font-bold text-[22px] text-[#343079]">Projects</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {projects?.length > 0 ? (
                projects.map((proj, i) => (
                  <div
                    key={i}
                    className="border border-[#EBEAF2] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {proj.project_image && (
                      <img
                        src={getFullUrl(proj.project_image)}
                        alt={proj.project_name}
                        className="w-full h-[160px] object-cover"
                      />
                    )}
                    <div className="p-5 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-[#343079] font-semibold text-lg">
                          {proj.project_name}
                        </h3>
                        <img
                          src={linkicon}
                          alt="View Project"
                          className="w-[24px] h-[24px] cursor-pointer hover:opacity-80 transition"
                          onClick={() =>
                            navigate("/candidate-profile/project-description", {
                              state: { project: proj },
                            })
                          }
                        />
                      </div>
                      <p className="text-[#343079] text-[16px] leading-relaxed">
                        {proj.project_description}
                      </p>
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {proj.technologies.split(",").map((tech, i) => (
                            <span
                              key={i}
                              className="bg-[#F9F9FC] text-[#343079] border border-[#343079] text-sm px-3 py-1 rounded-full"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[#83828F] text-sm">No projects added.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-[40%] flex flex-col gap-6">
          {/* Contact Info */}
          <div className="border border-[#EBEAF2] p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <img src={contacticon} className="w-6 h-6" alt="" />
              <h2 className="font-bold text-[22px] text-[#343079]">Contact Info</h2>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              <p className="text-[#343079]">{basicInfo.email}</p>
              <p className="text-[#343079]">{basicInfo.mobile_number}</p>
              <p className="text-[#343079]">{basicInfo.linkedin_profile}</p>
              <p className="text-[#343079]">{basicInfo.portfolio_website}</p>
              <p className="text-[#343079]">{basicInfo.github_profile}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="border border-[#EBEAF2] p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <img src={skillicon} className="w-6 h-6" alt="" />
              <h2 className="font-bold text-[22px] text-[#343079]">Skills</h2>
            </div>
            <div className="flex flex-col gap-[14px]">
              {parsedSkills.length > 0 ? (
                parsedSkills.map((skill, i) => (
                  <span key={i} className="text-[#343079] text-[16px]">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-[#83828F] text-sm">No skills added.</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="flex flex-col border border-[#EBEAF2] p-6 gap-[16px] rounded-lg">
            <div className="flex items-center gap-2">
              <img src={educationicon} className="w-6 h-6" alt="" />
              <h2 className="font-bold text-[22px] text-[#343079]">Education</h2>
            </div>
            {education?.length > 0 ? (
              education.map((edu, i) => (
                <div key={i} className="flex flex-col gap-[4px]">
                  <p className="font-bold text-[#343079] text-[16px]">
                    {edu.education_level}
                  </p>
                  <p className="text-[16px] text-[#343079]">{edu.college_name}</p>
                  <p className="text-[16px] text-[#343079]">
                    {edu.edu_start_year} - {edu.edu_end_year || "Present"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[#83828F] text-sm">No education added.</p>
            )}
          </div>

          {/* Certifications */}
          <div className="flex flex-col border border-[#EBEAF2] p-6 rounded-lg gap-[16px]">
            <div className="flex items-center gap-2 mb-2">
              <img src={certificationicon} className="w-6 h-6" alt="" />
              <h2 className="font-bold text-[22px] text-[#343079]">Certifications</h2>
            </div>
            {certifications?.length > 0 ? (
              certifications.map((cert, i) => (
                <div key={i} className="flex flex-col gap-[4px]">
                  <p className="font-semibold text-[#343079]">{cert.certificate_name}</p>
                  <p className="text-[#343079]">{cert.issuing_org}</p>
                  <p className="text-[#343079]">
                    {cert.issue_year} - {cert.expiry_year}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[#83828F] text-sm">No certifications added.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewtopprofile;
