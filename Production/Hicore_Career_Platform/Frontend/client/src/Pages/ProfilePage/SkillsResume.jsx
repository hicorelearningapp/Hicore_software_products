import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import uploadicon from "../../assets/profile/upload.png";
import deleteIcon from "../../assets/profile/delete.png";

const SkillsResume = forwardRef(({ updateData, initialData }, ref) => {
  // ✅ Initialize state
  const [skills, setSkills] = useState(initialData?.resume_skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState(initialData?.resume_file || null);
  const [resumePreview, setResumePreview] = useState(
    initialData?.resume_file
      ? typeof initialData.resume_file === "string"
        ? initialData.resume_file.split("/").pop()
        : initialData.resume_file.name
      : null
  );

  // ✅ Sync with parent
  useEffect(() => {
    if (updateData) {
      updateData({
        resume_skills: skills,
        resume_file: resumeFile, // send File object
      });
    }
  }, [skills, resumeFile, updateData]);

  // ✅ Add new skill
  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return alert("Please enter a skill before adding.");
    if (skills.includes(trimmed)) return alert("This skill is already added.");
    setSkills((prev) => [...prev, trimmed]);
    setNewSkill("");
  };

  // ✅ Remove skill
  const handleDeleteSkill = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Handle resume upload (store File object)
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }
    setResumeFile(file);
    setResumePreview(file.name);
  };

  // ✅ Delete resume
  const handleDeleteResume = () => {
    setResumeFile(null);
    setResumePreview(null);
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (skills.length === 0) {
        alert("⚠️ Please add at least one skill.");
        return false;
      }

      if (!resumeFile) {
        alert("⚠️ Please upload your resume (PDF file).");
        return false;
      }

      return true;
    },
  }));

  return (
    <div className="w-full h-fit pt-4 pr-32 pb-4 pl-32 flex flex-col gap-8 max-md:px-4 font-poppins">
      {/* --- Skills Section --- */}
      <div className="flex flex-col gap-4">
        <label className="text-[18px] text-[#343079] font-semibold">
          Add Your Skills <span className="text-red-500">*</span>
        </label>

        <div className="flex items-center gap-2 max-md:flex-col">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., React, Node.js, Python"
            className="w-2/3 max-md:w-full h-12 px-4 rounded-lg border border-[#AEADBE] text-[#343079] outline-none focus:border-[#343079]"
          />
          <button
            onClick={handleAddSkill}
            className="bg-[#343079] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#3c398e] transition"
          >
            + Add Skill
          </button>
        </div>

        {/* Skill Tags */}
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-3 mt-3">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-[#EBEAF2] text-[#343079] px-4 py-2 rounded-full font-medium shadow-sm"
              >
                {skill}
                <img
                  src={deleteIcon}
                  alt="Delete"
                  className="w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => handleDeleteSkill(index)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#6B6B83] text-sm mt-1">
            Add at least one skill to showcase your expertise.
          </p>
        )}
      </div>

      {/* --- Resume Upload Section --- */}
      <div className="flex flex-col gap-3">
        <label className="text-[18px] text-[#343079] font-semibold">
          Upload Resume (PDF only) <span className="text-red-500">*</span>
        </label>

        <input
          type="file"
          id="resumeUpload"
          accept=".pdf"
          className="hidden"
          onChange={handleResumeUpload}
        />

        {!resumeFile ? (
          <label
            htmlFor="resumeUpload"
            className="flex items-center gap-2 w-fit px-4 py-2 border border-[#343079] rounded-lg cursor-pointer hover:bg-[#EBEAF2]"
          >
            <img src={uploadicon} alt="Upload" className="w-5 h-5" />
            <span className="text-[#343079] font-medium">Upload Resume</span>
          </label>
        ) : (
          <div className="flex items-center gap-3 mt-2">
            <p className="w-fit text-[#343079] border border-gray-500 bg-gray-100 rounded-lg font-medium">{resumePreview}</p>
            <button
              onClick={handleDeleteResume}
              className="text-red-500 font-semibold hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default SkillsResume;
