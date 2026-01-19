import React, { useState } from "react";

const EducationSection = ({ educationData = [], setEducationData }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEdu, setNewEdu] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEducationChange = (index, field, value) => {
    const updated = [...educationData];
    updated[index] = { ...updated[index], [field]: value };
    setEducationData(updated);
  };

  const handleAddEducation = () => {
    setNewEdu({
      level: "",
      field: "",
      college: "",
      startYear: "",
      endYear: "",
    });
    setEditingIndex(null);
    setErrorMsg("");
  };

  const handleSaveNew = () => {
    if (!newEdu.level.trim() || !newEdu.college.trim()) {
      setErrorMsg("⚠️ Please enter Level of Education and College Name");
      return;
    }
    setEducationData([...(educationData || []), newEdu]);
    setNewEdu(null);
    setErrorMsg("");
  };

  const handleCancelNew = () => {
    setNewEdu(null);
    setErrorMsg("");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewEdu(null);
    setErrorMsg("");
  };

  const handleSaveEdit = () => {
    setEditingIndex(null);
  };

  const handleDeleteEducation = (index) => {
    const updated = educationData.filter((_, i) => i !== index);
    setEducationData(updated);
  };

  return (
    <div className="border rounded-xl border-blue-900 overflow-hidden mb-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#F2F2FF] px-4 py-4 border-b border-blue-900">
        <h3 className="text-[20px] font-semibold text-blue-900">Education</h3>
      </div>

      <div className="px-4 py-3 space-y-6 text-blue-900">
        {educationData?.length === 0 && !newEdu && (
          <p className="text-gray-500 text-sm italic">
            No education added yet.
          </p>
        )}

        {educationData.map((edu, index) => (
          <div key={index} className="border border-blue-900 p-3 rounded-lg">
            {editingIndex === index ? (
              <div className="space-y-4 text-blue-900">
                {/* Level */}
                <div>
                  <label className="block text-md font-medium mb-2">
                    Level of education
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-900 rounded-lg p-3 text-sm text-blue-900"
                    value={edu.level}
                    onChange={(e) =>
                      handleEducationChange(index, "level", e.target.value)
                    }
                  />
                </div>

                {/* Field */}
                <div>
                  <label className="block text-md font-medium mb-2">
                    Field of study
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-900 rounded-lg p-3 text-sm text-blue-900"
                    value={edu.field}
                    onChange={(e) =>
                      handleEducationChange(index, "field", e.target.value)
                    }
                  />
                </div>

                {/* College */}
                <div>
                  <label className="block text-md font-medium mb-2">
                    College/University Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-900 rounded-lg p-3 text-sm text-blue-900"
                    value={edu.college}
                    onChange={(e) =>
                      handleEducationChange(index, "college", e.target.value)
                    }
                  />
                </div>

                {/* Years */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-md font-medium mb-2">
                      Start Year
                    </label>
                    <input
                      type="text"
                      className="w-full border border-blue-900 rounded-lg p-3 text-sm text-blue-900"
                      value={edu.startYear}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "startYear",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-md font-medium mb-2">
                      End Year
                    </label>
                    <input
                      type="text"
                      className="w-full border border-blue-900 rounded-lg p-3 text-sm text-blue-900"
                      value={edu.endYear}
                      onChange={(e) =>
                        handleEducationChange(index, "endYear", e.target.value)
                      }
                    />
                  </div>
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
                    onClick={() => handleDeleteEducation(index)}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-blue-900">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold mb-1">
                      {edu.level || "Not specified"}
                    </p>
                    {edu.field && <p>{edu.field}</p>}
                    <p>{edu.college}</p>
                  </div>
                  <p className="text-right whitespace-nowrap">
                    {edu.startYear || "-"} - {edu.endYear || "-"}
                  </p>
                </div>

                {/* Edit + Delete */}
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-3 py-1 border border-[#343079] text-[#343079] rounded-lg text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(index)}
                    className="px-3 py-1 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add New Education Form */}
        {newEdu && (
          <div className="border border-blue-900 p-3 rounded-lg space-y-4 text-blue-900">
            {errorMsg && (
              <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
            )}

            {/* Level */}
            <div>
              <label className="block text-md font-medium mb-2">
                Level of education
              </label>
              <input
                type="text"
                className="w-full border border-blue-900 rounded-lg p-3 text-sm text-blue-900"
                value={newEdu.level}
                onChange={(e) =>
                  setNewEdu({ ...newEdu, level: e.target.value })
                }
              />
            </div>

            {/* Field */}
            <div>
              <label className="block text-md font-medium mb-2">
                Field of study
              </label>
              <input
                type="text"
                className="w-full border border-blue-900 rounded-lg p-3 text-sm text-blue-900"
                value={newEdu.field}
                onChange={(e) =>
                  setNewEdu({ ...newEdu, field: e.target.value })
                }
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-md font-medium mb-2">
                College/University Name
              </label>
              <input
                type="text"
                className="w-full border border-blue-900 rounded-lg p-3 text-sm text-blue-900"
                value={newEdu.college}
                onChange={(e) =>
                  setNewEdu({ ...newEdu, college: e.target.value })
                }
              />
            </div>

            {/* Years */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-md font-medium mb-2">
                  Start Year
                </label>
                <input
                  type="text"
                  className="w-full border border-blue-900 rounded-lg p-3 text-sm text-blue-900"
                  value={newEdu.startYear}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, startYear: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-md font-medium mb-2">
                  End Year
                </label>
                <input
                  type="text"
                  className="w-full border border-blue-900 rounded-lg p-3 text-sm text-blue-900"
                  value={newEdu.endYear}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, endYear: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Save + Delete for New */}
            <div className="flex justify-between">
              <button
                onClick={handleCancelNew}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
              >
                Delete
              </button>

              <button
                onClick={handleSaveNew}
                className="px-4 py-2 bg-[#2D2C8D] text-white rounded-lg text-sm font-medium"
              >
                Save Education
              </button>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!newEdu && (
          <button
            onClick={handleAddEducation}
            className="px-3 py-2 bg-[#F2F2FF] text-[#343079] border border-[#343079] rounded-lg text-sm font-medium hover:bg-[#E9E9FF] transition mt-3"
          >
            + Add Education
          </button>
        )}
      </div>
    </div>
  );
};

export default EducationSection;
