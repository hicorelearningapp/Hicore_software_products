import React from "react";
import { projectData } from "../data/projectData";
import { FiMail } from "react-icons/fi";
import "../index.css"; // Arrow-line styles

const Projects = () => {
  return (
    <div className="mt-24 px-4 text-center">
      <h2 className="text-4xl md:text-5xl font-semibold text-[#E09F2B] mb-4">
        Our Products
      </h2>
      <p className="text-base md:text-lg font-semibold text-[#230970] max-w-7xl mx-auto mb-16 md:mb-20">
        From semiconductor automation to AI-powered applications — here’s how we
        turn ideas into intelligent, working systems.
      </p>

      {projectData.map((project, index) => {
        const cardContent = (
          <div
            className={`${project.bgColor} ${project.textColor} w-full h-full p-6 md:p-8 rounded-lg text-left shadow-lg`}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              {project.title}
            </h3>

            <div className="mb-6 leading-relaxed space-y-2 text-sm md:text-base">
              {project.description
                .split(".")
                .map((sentence, i) =>
                  sentence.trim() ? <p key={i}>{sentence.trim()}.</p> : null
                )}
            </div>

            <p className="font-bold text-md md:text-lg mb-4 md:mb-6">
              Key Features:
            </p>

            <ul className="list-disc pl-5 space-y-2 md:space-y-3 text-sm md:text-base mb-6">
              {project.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            {/* MULTIPLE LINKS WITH LABELS */}
            {project.links && project.links.length > 0 && (
              <div className="flex flex-col items-end space-y-2">
                {project.links.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline"
                  >
                    Click here to visit {item.label} →
                  </a>
                ))}
              </div>
            )}
          </div>
        );

        return (
          <div
            key={project.id}
            className={`flex flex-col ${
              index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center justify-between gap-10 md:gap-15 max-w-7xl mx-auto mb-16 md:mb-24`}
          >
            {/* Left Side */}
            <div
              className={`flex flex-col ${
                index % 2 === 1
                  ? "items-end text-right"
                  : "items-start text-left"
              } gap-6 w-full lg:w-1/2`}
            >
              <div className="text-[#230970] font-bold text-6xl md:text-7xl">
                {String(project.id).padStart(2, "0")}
              </div>

              <div
                className={`arrow-line mb-4 ${
                  index % 2 === 1 ? "arrow-right" : "arrow-left"
                }`}
              ></div>

              <img
                src={project.image}
                alt={project.title}
                className="rounded-lg shadow-lg w-full"
              />
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 h-full">{cardContent}</div>
          </div>
        );
      })}

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto mb-16 md:mb-24 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10 px-6 md:px-12 rounded-md border-2 border-yellow-500 bg-gradient-to-r from-white via-gray-200 to-purple-50 shadow-md">
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-2xl font-bold text-[#230970] mb-2">
              Have a Project in Mind? Let’s Make It Real.
            </h3>
            <p className="text-sm md:text-lg text-[#230970]">
              Share your vision with us – and we’ll bring it to life with
              precision, speed, and scalable tech.
            </p>
          </div>

          <a
            href="/contact"
            className="group relative bg-[#230970] md:mr-20 text-white px-6 py-3 
             hover:bg-[#230960] transition-all duration-500 rounded-md 
             w-[130px] hover:w-[160px] overflow-hidden flex items-center justify-start"
          >
            <span className="text-base font-semibold whitespace-nowrap">
              Contact Us
            </span>
            <span
              className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 
               group-hover:opacity-100 transition-opacity duration-500"
            >
              <FiMail className="w-5 h-5 text-white" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Projects;
