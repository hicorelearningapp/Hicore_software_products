// src/components/Employer/PostJob/Steps/Step2JobOverview.jsx
import React, { useState } from "react";

const Step2JobOverview = ({ step1Data = {}, onContinue }) => {
  const [jobOverview, setJobOverview] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [mustHaveSkills, setMustHaveSkills] = useState("");
  const [preferredSkills, setPreferredSkills] = useState([
    "React & TypeScript",
    "Node.js & Express",
    "Python & Django",
    "AWS & DevOps",
  ]);
  const [skillInput, setSkillInput] = useState("");

  // ✅ Detect Internship or Job type
  const isInternship =
    step1Data?.jobType?.toLowerCase().includes("intern") ||
    step1Data?.title?.toLowerCase().includes("intern");

  // ✅ Add skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    const skill = skillInput.trim();
    if (skill && !preferredSkills.includes(skill)) {
      setPreferredSkills([...preferredSkills, skill]);
    }
    setSkillInput("");
  };

  // ✅ Remove skill
  const handleRemoveSkill = (skill) =>
    setPreferredSkills(preferredSkills.filter((s) => s !== skill));

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onContinue) {
      onContinue({
        jobOverview,
        keyResponsibilities: keyResponsibilities
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        aboutCompany,
        mustHaveSkills: mustHaveSkills
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        skills: preferredSkills,
      });
    }
  };

  // ✅ Dynamic placeholders & labels
  const overviewLabel = isInternship
    ? "Internship Overview / Description"
    : "Job Overview / Description";

  const overviewPlaceholder = isInternship
    ? "Add a short summary of what the intern will learn and contribute."
    : "Add a concise summary of the role, expectations, and objectives.";

  const highlightsLabel = isInternship
    ? "Highlights / Internship Tasks"
    : "Highlights / Key Responsibilities";

  const highlightsPlaceholder = isInternship
    ? `Describe what the intern will do or learn (each line = 1 point)
e.g., Assist in building frontend modules, learn team collaboration tools`
    : `List important responsibilities (each line = 1 point)
e.g., Develop and maintain React components, collaborate with designers.`;

  const skillsLabel = isInternship
    ? "Required Skills for Interns"
    : "Must-Have Skills";

  const skillsPlaceholder = isInternship
    ? `List the basic skills required (each line = 1 skill)
e.g., HTML, CSS, JavaScript`
    : `List must-have technical skills (each line = 1 skill)
e.g., React.js, Redux, or API Integration`;

  const headerTitle = isInternship
    ? "Step 2: Internship Overview"
    : "Step 2: Job Overview";

  const headerSubtitle = isInternship
    ? "Add details like learning goals, daily tasks, and required skills for interns."
    : "Add job description, key responsibilities, and required skills.";

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <h2 className="text-lg font-semibold text-[#343079] mb-2">
        {headerTitle}
      </h2>
      <p className="bg-[#FFE4FF] text-[#343079] px-4 py-2 rounded mb-6 text-sm">
        {headerSubtitle}
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Overview / Description */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            {overviewLabel} <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder={overviewPlaceholder}
            rows="4"
            value={jobOverview}
            required
            onChange={(e) => setJobOverview(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 resize-none text-[#343079]"
          />
        </div>

        {/* Highlights / Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            {highlightsLabel} <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder={highlightsPlaceholder}
            rows="4"
            required
            value={keyResponsibilities}
            onChange={(e) => setKeyResponsibilities(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 resize-none text-[#343079]"
          />
        </div>

        {/* About Company */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            About Company <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Describe your company’s culture, mission, and values."
            rows="3"
            required
            value={aboutCompany}
            onChange={(e) => setAboutCompany(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 resize-none text-[#343079]"
          />
        </div>

        {/* Must-Have / Required Skills */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            {skillsLabel} <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder={skillsPlaceholder}
            rows="3"
            required
            value={mustHaveSkills}
            onChange={(e) => setMustHaveSkills(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 resize-none text-[#343079]"
          />
        </div>

        {/* Preferred Skills (Optional) */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            Preferred Skills (Optional)
          </label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSkill(e)}
              placeholder={
                isInternship
                  ? "Type an extra desirable skill (e.g., teamwork, Git)"
                  : "Type a skill and press Enter"
              }
              className="flex-1 border border-gray-300 rounded-md p-3 text-[#343079]"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-[#343079] text-white px-4 py-2 rounded-md hover:bg-[#28225e] transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Selected Skills */}
        {preferredSkills.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {preferredSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border border-[#343079] text-[#343079] rounded-full px-4 py-2 text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-[#343079] font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#343079] text-white px-6 py-2 rounded-md hover:bg-[#28225e] transition"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2JobOverview;
