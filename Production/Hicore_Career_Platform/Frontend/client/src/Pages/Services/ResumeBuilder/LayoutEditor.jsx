import React from "react";
import layoutIcon from "../../../assets/layout-icon.png";

import PersonalInfoSection from "./PersonalInfoSection";
import SummarySection from "./SummarySection";
import WorkExperienceSection from "./WorkExperienceSection";
import SkillsSection from "./SkillsSection";
import CertificationSection from "./CertificationSection";

const LayoutEditor = ({
  formData = {},
  setFormData,
  onSummaryChange,
  onWorkExperiencesChange,
  onCertificationsChange,
  activeSection,
  setActiveSection, // ✅ from AIResumeEditor
  newExperienceDraft, // ✅ added for live typing
  setNewExperienceDraft, // ✅ added for live typing
}) => {
  const {
    personalInfo = {},
    summary = "",
    workExperiences = [],
    skills = [],
    certifications = [],
  } = formData;

  return (
    <div className="bg-white h-full p-4 rounded-lg shadow w-full border border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <img src={layoutIcon} alt="Layout Icon" className="w-[48px] h-[48px]" />
        <h2 className="text-[20px] text-[#343079] font-semibold">Layout</h2>
      </div>

      {/* ✅ Personal Info Section */}
      <div id="personal">
        <PersonalInfoSection
          personalInfo={personalInfo}
          setFormData={setFormData}
        />
      </div>

      {/* ✅ Summary Section */}
      <div
        id="summary"
        onClick={() => setActiveSection("Summary")}
        className={`transition-all duration-200 mt-3 ${
          activeSection === "Summary" ? "bg-[#F8F8FF]" : ""
        }`}
      >
        <SummarySection summary={summary} onSummaryChange={onSummaryChange} />
      </div>

      {/* ✅ Work Experience Section */}
      <div
        id="experience"
        onClick={() => setActiveSection("Experience")}
        className="transition-all duration-200 mt-3"
      >
        <WorkExperienceSection
          workExperiences={workExperiences}
          onWorkExperiencesChange={onWorkExperiencesChange}
          setActiveSection={setActiveSection}
          newExperienceDraft={newExperienceDraft} // ✅ live typing state
          setNewExperienceDraft={setNewExperienceDraft} // ✅ updater
        />
      </div>

      {/* ✅ Skills Section */}
      <div
        id="skills"
        onClick={() => setActiveSection("Skills")}
        className={`transition-all duration-200 mt-3 ${
          activeSection === "Skills"
            ? "ring-2 ring-[#343079] rounded-md bg-[#F8F8FF]"
            : ""
        }`}
      >
        <SkillsSection
          skills={skills}
          onSkillsChange={(updatedSkills) =>
            setFormData((p) => ({ ...p, skills: updatedSkills }))
          }
        />
      </div>

      {/* ✅ Certifications Section */}
      <div
        id="certifications"
        onClick={() => setActiveSection("Certifications")}
        className={`transition-all duration-200 mt-3 ${
          activeSection === "Certifications"
            ? "ring-2 ring-[#343079] rounded-md bg-[#F8F8FF]"
            : ""
        }`}
      >
        <CertificationSection
          certifications={certifications}
          setCertifications={onCertificationsChange}
        />
      </div>
    </div>
  );
};

export default LayoutEditor;
