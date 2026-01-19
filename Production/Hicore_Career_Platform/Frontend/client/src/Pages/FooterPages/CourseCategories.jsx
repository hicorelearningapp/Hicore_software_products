import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Import all image assets
import html from "../../assets/CourseLandingPng/html.png";
import css from "../../assets/CourseLandingPng/css.png";
import js from "../../assets/CourseLandingPng/js.png";
import c from "../../assets/CourseLandingPng/c.png";
import cpp from "../../assets/CourseLandingPng/cpp.png";
import csharp from "../../assets/CourseLandingPng/csharp.png";
import python from "../../assets/CourseLandingPng/python.png";
import kotlin from "../../assets/CourseLandingPng/kotlin.png";
import xml from "../../assets/CourseLandingPng/xml.png";
import java from "../../assets/CourseLandingPng/java.png";

import wpf from "../../assets/CourseLandingPng/wpf.jpg";
import angular from "../../assets/CourseLandingPng/angular.png";

import cyber from "../../assets/CourseLandingPng/cyber.png";

import mongodb from "../../assets/CourseLandingPng/mongodb.png";
import mysql from "../../assets/CourseLandingPng/mysql.png";
import node from "../../assets/CourseLandingPng/node.png";

const tabs = [
  "Programming Languages",
  "Frameworks & UI",
  "Security",
  "Databases & Backend",
];

const categories = {
  "Programming Languages": [
    { title: "HTML", img: html },
    { title: "CSS", img: css },
    { title: "Javascript", img: js },
    { title: "C", img: c },
    { title: "Cplus", label: "C++", img: cpp },
    { title: "Csharp", label: "C#", img: csharp },
    { title: "Python", img: python },
    { title: "Kotlin", img: kotlin },
    { title: "XML", img: xml },
    { title: "Java", img: java },
  ],
  "Frameworks & UI": [
    { title: "WPF", img: wpf },
    { title: "Angular", img: angular },
  ],
  Security: [{ title: "CyberSecurity", img: cyber }],
  "Databases & Backend": [
    { title: "MongoDB", img: mongodb },
    { title: "MySQL", img: mysql },
    { title: "Nodejs",label: "Node.js", img: node },
  ],
};

const CourseCategories = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") || "Programming Languages";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(location.search);
    newParams.set("tab", tab);
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  const handleCourseClick = (courseTitle) => {
    const urlSlug = courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    navigate(`/courses/${urlSlug}`);
  };

  return (
    <section className="mt-16 px-4 md:px-16 bg-[#f7f7fc] min-h-screen pb-10">
      <p className="text-center text-[#2E2A72] font-semibold text-lg mb-6">
        Click on any course to view details, curriculum, duration, and start learning.
      </p>

      <div className="max-w-6xl mx-auto rounded-xl border border-[#B4A7D6] bg-white overflow-hidden min-h-[800px] relative">
        {/* Vertical Divider */}
        <div className="hidden md:block absolute top-0 bottom-0 left-[20%] w-[1px] bg-[#B4A7D6]" />

        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-1/5 p-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`w-full text-left px-4 py-2 mb-2 rounded-md font-medium text-sm ${
                  activeTab === tab
                    ? "bg-[#e4e4ff] text-[#2E2A72]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Course Cards */}
          <div className="w-full md:w-4/5 p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {categories[activeTab].map((item) => (
                <div
                  key={item.title}
                  onClick={() => handleCourseClick(item.title)}
                  className="cursor-pointer bg-white border border-[#65629E] rounded-xl shadow-sm flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-gradient-to-br hover:from-[#B4A7D6] hover:to-[#E3E2F4] hover:border-[#7b68ee]"
                >
                  <div className="p-6">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-20 h-20 object-contain"
                    />
                  </div>

                  <div className="w-full py-2 bg-gradient-to-r from-[#B4A7D6] to-[#E3E2F4] text-[#2E2A72] font-semibold text-sm rounded-b-xl">
                    {item.label || item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseCategories;
