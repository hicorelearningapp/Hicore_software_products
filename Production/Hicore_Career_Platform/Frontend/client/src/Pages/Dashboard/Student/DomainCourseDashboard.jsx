import React from "react";
import { useNavigate } from "react-router-dom";
import medical from "../../../assets/CourseLandingPng/medical.jpg"
import semiconductor from "../../../assets/CourseLandingPng/semiconductor.jpg"
import software from "../../../assets/CourseLandingPng/software engineer.jpg"
import network from "../../../assets/CourseLandingPng/network engineer.jpg"

const courses = [
  { title: "Medical", img: medical, path: "/courses/medical" },
  { title: "Semiconductor", img: semiconductor, path: "/domain/semiconductors" },
  { title: "Software Engineers", img: software , path: "/courses/software-engineers" },
  { title: "Network Engineers", img: network, path: "/courses/network-engineers" },
];

const DomainCourseDashboard = () => {
  const navigate = useNavigate();

  const handleCourseClick = (path) => {
    navigate(path);
  };

  return (
    <section className="min-h-screen">
      <div className="max-w-7xl ml-4 mr-4 mx-auto rounded-xl bg-white overflow-hidden min-h-[600px] relative">
        {/* Course Grid */}
        <div className="p-6 border border-blue-900 rounded-xl">
          <h2 className="text-xl font-bold text-[#2E2A72] mb-6">
            Domain Based Courses
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {courses.map((item) => (
              <div
                key={item.title}
                onClick={() => handleCourseClick(item.path)}
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
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DomainCourseDashboard;
