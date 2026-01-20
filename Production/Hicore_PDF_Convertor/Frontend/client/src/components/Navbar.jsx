import React, { useState, useRef, useEffect } from "react";
import logoIcon from "../assets/logo.png";
import profileIcon from "../assets/Profile.png";

import { LayoutGrid, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ToolsMenu from "./ToolsMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showTools, setShowTools] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toolsMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const isToolPage = location.pathname.startsWith("/tools");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  /* 🔥 AUTH SYNC — FIXES VERCEL ISSUE */
  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(Boolean(token));
    };

    syncAuth(); // initial mount

    window.addEventListener("focus", syncAuth);
    window.addEventListener("storage", syncAuth);
    document.addEventListener("visibilitychange", syncAuth);
    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("focus", syncAuth);
      window.removeEventListener("storage", syncAuth);
      document.removeEventListener("visibilitychange", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  /* ---------- Close dropdowns on outside click ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target)) {
        setShowTools(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- Logout ---------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <div className="relative">
      {/* NAVBAR */}
      <nav
        className={`w-full bg-white px-4 sm:px-8 py-4 flex items-center justify-between
        ${isToolPage || isAuthPage ? "border-b border-rose-200" : ""}`}
      >
        {/* LEFT: Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logoIcon} alt="HiPDF logo" className="w-7 h-7" />
          <span className="text-[#D72638] font-bold text-lg">HiPDF</span>
        </div>

        {/* CENTER TOOLS */}
        {!isToolPage && !isAuthPage && (
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => setShowTools((p) => !p)}
              className="flex items-center gap-2 bg-red-700 text-white px-5 py-2 rounded-lg"
            >
              <LayoutGrid className="w-5 h-5" />
              Tools
            </button>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthPage && (
            <>
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="border border-red-700 text-red-700 px-5 py-2 rounded-md"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="bg-red-700 text-white px-5 py-2 rounded-md"
                  >
                    SignUp
                  </button>
                </>
              ) : (
                <div className="relative" ref={profileMenuRef}>
                  <img
                    src={profileIcon}
                    alt="Profile"
                    onClick={() => setShowProfileMenu((p) => !p)}
                    className="w-9 h-9 cursor-pointer"
                    style={{
                      filter:
                        "invert(17%) sepia(89%) saturate(4287%) hue-rotate(345deg) brightness(95%) contrast(102%)",
                    }}
                  />

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border shadow rounded z-10">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* MOBILE */}
        <button className="md:hidden" onClick={() => setMobileMenu((p) => !p)}>
          {mobileMenu ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow px-6 py-4 flex flex-col gap-4">
          {!isLoggedIn ? (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/signup")}>SignUp</button>
            </>
          ) : (
            <button onClick={handleLogout} className="text-red-600">
              Logout
            </button>
          )}
        </div>
      )}

      {/* TOOLS MENU */}
      {showTools && (
        <div
          ref={toolsMenuRef}
          className="absolute w-full z-50 bg-white shadow"
        >
          <ToolsMenu onClose={() => setShowTools(false)} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
