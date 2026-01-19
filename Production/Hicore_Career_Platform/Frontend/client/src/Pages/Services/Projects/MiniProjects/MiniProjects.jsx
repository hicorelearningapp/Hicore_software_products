import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import studentlapImg from "../../../../assets/StudentLap.png";
import bannerBg from "../../../../assets/banner-bg.png";
import footerBg from "../../../../assets/Bottom frame .png";
import iconCertified from "../../../../assets/Certificate_project.png";
import iconPortfolio from "../../../../assets/Job.png";
import iconSkills from "../../../../assets/Skill.png";
import iconMentor from "../../../../assets/Mentor_Internship.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const MiniProjects = () => {
  const [domains, setDomains] = useState([]);
  const [projectsByDomain, setProjectsByDomain] = useState({});
  const [selectedDomain, setSelectedDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingProjectId, setLoadingProjectId] = useState(null);
  const navigate = useNavigate();

  // ✅ Replace with actual logged-in user ID from localStorage or context
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [domainRes, projectsRes] = await Promise.all([
          fetch(`${API_BASE}/projects/mini_projects/domains`),
          fetch(`${API_BASE}/projects/mini_projects/by_domain`),
        ]);

        if (!domainRes.ok || !projectsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const domainData = await domainRes.json();
        const projectsData = await projectsRes.json();

        setDomains(domainData);
        setProjectsByDomain(projectsData);
        if (domainData.length > 0 && !selectedDomain) {
          setSelectedDomain(domainData[0]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Something went wrong while loading projects.");
      } finally {
        setLoading(false);
      }
    };

    if (domains.length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [domains, selectedDomain]);

const handleStartProject = async (projectId) => {
  try {
    setLoadingProjectId(projectId);

    const userId = Number(localStorage.getItem("userId"));
    if (!userId) {
      alert("User not logged in");
      return;
    }

    // 1️⃣ NOTIFY MENTOR
    try {
      await fetch(`${API_BASE}/api/student/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: userId,
          project_id: projectId,
          project_type: "mini",
        }),
      });
      console.log("Mentor notified successfully");
    } catch (notifyErr) {
      console.warn("Mentor notification failed, but continue...");
    }

    // 2️⃣ GRANT ACCESS
    try {
      await fetch(`${API_BASE}/access/grant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          item_type: "project",
          item_id: projectId,
        }),
      });
      console.log("Access granted successfully");
    } catch (grantErr) {
      console.warn("Access grant failed, but still allowing entry...");
    }

    // 3️⃣ ENTER PROJECT ALWAYS
    navigate(`/internship-project/${projectId}/project-wizard`);

  } catch (err) {
    console.error("START PROJECT ERROR:", err);
    alert("Something went wrong");
  } finally {
    setLoadingProjectId(null);
  }
};


  const projects = projectsByDomain[selectedDomain] || [];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Banner */}
      <div
        className="w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerBg})`, padding: "64px" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-[36px]">
          <div className="w-full md:w-[515px] flex justify-center">
            <img
              src={studentlapImg}
              alt="Student"
              className="w-[300px] md:w-[515px] object-contain"
            />
          </div>
          <div className="w-full md:w-[638px] flex flex-col gap-6 text-center md:text-left">
            <h1 className="font-[Poppins] text-[28px] md:text-[36px] font-normal text-[#343079] leading-[48px] md:leading-[84px]">
              Explore Mini Projects
            </h1>
            <p className="font-[Poppins] text-[18px] md:text-[20px] font-semibold text-[#343079] leading-[32px] md:leading-[48px]">
              Build, Innovate, and Get Certified with Real-World Engineering
              Projects
            </p>
            <p className="font-[Poppins] text-[14px] md:text-[16px] font-normal text-[#343079] leading-[28px] md:leading-[32px]">
              Choose from a diverse list of hands-on engineering projects across
              various domains. Gain practical experience, collaborate with
              experts, and earn certifications to boost your career.
            </p>
          </div>
        </div>
      </div>

      {/* Domain Filter */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-6 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                selectedDomain === domain
                  ? "bg-[#343079] text-white border-[#343079]"
                  : "bg-white text-[#343079] border-[#C0BFD5] cursor-pointer hover:border-[#343079] hover:bg-gray-100"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="border border-gray-300 rounded-2xl p-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg font-medium text-gray-600">
                Loading projects...
              </p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg font-medium text-red-600">{error}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg font-medium text-gray-600">
                No projects available in this domain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-300 rounded-xl p-5 shadow-sm flex flex-col"
                >
                  <h3 className="font-poppins font-bold text-[#343079] text-[16px] mb-8">
                    {project.title}
                  </h3>
                  <p className="font-poppins text-sm font-regular text-[#343079] text-[14px] mb-8">
                    {project.description}
                  </p>
                  <div className="mb-3">
                    <p className="font-poppins text-[14px] font-regular text-[#343079]">
                      Tools/Software:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.tools.map((t) => (
                        <span
                          key={t}
                          className="bg-[#EDECF8] text-[#2F2E4A] text-[12px] px-2 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="font-poppins text-[14px] font-regular text-[#343079]">
                      Tech Stack:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.techStack.map((t) => (
                        <span
                          key={t}
                          className="bg-[#EDECF8] text-[#2F2E4A] text-[12px] px-2 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <button
                      onClick={() => handleStartProject(project.id)}
                      disabled={loadingProjectId === project.id}
                      className={`w-full h-[44px] bg-[#282655] text-white cursor-pointer text-[16px] py-2 rounded-md hover:bg-[#403B93] hover:border-[white] ${
                        loadingProjectId === project.id
                          ? "opacity-60 cursor-wait"
                          : ""
                      }`}
                    >
                      {loadingProjectId === project.id
                        ? "Checking Access..."
                        : "Start Project"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="w-full bg-cover bg-center py-12 mb-8"
        style={{ backgroundImage: `url(${footerBg})` }}
      >
        <div className="w-full px-4">
          <div className="flex flex-col items-center md:flex-row  gap-8">
            <div className="text-center md:text-left md:w-[22%]">
              <p className="text-xl md:text-2xl font-semibold text-center justify-center text-[#2E2E91] font-[Poppins] leading-tight">
                Why Choose These
              </p>
              <p className="text-xl md:text-2xl font-semibold text-center justify-center text-[#2E2E91] font-[Poppins] ml-0 md:ml-6">
                Projects?
              </p>
            </div>
            <div className="w-full md:w-[78%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[iconCertified, iconPortfolio, iconSkills, iconMentor].map(
                (icon, idx) => {
                  const titles = [
                    "Get Certified",
                    "Portfolio Ready",
                    "Industry-Relevant Skills",
                    "Mentor-Guided",
                  ];
                  const descs = [
                    "With MNC-recognized credentials",
                    "Projects that showcase your capabilities",
                    "Learn what’s in demand",
                    "Expert support throughout your project",
                  ];
                  return (
                    <div
                      key={idx}
                      className="bg-white bg-opacity-80 rounded-[8px] border border-[#D1D5DB] shadow-sm text-center px-4 py-4 flex flex-col items-center gap-2"
                      style={{ minHeight: "160px" }}
                    >
                      <img
                        src={icon}
                        alt={titles[idx]}
                        className="w-[36px] h-[36px]"
                      />
                      <p className="font-medium text-[#2E2E91] text-[14px] font-[Poppins]">
                        {titles[idx]}
                      </p>
                      <p className="text-sm text-gray-700 font-[Poppins] text-[14px]">
                        {descs[idx]}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniProjects;
