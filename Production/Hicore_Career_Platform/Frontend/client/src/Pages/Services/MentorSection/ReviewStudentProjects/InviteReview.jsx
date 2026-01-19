// src/components/InviteReview.jsx
import React, { useState } from "react";
import searchIcon from "../../../../assets/For Mentor/ReviewLandingPage/search.png";
import chaticon from "../../../../assets/For Mentor/ReviewLandingPage/chat.png";
import eyeicon from "../../../../assets/For Mentor/ReviewLandingPage/eye.png";
import communityicon from "../../../../assets/For Mentor/ReviewLandingPage/community.png";
import viewicon from "../../../../assets/For Mentor/ReviewLandingPage/view.png";
import messageicon from "../../../../assets/For Mentor/ReviewLandingPage/message.png";

import { mockProjects, recommendedProjects } from "./Invitereviewdata";

const Button = ({ children, className, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};


const InviteReview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  const totalPages = Math.ceil(mockProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = mockProjects.slice(startIndex, startIndex + projectsPerPage);

  return (
    <div className="w-full h-fit flex flex-col gap-7 p-9 opacity-100 border border-[#C0BFD5] rounded-br-lg rounded-bl-lg rounded-tr-lg bg-white">
      {/* Search Bar */}
      <div className="w-full h-[120px] rounded-lg p-9 md:px-[100px] bg-[#F0F7FF] flex items-center gap-9">
        <div className="w-full h-[48px] rounded-lg border border-[#A4A2B3] flex items-center justify-between p-2 md:px-4">
          <img src={searchIcon} alt="Search" className="w-6 h-6" />
          <input
            type="text"
            placeholder="Search by candidate name, project name, domain......"
            className="w-full border-none outline-none bg-transparent pl-4 opacity-100"
          />
        </div>
      </div>
      {/* Filter + Table */}
      <div className="overflow-x-auto rounded-lg border border-[#C0BFD5]">
        {/* Filter bar */}
        <div className="w-full h-20 flex gap-4 items-center px-4 py-5 bg-[#F9F9FC] border-b border-[#F3F3FB]">
          <span className="font-poppins font-semibold text-base leading-8 text-[#343079]">
            Project Type
          </span>
          <select className="w-[250px] h-10 bg-white rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
            <option value="default">Select Option</option>
            <option value="name">Final Year Project</option>
            <option value="requested-role">Mini Project</option>
            <option value="skills">Research Work</option>
            <option value="focus-area">Portfolio</option>
          </select>
          <span className="font-poppins font-semibold text-base leading-8 text-[#343079]">
            Domain
          </span>
          <select className="w-[250px] h-10 bg-white rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
            <option value="default">Select Option</option>
            <option value="name">AI & Machine Learning</option>
            <option value="requested-role">HTML/CSS</option>
            <option value="skills">Javascript</option>
          </select>
          <span className="font-poppins font-semibold text-base leading-8 text-[#343079]">
            Project Duration
          </span>
          <select className="w-[250px] h-10 bg-white rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
            <option value="default">Select Option</option>
            <option value="name">15 days</option>
            <option value="requested-role">1 month</option>
            <option value="skills">45 days</option>
            <option value="focus-area">2 months</option>
            <option value="focus-area">6 months</option>
          </select>
        </div>

        {/* Project Table */}
        <table className="table-fixed w-full border-collapse">
          <thead className="h-16 font-poppins font-bold text-[16px] leading-[32px] border-y border-[#C0BFD5] text-[#343079] text-center">
            <tr>
              <th className="px-6 py-3">Project Title</th>
              <th className="px-6 py-3 border-x border-[#C0BFD5]">Project Type</th>
              <th className="px-6 py-3 border-x border-[#C0BFD5]">Domain</th>
              <th className="px-6 py-3 border-x border-[#C0BFD5]">Project Duration</th>
              <th className="px-6 py-3">Quick Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project) => (
              <tr
                key={project.id}
                className="bg-white items-center font-regular text-[16px] text-[#343079] text-center border-y border-[#C0BFD5] leading-[32px]"
              >
                <td className="px-6 py-4">{project.projectTitle}</td>
                <td className="px-6 py-4 border-x border-[#C0BFD5]">{project.projectType}</td>
                <td className="px-6 py-4 border-x border-[#C0BFD5]">{project.domain}</td>
                <td className="px-6 py-4 border-x border-[#C0BFD5]">{project.duration}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-4">
                    <img src={chaticon} alt="chat" className="w-[36px] h-[36px] cursor-pointer" />
                    <img src={eyeicon} alt="view" className="w-[48px] h-[48px] cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full flex justify-end items-center gap-3 p-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="flex items-center gap-1 text-[#4631A1] disabled:opacity-50"
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          {(() => {
            let pages = [];
            if (totalPages <= 7) {
              pages = Array.from({ length: totalPages }, (_, i) => i + 1);
            } else {
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);
              pages.push(1);
              if (start > 2) pages.push("...");
              for (let i = start; i <= end; i++) {
                pages.push(i);
              }
              if (end < totalPages - 1) {
                if (!pages.includes("...")) pages.push("...");
              }
              pages.push(totalPages);
            }
            return pages.map((page, i) =>
              page === "..." ? (
                <span key={i} className="px-3 py-1 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={i}
                  onClick={() => setCurrentPage(page)}
                  className={`w-[32px] h-[32px] flex items-center justify-center rounded ${
                    currentPage === page
                      ? "bg-[#4631A1] text-white"
                      : "text-[#4631A1] hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            );
          })()}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="flex items-center gap-1 text-[#4631A1] disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
      {/* Recommended Projects */}
      <div className="mt-8">
        <h3 className="text-[#343079] text-xl font-poppins font-semibold mb-4">
          Top 5 AI Recommended Projects
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-[#C0BFD5]"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-[164px] h-[164px] opacity-100 rounded-[80px] border border-[#EBEAF2 mt-6 ml-12"
              />
              <div className="p-4">
                <h4 className="text-[#343079] text-lg font-poppins font-semibold mb-1">
                  {project.title}
                </h4>
                <div className="text-[#AEADBE] font-regular text-[14px] text-center mb-2">
                  Submitted on {project.submittedDate}
                </div>
                <div className="flex items-center gap-2 mb-2 justify-center">
                  <img src={communityicon} alt="community" className="w-[16px] h-[16px] cursor-pointer" />
                  <span className="text-[#8C8A9B] font-regular text-[14px]">
                    By {project.mentor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-[8px] mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="text-[#343079] h-[32px] mt-[4px] text-regular text-center justify-center gap-[5px] items-center font-poppins px-2 py-1 bg-[#F0F7FF] rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <Button className="w-[110px] h-[40px] flex items-center justify-center gap-2 text-[#343079] text-sm font-poppins font-semibold 
                    border border-[#343079] px-4 py-2 rounded-lg"
                  >
                  <img 
                   src={viewicon} 
                   alt="community" 
                   className="w-[16px] h-[16px]" 
                  />
                  <span>View</span>
                  </Button>
                  <Button className="w-[110px] h-[40px] flex items-center justify-center gap-2 bg-[#343079] text-white text-sm font-poppins font-semibold 
                    border border-[#343079] px-4 py-2 rounded-lg"
                  >
                  <img 
                   src={messageicon} 
                   alt="community" 
                   className="w-[16px] h-[16px]" 
                  />
                  <span>Message</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-[12px] flex items-center justify-center gap-2 mt-4">
        <div className="w-3 h-3 rounded-full bg-[#EBEAF2]"></div>
        <div className="w-3 h-3 rounded-full bg-[#EBEAF2]"></div>
        <div className="w-3 h-3 rounded-full bg-[#EBEAF2]"></div>
      </div>
    </div>
  );
};

export default InviteReview;