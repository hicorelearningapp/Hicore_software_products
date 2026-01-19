import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import backArrow from '../../assets/back-arrow.png';
import askMentor from '../../assets/Chat.png';
import bannerBg from '../../assets/banner-bg.png';
import progressBarImage from '../../assets/project_progress.png';

import SystemRequirement from './SystemRequirement';
import SRS from './SRS';
import Design from './Design';
import Coding from './Coding';
import Testing from './Testing';
import ReportGeneration from './ReportGeneration';
import Certification from './Certification';

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const stepLabels = [
  'System Requirement',
  'SRS',
  'Design',
  'Coding',
  'Testing',
  'Report Generation',
  'Certification',
];

const stepComponents = [
  SystemRequirement,
  SRS,
  Design,
  Coding,
  Testing,
  ReportGeneration,
  Certification,
];

const fallbackData = {
  title: 'Project Title Not Available',
  description: 'No project description provided.',
  tools: [],
  techStack: [],
  mentor: 'N/A',
  image: '',
};

const ProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const StepComponent = stepComponents[currentStep - 1];

  const { projectId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    fetch(`${API_BASE}/projects/mini_projects/by_domain`)
      .then((res) => res.json())
      .then((projects) => {
        let allProjects = [];
        Object.values(projects).forEach((group) => {
          allProjects = allProjects.concat(group);
        });
        const foundProject = allProjects.find((p) => String(p.id) === String(projectId));
        setData(foundProject || fallbackData);
      })
      .catch((error) => {
        console.error('Failed to fetch project data:', error);
        setData(fallbackData);
      });
  }, [projectId]);

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(-1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Banner Section */}
      <div
        className="w-full bg-cover bg-center px-4 md:px-6 py-6"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <button className="flex items-center gap-2 text-[#343079]" onClick={handleBack}>
          <img src={backArrow} alt="back" />
          <span className="text-base font-medium">Back</span>
        </button>

        <div className="max-w-7xl mx-auto mt-6">
          <div className="border border-gray-300 rounded-2xl p-6 bg-white shadow-sm flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-[#343079] text-2xl md:text-3xl font-semibold mb-3">{data.title}</h1>
              <p className="text-gray-700 text-sm md:text-base mb-4">{data.description}</p>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Tools/Software:</p>
                <div className="flex flex-wrap gap-2">
                  {data.tools.map((tool, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-xs px-2 py-1 rounded-full font-[Poppins]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Tech Stack:</p>
                <div className="flex flex-wrap gap-2">
                  {data.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-xs px-2 py-1 rounded-full font-[Poppins]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <p className="text-sm font-medium text-gray-700">Assigned Mentor:</p>
                <span className="text-sm text-[#343079] font-[Poppins]">{data.mentor}</span>

                <button
                  className="group flex items-center justify-center p-2 rounded-full bg-[#343079] transition-all duration-300 hover:rounded-lg hover:px-4"
                  style={{ borderRadius: '80px' }}
                >
                  <div className="w-5 h-5 flex justify-center items-center">
                    <img src={askMentor} alt="Ask Mentor" className="w-5 h-5" />
                  </div>
                  <span className="ml-2 text-white font-[Poppins] text-sm hidden group-hover:inline-block transition-opacity duration-300">
                    Ask Mentor
                  </span>
                </button>
              </div>

              <div className="mt-2">
                <img src={progressBarImage} alt="Progress Bar" className="w-full h-5 object-contain" />
                <p className="text-[#008000] text-[12px] font-[Poppins] mt-1">0% Completed</p>
              </div>
            </div>

            {/* ✅ Updated image part */}
            {data.image && (
              <div className="flex-shrink-0">
                <img
                  src={`${API_BASE}/${data.image}`}
                  alt="Project"
                  className="w-full md:w-[311px] h-[280px] md:h-[347px] object-cover rounded-[16px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stepper Heading */}
      <div className="px-4 md:px-6 mt-6">
        <h1 className="text-center text-[18px] md:text-[20px] leading-[30px] md:leading-[36px] text-[#343079] font-[Poppins] font-semibold">
          To successfully complete this project and earn your certification, you need to follow these steps in order:
        </h1>

        {/* Stepper Component */}
        <div className="flex gap-3 md:gap-0 justify-start md:justify-between items-center w-full max-w-7xl mx-auto py-6 overflow-x-auto">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            return (
              <div key={index} className="flex flex-col items-center min-w-[90px] md:flex-1 relative">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10
                    ${stepNumber < currentStep
                      ? 'bg-[#008000] text-white border-[#008000]'
                      : stepNumber === currentStep
                      ? 'bg-[#343079] text-white border-[#343079]'
                      : 'bg-white text-[#343079] border-[#343079]'}`}
                >
                  {stepNumber < currentStep ? '✔' : stepNumber}
                </div>

                {index < stepLabels.length - 1 && (
                  <div className="hidden md:block absolute top-[14.5px] left-1/2 w-[155.593px] h-px bg-[#343079] z-0 translate-x-4" />
                )}

                <div className="mt-2 text-[12px] font-medium text-[#343079] text-center leading-tight font-[Poppins]">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Step Content */}
      <div className="flex-1 px-4 md:px-6 pb-12">
        <StepComponent onNext={() => setCurrentStep((prev) => prev + 1)} />
      </div>
    </div>
  );
};

export default ProjectWizard;
