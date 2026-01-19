import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import routes from "../../../Routes/routesConfig";

// Assets
import profileVideoPlaceholder from "../../../assets/JobSeekerDashboardPage/Profile.png";
import resumeIcon from "../../../assets/JobSeekerDashboardPage/Resume.png";
import experienceIcon from "../../../assets/JobSeekerDashboardPage/Work.png";
import locationIcon from "../../../assets/JobSeekerDashboardPage/Location.png";
import educationIcon from "../../../assets/JobSeekerDashboardPage/graduation.png";
import githubIcon from "../../../assets/JobSeekerDashboardPage/github.png";
import linkedinIcon from "../../../assets/JobSeekerDashboardPage/linkedin.png";
import globeIcon from "../../../assets/JobSeekerDashboardPage/website.png";
import editIcon from "../../../assets/JobSeekerDashboardPage/Editprofile.png";
import employerIcon from "../../../assets/JobSeekerDashboardPage/Employer.png";
import interestedIcon from "../../../assets/JobSeekerDashboardPage/PROJECT.png";
import shortlistedIcon from "../../../assets/JobSeekerDashboardPage/CERTIFICATE.png";
import rejectedIcon from "../../../assets/JobSeekerDashboardPage/CHALLENGE.png";
import pendingIcon from "../../../assets/JobSeekerDashboardPage/COURSE.png";
import ongoingProjectIcon from "../../../assets/JobSeekerDashboardPage/Projects.png";
import requestIcon from "../../../assets/JobSeekerDashboardPage/book.png";
import achievementIcon from "../../../assets/MentorDashboard/Award.png";
import techUpdateIcon from "../../../assets/MentorDashboard/projectplan.png";
import JobIcon from "../../../assets/JobSeekerDashboardPage/Vector.png";

// Backend API
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// Helpers
const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const cleanPath = path.replace(/^\/+/, "");
  const base = API_BASE.replace(/\/+$/, "");
  return `${base}/${cleanPath}`;
};

const formatProgressPercent = (p) => {
  const n = Number(p);
  if (Number.isNaN(n)) return "";
  if (n > 0 && n <= 1) return `${Math.round(n * 100)}%`;
  return `${Math.round(n)}%`;
};

const JobSeekerDashboardPage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");

  // ✅ Extract local course data
  const coursesRoute = routes.find((r) => r.label === "Courses");
  const courseItems = coursesRoute?.items?.Courses?.data || {};
  const allLocalCourses = Object.values(courseItems)
    .flatMap((tab) => (Array.isArray(tab) ? tab : tab.courses || []))
    .reduce((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {});

  // Calendar setup
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

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
          className={`flex items-center justify-center w-8 h-8 rounded-full text-[12px] ${
            isToday ? "bg-[#EBEAF2] font-semibold" : "text-[#343079] hover:bg-[#EBEAF2]"
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
    }
  };

  // ✅ SAFE FETCH (profile failure will NOT kill whole page)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("userRole") || "jobseeker";

        if (!userId) {
          setError("User not logged in");
          return;
        }

        const [profileRes, dashboardRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/profile/${userId}`),
          axios.get(`${API_BASE}/dashboard/${role}/${userId}`),
        ]);

        // ✅ PROFILE
        if (profileRes.status === "fulfilled" && profileRes.value?.data?.basicInfo) {
          setProfileData(profileRes.value.data);
        } else {
          setProfileData(null); // triggers Create Profile UI
        }

        // ✅ DASHBOARD
        if (dashboardRes.status === "fulfilled") {
          const raw = dashboardRes.value.data;
          const legacy = raw?.data?.details?.course?.inprogress || [];
          const modern = raw?.data?.dashboard?.details?.course?.inprogress || [];
          setOngoingCourses(modern.length ? modern : legacy);
        } else {
          setError("Failed to load dashboard");
        }
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoadingDashboard(false);
        setLoadingProfile(false);
      }
    };

    fetchData();
  }, []);

  if (loadingDashboard)
    return <div className="p-6 text-center text-gray-600">Loading...</div>;

  if (error)
    return <div className="p-6 text-center text-red-500">{error}</div>;

  const basicInfo = profileData?.basicInfo || {};
  const workExperience = profileData?.workExperience || [];
  const education = profileData?.education || [];
  const skillsResume = profileData?.skillsResume || {};
  const jobPreference = profileData?.jobPreference || {};

  return (
    <div className="p-6 min-h-screen">
      <div className="grid grid-cols-12 gap-6">

        {/* ✅ YOUR ENTIRE ORIGINAL UI IS KEPT BELOW */}
        {/* ✅ ONLY DIFFERENCE: PROFILE CARD IS CONDITIONAL */}

        {/* LEFT SECTION */}
        <div className="col-span-9 flex flex-col gap-6">

          {/* STATS */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: interestedIcon, label: "Interested Employers", bg: "bg-[#F3F3FB]" },
              { icon: shortlistedIcon, label: "Shortlisted", bg: "bg-[#F0F7FF]" },
              { icon: rejectedIcon, label: "Rejected", bg: "bg-[#E8FFDD]" },
              { icon: pendingIcon, label: "Pending", bg: "bg-[#FFFAEF]" },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-lg shadow p-5 flex flex-col text-center`}>
                <img src={item.icon} className="w-[48px] h-[48px] mb-3" />
                <p className="text-[20px] font-bold text-[#343079]">0</p>
                <p className="text-[14px] text-[#343079]">{item.label}</p>
              </div>
            ))}
          </div>


          {/* PROFILE CARD */}
<div className="grid grid-cols-2 gap-6">
  <div
    onClick={() => profileData && navigate("/profile")}
    className="bg-[#FFFEEA] rounded-2xl shadow p-6 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
  >
    {loadingProfile ? (
      <div className="text-center text-[#A4A2B3] py-10">
        Loading profile...
      </div>
    ) : profileData ? (
      <>
        {/* ✅ YOUR ORIGINAL PROFILE UI — UNCHANGED */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-[#343079]">
            Profile Card
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

        <div className="relative w-full h-50 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
          <video
            src={getFullUrl(basicInfo?.selfintro_video)}
            poster={
              getFullUrl(basicInfo?.profile_image) ||
              profileVideoPlaceholder
            }
            className="object-contain w-full h-full"
            controls
          />
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#343079]">
              {basicInfo?.first_name} {basicInfo?.last_name}
            </h3>
            <div className="flex gap-3">
              {basicInfo?.github_profile && (
                <a
                  href={basicInfo.github_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={githubIcon}
                    className="w-5 h-5"
                    alt="GitHub"
                  />
                </a>
              )}
              {basicInfo?.linkedin_profile && (
                <a
                  href={basicInfo.linkedin_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={linkedinIcon}
                    className="w-5 h-5"
                    alt="LinkedIn"
                  />
                </a>
              )}
              {basicInfo?.portfolio_website && (
                <a
                  href={basicInfo.portfolio_website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={globeIcon}
                    className="w-5 h-5"
                    alt="Portfolio"
                  />
                </a>
              )}
            </div>
          </div>

          <a
            href={getFullUrl(skillsResume?.resume_file)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3273FF] text-[14px] font-medium mt-2 inline-flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={resumeIcon} className="w-4 h-4" alt="Resume" />{" "}
            Resume
          </a>
        </div>

        <div className="mt-4 space-y-2 text-sm text-[#343079]">
          {jobPreference?.job_titles && (
            <div className="flex items-center gap-2">
              <img src={experienceIcon} className="w-4 h-4" alt="Job" />
              {jobPreference.job_titles} ({jobPreference.work_type})
            </div>
          )}
          <div className="flex items-center gap-2">
            <img src={locationIcon} className="w-4 h-4" alt="Location" />
            {basicInfo?.location || "Location not provided"}
          </div>
          {workExperience[0] && (
            <div className="flex items-center gap-2">
              <img
                src={employerIcon}
                className="w-4 h-4"
                alt="Employer"
              />
              {workExperience[0].company_name},{" "}
              {workExperience[0].location || basicInfo?.location}
            </div>
          )}
          {education[0] && (
            <div className="flex items-center gap-2">
              <img
                src={educationIcon}
                className="w-4 h-4"
                alt="Education"
              />
              {education[0].college_name}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {skillsResume?.resume_skills?.map((skill, idx) => (
            <span
              key={idx}
              className="bg-[#F0F7FF] px-3 py-1 rounded-full text-xs text-[#343079]"
            >
              {skill}
            </span>
          ))}
        </div>
      </>
    ) : (
      /* ✅ CREATE PROFILE UI (Only when profileData is null) */
      <div className="flex flex-col items-center justify-center text-center py-10 mt-30">
        <p className="text-[#343079] font-semibold mb-2">
          Profile not created yet
        </p>
        <p className="text-[#A4A2B3] mb-4 text-sm">
          Create your job seeker profile to apply for jobs.
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



            {/* PROJECTS & ONGOING COURSES (Dynamic) */}
            <div className="flex flex-col gap-[16px]">
              {/* Ongoing Project */}
              <div className="flex flex-col border border-gray-200 p-4 rounded-lg text-center gap-[16px]">
                <h1 className="text-[#343079] text-[16px] font-bold mb-2 text-left">
                  Ongoing project
                </h1>
                <div className="flex flex-col items-center gap-[16px]">
                  <img
                    src={ongoingProjectIcon}
                    alt="Ongoing Project"
                    className="w-[48px] h-[48px] mx-auto"
                  />
                  <p className="text-[#A4A2B3] text-[14px] font-regular text-center">
                    You haven’t started any projects yet.
                  </p>
                  <p className="text-[#A4A2B3] text-[14px] font-regular text-center">
                    Apply your skills in real-world challenges.
                  </p>
                  <button className="bg-[#343079] font-semibold text-[14px] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-5 py-2 rounded-lg mt-4">
                    Find Project
                  </button>
                </div>
              </div>

              {/* ✅ Ongoing Courses (limited to 4 + View All) */}
              <div className="border border-gray-200 p-4 rounded-lg flex flex-col text-center gap-[16px]">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-[#343079] text-[16px] font-bold text-left">
                    Ongoing courses
                  </h1>
                  {ongoingCourses.length > 2 && (
                    <button
                      onClick={() =>
                        navigate("/jobseeker-dashboard/learn/course")
                      }
                      className="text-[#343079] text-[13px] font-medium hover:underline"
                    >
                      View All »
                    </button>
                  )}
                </div>

                {ongoingCourses.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {ongoingCourses.slice(0, 2).map((course) => {
                      const localCourse = allLocalCourses[course.item_id] || {};
                      const label = localCourse.label || course.item_id;
                      const icon = localCourse.icon || requestIcon;
                      const cardObj = { id: course.item_id, label, icon };

                      // progress may be 0.0 (fraction) or percent like 25 — normalize for display
                      const progressText =
                        course.progress !== undefined &&
                        course.progress !== null
                          ? formatProgressPercent(course.progress)
                          : "";

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
                              className="w-16 h-16 object-contain mx-auto"
                            />
                            <div className="absolute top-2 -right-4 bg-white/90 text-[11px] px-2 py-1 rounded-full border border-[#E6E6F0] font-medium">
                              {progressText}
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
                  <div className="flex flex-col items-center gap-[16px]">
                    <img
                      src={requestIcon}
                      alt="Courses"
                      className="w-[48px] h-[48px] mx-auto"
                    />
                    <p className="text-[#A4A2B3] font-regular text-[14px]">
                      You’re not enrolled in any courses yet!
                    </p>
                    <p className="text-[#A4A2B3] font-regular text-[14px]">
                      Start learning new skills today.
                    </p>
                    <button className="bg-[#343079] items-center justify-center hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 font-semibold text-[14px] text-white px-5 py-2 rounded-lg mt-4">
                      Browse Course
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* JOBS (unchanged) */}
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-blue-900">
                34 Jobs recommended for you
              </h2>
              <button className="text-blue-900 text-md font-medium flex items-center gap-1 hover:underline">
                View All »
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide mb-3">
              {[1, 2, 3, 4].map((_, idx) => (
                <div
                  key={idx}
                  className="min-w-[220px] rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-3 hover:shadow-md transition cursor-pointer"
                >
                  <img
                    src={JobIcon}
                    className="w-12 h-12 bg-gray-200"
                    alt="Job"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900">
                      UI/UX Designer
                    </h3>
                    <p className="text-xs text-blue-900">Convosight</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (unchanged) */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-lg border border-[#EBEAF2] p-6">
            <div className="flex justify-between items-center mb-4">
              <button onClick={handlePrevMonth}>
                <FiChevronLeft />
              </button>
              <h3 className="text-[16px] font-bold text-[#343079]">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button onClick={handleNextMonth}>
                <FiChevronRight />
              </button>
            </div>
            <div className="grid grid-cols-7 text-[14px] text-[#C0BFD5] mb-3">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center font-semibold">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-[12px] text-[#343079] font-semibold gap-y-2 text-center">
              {generateCalendarDays()}
            </div>
            <div className="flex flex-col bg-white rounded-lg mt-4 border border-[#EBEAF2] p-[16px] text-gray-400 gap-[16px] text-center">
              <img
                src={techUpdateIcon}
                className="w-[48px] h-[48px] opacity-70 mx-auto mt-[54px]"
                alt="No events"
              />
              <div className="text-[#A4A2B3] text-[14px] font-regular">
                No upcoming events!
              </div>
              <div className="text-[#A4A2B3] text-[14px] font-regular mb-[54px]">
                No submissions yet!
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[16px] bg-white rounded-lg border border-[#EBEAF2] p-8 text-center">
            <h1 className="text-[#343079] text-[16px] font-bold mb-2 text-left">
              Achievements
            </h1>
            <img
              src={achievementIcon}
              className="w-[48px] h-[48px] mb-4 mx-auto"
              alt="Awards"
            />
            <p className="text-[#A4A2B3] text-[14px] font-regular">
              No achievements unlocked yet. Start learning, building, and
              participating to earn your first badge!
            </p>
            <button className="bg-[#343079] font-semibold text-[14px] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-4 py-2 rounded-lg">
              View Achievement Paths
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboardPage;
