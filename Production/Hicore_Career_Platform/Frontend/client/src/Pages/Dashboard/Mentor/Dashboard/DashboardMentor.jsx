import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

import profilePic from "../../../../assets/MentorDashboard/image.jpg";

// ✅ Import icons from assets
import projectIcon from "../../../../assets/MentorDashboard/PROJECT.png";
import courseIcon from "../../../../assets/MentorDashboard/COURSE.png";
import certificateIcon from "../../../../assets/MentorDashboard/CERTIFICATE.png";
import challengeIcon from "../../../../assets/MentorDashboard/CHALLENGE.png";
import ongoingProjectIcon from "../../../../assets/MentorDashboard/Growth.png";
import requestIcon from "../../../../assets/MentorDashboard/Add.png";
import achievementIcon from "../../../../assets/MentorDashboard/Award.png";
import techUpdateIcon from "../../../../assets/MentorDashboard/projectplan.png";
import Icon from "../../../../assets/MentorDashboard/Profit.png";
import editprofile from "../../../../assets/MentorDashboard/editprofile.png";
import professionalicon from "../../../../assets/MentorDashboard/Professional.png";
import staricon from "../../../../assets/MentorDashboard/star.png";
import reviewicon from "../../../../assets/MentorDashboard/Review.png";
import workicon from "../../../../assets/MentorDashboard/Work.png";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const DashboardMentor = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  
useEffect(() => {
  const user_id =
    localStorage.getItem("user_id") || localStorage.getItem("userId");

  console.log("Mentor Dashboard user_id:", user_id);

  if (!user_id) {
    setLoadingProfile(false);
    return;
  }

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/profile/${user_id}`
      );

      if (response.status === 200) {
        const data = response.data;

        setProfileData({
          name:
            data?.basicInfo?.first_name && data?.basicInfo?.last_name
              ? `${data.basicInfo.first_name} ${data.basicInfo.last_name}`
              : "Mentor",

          designation:
            data?.basicInfo?.professional_title || "Not specified",

          profileImage:
            data?.basicInfo?.profile_image
              ? data.basicInfo.profile_image
              : null,

          status: data?.basicInfo?.job_alerts ? "Available" : "Busy",

          projects: data?.projects?.length || 0,

          rating: data?.basicInfo?.rating || 0,

          reviews: data?.basicInfo?.reviews || 0,
        });

        console.log("✅ Mentor profile loaded:", data);
      }
    } catch (error) {
      console.error("❌ Mentor profile fetch failed:", error);

      if (error.response) {
        console.error(
          "API Error:",
          error.response.status,
          error.response.data
        );
      }

      setProfileData(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  fetchProfile();
}, []);


useEffect(() => {
  const user_id =
    localStorage.getItem("user_id") || localStorage.getItem("userId");

  if (!user_id) {
    setLoadingStats(false);
    return;
  }

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dashboard/mentor/${user_id}`);

      if (res.status === 200) {
        const summary = res.data?.data?.dashboard?.summary || {};
        setDashboardStats(summary);
      }
    } catch (error) {
      console.error("❌ Dashboard stats fetch failed:", error);
      setDashboardStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  fetchDashboardStats();
}, []);

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
      days.push(
        <div key={`empty-${i}`} className="text-transparent">
          .
        </div>
      );
    }

    


    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

      days.push(
        <div
          key={day}
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm cursor-pointer transition-all duration-200 ${
            isToday
              ? "bg-[#EBEAF2] text-[#343079] font-semibold"
              : "text-[#343079] hover:bg-[#F8F9FE]"
          }`}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Section */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Profile + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr] gap-6">
            {/* ✅ Profile*/}
            {/* ✅ Profile*/}
<div className="bg-[#FDFFED] rounded-lg border border-[#EBEAF2] p-6 w-full flex flex-col justify-center">

  {loadingProfile ? (
    <div className="text-center text-[#A4A2B3] py-10">
      Loading profile...
    </div>
  ) : profileData ? (
    <>
      <div className="flex justify-center relative">
        <img
          src={
  profileData.profileImage
    ? profileData.profileImage.startsWith("http")
      ? profileData.profileImage
      : `${API_BASE}/${profileData.profileImage.replace(/^\/+/, "")}`
    : profilePic
}

          alt="Profile"
          className="w-32 h-32 rounded-full border-[6px] border-green-500 object-cover"
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <h2 className="text-[16px] font-semibold text-[#343079]">
          {profileData.name || "Mentor"}
        </h2>
        <img
          src={editprofile}
          alt="edit"
          className="w-[22px] h-[22px] cursor-pointer hover:scale-110 transition-transform"
        />
      </div>

      <div className="flex flex-row mt-1 gap-[8px] items-center">
        <img src={workicon} alt="work" className="w-[16px] h-[16px] object-contain" />
        <p className="text-[14px] text-[#343079]">
          {profileData.designation || "Not specified"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 text-[14px] text-[#343079]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#008000] rounded-full"></span>
          <span>{profileData.status || "Available"}</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={professionalicon} className="w-[18px] h-[18px]" />
          <span>{profileData.projects || 0} Projects completed</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={staricon} className="w-[18px] h-[18px]" />
          <span>{profileData.rating || 0}</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={reviewicon} className="w-[18px] h-[18px]" />
          <span>{profileData.reviews || 0} Reviews</span>
        </div>
      </div>
    </>
  ) : (
    // ✅ NO PROFILE FOUND → CREATE PROFILE UI
    <div className="flex flex-col items-center justify-center text-center py-10">
      <p className="text-[#343079] font-semibold mb-2">
        Profile not created yet
      </p>
      <p className="text-[#A4A2B3] mb-4 text-sm">
        Create your mentor profile to start accepting mentees.
      </p>
      <a
        href="/create-profile"
        className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-6 py-2 rounded-lg"
      >
        Create Profile
      </a>
    </div>
  )}
</div>


            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
  {
    icon: projectIcon,
    label: "Projects Completed",
    value: dashboardStats?.projects_completed,
    bg: "bg-[#F3F3FB]",
  },
  {
    icon: courseIcon,
    label: "Ongoing Projects",
    value: dashboardStats?.ongoing_projects,
    bg: "bg-[#FFFAEF]",
  },
  {
    icon: certificateIcon,
    label: "Courses Completed",
    value: dashboardStats?.courses_completed,
    bg: "bg-[#F0F7FF]",
  },
  {
    icon: challengeIcon,
    label: "Challenges Completed",
    value: dashboardStats?.challenges_completed,
    bg: "bg-[#E8FFDD]",
  },
]
.map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.bg} rounded-lg p-5 flex flex-col`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-12 h-12 mb-2 self-start"
                  />
                  <p className="text-2xl font-bold text-[#343079] text-center">
  {loadingStats ? "…" : item.value ?? 0}
</p>

                  <p className="text-sm text-[#343079] text-center">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ongoing Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-[#EBEAF2] p-3 rounded-lg">
              <h1 className="text-md text-[#343079] font-bold m-1 mb-4">
                Monthly Performance
              </h1>
              <div className="bg-white rounded-lg border border-[#EBEAF2]  p-6 flex flex-col items-center">
                <img
                  src={ongoingProjectIcon}
                  alt="Ongoing Project"
                  className="w-10 h-10 mb-2"
                />
                <p className="text-[#A4A2B3] mb-3 text-center">
                  Conduct sessions, provide feedback, and guide projects to
                  track your monthly impact.
                </p>
                <button className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white mt-2 px-5 py-2 rounded-lg">
                  Schedule a Session
                </button>
              </div>
            </div>

            <div className="border border-[#EBEAF2] p-3 rounded-lg">
              <h1 className="text-md text-[#343079] font-bold m-1 mb-4">
                New Mentee Request
              </h1>
              <div className="bg-white rounded-lg border border-[#EBEAF2] p-6 flex flex-col items-center">
                <img
                  src={requestIcon}
                  alt="Request"
                  className="w-10 h-10 mb-2"
                />
                <p className="text-[#A4A2B3] mb-3 text-center">
                  When mentees request guidance, their details will appear here.
                </p>
                <button className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-5 mt-2 py-2 rounded-lg">
                  Update Availability
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Calendar */}
        <div className="flex border border-[#EBEAF2] rounded-lg p-4 flex-col gap-6 h-full">
          <div className="bg-[#FBFBFD] rounded-lg border border-[#EBEAF2] p-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <FiChevronLeft />
              </button>
              <h3 className="text-lg font-bold text-[#343079]">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <FiChevronRight />
              </button>
            </div>
            <div className="grid grid-cols-7 text-xs text-[#C0BFD5] mb-3">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center flex-grow">
              {generateCalendarDays()}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#EBEAF2] p-6 flex flex-col items-center justify-center text-[#A4A2B3] text-center">
            <img
              src={techUpdateIcon}
              alt="Events"
              className="w-10 h-10 mb-2 opacity-70"
            />
            No Sessions yet!
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6 mt-6">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-semibold text-[#343079]">Earnings</h3>
          </div>
          <div className="border border-[#EBEAF2] rounded-lg flex flex-col items-center justify-center p-8 text-center">
            <img src={Icon} alt="Courses" className="w-10 h-10 mb-2" />
            <p className="text-[#A4A2B3] mb-3">
              You’re not enrolled in any courses yet!
              <br />
              Start learning new skills today.
            </p>
            <button className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-5 py-2 rounded-lg">
              Browse Course
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#EBEAF2] p-6 flex flex-col items-center justify-center">
          <img
            src={achievementIcon}
            alt="Achievements"
            className="w-10 h-10 mb-2"
          />
          <p className="text-[#A4A2B3] text-center mb-3">
            No achievements unlocked yet.
            <br />
            Start learning, building, and participating to earn your first
            badge!
          </p>
          <button className="bg-[#343079] hover:bg-gradient-to-r hover:from-[#343079] hover:to-[#918ECC] transition-all duration-300 text-white px-5 py-2 rounded-lg">
            View Achievement Paths
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMentor;
