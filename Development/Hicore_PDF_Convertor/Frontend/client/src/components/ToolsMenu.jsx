// src/components/ToolsMenu.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toolsData } from "../data/toolData";

const ToolsMenu = ({ onClose }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleToolClick = (toolPath) => {
    navigate(`/tools/${toolPath}`);
    if (onClose) onClose(); // Hide menu after click
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white px-10 py-8 
      shadow-lg border border-gray-300 rounded-t-none rounded-md z-50"
    >
      {toolsData.map((section) => (
        <div key={section.title}>
          <div
            className={`flex items-center justify-center space-x-2
               text-black-100 px-2 py-2 rounded-md mb-8 ${section.color}`}
          >
            <section.icon className="w-5 h-5" />
            <span className="ml-1">{section.title}</span>
          </div>

          <ul className="space-y-8 text-sm  text-gray-700">
            {section.tools.map((tool) => (
              <li
                key={tool.path}
                onClick={() => handleToolClick(tool.path)}
                className="cursor-pointer hover:underline hover:text-red-600 text-center transition duration-200"
              >
                {tool.label}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ToolsMenu;
