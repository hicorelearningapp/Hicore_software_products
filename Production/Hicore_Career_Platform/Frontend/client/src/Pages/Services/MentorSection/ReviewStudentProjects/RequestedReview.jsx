import React, { useState } from 'react';
import searchIcon from "../../../../assets/For Mentor/ReviewLandingPage/search.png";
import { FaUser } from "react-icons/fa";
import eyeicon from "../../../../assets/For Mentor/ReviewLandingPage/view.png";
import reviewicon from "../../../../assets/For Mentor/ReviewLandingPage/circletick.png";
import staricon from "../../../../assets/For Mentor/ReviewLandingPage/star.png";

import { projectsData } from "./Requestedreviewdata"; 

const ReviewForm = ({ onClose }) => {
  return (
    <div className="w-full h-fit flex flex-col gap-7 p-9 opacity-100 border border-[#C0BFD5] rounded-lg bg-white">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-poppins font-semibold text-[14px] text-base text-[#343079]">Strengths</label>
          <textarea className="w-full h-[156px] border border-[#C0BFD5] rounded-lg p-4 font-poppins text-[14px]" placeholder="Type your feedback here..."></textarea>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-poppins font-semibold text-[14px] text-base text-[#343079]">Areas of improvement</label>
          <textarea className="w-full h-[156px] border border-[#C0BFD5] rounded-lg p-4 font-poppins text-[14px]" placeholder="Type your feedback here..."></textarea>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-poppins font-semibold text-[14px] text-base text-[#343079]">Suggestions & guidance</label>
          <textarea className="w-full h-[156px] border border-[#C0BFD5] rounded-lg p-4 font-poppins text-[14px]" placeholder="Type your feedback here..."></textarea>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-poppins font-semibold text-[14px] text-base text-[#343079]">Rating</label>
          <div className="flex gap-1 text-2xl text-[#AEADBE]">
            <img src={staricon} alt="star" />
            <img src={staricon} alt="star" />
            <img src={staricon} alt="star" />
            <img src={staricon} alt="star" />
            <img src={staricon} alt="star" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-poppins font-semibold text-[14px] text-base text-[#343079]">Endorsement</label>
          <textarea className="w-full h-[156px] border border-[#C0BFD5] rounded-lg p-4 font-poppins text-[14px]" placeholder="Type your message here..."></textarea>
        </div>
        
        <button 
          onClick={onClose} 
          className="w-[150px] h-12 border border-[#343079] text-[#343079] font-semibold text-[14px] rounded-lg self-center"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const RequestedReview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;
  const totalPages = Math.ceil(projectsData.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const displayedProjects = projectsData.slice(startIndex, startIndex + projectsPerPage);
  
  // State to manage which project is being reviewed
  const [projectToReview, setProjectToReview] = useState(null);

  // Handler for "Review Now" button click
  const handleReviewClick = (projectId) => {
    setProjectToReview(projectId);
  };
  
  // Handler to close the review form and go back to the list
  const handleCloseReview = () => {
    setProjectToReview(null);
  };

  // Conditional Rendering Logic
  if (projectToReview) {
    // If a project is selected for review, show the ReviewForm
    return <ReviewForm onClose={handleCloseReview} />;
  }

  // Otherwise, show the list of projects
  return (
    <div className="w-full h-fit flex flex-col gap-7 p-9 opacity-100 border border-[#C0BFD5] rounded-lg bg-white">
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
        <div className="w-full h-20 flex gap-[8px] items-center justify-center px-4 py-5 bg-[#F9F9FC] border-b border-[#F3F3FB]">
          <span className="font-poppins font-normal text-base leading-8 text-[#343079]">Project Type</span>
          <select className="w-[250px] h-10 bg-white rounded-md border border-gray-300">
            <option value="default">Select Option</option>
            <option value="final">Final Year Project</option>
            <option value="mini">Mini Project</option>
            <option value="research">Research Work</option>
            <option value="portfolio">Portfolio</option>
          </select>
          <span className="font-poppins font-normal text-base leading-8 text-[#343079]">Domain</span>
          <select className="w-[250px] h-10 bg-white rounded-md border border-gray-300">
            <option value="default">Select Option</option>
            <option value="ai">AI & Machine Learning</option>
            <option value="html">HTML/CSS</option>
            <option value="js">Javascript</option>
          </select>
          <span className="font-poppins font-normal text-base leading-8 text-[#343079]">Project Duration</span>
          <select className="w-[250px] h-10 bg-white rounded-md border border-gray-300">
            <option value="default">Select Option</option>
            <option value="15d">15 days</option>
            <option value="1m">1 month</option>
            <option value="45d">45 days</option>
            <option value="2m">2 months</option>
            <option value="6m">6 months</option>
          </select>
        </div>

        {/* Cards */}
        <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 p-9">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              className="w-full h-full border border-[#C0BFD5] rounded-lg flex flex-col overflow-hidden"
            >
              {/* Image */}
              <img src={project.image} alt={project.title} className="w-full h-[246px] object-cover rounded-t-lg" />

              {/* Content */}
              <div className="w-full h-full flex flex-col gap-4 p-4">
                {/* Title + Description */}
                <div className="w-full flex flex-col gap-2">
                  <h3 className="w-full h-8 font-poppins font-bold text-[16px] leading-8 text-[#343079]">
                    {project.title}
                  </h3>
                  <p className="w-full font-poppins text-[14px] leading-6 text-[#343079]">
                    {project.description}
                  </p>
                </div>

                {/* Submitted Date + Authors */}
                <div className="w-full flex flex-col gap-2">
                  <p className="text-[14px] leading-6 text-[#AEADBE]">Submitted on {project.date}</p>
                  <div className="flex items-center gap-2 text-[#343079] text-[14px] leading-6">
                    <FaUser className="w-4 h-4" />
                    <span>By {project.authors}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="w-full flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-1 rounded-full bg-[#F0F7FF] text-[#3F6699] font-poppins text-[14px] leading-6"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="w-full flex gap-2 mt-auto">
                  <button className="w-[200px] flex items-center gap-2 px-4 py-1 h-10 border border-[#343079] rounded-lg text-[#343079] font-poppins font-semibold text-[14px]">
                    <img src={eyeicon} alt="view" className="w-[20px] h-[20px] cursor-pointer" />
                    View Project
                  </button>
                  <button
                    className="w-[200px] flex items-center gap-2 px-4 py-1 h-10 rounded-lg bg-[#343079] text-white font-poppins font-semibold text-[14px]"
                    onClick={() => handleReviewClick(project.id)}
                  >
                    <img src={reviewicon} alt="review" className="w-[20px] h-[20px] cursor-pointer" />
                    Review Now
                  </button>
                </div>
              </div>
            </div>
          ))}
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
      </div>
    </div>
  );
};

export default RequestedReview;