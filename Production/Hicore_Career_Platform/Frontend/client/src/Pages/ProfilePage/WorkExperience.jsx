import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import workIcon from "../../assets/profile/step3.png";
import deleteIcon from "../../assets/profile/delete.png";
import uploadicon from "../../assets/profile/upload.png";

const WorkExperience = forwardRef(({ updateData, initialData }, ref) => {
  const [experiences, setExperiences] = useState(initialData || []);

  // ✅ Send cleaned data (remove preview URLs)
  useEffect(() => {
    if (updateData) {
      const cleanData = experiences.map(
        ({ company_preview, ...rest }) => rest
      );
      updateData(cleanData);
    }
  }, [experiences, updateData]);

  // ✅ Add new experience
  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        company_name: "",
        job_title: "",
        job_location: "",
        start_year: "",
        end_year: "",
        currently_working: false,
        responsibilities: "",
        technologies: "",
        company_image: null, // stores File object
        company_preview: null, // local preview
      },
    ]);
  };

  // ✅ Delete experience
  const handleDeleteExperience = (index) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Handle input change
  const handleInputChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    setExperiences((prev) => {
      const updated = [...prev];
      if (type === "checkbox") {
        updated[index][name] = checked;
        if (checked) updated[index].end_year = "";
      } else {
        updated[index][name] = value;
      }
      return updated;
    });
  };

  // ✅ Handle company image upload
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    setExperiences((prev) => {
      const updated = [...prev];
      updated[index].company_image = file; // store File
      updated[index].company_preview = previewUrl;
      return updated;
    });
  };


  useImperativeHandle(ref, () => ({
    validate: () => {
      if (experiences.length === 0) {
        return true;
      }

      for (let i = 0; i < experiences.length; i++) {
        const exp = experiences[i];
        if (
          !exp.company_name?.trim() ||
          !exp.job_title?.trim() ||
          !exp.job_location?.trim() ||
          !exp.start_year?.trim() ||
          (!exp.currently_working && !exp.end_year?.trim()) ||
          !exp.responsibilities?.trim() ||
          !exp.technologies?.trim() ||
          (!exp.company_image && !exp.company_preview)
        ) {
          alert(`⚠️ Please fill all required fields in Experience ${i + 1}.`);
          return false;
        }
      }
      return true;
    },
  }));


  return (
    <div className="w-full h-fit pt-4 pr-32 pb-4 pl-32 gap-5 flex flex-col max-md:px-4 font-inter">
      {/* Empty State */}
      {experiences.length === 0 && (
        <div className="w-full h-[450px] gap-[16px] flex flex-col items-center justify-center">
          <img src={workIcon} alt="Work Icon" className="w-12 h-12 opacity-25" />
          <p className="font-poppins font-semibold text-[20px] text-[#DAD8EE]">
            No work experience added yet.
          </p>
          <p className="font-poppins font-semibold text-[20px] text-[#DAD8EE]">
            Click “Add Experience” to get started.
          </p>
          <button
            onClick={handleAddExperience}
            className="w-[200px] h-[36px] bg-[#343079] text-white font-poppins font-semibold text-[20px] rounded-lg shadow-md hover:bg-[#4a47a3] transition"
          >
            + Add Experience
          </button>
        </div>
      )}

      {/* Add Experience Button */}
      {experiences.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleAddExperience}
            className="w-[200px] h-[52px] px-4 py-2 rounded-lg bg-[#343079] text-white font-poppins font-semibold text-[20px] shadow-md hover:bg-[#4a47a3] transition"
          >
            + Add Experience
          </button>
        </div>
      )}

      {/* Experience Cards */}
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="w-full rounded-lg border border-[#AEADBE] p-9 flex flex-col gap-5 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <p className="font-poppins font-semibold text-[20px] text-[#343079]">
              Experience {index + 1}
            </p>
            <img
              src={deleteIcon}
              alt="Delete"
              className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100"
              onClick={() => handleDeleteExperience(index)}
            />
          </div>

          {/* Company Name & Job Title */}
          <div className="flex gap-2 max-md:flex-col">
            <div className="flex flex-col w-1/2 gap-1">
              <label className="text-[16px] text-[#343079]">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={exp.company_name}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="ABC Tech"
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079]"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-1">
              <label className="text-[16px] text-[#343079]">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="job_title"
                value={exp.job_title}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Intern / Developer"
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079]"
              />
            </div>
          </div>

          {/* Job Location */}
          <div className="flex flex-col gap-1">
            <label className="text-[16px] text-[#343079]">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="job_location"
              value={exp.job_location}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="City, State"
              className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079]"
            />
          </div>

          {/* Start & End Year */}
          <div className="flex gap-2 max-md:flex-col">
            <div className="flex flex-col w-1/2 gap-1">
              <label className="text-[16px] text-[#343079]">
                Start Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="start_year"
                value={exp.start_year}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="2023"
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079]"
              />
            </div>

            {!exp.currently_working && (
              <div className="flex flex-col w-1/2 gap-1">
                <label className="text-[16px] text-[#343079]">
                  End Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="end_year"
                  value={exp.end_year}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="2024"
                  className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079]"
                />
              </div>
            )}
          </div>

          {/* Currently Working Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="currently_working"
              checked={exp.currently_working}
              onChange={(e) => handleInputChange(e, index)}
              id={`currently_working-${index}`}
              className="w-4 h-4 accent-[#343079]"
            />
            <label
              htmlFor={`currently_working-${index}`}
              className="text-[16px] text-[#343079]"
            >
              Currently Working
            </label>
          </div>

          {/* Responsibilities */}
          <div className="flex flex-col gap-1">
            <label className="text-[16px] text-[#343079]">
              Responsibilities & Achievements{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="responsibilities"
              value={exp.responsibilities}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Worked on backend APIs"
              className="w-full h-32 px-4 pt-2 rounded-lg border border-[#AEADBE] text-[#343079] resize-none"
            ></textarea>
          </div>

          {/* Technologies */}
          <div className="flex flex-col gap-1">
            <label className="text-[16px] text-[#343079]">
              Technologies Used <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="technologies"
              value={exp.technologies}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="React, Node.js"
              className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079]"
            />
          </div>

          {/* Company Image */}
          <div className="flex flex-col gap-1">
            <label className="text-[16px] text-[#343079]">
              Upload Company Thumbnail <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id={`company_image-${index}`}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, index)}
            />
            <label
              htmlFor={`company_image-${index}`}
              className="flex items-center gap-2 w-[161px] h-[40px] px-4 border border-[#343079] text-[#343079] rounded-lg cursor-pointer hover:bg-[#ebeaf5]"
            >
              <img src={uploadicon} alt="Upload" className="w-5 h-5" />
              <span className="font-poppins font-semibold text-[14px]">
                Upload Picture
              </span>
            </label>

            {exp.company_preview && (
              <img
                src={exp.company_preview}
                alt="Company Preview"
                className="mt-2 w-24 h-24 object-cover rounded-lg border border-gray-300"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default WorkExperience;
