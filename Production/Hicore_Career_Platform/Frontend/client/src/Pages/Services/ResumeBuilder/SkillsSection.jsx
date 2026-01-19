import React, { useState } from "react";
import { FiEdit3 } from "react-icons/fi";

const SkillsSection = ({ skills = [], onSkillsChange }) => {
  const [isSkillsEditing, setIsSkillsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Normalize backend value into array
  const skillsArray = Array.isArray(skills)
    ? skills
    : typeof skills === "string"
    ? skills.split(",").map((s) => s.trim())
    : [];

  const addSkill = () => {
    const skill = inputValue.trim();
    if (!skill) return;
    if (skillsArray.includes(skill)) {
      setInputValue("");
      return;
    }

    const updated = [...skillsArray, skill];
    onSkillsChange(updated);
    setInputValue(""); // Reset text box
  };

  const removeSkill = (skill) => {
    const updated = skillsArray.filter((s) => s !== skill);
    onSkillsChange(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="border rounded-xl border-blue-900 overflow-hidden mb-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#F2F2FF] px-4 py-4 border-b border-blue-900">
        <h3 className="text-[20px] font-semibold text-blue-900">Skills</h3>
        <button
          className="text-md text-blue-900 font-medium"
          onClick={() => setIsSkillsEditing((prev) => !prev)}
        >
          {isSkillsEditing ? "Save" : <FiEdit3 className="text-[#7C67F5]" />}
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        {isSkillsEditing ? (
          <div className="space-y-4">
            {/* Skill Input Box */}
            <div>
              <label className="text-md text-blue-900 block mb-2">
                Add Skill
              </label>
              <input
                type="text"
                value={inputValue}
                placeholder="Type a skill and press Enter"
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-blue-900 text-blue-900 rounded-lg p-2 text-sm"
              />
            </div>

            {/* Display Skills Tags */}
            <div className="flex flex-wrap gap-2">
              {skillsArray.length > 0 ? (
                skillsArray.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2 bg-[#F2F2FF] text-blue-900 text-sm rounded-lg border border-blue-900 flex items-center"
                  >
                    {skill}
                    <button
                      className="ml-2 text-blue-900 font-bold"
                      onClick={() => removeSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">No skills added.</p>
              )}
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="flex flex-wrap gap-2">
            {skillsArray.length > 0 ? (
              skillsArray.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#F2F2FF] text-blue-900 text-sm rounded-full border border-blue-900"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No skills added.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;
