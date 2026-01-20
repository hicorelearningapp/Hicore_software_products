import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ IMPORTANT: Add this

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const menuItems = [
    { label: "How It Works", id: "HowItWorks" },
    { label: "AI-Powered Features", id: "AIFeatures" },
    { label: "Stakeholder", id: "Stakeholder" },
    { label: "Medicines", id: "Medicines" },
  ];

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setOpenMenu(false);
    }
  };

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className="w-full bg-[#115D29] py-8 max-md:hidden">
        <div className="mx-auto px-12 flex items-center justify-between">
          {/* Menu Items */}
          <ul className="flex space-x-14 text-white font-medium">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer relative group"
                onClick={() => handleScroll(item.id)}
              >
                {item.label}

                <span
                  className="
                    absolute left-1/2 -translate-x-1/2 
                    bottom-[-10px]
                    w-[120%] h-[3px]
                    rounded-full
                    bg-gradient-to-r from-white via-[#A4E6A4] to-white
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                  "
                ></span>
              </li>
            ))}
          </ul>

          {/* ✅ LOGIN BUTTON WITH ROUTER LINK */}
          <Link
            to="/login"
            className="text-white font-semibold cursor-pointer relative group"
          >
            Login
            <span
              className="
                absolute left-1/2 -translate-x-1/2 
                bottom-[-10px]
                w-[120%] h-[3px]
                rounded-full
                bg-gradient-to-r from-white via-[#A4E6A4] to-white
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
              "
            ></span>
          </Link>
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <nav className="w-full bg-[#115D29] py-5 px-6 flex items-center justify-between md:hidden">
        <h1 className="text-white font-semibold text-[20px]">Menu</h1>

        <button onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? (
            <X size={28} className="text-white" />
          ) : (
            <Menu size={28} className="text-white" />
          )}
        </button>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {openMenu && (
        <div className="bg-[#115D29] text-white px-6 py-4 flex flex-col gap-4 md:hidden">
          {menuItems.map((item, i) => (
            <div
              key={i}
              className="cursor-pointer py-2 border-b border-white/20"
              onClick={() => handleScroll(item.id)}
            >
              {item.label}
            </div>
          ))}

          {/* ✅ MOBILE LOGIN BUTTON WITH LINK */}
          <Link
            to="/login"
            className="mt-4 bg-white text-[#115D29] font-semibold py-2 rounded text-center"
          >
            Login
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
