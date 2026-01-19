import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Bell, User } from "lucide-react";
import logoIcon from "../assets/share-knowledge.png";
import routes from "../Routes/routesConfig";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const Navbar = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [hasProfile, setHasProfile] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard"); // dynamic path

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // 🔁 Sync login and fetch role from backend
  useEffect(() => {
    const syncLoginStatus = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const email = localStorage.getItem("userEmail") || "";
      const userId = localStorage.getItem("userId") || localStorage.getItem("user_id");

      setLoggedIn(isLoggedIn);
      setUserEmail(email);

      if (isLoggedIn && email) {
        await fetchUserRoleFromAPI(email);
      }

      if (isLoggedIn && userId) {
        checkProfileExists(userId);
      } else {
        setHasProfile(false);
      }
    };

    syncLoginStatus();

    window.addEventListener("loginStatusChanged", syncLoginStatus);
    window.addEventListener("profileCreated", syncLoginStatus);

    return () => {
      window.removeEventListener("loginStatusChanged", syncLoginStatus);
      window.removeEventListener("profileCreated", syncLoginStatus);
    };
  }, []);

  // ✅ Fetch profile existence
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
    } catch (err) {
      console.warn("❌ Profile not found:", err?.response?.status || err.message);
      setHasProfile(false);
      localStorage.removeItem("hasProfile");
    }
  };

  // ✅ Fetch all users and find current user's role
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
        } else {
          console.warn("⚠️ User email not found in /auth/users");
          setDashboardPath("/dashboard");
        }
      }
    } catch (err) {
      console.error("❌ Error fetching users:", err.message);
      setDashboardPath("/dashboard");
    }
  };

  // ✅ Determine dashboard route based on role
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

  // 🚪 Logout handler
  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setUserRole("");
    setUserEmail("");
    setHasProfile(false);
    setShowUserMenu(false);
    setDashboardPath("/dashboard");
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/");
  };

  // ❌ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* 🖥️ Desktop Navbar */}
      <nav className="bg-[#343079] text-white px-6 py-5 shadow-md hidden lg:flex items-center justify-between relative z-50 font-[Poppins]">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-xl whitespace-nowrap">
          <img src={logoIcon} alt="logo" className="h-6 w-auto object-contain" />
          <Link to="/" className="cursor-pointer">
            HiCore Career Project Platform
          </Link>
        </div>

        {/* Center Menu */}
        <div className="flex items-center space-x-11 relative">
          {routes.map((route, idx) => (
            <button
              key={idx}
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
              }}
              className="cursor-pointer hover:text-gray-300 tracking-wider font-medium text-white px-3 py-1.5 rounded"
            >
              {route.label}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 relative">
          {!loggedIn ? (
            <Link to="/login">
              <button className="bg-white text-[#312c81] font-semibold px-4 py-1.5 rounded hover:opacity-90">
                Login
              </button>
            </Link>
          ) : (
            <>
              <Link to={dashboardPath}>
                <button className="bg-white text-[#312c81] mr-10 font-semibold px-4 py-1.5 rounded hover:opacity-90">
                  Dashboard
                </button>
              </Link>

              <button className="hover:opacity-80">
                <Bell size={20} className="text-white" />
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
                >
                  <User size={20} className="text-white hover:text-blue-900" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 bg-white text-[#312c81] rounded shadow-lg w-52 z-50 py-2">
                    {userEmail && (
                      <div className="text-center text-sm font-semibold border-b border-gray-200 pb-2 mb-1 px-2">
                        {userEmail}
                      </div>
                    )}

                    {hasProfile && (
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        <User size={18} className="mr-2" /> Profile
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <LogOut size={18} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* 📱 Mobile Navbar */}
      <nav className="flex lg:hidden bg-[#312c81] text-white px-4 py-4 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <img src={logoIcon} alt="logo" className="h-5 w-auto object-contain" />
          HiCore
        </div>
        <button onClick={() => setOpenMobileMenu(!openMobileMenu)}>
          {openMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* 📋 Mobile Menu */}
      {openMobileMenu && (
        <div className="lg:hidden bg-white text-[#312c81] px-4 py-2 shadow-md space-y-3">
          {routes.map((route, i) => (
            <button
              key={i}
              onClick={() => {
                navigate(route.path || "/");
                setOpenMobileMenu(false);
              }}
              className="block px-3 py-2 rounded hover:bg-gray-100 w-full text-left bg-[#312c81] text-white font-semibold"
            >
              {route.label}
            </button>
          ))}

          <div className="flex flex-col gap-2 pt-4">
            {!loggedIn ? (
              <Link to="/login" className="w-full">
                <button className="bg-[#312c81] text-white px-4 py-1.5 rounded w-full">
                  Login
                </button>
              </Link>
            ) : (
              <>
                {userEmail && (
                  <div className="text-center text-sm font-semibold border-b border-gray-200 pb-2 mb-1">
                    {userEmail}
                  </div>
                )}

                {hasProfile && (
                  <Link to="/profile" className="w-full">
                    <button
                      className="bg-[#312c81] text-white px-4 py-1.5 rounded w-full"
                      onClick={() => setOpenMobileMenu(false)}
                    >
                      View Profile
                    </button>
                  </Link>
                )}

                <Link to={dashboardPath} className="w-full">
                  <button className="bg-[#312c81] text-white px-4 py-1.5 rounded w-full">
                    Dashboard
                  </button>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 rounded text-[#312c81] border border-[#312c81] hover:bg-gray-100 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
