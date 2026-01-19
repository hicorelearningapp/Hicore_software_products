import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import routes from "../../../../Routes/routesConfig";

// ✅ Assets
import profilePlaceholder from "../../../../assets/StudentDashboardPage/profile-image.jpg";
import projectIcon from "../../../../assets/StudentDashboardPage/PROJECT.png";
import courseIcon from "../../../../assets/StudentDashboardPage/COURSE.png";
import certificateIcon from "../../../../assets/StudentDashboardPage/CERTIFICATE.png";
import challengeIcon from "../../../../assets/StudentDashboardPage/CHALLENGE.png";
import ongoingProjectIcon from "../../../../assets/StudentDashboardPage/Projects.png";
import achievementIcon from "../../../../assets/StudentDashboardPage/Award.png";
import techUpdateIcon from "../../../../assets/StudentDashboardPage/projectplan.png";
import bookIcon from "../../../../assets/StudentDashboardPage/book.png";
import editIcon from "../../../../assets/JobSeekerDashboardPage/Editprofile.png";
import experienceIcon from "../../../../assets/JobSeekerDashboardPage/Work.png";
import locationIcon from "../../../../assets/JobSeekerDashboardPage/Location.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const cleanPath = path.replace(/^\/+/, "");
  const base = API_BASE.replace(/\/+$/, "");
  return `${base}/${cleanPath}`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [projectDetails, setProjectDetails] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
const [loadingDashboard, setLoadingDashboard] = useState(true);

  const [error, setError] = useState("");

  // ✅ Local course mapping
  const coursesRoute = routes.find((r) => r.label === "Courses");
  const courseItems = coursesRoute?.items?.Courses?.data || {};
  const allLocalCourses = Object.values(courseItems)
    .flatMap((tab) => (Array.isArray(tab) ? tab : tab.courses || []))
    .reduce((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {});

  // ✅ Calendar setup
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else setCurrentMonth((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else setCurrentMonth((prev) => prev + 1);
  };

  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = getDaysInMonth(currentYear, currentMonth);
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="text-transparent">.</div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const isToday =
        d === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();
      days.push(
        <div
          key={d}
          className={`flex items-center justify-center w-8 h-8 rounded-full text-[12px] cursor-pointer transition-all duration-200 ${
            isToday
              ? "bg-[#EBEAF2] font-semibold"
              : "text-[#343079] hover:bg-[#EBEAF2]"
          }`}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  const handleCourseClick = (course) => {
    if (course?.id) {
      navigate(`/courses/${course.id}`, {
        state: { courseId: course.id, label: course.label },
      });
      return;
    }
    if (course?.path) {
      navigate(course.path, {
        state: { courseId: course.id, label: course.label },
      });
    }
  };

  // ✅ Fetch data (profile + dashboard + mini projects)
  useEffect(() => {
  const fetchProfileAndDashboard = async () => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");

    if (!userId || !role) {
      setError("User not logged in");
      setLoadingProfile(false);
      setLoadingDashboard(false);
      return;
    }

    try {
      // ✅ PARALLEL SAFE FETCH
      const [profileResponse, dashboardResponse] = await Promise.allSettled([
        axios.get(`${API_BASE}/profile/${userId}`),
        axios.get(`${API_BASE}/dashboard/${role}/${userId}`),
      ]);

      // ✅ PROFILE (never blocks dashboard)
      if (profileResponse.status === "fulfilled") {
        setProfileData(profileResponse.value.data);
      } else {
        console.warn("Profile API failed");
        setProfileData(null);
      }
      setLoadingProfile(false); // ✅ ALWAYS STOP PROFILE LOADER

      // ✅ DASHBOARD (controls full page)
      if (dashboardResponse.status === "fulfilled") {
        const dashboardData =
          dashboardResponse.value.data?.data?.dashboard || {};
        const summary = dashboardData.summary || {};
        const details = dashboardData.details || {};

        setSummaryData(summary);
        setOngoingCourses(details.course?.inprogress || []);

        const miniProjects = details.mini_project?.inprogress || [];
        setOngoingProjects(miniProjects);

        const grantedIds = miniProjects.map((p) => p.item_id);

        // ✅ SAFE FETCH (DOES NOT BLOCK DASHBOARD)
        if (grantedIds.length > 0) {
          fetch(`${API_BASE}/projects/mini_projects/by_domain`)
            .then((res) => res.json())
            .then((projectsData) => {
              let all = [];
              for (const domain in projectsData) {
                if (Array.isArray(projectsData[domain])) {
                  all = [...all, ...projectsData[domain]];
                }
              }

              const grantedDetails = all.filter((proj) =>
                grantedIds.includes(proj.id)
              );

              setProjectDetails(grantedDetails);
            })
            .catch((err) => {
              console.warn("Mini project API failed", err);
            });
        }
      } else {
        setError("Failed to load dashboard data.");
      }
    } catch (err) {
      console.error("Fatal dashboard crash:", err);
      setError("Failed to load dashboard.");
    } finally {
      setLoadingDashboard(false); // ✅ GUARANTEED EXECUTION
    }
  };

  fetchProfileAndDashboard();
}, []);



  if (loadingDashboard)
  return <div className="p-6 text-center text-gray-600">Loading dashboard...</div>;

if (error)
  return <div className="p-6 text-center text-red-500">{error}</div>;


  const { basicInfo = {}, skillsResume = {} } = profileData;
  const summary = summaryData || {
    projects_completed: 0,
    courses_completed: 0,
    certificates_acquired: 0,
    challenges_completed: 0,
  };

  const firstProject = projectDetails[0];

  return (
    <div className="p-6 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT SECTION */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Profile + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
<div
  onClick={() => profileData && navigate("/profile")}
  className="bg-[#FDFFED] rounded-lg border border-[#EBEAF2] p-6 flex flex-col items-center gap-[4px] cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
>
  {loadingProfile ? (

    <div className="text-center text-[#A4A2B3] py-10">
      Loading profile...
    </div>
  ) : profileData ? (
    <>
      {/* ✅ YOUR ORIGINAL PROFILE DESIGN — UNCHANGED */}
      <img
        src={getFullUrl(basicInfo?.profile_image) || profilePlaceholder}
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-[#008000] object-cover"
      />

      <div className="flex items-center w-full justify-between mt-2">
        <h2 className="text-[16px] font-semibold text-[#343079]">
          {basicInfo?.first_name} {basicInfo?.last_name}
        </h2>
        <img
          src={editIcon}
          alt="Edit Profile"
          className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/create-profile", { state: { profileData } });
          }}
        />
      </div>

      <div className="flex items-center w-full justify-start gap-[8px]">
        <img
          src={experienceIcon}
          className="w-[16px] h-[16px] object-contain"
          alt="Job"
        />
        <p className="text-[14px] text-[#343079] font-regular">
          {basicInfo?.professional_title || "Aspiring Frontend Developer"}
        </p>
      </div>

      <div className="flex items-center w-full justify-start gap-[8px]">
        <img src={locationIcon} className="w-4 h-4" alt="Location" />
        <p className="text-[14px] text-[#343079] font-regular">
          {basicInfo?.location || "Location not available"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2 justify-start">
        {skillsResume?.resume_skills?.length ? (
          skillsResume.resume_skills.slice(0, 5).map((skill, i) => (
            <span
              key={i}
              className="bg-[#F0F7FF] text-[#343079] text-[12px] font-regular px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-xs">No skills added</span>
        )}
        {skillsResume?.resume_skills?.length > 5 && (
          <span className="text-[#343079] text-xs cursor-pointer">
            +{skillsResume.resume_skills.length - 5} more &raquo;
          </span>
        )}
      </div>
    </>
  ) : (
    /* ✅ CREATE PROFILE UI (Only when profileData is null) */
    <div className="flex flex-col items-center justify-center text-center py-10">
      <p className="text-[#343079] font-semibold mb-2">
        Profile not created yet
      </p>
      <p className="text-[#A4A2B3] mb-4 text-sm">
        Create your student profile to start learning.
      </p>
      <button
        onClick={() => navigate("/create-profile")}
        className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-6 py-2 rounded-lg"
      >
        Create Profile
      </button>
    </div>
  )}
</div>


            {/* Stats Section */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[
                {
                  icon: projectIcon,
                  label: "Projects Completed",
                  value: summary.projects_completed,
                  bg: "bg-[#F3F3FB]",
                },
                {
                  icon: courseIcon,
                  label: "Courses Completed",
                  value: summary.courses_completed,
                  bg: "bg-[#FFFAEF]",
                },
                {
                  icon: certificateIcon,
                  label: "Certificates Acquired",
                  value: summary.certificates_acquired,
                  bg: "bg-[#F0F7FF]",
                },
                {
                  icon: challengeIcon,
                  label: "Challenges Completed",
                  value: summary.challenges_completed,
                  bg: "bg-[#E8FFDD]",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.bg} rounded-lg hover:drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-4 flex flex-col`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-[48px] h-[48px] mb-2 self-start"
                  />
                  <p className="text-[20px] font-semibold text-[#343079] text-center">
                    {item.value ?? 0}
                  </p>
                  <p className="text-[14px] font-regular text-[#343079] text-center">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ongoing Courses */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[16px] font-bold text-[#343079]">Ongoing Courses</h3>
              {ongoingCourses.length > 4 && (
                <button
                  onClick={() => navigate("/student-dashboard/learn/courses")}
                  className="text-[#343079] text-[13px] font-medium hover:underline"
                >
                  View All »
                </button>
              )}
            </div>

            {ongoingCourses.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {ongoingCourses.slice(0, 4).map((course) => {
                  const localCourse = allLocalCourses[course.item_id] || {};
                  const label = localCourse.label || course.item_id;
                  const icon = localCourse.icon || bookIcon;
                  const cardObj = { id: course.item_id, label, icon };

                  return (
                    <div
                      key={course.item_id}
                      onClick={() => handleCourseClick(cardObj)}
                      className="cursor-pointer bg-white border border-[#65629E] rounded-xl shadow-sm flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-gradient-to-br hover:from-[#B4A7D6] hover:to-[#E3E2F4] hover:border-[#7b68ee]"
                    >
                      <div className="p-6 relative">
                        <img
                          src={icon}
                          alt={label}
                          className="w-20 h-20 object-contain mx-auto"
                        />
                        <div className="absolute top-2 -right-3 bg-white/90 text-[11px] px-2 py-1 rounded-full border border-[#E6E6F0] font-medium">
                          {typeof course.progress !== "undefined"
                            ? `${course.progress}%`
                            : ""}
                        </div>
                      </div>
                      <div className="w-full py-2 bg-gradient-to-r from-[#B4A7D6] to-[#E3E2F4] text-[#2E2A72] font-semibold text-sm rounded-b-xl">
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 text-center">
                <img src={bookIcon} alt="Courses" className="w-[48px] h-[48px] mb-2" />
                <p className="text-[#A4A2B3] text-[14px] font-regular mb-3">
                  You’re not enrolled in any courses yet!
                  <br />
                  Start learning new skills today.
                </p>
                <button className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-5 py-2 rounded-lg text-[14px] font-semibold">
                  Browse Course
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Calendar + Events */}
        <div className="flex border border-gray-200 rounded-lg p-4 flex-col gap-6 h-full">
          <div className="bg-[#FBFBFD] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full">
                <FiChevronLeft />
              </button>
              <h3 className="text-[14px] font-bold text-[#343079]">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full">
                <FiChevronRight />
              </button>
            </div>
            <div className="grid grid-cols-7 text-[12px] text-[#C0BFD5] mb-3">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center font-semibold">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-3 text-[#343079] text-[12px] text-center flex-grow">
              {generateCalendarDays()}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#EBEAF2] p-6 flex flex-col items-center justify-center font-regular text-[#A4A2B3] text-[14px] text-center">
            <img
              src={techUpdateIcon}
              alt="Events"
              className="w-[48px] h-[48px] mb-2 opacity-70"
            />
            No upcoming events!
            <br />
            No submissions yet!
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* ✅ Ongoing Projects Section */}
        <div className="bg-white rounded-lg border border-[#EBEAF2] p-6 gap-[16px] flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[16px] font-bold text-[#343079] text-left">
              Ongoing Projects
            </h3>
            {ongoingProjects.length > 1 && (
              <button
                onClick={() => navigate("/student-dashboard/projects/mini-project")}
                className="text-[#343079] text-[13px] font-medium hover:underline"
              >
                View All »
              </button>
            )}
          </div>

          {firstProject ? (
            <div className="border border-gray-300 rounded-xl p-5 shadow-sm flex flex-col hover:shadow-md transition-all duration-200">
              <h3 className="font-semibold text-[#2E2E91] mb-2">{firstProject.title}</h3>
              <p className="text-sm text-gray-700 mb-3">{firstProject.description}</p>

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500">Tools/Software:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {firstProject.tools?.map((t) => (
                    <span
                      key={t}
                      className="bg-gray-200 text-xs px-2 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500">Tech Stack:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {firstProject.techStack?.map((t) => (
                    <span
                      key={t}
                      className="bg-gray-200 text-xs px-2 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6">
                <button
                  onClick={() =>
                    navigate(`/internship-project/${firstProject.id}/project-wizard`)
                  }
                  className="w-full bg-[#2E2E91] text-white text-sm py-2 rounded-md hover:bg-[#1f1f75]"
                >
                  Start Project
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <img
                src={ongoingProjectIcon}
                alt="Ongoing Project"
                className="w-[48px] h-[48px] mb-2"
              />
              <p className="text-[#A4A2B3] text-[14px] font-regular mb-3 text-center">
                You haven’t started any projects yet.
                <br /> Apply your skills in real-world challenges.
              </p>
              <button
                onClick={() => navigate("/student-dashboard/projects/mini-project")}
                className="bg-[#343079] text-[14px] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-5 py-2 rounded-lg"
              >
                Find Project
              </button>
            </div>
          )}
        </div>

        {/* Technology Updates */}
        <div className="bg-white rounded-lg border border-[#EBEAF2] shadow p-6">
          <div className="flex justify-between mb-4 items-center">
            <h3 className="text-[16px] font-bold text-[#343079]">
              Technology updates
            </h3>
            <button className="text-sm text-[#A4A2B3] hover:underline text-[12px] font-regular">
              View All
            </button>
          </div>
          <ul className="space-y-3">
            <li className="rounded-lg p-3 border text-[#343079] border-[#EBEAF2] text-sm">
              <span className="font-semibold text-[12px]">• AI/ML:</span> GitHub
              Copilot X brings real-time coding help{" "}
              <span className="text-[#A4A2B3] ml-2">1d ago</span>
            </li>
            <li className="rounded-lg p-3 border text-[#343079] border-[#EBEAF2] text-sm">
              <span className="font-semibold text-[12px]">• UI/UX:</span> Figma
              launches AI wireframe generator{" "}
              <span className="text-gray-400 ml-2">3d ago</span>
            </li>
          </ul>
        </div>

        {/* Achievements */}
        <div className="flex flex-col gap-[16px] rounded-lg border border-[#EBEAF2] shadow p-6">
          <h3 className="text-[16px] font-bold text-[#343079]">Achievements</h3>
          <div className="flex flex-col items-center gap-[16px]">
            <img
              src={achievementIcon}
              alt="Achievements"
              className="w-[48px] h-[48px] mb-2"
            />
            <p className="text-[#A4A2B3] text-[14px] font-regular text-center mb-3">
              No achievements unlocked yet.
              <br /> Start learning, building, and participating to earn your
              first badge!
            </p>
            <button className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-5 py-2 rounded-lg text-[14px] font-semibold">
              View Achievement Paths
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
