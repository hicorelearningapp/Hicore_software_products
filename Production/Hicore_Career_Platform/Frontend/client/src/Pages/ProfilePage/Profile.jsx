import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Icons
import shareicon from "../../assets/profile/share.png";
import editicon from "../../assets/profile/edituser.png";
import jobicon from "../../assets/profile/job.png";
import contacticon from "../../assets/profile/contact.png";
import locationicon from "../../assets/profile/location.png";
import messageicon from "../../assets/profile/message.png";
import downloadicon from "../../assets/profile/download.png";
import usericon from "../../assets/profile/user.png";
import workicon from "../../assets/profile/work.png";
import skillicon from "../../assets/profile/brain.png";
import educationicon from "../../assets/profile/education.png";
import certificationicon from "../../assets/profile/certification.png";
import calendaricon from "../../assets/profile/calendar.png";
import projecticon from "../../assets/profile/file.png";
import linkicon from "../../assets/profile/link.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const getFullUrl = (path) => {
  if (!path) return null;

  // ✅ If it's already a full URL or blob (no need to modify)
  if (path.startsWith("http") || path.startsWith("blob:")) return path;

  // ✅ Remove any leading slashes to avoid double-slash errors
  const cleanPath = path.replace(/^\/+/, "");

  // ✅ Ensure API_BASE doesn’t end with a trailing slash
  const base = API_BASE.replace(/\/+$/, "");

  // ✅ Combine the API base with path correctly
  return `${base}/${cleanPath}`;
};



// ✅ Share Modal
const ShareProfile = ({ onClose }) => {
  const profileLink = window.location.href;
  const handleCopy = () => {
    navigator.clipboard.writeText(profileLink);
    alert("✅ Profile link copied!");
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[500px] flex flex-col gap-4">
        <h2 className="font-semibold text-lg text-[#343079]">Share Profile</h2>
        <div className="bg-[#EBEAF2] p-3 rounded-lg">
          <input
            type="text"
            value={profileLink}
            readOnly
            className="w-full bg-white border border-[#DAD8EE] rounded p-2 text-sm"
          />
          <button
            onClick={handleCopy}
            className="bg-[#343079] text-white mt-2 px-3 py-1 rounded text-sm"
          >
            Copy Link
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-[#343079] text-white py-2 rounded-lg font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ✅ Main Profile Component
const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://placehold.co/198x248/EBEAF2/343079?text=Profile"
  );

  useEffect(() => {
    const user_id =
      localStorage.getItem("user_id") || localStorage.getItem("userId");

    if (!user_id) {
      navigate("/create-profile");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE}/profile/${user_id}`);
        if (response.status === 200) {
          const data = response.data;

          // ✅ Parse project.details safely
          if (data?.projects?.length > 0) {
            data.projects = data.projects.map((p) => {
              if (typeof p.details === "string") {
                try {
                  const parsed = JSON.parse(p.details);
                  p.details =
                    typeof parsed === "string" ? JSON.parse(parsed) : parsed;
                } catch {
                  p.details = {};
                }
              }
              return p;
            });
          }

          setProfileData(data);

          if (data?.basicInfo?.profile_image) {
            setProfileImageUrl(getFullUrl(data.basicInfo.profile_image));
          }

          console.log("✅ Profile fetched successfully:", data);
        } else {
          alert("No profile found for this user.");
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        if (error.response) {
          alert(
            `Failed to load profile: ${error.response.status} - ${
              error.response.data?.detail || "Unknown error"
            }`
          );
        } else {
          alert("Server not reachable. Please check your connection.");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // ✅ Convert uploaded image to Base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setProfileImageUrl(base64);
      setProfileData((prev) => ({
        ...prev,
        basicInfo: { ...prev.basicInfo, profile_image: base64 },
      }));
    }
  };

  if (!profileData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-[#343079]">Loading profile...</p>
      </div>
    );

  const {
    basicInfo,
    workExperience,
    education,
    skillsResume,
    certifications,
    projects,
  } = profileData;

  const parsedSkills =
    Array.isArray(skillsResume?.resume_skills)
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
            placeholder="Search for User Name, Company Name..."
            className="ml-2 w-full outline-none text-[#343079]"
          />
        </div>
      </div>

      {/* === Header === */}
      <div className="w-full bg-[#F3F3FB] py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4">
          {/* Profile Picture */}
          <div className="relative w-[200px] h-[248px]">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover rounded-lg border"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 right-2 bg-[#343079] text-white p-2 rounded-full"
            >
              <FaCamera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </div>

          {/* Info Section */}
          <div className="w-[390px] flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-[32px] font-bold text-[#343079]">
                {basicInfo.first_name} {basicInfo.last_name}
              </h1>
              <div className="flex gap-3">
                <img
                  src={shareicon}
                  onClick={() => setShareOpen(true)}
                  className="w-7 h-7 cursor-pointer"
                  alt="Share"
                />
                <img
                  src={editicon}
                  onClick={() => navigate("/create-profile", { state: { profileData } })}
                  className="w-7 h-7 cursor-pointer"
                  alt="Edit"
                />
              </div>
            </div>

            <p className="font-semibold text-[#343079]">
              {basicInfo.professional_title}
            </p>

            <div className="flex items-center gap-2">
              <img src={locationicon} alt="" className="w-4 h-4" />
              <span className="text-[#83828F]">{basicInfo.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <img src={jobicon} alt="" className="w-4 h-4" />
              <span className="text-[#83828F]">
                {basicInfo.job_alerts ? "Open to Opportunities" : "Not Open"}
              </span>
            </div>

            <div className="flex gap-3 mt-2">
              <button className="w-[300px] bg-[#343079] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                Contact Me <img src={messageicon} className="w-4 h-4" alt="" />
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
                className="rounded-lg w-[250px] max-h-[300px] object-cover shadow-md"
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
              <h2 className="font-bold text-[22px] text-[#343079]">
                About Me
              </h2>
            </div>
            <p className="text-[#343079]">{basicInfo.professional_bio}</p>
          </div>

          {/* Work Experience */}
          <div className="border border-[#EBEAF2] p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <img src={workicon} className="w-6 h-6" alt="" />
              <h2 className="font-bold text-[22px] text-[#343079]">
                Work Experience
              </h2>
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
                        <img
                          src={calendaricon}
                          alt="Calendar"
                          className="w-[16px] h-[16px]"
                        />
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
                        {exp.technologies
                          .split(",")
                          .map((tech, i) => (
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
                <p className="text-[#83828F] text-sm">
                  No work experience added.
                </p>
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
                        {proj.project_link && (
                          <img
                            src={linkicon}
                            className="w-[24px] h-[24px] cursor-pointer hover:opacity-80 transition"
                            alt="View Project"
                            onClick={() =>
                              navigate("/profile/project-description", {
                                state: { project: proj },
                              })
                            }
                          />
                        )}
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
              <h2 className="font-bold text-[22px] text-[#343079]">
                Contact Info
              </h2>
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
                  <span
                    key={i}
                    className=" text-[#343079] px-1 py-1  text-[16px]"
                  >
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
              <h2 className="font-bold text-[22px] text-[#343079]">
                Education
              </h2>
            </div>
            {education?.length > 0 ? (
              education.map((edu, i) => (
                <div key={i} className="flex flex-col gap-[4px]">
                  <p className="font-bold text-[#343079] text-[16px]">
                    {edu.education_level}
                  </p>
                  <p className="font-regular text-[16px] text-[#343079]">
                    {edu.college_name}
                  </p>
                  <p className="font-regular text-[16px] text-[#343079]">
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
              <h2 className="font-bold text-[22px] text-[#343079]">
                Certifications
              </h2>
            </div>
            {certifications?.length > 0 ? (
              certifications.map((cert, i) => (
                <div key={i} className="flex flex-col gap-[4px]">
                  <p className="font-semibold text-[#343079]">
                    {cert.certificate_name}
                  </p>
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

      {shareOpen && <ShareProfile onClose={() => setShareOpen(false)} />}
    </div>
  );
};

export default Profile;
