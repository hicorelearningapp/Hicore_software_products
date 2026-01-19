import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import workIcon from "../../assets/profile/step4.png";
import deleteIcon from "../../assets/profile/delete.png";

const Education = forwardRef(({ updateData, initialData = [] }, ref) => {
  const [education, setEducation] = useState([]);

  // ✅ Prefill once when initialData is available (Edit Mode)
  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      setEducation(initialData);
    }
  }, [initialData]);

  // ✅ Sync to parent whenever data changes
  useEffect(() => {
    if (updateData) updateData(education);
  }, [education]);

  // ✅ Add new education entry
  const handleAddEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        education_level: "",
        field_of_study: "",
        college_name: "",
        edu_start_year: "",
        edu_end_year: "",
        currently_studying: false,
      },
    ]);
  };

  // ✅ Delete education entry
  const handleDeleteEducation = (index) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Handle input changes
  const handleChange = (index, name, value) => {
    setEducation((prev) => {
      const updated = [...prev];
      updated[index][name] = value;

      // clear end year if currently studying
      if (name === "currently_studying" && value === true) {
        updated[index].edu_end_year = "";
      }
      return updated;
    });
  };

  // ✅ Validation for required fields
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (education.length === 0) return true;

      for (let i = 0; i < education.length; i++) {
        const edu = education[i];
        if (
          !edu.education_level?.trim() ||
          !edu.field_of_study?.trim() ||
          !edu.college_name?.trim() ||
          !edu.edu_start_year?.trim() ||
          (!edu.currently_studying && !edu.edu_end_year?.trim())
        ) {
          alert(`⚠️ Please fill all required fields in Education ${i + 1}.`);
          return false;
        }
      }
      return true;
    },
  }));

  return (
    <div className="w-full h-fit pt-4 pr-32 pb-4 pl-32 flex flex-col gap-5 max-md:px-4 font-inter">
      {/* Empty State */}
      {education.length === 0 && (
        <div className="w-full h-[450px] flex flex-col items-center justify-center gap-4">
          <img src={workIcon} alt="Education Icon" className="w-12 h-12 opacity-25" />
          <p className="font-poppins font-semibold text-[20px] text-[#DAD8EE] text-center">
            No Education added yet.
          </p>
          <p className="font-poppins font-semibold text-[20px] text-[#DAD8EE] text-center">
            Click “Add Education” to get started.
          </p>
          <button
            onClick={handleAddEducation}
            className="w-[200px] h-[36px] bg-[#343079] text-white font-poppins font-semibold text-[20px] rounded-lg shadow-md hover:bg-[#2a276b] transition"
          >
            + Add Education
          </button>
        </div>
      )}

      {/* Add Button */}
      {education.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleAddEducation}
            className="w-[200px] h-[52px] bg-[#343079] text-white font-poppins font-semibold text-[20px] rounded-lg shadow-md hover:bg-[#2a276b] transition"
          >
            + Add Education
          </button>
        </div>
      )}

      {/* Education Entries */}
      {education.map((edu, index) => (
        <div
          key={index}
          className="w-full rounded-lg border border-[#AEADBE] p-9 flex flex-col gap-5 shadow-sm"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <p className="font-poppins font-semibold text-[20px] text-[#343079]">
              Education {index + 1}
            </p>
            <img
              src={deleteIcon}
              alt="Delete"
              onClick={() => handleDeleteEducation(index)}
              className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
            />
          </div>

          {/* Education Level & Field */}
          <div className="flex gap-2 max-md:flex-col">
            <div className="flex flex-col w-1/2 max-md:w-full gap-1">
              <label className="text-[16px] text-[#343079]">
                Level of Education <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="education_level"
                value={edu.education_level}
                onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                placeholder="Bachelor’s Degree"
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
              />
            </div>

            <div className="flex flex-col w-1/2 max-md:w-full gap-1">
              <label className="text-[16px] text-[#343079]">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="field_of_study"
                value={edu.field_of_study}
                onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                placeholder="Computer Science, Business, etc."
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
              />
            </div>
          </div>

          {/* College Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[16px] text-[#343079]">
              College / University Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="college_name"
              value={edu.college_name}
              onChange={(e) => handleChange(index, e.target.name, e.target.value)}
              placeholder="XYZ University"
              className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
            />
          </div>

          {/* Years */}
          <div className="flex flex-wrap gap-2 max-md:flex-col">
            <div className="flex flex-col w-1/3 max-md:w-full gap-1">
              <label className="text-[16px] text-[#343079]">
                Start Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="edu_start_year"
                value={edu.edu_start_year}
                onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                placeholder="2021"
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
              />
            </div>

            <div className="flex flex-col w-1/3 max-md:w-full gap-1">
              <label className="text-[16px] text-[#343079]">
                End Year {edu.currently_studying ? "(Disabled)" : ""}
              </label>
              <input
                type="text"
                name="edu_end_year"
                value={edu.edu_end_year}
                onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                placeholder="2025"
                disabled={edu.currently_studying}
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
              />
            </div>
          </div>

          {/* Currently Studying */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="currently_studying"
              id={`currently_studying-${index}`}
              checked={edu.currently_studying}
              onChange={(e) => handleChange(index, e.target.name, e.target.checked)}
              className="w-4 h-4 border border-[#343079] accent-[#343079] cursor-pointer"
            />
            <label
              htmlFor={`currently_studying-${index}`}
              className="text-[16px] text-[#343079] cursor-pointer"
            >
              Currently Studying
            </label>
          </div>
        </div>
      ))}
    </div>
  );
});

export default Education;
