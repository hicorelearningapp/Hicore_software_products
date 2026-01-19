import React, { useState } from "react";
import { Link } from "react-router-dom";
import routes from "../../Routes/routesConfig";

import bgImage from "../../assets/CourseLandingPng/course-bg.jpg";
import bookImage from "../../assets/CourseLandingPng/books-cap.png";
import levelIcon from "../../assets/CourseLandingPng/level-icon.png";
import certificateIcon from "../../assets/CourseLandingPng/certificate-icon.png";
import mentorIcon from "../../assets/CourseLandingPng/mentor-icon.png";
import projectsIcon from "../../assets/CourseLandingPng/projects-icon.png";

import CourseCategories from "./CourseCategories";

const Courses = () => {
  const courseRoute = routes.find((route) => route.label === "Courses");

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Banner Section */}
      <section
        className="w-full bg-no-repeat bg-cover bg-center py-12 px-4 sm:px-12 flex flex-col md:flex-row items-center justify-between border-b"
        style={{
          backgroundImage: `url(${bgImage})`,
          borderBottom: "1px solid #C8ECF5",
        }}
      >
        {/* Left Text */}
        <div className="max-w-2xl text-center md:text-left text-[#2E2A72]">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Explore Our Courses
          </h2>
          <p className="text-md md:text-lg font-semibold mb-2">
            Build job ready skills with industry relevant tech courses.
          </p>
          <p className="text-sm md:text-base leading-relaxed">
            Whether you're starting fresh or leveling up, our curated courses help
            you master essential programming languages, frameworks, and tools – with
            certifications that matter.
          </p>
        </div>

        {/* Right Image */}
        <div className="mt-8 md:mt-0 md:ml-10">
          <img
            src={bookImage}
            alt="Books and Graduation Cap"
            className="w-60 md:w-72 lg:w-80"
          />
        </div>
      </section>

      {/* Key Features Section */}
      <section className="mt-16 px-4 md:px-16">
        <div className="max-w-6xl mx-auto rounded-xl border border-[#ddd] py-10 px-4 md:px-12 bg-white">
          <h2 className="text-center text-xl md:text-2xl font-semibold text-[#2E2A72] mb-8">
            Key Features of the Course
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="flex flex-col items-center justify-center text-center p-6 bg-[#F3F3FB] rounded-xl border border-[#65629E] transition duration-300 hover:shadow-[0_4px_8px_rgba(101,98,158,0.3)]">
              <img src={levelIcon} alt="Level Icon" className="w-10 h-10 mb-4" />
              <p className="font-semibold text-[#2B2160]">
                Beginner to Advanced<br />Levels
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center justify-center text-center p-6 bg-[#FFFAEF] rounded-xl border border-[#65629E] transition duration-300 hover:shadow-[0_4px_8px_rgba(101,98,158,0.3)]">
              <img src={certificateIcon} alt="Certificate Icon" className="w-10 h-10 mb-4" />
              <p className="font-semibold text-[#2B2160]">Certification (MNC-Verified)</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center justify-center text-center p-6 bg-[#F0F7FF] rounded-xl border border-[#65629E] transition duration-300 hover:shadow-[0_4px_8px_rgba(101,98,158,0.3)]">
              <img src={mentorIcon} alt="Mentor Icon" className="w-10 h-10 mb-4" />
              <p className="font-semibold text-[#2B2160]">Mentor Support</p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center justify-center text-center p-6 bg-[#E8FFDD] rounded-xl border border-[#65629E] transition duration-300 hover:shadow-[0_4px_8px_rgba(101,98,158,0.3)]">
              <img src={projectsIcon} alt="Projects Icon" className="w-10 h-10 mb-4" />
              <p className="font-semibold text-[#2B2160]">
                Interactive Projects +<br />Assignments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <CourseCategories />
    </div>
  );
};

export default Courses;
