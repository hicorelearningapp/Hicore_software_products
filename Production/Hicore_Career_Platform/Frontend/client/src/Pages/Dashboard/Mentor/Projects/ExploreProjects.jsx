import React from "react";
import projectImg from "../../../../assets/MentorProjects/ExploreProjects-image.png";
import { User, Calendar, Eye, CheckCircle } from "lucide-react";

const ExploreProjects = () => {
  const projects = [
    {
      id: 1,
      title: "AI-Powered Tutoring System",
      description:
        "An AI-powered tutoring system uses artificial intelligence to create personalized learning experiences for students. This system acts as a virtual tutor, offering support 24/7, and provides valuable insights into a student’s progress for both teachers and parents.",
      date: "Aug 20,2025",
      authors: "Rajesh, John, Priya",
      tags: ["React.js", "Next.js", "JavaScript (ES6+)", "Responsive Design"],
      image: projectImg,
    },
    {
      id: 2,
      title: "AI-Powered Tutoring System",
      description:
        "An AI-powered tutoring system uses artificial intelligence to create personalized learning experiences for students. This system acts as a virtual tutor, offering support 24/7, and provides valuable insights into a student’s progress for both teachers and parents.",
      date: "Aug 20,2025",
      authors: "Rajesh, John, Priya",
      tags: ["React.js", "Next.js", "JavaScript (ES6+)", "Responsive Design"],
      image: projectImg,
    },
    {
      id: 3,
      title: "AI-Powered Tutoring System",
      description:
        "An AI-powered tutoring system uses artificial intelligence to create personalized learning experiences for students. This system acts as a virtual tutor, offering support 24/7, and provides valuable insights into a student’s progress for both teachers and parents.",
      date: "Aug 20,2025",
      authors: "Rajesh, John, Priya",
      tags: ["React.js", "Next.js", "JavaScript (ES6+)", "Responsive Design"],
      image: projectImg,
    },
    {
      id: 4,
      title: "AI-Powered Tutoring System",
      description:
        "An AI-powered tutoring system uses artificial intelligence to create personalized learning experiences for students. This system acts as a virtual tutor, offering support 24/7, and provides valuable insights into a student’s progress for both teachers and parents.",
      date: "Aug 20,2025",
      authors: "Rajesh, John, Priya",
      tags: ["React.js", "Next.js", "JavaScript (ES6+)", "Responsive Design"],
      image: projectImg,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-300"
        >
          {/* Image */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-56 object-cover"
          />

          {/* Content */}
          <div className="p-5">
            <h3 className="text-xl font-bold text-blue-900">
              {project.title}
            </h3>
            <p className="text-md text-blue-900 mt-3 leading-relaxed">
              {project.description}
            </p>

            {/* Meta Info */}
            <p className="text-md text-gray-500 mt-2">
              Submitted on {project.date}
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-900 font-medium mt-2">
              <User size={16} /> {project.authors}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mt-4">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-5 py-2 text-sm rounded-full bg-[#eef2ff] text-[#1e1b4b] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#1e1b4b] text-[#1e1b4b] rounded-lg py-3 text-sm font-medium hover:bg-[#eef2ff] transition">
                <Eye size={20} /> View Project
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-800 transition">
                <CheckCircle size={20} /> Review Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExploreProjects;
