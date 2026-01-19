import React, { useState, useEffect, useRef } from "react";
import { X, Menu, LogOut, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import routes from "../Routes/routesConfig";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const FloatingSidebar = () => {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [hasProfile, setHasProfile] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");

  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Sync login/user data
  useEffect(() => {
    const syncUser = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const email = localStorage.getItem("userEmail") || "";
      const userId = localStorage.getItem("userId") || localStorage.getItem("user_id");

      setLoggedIn(isLoggedIn);
      setUserEmail(email);

      if (isLoggedIn && email) await fetchUserRoleFromAPI(email);
      if (isLoggedIn && userId) await checkProfileExists(userId);
    };

    syncUser();
    window.addEventListener("loginStatusChanged", syncUser);
    window.addEventListener("profileCreated", syncUser);

    return () => {
      window.removeEventListener("loginStatusChanged", syncUser);
      window.removeEventListener("profileCreated", syncUser);
    };
  }, []);

  const fetchUserRoleFromAPI = async (email) => {
    try {
      const res = await axios.get(`${API_BASE}/auth/users`);
      if (res.status === 200 && Array.isArray(res.data)) {
        const user = res.data.find((u) => u.email === email);
        if (user) {
          const role = user.role?.toLowerCase() || "default";
          setUserRole(role);
          localStorage.setItem("userRole", role);
          setDashboardPath(getDashboardByRole(role));
        }
      }
    } catch (err) {
      console.warn("⚠️ Could not fetch role:", err.message);
    }
  };

  const checkProfileExists = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE}/profile/${userId}`);
      if (res.status === 200 && res.data) {
        setHasProfile(true);
        localStorage.setItem("hasProfile", "true");
      } else {
        setHasProfile(false);
        localStorage.removeItem("hasProfile");
      }
    } catch {
      setHasProfile(false);
      localStorage.removeItem("hasProfile");
    }
  };

  const getDashboardByRole = (role) => {
    switch (role) {
      case "student":
        return "/student-dashboard";
      case "jobseeker":
        return "/jobseeker-dashboard";
      case "mentor":
        return "/mentor-dashboard";
      case "employer":
        return "/employer-dashboard";
      default:
        return "/dashboard";
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setUserRole("");
    setUserEmail("");
    setHasProfile(false);
    setOpen(false);
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/");
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* Floating Edge Handle */}
      <div
        className="fixed top-1/2 right-0 transform -translate-y-1/2 z-40"
        style={{ transition: "all 0.3s ease" }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#343079] text-white h-24 w-3 rounded-l-full shadow-xl flex items-center justify-center hover:w-5 transition-all duration-300"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={`fixed top-1/2 right-0 transform -translate-y-1/2 transition-all duration-300 ease-in-out z-50 ${
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="w-64 rounded-2xl backdrop-blur-xl bg-white/40 shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200/40 rounded-t-2xl">
            <h2 className="text-[#343079] font-semibold text-lg">Menu</h2>
            <button onClick={() => setOpen(false)}>
              <X size={22} className="text-[#343079]" />
            </button>
          </div>

          {/* Menu Links */}
          <div className="flex flex-col p-4 space-y-3">
            {routes.map((route, i) => (
              <button
                key={i}
                onClick={() => {
                  if (route.label === "About Us") {
                    if (window.location.pathname !== "/") {
                      navigate("/", { state: { scrollTo: "about-us" } });
                    } else {
                      const section = document.getElementById("about-us");
                      if (section) section.scrollIntoView({ behavior: "smooth" });
                    }
                  } else {
                    navigate(route.path || "/");
                  }
                  setOpen(false);
                }}
                className="block px-3 py-2 rounded hover:bg-[#312c81] hover:text-white text-[#343079] font-semibold text-left transition"
              >
                {route.label}
              </button>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200/40 p-4 flex flex-col gap-3 rounded-b-2xl bg-white/40">
            {!loggedIn ? (
              <button
                onClick={() => {
                  navigate("/login");
                  setOpen(false);
                }}
                className="bg-[#343079] text-white font-semibold px-4 py-2 rounded hover:opacity-90"
              >
                Login
              </button>
            ) : (
              <>
                {userEmail && (
                  <div className="text-center text-sm font-semibold text-[#343079]">
                    {userEmail}
                  </div>
                )}

                {hasProfile && (
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 bg-[#343079] text-white px-4 py-2 rounded hover:opacity-90"
                  >
                    <User size={16} /> Profile
                  </button>
                )}

                <button
                  onClick={() => {
                    navigate(dashboardPath);
                    setOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-[#343079] text-white px-4 py-2 rounded hover:opacity-90"
                >
                  <Bell size={16} /> Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 border border-[#312c81] text-[#312c81] px-4 py-2 rounded hover:bg-gray-100 font-semibold"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingSidebar;
