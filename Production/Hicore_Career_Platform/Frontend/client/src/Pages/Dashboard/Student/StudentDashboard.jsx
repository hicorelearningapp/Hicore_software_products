import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import axios from "axios";
import menuItems from "./menuItems";

import logoIcon from "../../../assets/StudentDashboard/share-knowledge.png";
import groupIcon from "../../../assets/StudentDashboard/Community.png";
import mailIcon from "../../../assets/StudentDashboard/Message.png";
import bellIcon from "../../../assets/StudentDashboard/Notification.png";
import handicon from "../../../assets/JobSeekerDashboardPage/hand.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasAutoNavigatedRef = useRef(false);

  const [openMenus, setOpenMenus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(menuItems[0]?.label || "");
  const [activeSubMenu, setActiveSubMenu] = useState("");
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch student profile info for greeting + role check
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/login");
          return;
        }

        // ✅ Fetch profile data instead of auth
        const res = await axios.get(`${API_BASE}/profile/${userId}`);
        const user = res.data?.basicInfo || {};

        // ✅ Role validation
        if (user.role && user.role.toLowerCase() !== "student") {
          alert("Access denied. Only students can view this dashboard.");
          navigate("/");
          return;
        }

        setStudentName(`${user.first_name || ""} ${user.last_name || ""}`);
      } catch (error) {
        console.error("❌ Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // ✅ Sync active menu with URL & default auto-navigation
  useEffect(() => {
    let found = false;

    menuItems.forEach((item) => {
      if (item.path && item.path === location.pathname) {
        setActiveMenu(item.label);
        setActiveSubMenu("");
        setOpenMenus((prev) => ({ ...prev, [item.label]: false }));
        found = true;
      }
      if (item.subMenu) {
        item.subMenu.forEach((sub) => {
          if (sub.path && sub.path === location.pathname) {
            setActiveMenu(item.label);
            setActiveSubMenu(sub.label);
            setOpenMenus((prev) => ({ ...prev, [item.label]: true }));
            found = true;
          }
        });
      }
    });

    if (!found && !hasAutoNavigatedRef.current) {
      hasAutoNavigatedRef.current = true;
      const first = menuItems[0];
      if (!first) return;

      if (first.subMenu && first.subMenu[0]?.path) {
        setActiveMenu(first.label);
        setActiveSubMenu(first.subMenu[0].label);
        setOpenMenus((prev) => ({ ...prev, [first.label]: true }));
        navigate(first.subMenu[0].path, { replace: true });
        return;
      }

      if (first.path) {
        setActiveMenu(first.label);
        setActiveSubMenu("");
        if (first.subMenu)
          setOpenMenus((prev) => ({ ...prev, [first.label]: true }));
        navigate(first.path, { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#343079] text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white mb-2 border-r border-gray-300 rounded-xl shadow-xl p-4">
        <div className="flex flex-col gap-[16px]    pr-[16px] pl-[16px]">
          <h2
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 text-[14px] font-medium text-[#343079] mb-6 cursor-pointer hover:text-blue-900"
          >
            <img src={logoIcon} alt="Logo" className="w-6 h-6 items-center" />
            HiCore Career Project Platform
          </h2>
        </div>
        <div className="h-[1px] w-full border border-gray-300 rounded-lg mb-4"></div>

        <ul className="space-y-3">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <li>
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors group 
                    ${
                      activeMenu === item.label && !activeSubMenu
                        ? "bg-blue-900 text-white"
                        : item.danger
                        ? "text-red-500 hover:bg-red-600 hover:text-white"
                        : "text-[#343079] hover:bg-blue-900 hover:text-white"
                    }`}
                  onClick={() => {
                    setActiveMenu(item.label);
                    setActiveSubMenu("");
                    if (item.subMenu) toggleMenu(item.label);
                    else if (item.path) navigate(item.path);
                  }}
                >
                  <div className="flex items-center gap-3 group">
                    <img
                      src={item.icon}
                      alt=""
                      className={`w-5 h-5 transition-colors 
                        ${
                          activeMenu === item.label
                            ? "invert brightness-200"
                            : "group-hover:invert group-hover:brightness-200"
                        }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.subMenu && (
                    <span>
                      {openMenus[item.label] ? (
                        <FiChevronUp className="w-4 h-4" />
                      ) : (
                        <FiChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>

                {/* Submenu */}
                {item.subMenu && openMenus[item.label] && (
                  <ul className="ml-10 mt-2 space-y-2 text-sm">
                    {item.subMenu.map((sub, subIndex) => (
                      <li
                        key={subIndex}
                        className={`px-2 py-1 rounded-md cursor-pointer transition-colors
                          ${
                            activeSubMenu === sub.label
                              ? "bg-blue-900 text-white"
                              : "text-[#343079] hover:bg-blue-900 hover:text-white"
                          }`}
                        onClick={() => {
                          setActiveMenu(item.label);
                          setActiveSubMenu(sub.label);
                          if (sub.path) navigate(sub.path);
                        }}
                      >
                        {sub.label}
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              {(index === 0 || index === 7) && (
                <hr className="my-6 border-t-2 border-dashed border-[#AEADBE] mx-auto" />
              )}
            </React.Fragment>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white rounded-lg px-6 py-4 mb-0 ml-0 m-4">
          <div className="flex items-center gap-[8px]">
            <img src={handicon} alt="handicon" className="w-[40px] h-[40px] opacity-100" />
            <span className="text-[#343079] font-semibold text-[20px]">
              Hello, {studentName || "Student"}
            </span>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center w-1/2 border border-[#DAD8EE] rounded-md px-3 py-2 gap-[5px]"
          >
            <button type="submit" className="text-[#A4A2B3]">
              <FiSearch className="w-6 h-6" />
            </button>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
            />
          </form>

          <div className="flex items-center gap-4">
            <img
              src={mailIcon}
              alt="Mail"
              className="w-8 h-8 bg-[#EBEAF2] p-[8px] rounded-lg cursor-pointer"
            />
            <img
              src={bellIcon}
              alt="Notifications"
              className="w-8 h-8 cursor-pointer bg-[#EBEAF2] p-[8px] rounded-lg"
            />
            <img
              src={groupIcon}
              alt="Group"
              className="w-8 h-8 cursor-pointer bg-[#EBEAF2] p-[8px] rounded-lg"
            />
          </div>
        </header>

        {/* Breadcrumb */}
        {(activeMenu || activeSubMenu) && (
          <div className="mx-6 mb-2 mt-2 text-gray-700 ml-10 text-md font-medium">
            <span className="text-[#343079]">
              {activeMenu}
              {activeSubMenu && <span> &nbsp;→&nbsp; {activeSubMenu}</span>}
            </span>
          </div>
        )}

        {/* Nested Routes */}
        <div className="flex-1 m-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
