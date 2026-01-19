import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import fileIcon from "../../assets/profile/file.png";
import deleteIcon from "../../assets/profile/delete.png";
import uploadicon from "../../assets/profile/upload.png";
import arrowicon from "../../assets/profile/double arrow.png";
import ProjectDetails from "./ProjectDetails";

const Projects = forwardRef(({ updateData, initialData = [], setShowProjectDetailsMode }, ref) => {
  const [projects, setProjects] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Prefill projects ONCE in edit mode (prevents infinite loop)
  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0 && projects.length === 0) {
      const parsedProjects = initialData.map((p) => {
        let details = p.details;

        // Safely parse details if it's a stringified JSON
        if (typeof details === "string") {
          try {
            const parsed = JSON.parse(details);
            details = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
          } catch {
            details = {};
          }
        }

        return {
          ...p,
          project_preview:
            typeof p.project_image === "string" ? p.project_image : null,
          hasDetails: !!details && Object.keys(details).length > 0,
          details: details || null,
        };
      });

      setProjects(parsedProjects);
    }
  }, [initialData]); // ✅ runs only if initialData changes and no local projects yet

  // ✅ Send updated data to parent, but skip first render to prevent feedback loop
  useEffect(() => {
    if (projects.length > 0) {
      updateData?.(projects);
    }
  }, [projects]); // ✅ safe now, no recursion

  // ✅ Add new project
  const handleAddProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        project_name: "",
        project_link: "",
        technologies: "",
        project_description: "",
        project_image: null,
        project_preview: null,
        hasDetails: false,
        details: null,
      },
    ]);
  };

  // ✅ Delete project
  const handleDeleteProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Handle input changes
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setProjects((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  // ✅ Handle image upload (store actual File + preview)
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProjects((prev) => {
      const updated = [...prev];
      updated[index].project_image = file;
      updated[index].project_preview = previewUrl;
      return updated;
    });
  };

  // ✅ Open project details screen
  const handleOpenDetails = (index) => {
    setSelectedProjectIndex(index);
    setShowDetails(true);
    setShowProjectDetailsMode?.(true);
  };

  // ✅ Back to project list
  const handleBackToProjects = () => {
    setShowDetails(false);
    setShowProjectDetailsMode(false);
  };

  // ✅ Save project details
  const handleSaveDetails = (details) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === selectedProjectIndex ? { ...p, hasDetails: true, details } : p
      )
    );
    setShowDetails(false);
    setShowProjectDetailsMode(false);
  };

  // ✅ Validation for parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (projects.length === 0) {
        setErrorMessage("⚠️ Please add at least one project before proceeding.");
        return false;
      }

      for (let i = 0; i < projects.length; i++) {
        const p = projects[i];
        if (!p.project_name.trim() || !p.project_description.trim()) {
          setErrorMessage(`⚠️ Please fill all required fields in Project ${i + 1}.`);
          return false;
        }

        if (!p.project_image && !p.project_preview) {
          setErrorMessage(`⚠️ Please upload a project thumbnail for Project ${i + 1}.`);
          return false;
        }

        if (!p.hasDetails) {
          setErrorMessage(`⚠️ Please complete Project Documentation for Project ${i + 1}.`);
          return false;
        }
      }

      setErrorMessage("");
      return true;
    },
  }));

  // ✅ Render ProjectDetails if opened
  if (showDetails && selectedProjectIndex !== null) {
    return (
      <ProjectDetails
        project={projects[selectedProjectIndex]}
        onBack={handleBackToProjects}
        onSave={handleSaveDetails}
      />
    );
  }

  return (
    <div className="w-full h-fit pt-4 pr-32 pb-4 pl-32 flex flex-col gap-5 max-md:px-4 font-inter">
      {/* Empty State */}
      {projects.length === 0 && (
        <div className="w-full h-[450px] flex flex-col items-center justify-center gap-4">
          <img src={fileIcon} alt="Project Icon" className="w-12 h-12 opacity-25" />
          <p className="font-poppins font-semibold text-[20px] text-[#DAD8EE] text-center">
            No Projects added yet.
          </p>
          <p className="font-poppins font-semibold text-[20px] text-[#DAD8EE] text-center">
            Click “Add Project” to get started.
          </p>
          <button
            onClick={handleAddProject}
            className="w-[200px] h-[36px] bg-[#343079] text-white font-poppins font-semibold text-[20px] rounded-lg shadow-md hover:bg-[#2a276b] transition"
          >
            + Add Project
          </button>
        </div>
      )}

      {/* Add Button */}
      {projects.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleAddProject}
            className="w-[200px] h-[52px] bg-[#343079] text-white font-poppins font-semibold text-[20px] rounded-lg shadow-md hover:bg-[#2a276b] transition"
          >
            + Add Project
          </button>
        </div>
      )}

      {/* Project Cards */}
      {projects.map((proj, index) => (
        <div
          key={index}
          className="w-full min-h-fit rounded-lg border border-[#AEADBE] p-9 flex flex-col gap-5 shadow-sm bg-white"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <p className="font-poppins font-semibold text-[20px] text-[#343079]">
              Project {index + 1}
            </p>
            <img
              src={deleteIcon}
              alt="Delete"
              onClick={() => handleDeleteProject(index)}
              className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
            />
          </div>

          {/* Project Name & Link */}
          <div className="flex gap-4 max-md:flex-col">
            <div className="flex flex-col w-1/2 max-md:w-full gap-1">
              <label className="font-poppins text-[16px] text-[#343079]">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="project_name"
                value={proj.project_name}
                onChange={(e) => handleChange(e, index)}
                placeholder="E-Commerce Platform"
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079]"
              />
            </div>

            <div className="flex flex-col w-1/2 max-md:w-full gap-1">
              <label className="font-poppins text-[16px] text-[#343079]">
                Project Link
              </label>
              <input
                type="url"
                name="project_link"
                value={proj.project_link}
                onChange={(e) => handleChange(e, index)}
                placeholder="https://github.com/yourproject"
                className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079]"
              />
            </div>
          </div>

          {/* Technologies */}
          <div className="flex flex-col w-full gap-1">
            <label className="font-poppins text-[16px] text-[#343079]">
              Technologies Used
            </label>
            <input
              type="text"
              name="technologies"
              value={proj.technologies}
              onChange={(e) => handleChange(e, index)}
              placeholder="React, Node.js, MongoDB"
              className="w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079]"
            />
          </div>

          {/* Upload Image */}
          <div className="flex flex-col w-full gap-1">
            <label className="font-poppins text-[16px] text-[#343079]">
              Upload Project Thumbnail <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id={`projectImage-${index}`}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, index)}
            />
            <label
              htmlFor={`projectImage-${index}`}
              className="flex items-center gap-2 w-fit h-[40px] px-4 py-1 border border-[#343079] rounded-lg cursor-pointer hover:bg-[#EBEAF2]"
            >
              <img src={uploadicon} alt="Upload" className="w-5 h-5" />
              <span className="text-[#343079] font-semibold">Upload Picture</span>
            </label>
            {proj.project_preview && (
              <img
                src={proj.project_preview}
                alt="Preview"
                className="mt-2 w-24 h-24 rounded-lg border border-gray-300 object-cover"
              />
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col w-full gap-1">
            <label className="font-poppins text-[16px] text-[#343079]">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="project_description"
              value={proj.project_description}
              onChange={(e) => handleChange(e, index)}
              placeholder="Describe your project briefly..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-[#AEADBE] text-[#343079] resize-none"
            />
          </div>

          {/* Documentation Section */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:translate-x-1 transition"
            onClick={() => handleOpenDetails(index)}
          >
            <h2 className="text-[#343079] font-semibold text-[16px]">
              Detailed Project Documentation
            </h2>
            <img src={arrowicon} alt="arrow" className="w-5 h-5" />
              <span className="text-red-500">*</span>
          </div>
        </div>
      ))}
    </div>
  );
});

export default Projects;
