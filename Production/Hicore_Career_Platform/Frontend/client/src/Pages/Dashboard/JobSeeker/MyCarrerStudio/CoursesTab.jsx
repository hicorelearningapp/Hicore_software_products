// 📂 src/components/MyCareer/CoursesTab.jsx
import React, { useState } from "react";
import { FaPlayCircle, FaCheckCircle, FaBookmark } from "react-icons/fa";
import { FiClock, FiBookOpen, FiAward } from "react-icons/fi";

import dsImg from "../../../../assets/StudentCourseTab/icon-one.jpg";
import webdevImg from "../../../../assets/StudentCourseTab/icon-two.jpg";
import cloudImg from "../../../../assets/StudentCourseTab/icon-three.jpg";
import cyberImg from "../../../../assets/StudentCourseTab/icon-four.jpg";

import courseIcon from "../../../../assets/StudentCourseTab/book.png";

const CoursesTab = () => {
  const [showCourses, setShowCourses] = useState(false);

  // ✅ Recommended courses data
  const courses = [
    {
      img: dsImg,
      title: "Data Science with Python: Beginner to Pro",
      hours: "18 hrs",
      modules: "12 modules",
      tag: "Matches your interest in AI & Analytics",
    },
    {
      img: webdevImg,
      title: "Full-Stack Web Development Bootcamp",
      hours: "20 hrs",
      modules: "15 modules",
      tag: "Based on your Web Dev interests.",
    },
    {
      img: cloudImg,
      title: "Introduction to Cloud Computing",
      hours: "10 hrs",
      modules: "7 modules",
      tag: "Matches your interest in Emerging Tech",
    },
    {
      img: cyberImg,
      title: "Cybersecurity Essentials",
      hours: "9 hrs",
      modules: "7 modules",
      tag: "Matches your tech learning path",
    },
  ];

  return (
    <div className="p-6">
      {!showCourses ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <img
            src={courseIcon}
            alt="Courses"
            className="w-24 h-24 mb-6 object-contain"
          />

          <p className="text-md text-gray-600 mb-6">
            You’re not enrolled in any courses yet! <br /> Start learning new
            skills today.
          </p>

          <button
            onClick={() => setShowCourses(true)}
            className="bg-indigo-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
          >
            Browse Course
          </button>
        </div>
      ) : (
        // ✅ Original design (only visible after button click)
        <div className="border border-gray-200 p-6 rounded-lg space-y-12">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Ongoing Courses */}
            <div className="bg-blue-100 rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
              <FaPlayCircle className="text-blue-500 text-5xl mb-4" />
              <h3 className="text-lg font-semibold text-blue-900">
                Ongoing Courses
              </h3>
              <p className="text-blue-900 mt-2 text-md">
                Stay motivated – your hard work today is shaping the skills that
                will define your tomorrow.
              </p>
            </div>

            {/* Completed Courses */}
            <div className="bg-green-100 rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
              <FaCheckCircle className="text-green-600 text-5xl mb-4" />
              <h3 className="text-lg font-semibold text-blue-900">
                Completed Courses
              </h3>
              <p className="text-blue-900 mt-2 text-md">
                Be proud of yourself! Finishing these courses shows your
                determination to learn, grow, and succeed.
              </p>
            </div>

            {/* Saved Courses */}
            <div className="bg-red-100 rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
              <FaBookmark className="text-red-500 text-5xl mb-4" />
              <h3 className="text-lg font-semibold text-blue-900">
                Saved Courses
              </h3>
              <p className="text-blue-900 mt-2 text-md">
                Your saved courses are here, waiting for you. Take the next step
                whenever you feel ready.
              </p>
            </div>
          </div>

          {/* Recommended Courses */}
          <div>
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Recommended Courses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.map((course, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white p-4 flex flex-col"
                >
                  {/* Image + Content */}
                  <div className="grid grid-cols-2 gap-4 flex-grow">
                    {/* Left Image */}
                    <div>
                      <img
                        src={course.img}
                        alt={course.title}
                        className="rounded-lg object-cover w-full h-48"
                      />
                    </div>

                    {/* Right Content */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-blue-900">
                          {course.title}
                        </h3>

                        <div className="flex items-center gap-4 text-blue-900 text-md mt-4">
                          <span className="flex items-center gap-1">
                            <FiClock /> {course.hours}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiBookOpen /> {course.modules}
                          </span>
                        </div>

                        <p className="text-blue-900 text-md mt-2 flex items-center gap-1">
                          <FiAward /> Certificate Included
                        </p>

                        <div className="bg-green-100 text-blue-900 text-md px-3 py-1 rounded-lg inline-block mt-4">
                          {course.tag}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex gap-4">
                    <button className="flex-1 bg-indigo-900 text-white py-2 rounded-md hover:bg-indigo-800 transition">
                      Enroll Now
                    </button>
                    <button className="flex-1 border border-indigo-900 text-indigo-900 py-2 rounded-md hover:bg-indigo-50 transition">
                      Save Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
