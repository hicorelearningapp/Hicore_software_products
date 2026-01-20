// Navbar.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

const TOKEN_KEY = "token";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isLoggingOutRef = useRef(false);
  const profileRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "home" },
    { name: "About", path: "about" },
    { name: "Features", path: "features" },
    { name: "Exams", path: "exams" },
    { name: "Roadmap", path: "roadmap" },
  ];

  /* ---------- AUTH CHECK ---------- */
  const checkAuth = useCallback(() => {
    setIsLoggedIn(Boolean(localStorage.getItem(TOKEN_KEY)));
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth, location.pathname]);

  /* ---------- CLOSE PROFILE MENU ON OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ---------- NAVIGATION ---------- */
  const handleNavClick = (section) => {
    if (location.pathname === "/") {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 600,
        offset: -80,
      });
    } else {
      navigate("/");
      setTimeout(() => {
        scroller.scrollTo(section, {
          smooth: true,
          duration: 600,
          offset: -80,
        });
      }, 300);
    }
    setIsOpen(false);
  };

  /* ---------- DASHBOARD (ROLE BASED) ---------- */
  const handleDashboard = () => {
    const role = localStorage.getItem("role");

    if (!role) {
      navigate("/login");
    } else if (role === "student") {
      navigate("/dashboard/student");
    } else if (role === "teacher") {
      navigate("/dashboard/teacher");
    } else if (role === "parent") {
      navigate("/dashboard/parent");
    } else {
      navigate("/login");
    }

    setIsOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    setShowProfileMenu(false);
    setIsOpen(false);
    setIsLoggedIn(false);

    navigate("/login", { replace: true });

    setTimeout(() => {
      isLoggingOutRef.current = false;
    }, 300);
  };

  return (
    <nav className="w-full h-[92px] bg-[#2758B3] text-white px-6 md:px-12 py-4 md:py-8 rounded-b-[16px]">
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <div className="font-semibold text-lg">
          <Link to="/">HiCore Exam AI</Link>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(item.path)}
              className="px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-[#2758B3]"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn && (
            <button
              onClick={handleDashboard}
              className="px-4 py-2 rounded-full font-semibold bg-white text-[#2758B3]"
            >
              Dashboard
            </button>
          )}

          {!isLoggedIn ? (
            <button
              onClick={handleLogin}
              className="px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-[#2758B3]"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#2758B3]"
              >
                <FiUser size={20} />
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-50"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-blue-700"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-3 bg-[#1F4390] p-4 rounded-xl">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(item.path)}
              className="px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-[#2758B3]"
            >
              {item.name}
            </button>
          ))}

          {isLoggedIn && (
            <button
              onClick={handleDashboard}
              className="px-4 py-2 rounded-full font-semibold bg-white text-[#2758B3]"
            >
              Dashboard
            </button>
          )}

          {!isLoggedIn ? (
            <button
              onClick={handleLogin}
              className="px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-[#2758B3]"
            >
              Login
            </button>
          ) : (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
