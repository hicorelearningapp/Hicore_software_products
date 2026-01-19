import React, { useState, useEffect } from "react";

const WorkExperienceSection = ({
  workExperiences = [],
  onWorkExperiencesChange,
  setActiveSection, // from parent
  newExperienceDraft, // live draft string (optional)
  setNewExperienceDraft, // updater for live draft (optional)
}) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newExp, setNewExp] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Sync textarea with AI-applied suggestion (Apply Suggestion → instant update)
  useEffect(() => {
    if (newExp && newExperienceDraft !== undefined) {
      setNewExp((prev) => ({
        ...prev,
        responsibilities: newExperienceDraft || "",
      }));
    }
  }, [newExperienceDraft]); // runs when suggestion content changes

  const handleWorkChange = (index, field, value) => {
    const updated = [...workExperiences];
    updated[index] = { ...updated[index], [field]: value };
    onWorkExperiencesChange(updated);
  };

  const handleAddExperience = () => {
    const draft = {
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      responsibilities: "",
    };
    setNewExp(draft);
    setEditingIndex(null);
    setErrorMsg("");

    // focus suggestions on new experience and reset live draft
    if (setActiveSection) setActiveSection("NewExperience");
    if (setNewExperienceDraft) setNewExperienceDraft("");
  };

  const handleCancelNew = () => {
    setNewExp(null);
    setErrorMsg("");
    // Reset suggestion focus back to Experience (default)
    if (setActiveSection) setActiveSection("Experience");
    if (setNewExperienceDraft) setNewExperienceDraft("");
  };

  const handleSaveNew = () => {
    if (!newExp.company.trim() || !newExp.title.trim()) {
      setErrorMsg("⚠️ Please enter Company Name and Job Title");
      return;
    }

    const updatedList = [...(workExperiences || []), newExp];
    onWorkExperiencesChange(updatedList);

    // After parent state updates, switch suggestion to the new experience
    setTimeout(() => {
      if (setActiveSection)
        setActiveSection(`Experience-${updatedList.length}`);
    }, 50);

    // Clear after saving
    setNewExp(null);
    setErrorMsg("");
    if (setNewExperienceDraft) setNewExperienceDraft("");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewExp(null);
    setErrorMsg("");
    if (setActiveSection) setActiveSection(`Experience-${index + 1}`);
  };

  const handleSaveEdit = () => {
    setEditingIndex(null);
    if (setActiveSection) setActiveSection("Experience");
  };

  const handleDeleteExperience = (index) => {
    const updated = (workExperiences || []).filter((_, i) => i !== index);
    onWorkExperiencesChange(updated);
    if (setActiveSection) setActiveSection("Experience");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="border rounded-xl border-blue-900 overflow-hidden mb-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#F2F2FF] px-4 py-3 border-b border-blue-900">
        <h3 className="text-[20px] font-semibold text-blue-900">
          Work Experience
        </h3>
      </div>

      <div className="px-4 py-3 space-y-6">
        {workExperiences?.length === 0 && !newExp && (
          <p className="text-gray-500 text-sm italic">
            No work experience added yet.
          </p>
        )}

        {/* Existing Experiences */}
        {workExperiences.map((exp, index) => (
          <div key={index} className="border border-blue-900 p-3 rounded-lg">
            {editingIndex === index ? (
              <div className="space-y-4">
                {/* Company */}
                <div>
                  <label className="block text-md text-blue-900 mb-2">
                    Company Name
                  </label>
                  <input
                    className="border text-blue-900 border-blue-900 p-3 rounded-lg w-full text-sm"
                    value={exp.company}
                    onChange={(e) =>
                      handleWorkChange(index, "company", e.target.value)
                    }
                  />
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-md text-blue-900 mb-2">
                    Job Title
                  </label>
                  <input
                    className="border text-blue-900 border-blue-900 p-3 rounded-lg w-full text-sm"
                    value={exp.title}
                    onChange={(e) =>
                      handleWorkChange(index, "title", e.target.value)
                    }
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-md text-blue-900 mb-2">
                    Location
                  </label>
                  <input
                    className="border text-blue-900 border-blue-900 p-3 rounded-lg w-full text-sm"
                    value={exp.location}
                    onChange={(e) =>
                      handleWorkChange(index, "location", e.target.value)
                    }
                  />
                </div>

                {/* Dates */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-md block mb-2 text-blue-900">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="border p-3 text-blue-900 rounded w-full text-sm"
                      value={exp.startDate}
                      onChange={(e) =>
                        handleWorkChange(index, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-md block mb-2 text-blue-900">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="border p-3 text-blue-900 rounded w-full text-sm"
                      value={exp.current ? "" : exp.endDate}
                      onChange={(e) =>
                        handleWorkChange(index, "endDate", e.target.value)
                      }
                      disabled={exp.current}
                    />
                  </div>
                </div>

                {/* Currently working */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) =>
                      handleWorkChange(index, "current", e.target.checked)
                    }
                  />
                  <label className="text-md text-blue-900">
                    Currently working
                  </label>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="text-md font-medium text-blue-900 mb-2 block">
                    Responsibilities & Achievements
                  </label>
                  <textarea
                    className="border border-blue-900 rounded-lg p-3 w-full text-md text-blue-900"
                    rows={4}
                    value={exp.responsibilities}
                    onChange={(e) =>
                      handleWorkChange(
                        index,
                        "responsibilities",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* Save + Delete */}
                <div className="flex justify-between">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-[#2D2C8D] text-white rounded-lg text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(index)}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[16px] text-blue-900">
                      {exp.title}
                    </p>
                    <p className="text-md text-blue-900">{exp.company}</p>
                    <p className="text-md text-blue-900">{exp.location}</p>
                  </div>
                  <p className="text-sm text-blue-900 whitespace-nowrap">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>

                <ul className="list-disc pl-6 text-md text-blue-900 space-y-2 my-2">
                  {exp.responsibilities?.split("\n").map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>

                {/* Edit + Delete */}
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-3 py-1 text-[#343079] border border-[#343079] rounded-lg text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(index)}
                    className="px-3 py-1 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add New Form */}
        {newExp && (
          <div className="border border-blue-900 p-3 rounded-lg space-y-4">
            {errorMsg && (
              <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
            )}

            {/* Company */}
            <div>
              <label className="block text-md text-blue-900 mb-2">
                Company Name
              </label>
              <input
                className="border text-blue-900 border-blue-900 p-3 rounded-lg w-full text-sm"
                value={newExp.company}
                onChange={(e) =>
                  setNewExp((prev) => ({ ...prev, company: e.target.value }))
                }
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-md text-blue-900 mb-2">
                Job Title
              </label>
              <input
                className="border text-blue-900 border-blue-900 p-3 rounded-lg w-full text-sm"
                value={newExp.title}
                onChange={(e) =>
                  setNewExp((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-md text-blue-900 mb-2">
                Location
              </label>
              <input
                className="border text-blue-900 border-blue-900 p-3 rounded-lg w-full text-sm"
                value={newExp.location}
                onChange={(e) =>
                  setNewExp((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </div>

            {/* Dates */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-md block mb-2 text-blue-900">
                  Start Date
                </label>
                <input
                  type="date"
                  className="border p-3 text-blue-900 rounded w-full text-sm"
                  value={newExp.startDate}
                  onChange={(e) =>
                    setNewExp((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex-1">
                <label className="text-md block mb-2 text-blue-900">
                  End Date
                </label>
                <input
                  type="date"
                  className="border p-3 text-blue-900 rounded w-full text-sm"
                  value={newExp.current ? "" : newExp.endDate}
                  onChange={(e) =>
                    setNewExp((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  disabled={newExp.current}
                />
              </div>
            </div>

            {/* Currently working */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newExp.current}
                onChange={(e) =>
                  setNewExp((prev) => ({ ...prev, current: e.target.checked }))
                }
              />
              <label className="text-md text-blue-900">Currently working</label>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="text-md font-medium text-blue-900 mb-2 block">
                Responsibilities & Achievements
              </label>
              <textarea
                className="border border-blue-900 rounded-lg p-3 w-full text-md text-blue-900"
                rows={4}
                value={newExp.responsibilities}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewExp((prev) => ({ ...prev, responsibilities: val }));

                  // live-update parent draft used by LeftSuggestions
                  if (setNewExperienceDraft) setNewExperienceDraft(val);

                  // ensure suggestions panel focuses on NewExperience
                  if (setActiveSection) setActiveSection("NewExperience");
                }}
              />
            </div>

            {/* Save + Cancel */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleCancelNew}
                className="px-4 py-2 border border-gray-500 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveNew}
                className="px-4 py-2 bg-[#2D2C8D] text-white rounded-lg text-sm font-medium"
              >
                Save Experience
              </button>
            </div>
          </div>
        )}

        {/* Add Experience Button */}
        {!newExp && (
          <button
            onClick={handleAddExperience}
            className="px-4 py-2 bg-[#F2F2FF] text-[#343079] border border-[#343079] rounded-lg text-sm font-medium mt-3"
          >
            + Add Experience
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkExperienceSection;
