import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import backArrow from '../../assets/back-arrow.png';
import askMentor from '../../assets/Chat.png';
import bannerBg from '../../assets/banner-bg.png';

import SystemRequirement from './SystemRequirement';
import SRS from './SRS';
import Design from './Design';
import Coding from './Coding';
import Testing from './Testing';
import ReportGeneration from './ReportGeneration';
import Certification from './Certification';

const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE || "/api";

const stepLabels = [
  "System Requirement",
  "SRS",
  "Design",
  "Coding",
  "Testing",
  "Report Generation",
  "Certification",
];

/* ⭐ MUST MATCH BACKEND EXACTLY */
const stepPaths = [
  "systemrequirement",
  "srs",
  "design",
  "coding",
  "testing",
  "reportgeneration",
  "certification"
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
  title: "Project Title Not Available",
  description: "No project description provided.",
  tools: [],
  techStack: [],
  mentor: "N/A",
  image: "",
};

// Clean Image URL
const getImageUrl = (path) => {
  if (!path) return "";
  let clean = path.replace(/^app\//, "").replace("/app/", "/");
  if (!clean.startsWith("/")) clean = "/" + clean;
  return `${IMAGE_BASE}${clean}`;
};

const ProjectWizard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || "";
  const totalSteps = stepLabels.length;

  const [data, setData] = useState(fallbackData);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedPaths, setCompletedPaths] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);

  const StepComponent = stepComponents[currentStep - 1];

  /* ---------------------------------------
      GET PROGRESS (CORRECT URL)
  ---------------------------------------- */
  const fetchProgress = async () => {
    const params = new URLSearchParams({
      userId,
      itemType: "project",
      itemId: projectId,
    });

    const url = `${API_BASE}/api/progress/progress?${params}`;
    console.log("🔍 DEBUG: FETCHING PROGRESS:", url);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log("⚠️ DEBUG: Progress GET returned non-OK");
        return;
      }

      const result = await res.json();
      console.log("🔍 DEBUG: BACKEND PROGRESS RESULT:", result);

      setCompletedPaths(result.completed || []);

      if (result.percentage !== undefined) {
        console.log("🔍 DEBUG: Restoring percentage:", result.percentage);
        setProgressPercent(result.percentage);
      }

      if (result.active) {
        console.log("🔍 DEBUG: Active from backend:", result.active);

        const index = stepPaths.indexOf(result.active);
        console.log("🔍 DEBUG: Calculated step index:", index);

        if (index !== -1) {
          console.log("🔍 DEBUG: Restoring CURRENT STEP to:", index + 1);
          setCurrentStep(index + 1);
        }
      }
    } catch (err) {
      console.error("❌ DEBUG: fetchProgress error:", err);
    }
  };

  /* ---------------------------------------
      SAVE ACTIVE STEP (CORRECT URL)
  ---------------------------------------- */
  const saveActiveStep = async (stepIndex) => {
    const lessonPath = stepPaths[stepIndex - 1];

    console.log("🔍 DEBUG: Saving ACTIVE step:", stepIndex, "→", lessonPath);

    try {
      const res = await fetch(`${API_BASE}/api/progress/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          itemType: "project",
          itemId: projectId,
          lessonPath,
          totalLessons: totalSteps,
          status: "active",
        }),
      });

      console.log("🔍 DEBUG: Active step saved successfully.");
    } catch (err) {
      console.error("❌ DEBUG: saveActiveStep error:", err);
    }
  };

  /* ---------------------------------------
      SAVE COMPLETED STEP
  ---------------------------------------- */
  const saveCompletedStep = async (stepIndex) => {
    const lessonPath = stepPaths[stepIndex - 1];

    console.log("🔍 DEBUG: Marking COMPLETED:", lessonPath);

    if (completedPaths.includes(lessonPath)) {
      console.log("🔍 DEBUG: Already completed:", lessonPath);
      return;
    }

    const updated = [...completedPaths, lessonPath];
    setCompletedPaths(updated);

    try {
      const res = await fetch(`${API_BASE}/api/progress/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          itemType: "project",
          itemId: projectId,
          lessonPath,
          totalLessons: totalSteps,
          status: "completed",
        }),
      });

      console.log("🔍 DEBUG: Completed step saved:", lessonPath);
    } catch (err) {
      console.error("❌ DEBUG: saveCompletedStep error:", err);
    }
  };

  /* ---------------------------------------
      LOAD PROJECT + PROGRESS
  ---------------------------------------- */
  useEffect(() => {
    console.log("🔍 DEBUG: Loading project data for ID:", projectId);

    fetch(`${API_BASE}/projects/mini_projects/by_domain`)
      .then((res) => res.json())
      .then((projects) => {
        let all = [];
        Object.values(projects).forEach((group) => (all = all.concat(group)));
        const found = all.find((p) => String(p.id) === String(projectId));

        console.log("🔍 DEBUG: Project found:", found);
        setData(found || fallbackData);
      });

    fetchProgress();
  }, [projectId]);

  /* ---------------------------------------
      SAVE ACTIVE STEP WHEN CHANGED
  ---------------------------------------- */
  useEffect(() => {
    console.log("🔍 DEBUG: CURRENT STEP CHANGED:", currentStep);
    saveActiveStep(currentStep);
  }, [currentStep]);

  /* ---------------------------------------
      RECALCULATE PERCENT
  ---------------------------------------- */
  useEffect(() => {
    const percent = Math.round((completedPaths.length / totalSteps) * 100);
    setProgressPercent(percent);

    console.log("🔍 DEBUG: Progress % recalculated:", percent);
  }, [completedPaths]);

  /* ---------------------------------------
      NEXT STEP
  ---------------------------------------- */
  const handleNext = () => {
    console.log("➡️ DEBUG: Next clicked at step:", currentStep);

    saveCompletedStep(currentStep);

    if (currentStep < totalSteps) {
      console.log("➡️ DEBUG: Moving to next step");
      setCurrentStep((prev) => prev + 1);
    }
  };

  /* ---------------------------------------
      BACK BUTTON
  ---------------------------------------- */
  const handleBack = () => {
    if (currentStep === 1) navigate(-1);
    else setCurrentStep((prev) => prev - 1);
  };

  /* ---------------------------------------
      UI (UNCHANGED)
  ---------------------------------------- */
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Banner */}
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

              {/* Tools */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Tools/Software:</p>
                <div className="flex flex-wrap gap-2">
                  {data.tools.map((tool, index) => (
                    <span key={index} className="bg-gray-200 text-xs px-2 py-1 rounded-full font-[Poppins]">{tool}</span>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Tech Stack:</p>
                <div className="flex flex-wrap gap-2">
                  {data.techStack.map((tech, index) => (
                    <span key={index} className="bg-gray-200 text-xs px-2 py-1 rounded-full font-[Poppins]">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Mentor */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <p className="text-sm font-medium text-gray-700">Assigned Mentor:</p>
                <span className="text-sm text-[#343079] font-[Poppins]">{data.mentor}</span>

                <button className="group flex items-center justify-center p-2 rounded-full bg-[#343079] hover:rounded-lg hover:px-4 transition-all duration-300">
                  <img src={askMentor} alt="Ask Mentor" className="w-5 h-5" />
                  <span className="ml-2 text-white font-[Poppins] text-sm hidden group-hover:inline-block">Ask Mentor</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="w-[400px] bg-gray-200 rounded-full h-3 mt-4">
                  <div
                    className="bg-[#008000] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-[#008000] text-[12px] font-[Poppins] mt-1">
                  {progressPercent}% Completed
                </p>
              </div>
            </div>

            {/* Project Image */}
            {data.image && (
              <div className="flex-shrink-0">
                <img
                  src={getImageUrl(data.image)}
                  alt="Project"
                  className="w-full md:w-[311px] h-[280px] md:h-[347px] object-cover rounded-[16px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="px-4 md:px-6 mt-6">
        <h1 className="text-center text-[18px] md:text-[20px] text-[#343079] font-[Poppins] font-semibold">
          To successfully complete this project and earn your certification, follow these steps:
        </h1>

        <div className="flex gap-3 md:gap-0 justify-start md:justify-between items-center w-full max-w-7xl mx-auto py-6 overflow-x-auto">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;

            return (
              <div key={index} className="flex flex-col items-center min-w-[90px] md:flex-1 relative">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    completedPaths.includes(stepPaths[index])
                      ? "bg-[#008000] text-white border-[#008000]"
                      : stepNumber === currentStep
                      ? "bg-[#343079] text-white border-[#343079]"
                      : "bg-white text-[#343079] border-[#343079]"
                  }`}
                >
                  {completedPaths.includes(stepPaths[index]) ? "✔" : stepNumber}
                </div>

                {index < stepLabels.length - 1 && (
                  <div className="hidden md:block absolute top-[14.5px] ml-4 left-1/2 w-[155px] h-px bg-[#343079]" />
                )}

                <div className="mt-2 text-[12px] font-medium text-[#343079] text-center font-[Poppins]">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Step Content */}
      <div className="flex-1 px-4 md:px-6 pb-12">
        <StepComponent onNext={handleNext} />
      </div>
    </div>
  );
};

export default ProjectWizard;
