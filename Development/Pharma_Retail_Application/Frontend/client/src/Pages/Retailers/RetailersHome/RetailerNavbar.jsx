import React from "react";

/**
 * RetailerNavbar.jsx
 *
 * - dynamic left menu
 * - centered gradient underline on hover (white -> light-green -> white)
 */

const RetailerNavbar = () => {
  const menuItems = [
    "Retailer Benefits",
    "How It Works",
    "AI-Powered Features",
    "Medicines",
  ];

  return (
    <nav className="w-full bg-[#115D29]">
      <div className="w-full mx-auto px-14 py-7 flex items-center justify-between">
        {/* LEFT MENU */}
        <ul className="flex items-center gap-12 text-sm">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              className="relative group text-white font-medium cursor-pointer"
            >
              <span className="block py-2">{item}</span>

              {/* centered underline: white -> green -> white */}
              <span
                className={`
                  absolute left-1/2 -translate-x-1/2 -bottom-2
                  w-[130%] h-[3px] 
                  bg-gradient-to-r from-white via-[#A4E6A4] to-white
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                `}
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>

        {/* RIGHT: Login */}
        <div className="relative group">
          <button className="text-white font-medium py-2">Login</button>

          <span
            className="
              absolute left-1/2 -translate-x-1/2 -bottom-2
              w-[130%] h-[3px] 
              bg-gradient-to-r from-white via-[#A4E6A4] to-white
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
            "
            aria-hidden="true"
          />
        </div>
      </div>
    </nav>
  );
};

export default RetailerNavbar;
