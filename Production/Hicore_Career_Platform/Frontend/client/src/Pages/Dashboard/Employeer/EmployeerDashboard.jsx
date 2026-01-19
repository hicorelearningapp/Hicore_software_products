import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";

import menuItems from "./menuItems";
import logoIcon from "../../../assets/StudentDashboard/share-knowledge.png";
import groupIcon from "../../../assets/StudentDashboard/Community.png";
import mailIcon from "../../../assets/StudentDashboard/Message.png";
import bellIcon from "../../../assets/StudentDashboard/Notification.png";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const EmployeerDashboard = () => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSubMenu, setActiveSubMenu] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);


  // ✅ Run once on mount → set default menu as index 0
  useEffect(() => {
    if (menuItems.length > 0) {
      setActiveMenu(menuItems[0].label);
      if (menuItems[0].path) {
        navigate(menuItems[0].path); // only on first load
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty dependency → run only once

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const userId =
        localStorage.getItem("userId") || localStorage.getItem("user_id");

      if (!userId) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`${API_BASE}/profile/${userId}`);
      const user = res.data?.basicInfo || {};

      // 🔥 FIX → Employers usually have company_name instead of first/last names
      const name =
        user.company_name ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim();

      setEmployerName(name || "Employer");
    } catch (err) {
      console.error("❌ Failed to load employer profile:", err);
      setEmployerName("Employer");
    } finally {
      setLoadingUser(false);
    }
  };

  fetchUser();
}, [navigate]);


  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white mb-2 border-r border-[#EBEAF2] rounded-xl shadow-xl p-4">
        <h2
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 text-sm font-bold text-indigo-900 mb-6 cursor-pointer hover:text-[#343079] border-b-2 border-indigo-900 pb-4"
        >
          <img src={logoIcon} alt="Logo" className="w-6 h-6" />
          HiCore Career Project Platform
        </h2>

        <ul className="space-y-3">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <li
                className={`${
                  index === menuItems.length - 5
                    ? "mt-8 pt-4 border-[#EBEAF2]"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors group ${
                    activeMenu === item.label && !activeSubMenu
                      ? "bg-[#343079] text-white"
                      : item.danger
                      ? "text-red-500 hover:bg-red-600 hover:text-white"
                      : "text-[#343079] hover:bg-[#343079] hover:text-white"
                  }`}
                  onClick={() => {
                    setActiveMenu(item.label);
                    setActiveSubMenu("");
                    if (item.subMenu) {
                      toggleMenu(item.label);
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 group">
                    <img
                      src={item.icon}
                      alt=""
                      className={`w-5 h-5 transition-colors ${
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
                        className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                          activeSubMenu === sub.label
                            ? "bg-[#343079] text-white"
                            : "text-[#343079] hover:bg-[#343079] hover:text-white"
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
              {index === 4 && (
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
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <span className="text-[#343079] font-semibold text-[20px]">
              Hello, {loadingUser ? "..." : employerName || "Employer"}
            </span>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center w-1/2 border border-[#A4A2B3] rounded-md px-3 py-2"
          >
            <button type="submit" className="text-[#A4A2B3]">
              <FiSearch className="w-6 h-6" />
            </button>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#A4A2B3] text-sm"
            />
          </form>

          <div className="flex items-center gap-4">
            <img
              src={mailIcon}
              alt="Mail"
              className="w-8 h-8 bg-[#EBEAF2] p-1 rounded cursor-pointer"
            />
            <img
              src={bellIcon}
              alt="Notifications"
              className="w-8 h-8 cursor-pointer bg-[#EBEAF2] p-1 rounded"
            />
            <img
              src={groupIcon}
              alt="Group"
              className="w-8 h-8 cursor-pointer bg-[#EBEAF2] p-1 rounded"
            />
          </div>
        </header>
        {(activeMenu || activeSubMenu) && (
          <div className="mx-6 mb-2 mt-2 text-[#EBEAF2] ml-10 text-md font-medium">
            <span className="text-[#343079]">
              {activeMenu}
              {activeSubMenu && <span> &nbsp;→&nbsp; {activeSubMenu}</span>}
            </span>
          </div>
        )}

        {/* Nested Pages Render */}
        <div className="flex-1 m-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeerDashboard;
