import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
    
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setOpenMenu(false);
    navigate("/login");
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setOpenMenu(false);
  };

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <div className="p-4 w-full max-md:hidden">
        <div className="flex items-center justify-between select-none pt-4 pr-8 pb-4 pl-8 rounded-[80px] bg-[#F4F6F8] opacity-100">
          
          {/* LEFT LABEL */}
          <div className="flex items-center gap-2 pt-1 pr-4 pb-1 pl-4 rounded-[80px]">
            <span className="font-semibold text-[16px] leading-[28px] tracking-[0.01em] text-[#1769FF]">
              HiCore InVue
            </span>
          </div>

          {/* CENTER NAV BUTTONS */}
          <div className="flex flex-row items-center gap-[38px]">
            <Link
              to="/"
              className="font-semibold text-[14px] leading-[26px] text-[#0A2A43] pt-[4px] pr-[16px] pb-[4px] pl-[16px] rounded-[80px] hover:bg-white hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] transition"
            >
              Home
            </Link>

            <button
              onClick={() => scrollToSection("features")}
              className="font-semibold text-[14px] cursor-pointer leading-[26px] text-[#0A2A43] pt-[4px] pr-[16px] pb-[4px] pl-[16px] rounded-[80px] hover:bg-white hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] transition"
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("whyus")}
              className="font-semibold text-[14px] cursor-pointer leading-[26px] text-[#0A2A43] pt-[4px] pr-[16px] pb-[4px] pl-[16px] rounded-[80px] hover:bg-white hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] transition"
            >
              Why Us?
            </button>

            <button
              onClick={() => scrollToSection("downloadapp")}
              className="font-semibold text-[14px] cursor-pointer leading-[26px] text-[#0A2A43] pt-[4px] pr-[16px] pb-[4px] pl-[16px] rounded-[80px] hover:bg-white hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] transition"
            >
              Download App
            </button>
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex gap-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="font-semibold text-[14px] text-[#0A2A43] bg-white pt-1 pr-6 pb-1 pl-6 rounded-[80px] shadow-sm hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.1)] transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white pt-1 pr-6 pb-1 pl-6 rounded-[80px] text-[14px] font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 pt-1 pr-8 pb-1 pl-8 rounded-[80px] bg-[#1769FF] text-white font-semibold text-[14px] cursor-pointer leading-[26px] hover:drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="w-full bg-[#F4F6F8] py-4 px-6 flex items-center justify-between md:hidden rounded-b-[40px]">
        <span className="font-semibold text-[18px] text-[#1769FF]">HiCore InVue</span>
        <button onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {openMenu && (
        <div className="bg-[#F4F6F8] px-6 py-4 flex flex-col gap-4 md:hidden shadow-md rounded-b-[30px]">
          <div
            className="cursor-pointer font-semibold text-[#0A2A43] py-2 border-b border-black/10"
            onClick={() => {
              setOpenMenu(false);
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Home
          </div>

          <div
            className="cursor-pointer font-semibold text-[#0A2A43] py-2 border-b border-black/10"
            onClick={() => scrollToSection("features")}
          >
            Features
          </div>

          <div
            className="cursor-pointer font-semibold text-[#0A2A43] py-2 border-b border-black/10"
            onClick={() => scrollToSection("whyus")}
          >
            Why Us?
          </div>

          <div
            className="cursor-pointer font-semibold text-[#0A2A43] py-2 border-b border-black/10"
            onClick={() => scrollToSection("downloadapp")}
          >
            Download App
          </div>

          {isLoggedIn ? (
            <>
              <div
                className="cursor-pointer font-semibold text-[#0A2A43] py-2 border-b border-black/10"
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/dashboard");
                }}
              >
                Dashboard
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 bg-red-500 text-white font-semibold py-2 rounded-[50px]"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setOpenMenu(false);
                navigate("/login");
              }}
              className="mt-2 bg-[#1769FF] text-white font-semibold py-2 rounded-[50px]"
            >
              Login
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;