import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { projectBannerData } from '../../../data/projectBannerData';
import backArrow from '../../assets/back-arrow.png';
import askMentor from '../../assets/Chat.png';
import bannerBg from '../../assets/banner-bg.png';
import progressBarImage from '../../assets/project_progress.png';

const ProjectBanner = ({ currentStep, setCurrentStep }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const data = projectBannerData[projectId];

  if (!data) return null;

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/internship-project');
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div
      className="w-full bg-cover bg-center px-6 py-12"
      style={{
        background: `url(${bannerBg}) lightgray 50% / cover no-repeat`,
      }}
    >
      {/* Back Button */}
      <button className="flex items-center gap-2 text-[#343079]" onClick={handleBack}>
        <img src={backArrow} alt="back" />
        <span className="text-base font-medium">Back</span>
      </button>

      {/* Main Content */}
      <div className="flex justify-between items-start w-full gap-12 mt-6">
        {/* Left side content */}
        <div className="flex flex-col gap-4 w-[60%]">
          <h1 className="text-[#343079] text-[36px] font-normal leading-[48px] font-[Poppins]">
            {data.title}
          </h1>

          <p className="text-[#343079] text-[16px] font-normal leading-[28px] font-[Poppins]">
            {data.description}
          </p>

          {/* Tools/Software */}
          <div className="flex items-start gap-2">
            <p className="text-[#343079] text-[14px] leading-[24px] font-[Poppins] whitespace-nowrap pt-1">
              Tools/Software:
            </p>
            <div className="flex flex-wrap gap-2">
              {data.tools.map((tool, i) => (
                <div
                  key={i}
                  className="px-4 py-1 rounded-full bg-[#D9D8F1] text-sm font-medium text-[#343079]"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex items-start gap-2">
            <p className="text-[#343079] text-[14px] leading-[24px] font-[Poppins] whitespace-nowrap pt-1">
              Tech Stack:
            </p>
            <div className="flex flex-wrap gap-2">
              {data.techStack.map((tech, i) => (
                <div
                  key={i}
                  className="px-4 py-1 rounded-full bg-[#D9D8F1] text-sm font-medium text-[#343079]"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Mentor Info */}
          <div className="flex items-center gap-6 mt-2">
            <p className="text-[#343079] text-[16px] font-bold font-[Poppins]">Assigned Mentor:</p>
            <span className="text-[#343079] font-[Poppins] text-[16px]">{data.mentor}</span>

            {/* Hoverable Ask Mentor Button */}
            <button
              className="group flex items-center gap-2 bg-[#343079] text-white font-[Poppins] text-sm 
                         px-2 py-2 rounded-full hover:rounded-lg hover:px-4 transition-all duration-300"
            >
              <div className="w-5 h-5 flex justify-center items-center">
                <img src={askMentor} alt="Ask Mentor" className="w-5 h-5" />
              </div>
              <span className="hidden group-hover:inline">Ask Mentor</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-2">
            <img
              src={progressBarImage}
              alt="Progress Bar"
              className="w-full h-5 object-contain"
            />
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[#008000] text-[12px] font-[Poppins]">0% Completed</p>
            </div>
          </div>
        </div>

        {/* Right side illustration */}
        <div>
          <img
            src={data.image}
            alt="Project Illustration"
            style={{
              width: '311.868px',
              height: '347px',
              borderRadius: '16px',
              aspectRatio: '311.87 / 347.00',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectBanner;
