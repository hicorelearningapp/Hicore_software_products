import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ICONS */
import searchIcon from "../../assets/StudentDashboard/search.png";
import bellIcon from "../../assets/StudentDashboard/Notification.png";
import mailIcon from "../../assets/StudentDashboard/Message.png";
import profileImg from "../../assets/StudentDashboard/Profile.jpg";

const tabs = ["Dashboard", "Exams", "Classes", "Calendar", "Analytics"];

const TeacherDashboardNavbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  // 🔹 Load saved tab on first render
  useEffect(() => {
    const savedTab = localStorage.getItem("studentActiveTab");
    if (savedTab && tabs.includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, [setActiveTab]);

  // 🔹 Handle tab click + save
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("studentActiveTab", tab);
  };

  return (
    <div className="bg-[#FBFBFB] px-8 py-6 flex items-center justify-between">
      {/* LEFT LOGO */}
      <h1
        onClick={() => navigate("/")}
        className="text-[#2758B3] font-semibold text-lg cursor-pointer hover:opacity-80 transition"
      >
        HiCore Exam AI
      </h1>

      {/* CENTER TABS */}
      <div className="flex items-center border border-[#BFD1FF] rounded-full px-2 py-1">
        <div className="flex rounded-full p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                ${
                  activeTab === tab
                    ? "bg-[#2758B3] text-white shadow"
                    : "text-[#2758B3] hover:bg-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-4">
        <button className="w-12 h-12 flex items-center justify-center rounded-full border border-[#BFD1FF] hover:bg-[#F2F6FF] transition">
          <img src={searchIcon} alt="Search" className="w-6 h-6" />
        </button>

        <button className="w-12 h-12 flex items-center justify-center rounded-full border border-[#BFD1FF] hover:bg-[#F2F6FF] transition">
          <img src={bellIcon} alt="Notifications" className="w-6 h-6" />
        </button>

        <button className="w-12 h-12 flex items-center justify-center rounded-full border border-[#BFD1FF] hover:bg-[#F2F6FF] transition">
          <img src={mailIcon} alt="Messages" className="w-6 h-6" />
        </button>

        <img
          src={profileImg}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
      </div>
    </div>
  );
};

export default TeacherDashboardNavbar;
