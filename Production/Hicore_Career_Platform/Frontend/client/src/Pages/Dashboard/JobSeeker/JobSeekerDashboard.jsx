import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import menuItems from "./menuItems";

import logoIcon from "../../../assets/StudentDashboard/share-knowledge.png";
import groupIcon from "../../../assets/StudentDashboard/Community.png";
import mailIcon from "../../../assets/StudentDashboard/Message.png";
import bellIcon from "../../../assets/StudentDashboard/Notification.png";
import handicon from "../../../assets/JobSeekerDashboardPage/hand.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasAutoNavigatedRef = useRef(false);

  const [openMenus, setOpenMenus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(menuItems[0]?.label || "");
  const [activeSubMenu, setActiveSubMenu] = useState("");
  const [userName, setUserName] = useState("Job Seeker");
  const [loadingName, setLoadingName] = useState(true);

  // ✅ Fetch name from backend (profile)
  useEffect(() => {
    const fetchProfileName = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("⚠️ No userId found in localStorage");
          setLoadingName(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/profile/${userId}`);
        const basicInfo = res.data?.basicInfo;

        if (basicInfo?.first_name) {
          setUserName(`${basicInfo.first_name} ${basicInfo.last_name || ""}`);
        } else {
          setUserName("User");
        }
      } catch (err) {
        console.error("❌ Error fetching user name:", err);
        setUserName("User");
      } finally {
        setLoadingName(false);
      }
    };

    fetchProfileName();
  }, []);

  // ✅ Menu sync with router
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white mb-2 border-r border-gray-300 rounded-xl shadow-xl p-4">
        <h2
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 text-[14px] font-medium text-[#343079] mb-6 cursor-pointer hover:text-blue-900 border-b-2 border-indigo-900 pb-4"
        >
          <img src={logoIcon} alt="Logo" className="w-6 h-6 items-center" />
          HiCore Career Project Platform
        </h2>

        <ul className="space-y-3">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <li
                className={`${
                  index === menuItems.length - 5
                    ? " border-gray-300"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors group 
                    ${
                      activeMenu === item.label && !activeSubMenu
                        ? "bg-blue-900 text-white"
                        : item.danger
                        ? "text-red-500 hover:bg-red-600 hover:text-white"
                        : "text-indigo-900 hover:bg-blue-900 hover:text-white"
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
                      className={`w-[24px] h-[24px] transition-colors 
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

                {item.subMenu && openMenus[item.label] && (
                  <ul className="ml-10 mt-2 space-y-2 text-sm">
                    {item.subMenu.map((sub, subIndex) => (
                      <li
                        key={subIndex}
                        className={`px-2 py-1 rounded-md cursor-pointer transition-colors
                          ${
                            activeSubMenu === sub.label
                              ? "bg-[#343079] text-white"
                              : "text-[#343079] hover:bg-[#EBEAF2]"
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
              {loadingName ? "Loading..." : `Hello, ${userName}`}
            </span>
          </div>

          {/*<form
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
              className="flex-1 outline-none text-[#A4A2B3] text-sm"
            />
          </form>*/}

          <div className="flex items-center gap-4">
            <img
              src={mailIcon}
              alt="Mail"
              className="w-8 h-8 bg-gray-200 p-1 rounded cursor-pointer"
            />
            <img
              src={bellIcon}
              alt="Notifications"
              className="w-8 h-8 cursor-pointer bg-gray-200 p-1 rounded"
            />
            <img
              src={groupIcon}
              alt="Group"
              className="w-8 h-8 cursor-pointer bg-gray-200 p-1 rounded"
            />
          </div>
        </header>

        {/* Breadcrumb */}
        {(activeMenu || activeSubMenu) && (
          <div className="mx-6 mb-2 mt-2 text-gray-700 ml-10 text-md font-medium">
            <span className="text-blue-900">
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

export default JobSeekerDashboard;
