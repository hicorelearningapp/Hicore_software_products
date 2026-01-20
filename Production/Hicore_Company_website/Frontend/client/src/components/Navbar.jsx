import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiMenuAlt3, HiX } from "react-icons/hi";
import logo from "../assets/hicore-logo.png";

const Navbar = ({
  navLinks = ["Home",  "Services", "Products", "Semiconductor", "Career" , "About Us", "Contact US"],
  buttonLabel = "Contact Us",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingScrollSection, setPendingScrollSection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const sectionMap = {
    "about us": "about-us",
    "services": "services",
  };

  const getRoute = (label) => {
    switch (label.toLowerCase()) {
      case "home":
        return "/";
      case "products":
        return "/products";
        case "semiconductor":
        return "/hicore/semiconductor";
      case "career":
        return "/career";
      case "contact us":
        return "/contact";
      default:
        return "#";
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (label) => {
    const route = getRoute(label);
    const sectionId = sectionMap[label.toLowerCase()];

    if (route === "#" && sectionId) {
      if (location.pathname !== "/") {
        setPendingScrollSection(sectionId);
        navigate("/");
      } else {
        scrollToSection(sectionId);
      }
    } else {
      navigate(route);
    }

    setMenuOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/" && pendingScrollSection) {
      const timer = setTimeout(() => {
        scrollToSection(pendingScrollSection);
        setPendingScrollSection(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, pendingScrollSection]);

  return (
    <nav className="w-full bg-white shadow-md px-3 md:px-10 lg:px-16 py-3 font-serif relative z-50">
      <div className="flex justify-between items-center">
        {/* 👇 Logo image instead of text */}
        <div className="w-[140px] sm:w-[160px]">
          {" "}
          {/* increased from 120px → 140px, 140px → 160px */}
          <Link to="/">
            <img
              src={logo}
              alt="Company Logo"
              className="w-full h-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-3 text-[#230970] font-semibold text-lg">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(link)}
              className="group relative px-2 py-1"
            >
              <span className="relative inline-block px-4 py-[4px] rounded transition-all duration-300 group-hover:bg-white z-20">
                <span className="relative">{link}</span>
              </span>
              <span className="absolute left-1/2 top-full -translate-x-1/2 w-[90%] h-[8.5px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-[#2B2160] via-gray-200 to-[#2B2160] z-0"></span>
              <span className="absolute left-0 top-full w-full h-[5px] bg-white z-20 pointer-events-none"></span>
            </button>
          ))}
        </div>

        {/* Desktop Contact Button */}
        <div className="hidden md:block">
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? (
              <HiX className="text-3xl text-[#230970]" />
            ) : (
              <HiMenuAlt3 className="text-3xl text-[#230970]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-[#230970] text-base font-semibold">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(link)}
              className="hover:text-blue-700 transition text-left"
            >
              {link}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
