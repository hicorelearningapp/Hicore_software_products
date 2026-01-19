import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import circlearrow from "../../assets/profile/arrowcircle.png";

const ProjectDetails = forwardRef(({ onBack, onSave, project = {} }, ref) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    projectTitle: "",
    projectType: "",
    domain: "",
    startDate: "",
    endDate: "",
    teamSize: "",
    teamMembers: "",
    mentor: "",
    role: "",
    summary: "",
    objective: "",
    solution: "",
    keyFeatures: "",
    outcome: "",
    frontend: "",
    backend: "",
    database: "",
    apis: "",
    devTools: "",
    authentication: "",
    hosting: "",
    versionControl: "",
    srsFile: null,
    reportFile: null,
    demoFile: null,
    challenges: "",
    learnings: "",
    improvements: "",
    projectVideo: null,
    institution: "",
  });

  // ✅ Track preview for uploaded files/videos
  const [filePreviews, setFilePreviews] = useState({
    srsFile: null,
    reportFile: null,
    demoFile: null,
    projectVideo: null,
  });

  const [recording, setRecording] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);
  const recorderRef = useRef(null);

  // ✅ Prefill when editing project
  useEffect(() => {
    if (project?.details) {
      const details = project.details;

      // Merge all text fields
      setFormData((prev) => ({ ...prev, ...details }));

      // ✅ Prefill preview URLs if backend provided file paths
      const API_BASE = import.meta.env.VITE_API_BASE || "";

      const newPreviews = {};

      ["srsFile", "reportFile", "demoFile", "projectVideo"].forEach((key) => {
        const fileValue = details[key];

        if (fileValue) {
          // Case 1: If it's already a File (newly uploaded)
          if (fileValue instanceof File) {
            newPreviews[key] = URL.createObjectURL(fileValue);
          }
          // Case 2: If backend sent a relative path (string)
          else if (typeof fileValue === "string") {
            const url =
              fileValue.startsWith("http") || fileValue.startsWith("/")
                ? `${API_BASE}/${fileValue.replace(/^\/+/, "")}`
                : `${API_BASE}/${fileValue}`;
            newPreviews[key] = url;
          }
        }
      });

      setFilePreviews((prev) => ({ ...prev, ...newPreviews }));
    }
  }, [project]);

  // ✅ Text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ File Upload Handler
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, [name]: file }));
    setFilePreviews((prev) => ({ ...prev, [name]: url }));
  };

  // ✅ Video upload handler
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({ ...prev, projectVideo: file }));
    setFilePreviews((prev) => ({ ...prev, projectVideo: previewUrl }));
  };

  // ✅ Start recording video
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setVideoStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const file = new File([blob], "project_video.webm", { type: "video/webm" });
        const previewUrl = URL.createObjectURL(file);

        setFormData((prev) => ({ ...prev, projectVideo: file }));
        setFilePreviews((prev) => ({ ...prev, projectVideo: previewUrl }));

        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        setVideoStream(null);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      alert("🎥 Camera or microphone permission denied.");
    }
  };

  // ✅ Stop recording
  const stopRecording = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") recorder.stop();
  };

  // ✅ Delete recorded or uploaded video
  const deleteVideo = () => {
    setFormData((prev) => ({ ...prev, projectVideo: null }));
    setFilePreviews((prev) => ({ ...prev, projectVideo: null }));
    if (videoRef.current) videoRef.current.srcObject = null;
    if (videoStream) videoStream.getTracks().forEach((t) => t.stop());
  };

  // ✅ Validation and Save
  const handleSubmit = () => {
    const requiredFields = [
      "projectTitle",
      "projectType",
      "domain",
      "startDate",
      "endDate",
      "teamSize",
      "role",
      "summary",
      "objective",
      "solution",
      "keyFeatures",
      "outcome",
      "frontend",
      "backend",
      "database",
      "apis",
      "devTools",
      "authentication",
      "hosting",
      "versionControl",
      "challenges",
      "learnings",
      "improvements",
    ];

    const missing = requiredFields.filter(
      (f) => !formData[f] || !formData[f].toString().trim()
    );

    if (missing.length > 0) {
      alert("⚠️ Please fill all required fields before saving.");
      return;
    }

    onSave?.(formData);
    alert("✅ Project details saved successfully!");
  };

  return (
    <div className="w-full min-h-screen pt-10 pb-16 px-[80px] max-md:px-6 flex flex-col gap-8">
      {/* 🔙 Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#343079] hover:underline w-fit"
      >
        <img src={circlearrow} alt="back" className="w-[24px] h-[24px]" />
        <span className="font-semibold text-[16px]">Back to Projects</span>
      </button>

      <div>
        <h1 className="text-[24px] font-bold text-[#343079]">
          Detailed Project Documentation
        </h1>
      </div>

      {/* ===== Basic Project Information ===== */}
      <section className="bg-white rounded-xl border border-[#E5E4F0] p-8 flex flex-col gap-6">
        <h2 className="text-[18px] font-medium text-[#343079] mb-2">
          Basic Project Information
        </h2>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-[#343079] font-medium">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            placeholder='e.g. "AI Resume Screening System"'
            className="border border-[#AEADBE] rounded-lg px-4 h-12 text-[#343079]"
          />
        </div>

        {/* Type + Domain */}
        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          <div className="flex flex-col gap-1">
            <label className="text-[#343079] font-medium">
              Project Type <span className="text-red-500">*</span>
            </label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="border border-[#AEADBE] rounded-lg px-4 h-12 text-[#343079]"
            >
              <option value="">Select</option>
              <option value="Academic">Academic</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Company Project">Company Project</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#343079] font-medium">
              Domain / Category 
            <span className="text-red-500"> *</span></label> 
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="border border-[#AEADBE] rounded-lg px-4 h-12 text-[#343079]"
            >
              <option value="">Select</option>
              <option value="AI">AI</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="IoT">IoT</option>
            </select>
          </div>
        </div>

        {/* Dates, Role, Team Info */}
        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          <div className="flex flex-col gap-1">
            <label className="text-[#343079]">Start Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border border-[#AEADBE] rounded-lg px-4 h-12 text-[#343079]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#343079]">End Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border border-[#AEADBE] rounded-lg px-4 h-12 text-[#343079]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#343079]">Team Size <span className="text-red-500">*</span></label>
            <input
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              placeholder="e.g. 4 members"
              className="border border-[#AEADBE] rounded-lg px-4 h-12 text-[#343079]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#343079]">Role <span className="text-red-500">*</span></label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="border border-[#AEADBE] rounded-lg px-4 h-12 text-[#343079]"
            />
          </div>
        </div>

        {/* Team Members + Institution */}
        <div className="flex flex-col gap-1">
          <label className="text-[#343079] font-medium">Team Members</label>
          <textarea
            name="teamMembers"
            value={formData.teamMembers}
            onChange={handleChange}
            rows={3}
            placeholder="Enter member names and roles"
            className="border border-[#AEADBE] rounded-lg p-3 text-[#343079]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#343079] font-medium">Institute Name</label>
          <input
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="Enter institute name"
            className="border border-[#AEADBE] rounded-lg px-4 h-12 text-[#343079]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#343079] font-medium">Mentor Name</label>
          <input
            name="mentor"
            value={formData.mentor}
            onChange={handleChange}
            placeholder="Enter mentor name"
            className="w-[400px] border border-[#AEADBE] rounded-lg p-3 text-[#343079]"
          />
        </div>
      </section>

      {/* ===== Project Description ===== */}
      <section className="bg-white rounded-xl border border-[#E5E4F0] p-8 flex flex-col gap-6">
        <h2 className="text-[18px] font-medium text-[#343079]">
          Project Description
        </h2>

        {[
          ["summary", "Abstract / Summary", "Brief overview (200–300 words)"],
          ["objective", "Objective", "What problem it solves"],
          ["solution", "Solution", "How the project solves the issue"],
          ["keyFeatures", "Key Features", "Main features of your project"],
          ["outcome", "Outcome", "What was achieved"],
        ].map(([name, label, placeholder]) => (
          <div key={name} className="flex flex-col gap-1">
            <label className="text-[#343079] font-medium">{label} <span className="text-red-500">*</span></label>
            <textarea
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              rows={3}
              className="border border-[#AEADBE] rounded-lg p-3 text-[#343079]"
            />
          </div>
        ))}
      </section>

      {/* ===== Technical Stack ===== */}
      <section className="bg-white rounded-xl border border-[#E5E4F0] p-8 flex flex-col gap-6">
        <h2 className="text-[18px] font-medium text-[#343079]">
          Technical Stack & Tools
        </h2>

        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          {[
            ["frontend", "Frontend", "e.g. React.js, Tailwind"],
            ["backend", "Backend", "e.g. Node.js, FastAPI"],
            ["database", "Database", "e.g. MySQL, MongoDB"],
            ["apis", "APIs", "e.g. Stripe, Firebase"],
            ["devTools", "Dev Tools", "e.g. VS Code, Postman"],
            ["authentication", "Authentication", "e.g. JWT, bcrypt"],
            ["hosting", "Hosting", "e.g. Vercel, Render"],
            ["versionControl", "Version Control", "e.g. GitHub"],
          ].map(([name, label, placeholder]) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="text-[#343079] font-medium">{label} <span className="text-red-500">*</span></label>
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="border border-[#AEADBE] rounded-lg px-4 h-12 text-[#343079]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ===== Documentation Upload ===== */}
<section className="bg-white rounded-xl border border-[#E5E4F0] p-8 flex flex-col gap-6">
  <h2 className="text-[18px] font-medium text-[#343079]">
    Documentation & Files Upload
  </h2>

  <div className="flex flex-col gap-4">
    {[
      ["srsFile", "Upload SRS File"],
      ["reportFile", "Upload Project Report"],
      ["demoFile", "Upload Demo Screenshots / Output Files"],
    ].map(([name, label]) => (
      <div
        key={name}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-[#E5E4F0] rounded-lg px-6 py-3 gap-3"
      >
        {/* Label */}
        <p className="text-[#343079] font-medium">{label}</p>

        {/* Upload Button */}
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <input
            type="file"
            id={name}
            name={name}
            onChange={(e) => {
              handleFileChange(e); // keep your existing handler
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setFilePreviews((prev) => ({
                  ...prev,
                  [name]: { file, url },
                }));
              }
            }}
            className="hidden"
          />
          <label
            htmlFor={name}
            className="border border-[#343079] text-[#343079] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#EBEAF2]"
          >
            {filePreviews?.[name]?.file ? "Replace File" : "Upload"}
          </label>

          {/* ✅ File name + Preview link */}
          {filePreviews?.[name]?.file && (
            <div className="flex flex-col sm:items-end">
              <span className="text-sm text-[#343079]">
                📄 {filePreviews[name].file.name}
              </span>
              {filePreviews[name].url &&
                (filePreviews[name].file.type.includes("pdf") ? (
                  <a
                    href={filePreviews[name].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Preview PDF
                  </a>
                ) : (
                  <img
                    src={filePreviews[name].url}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded-lg border border-gray-300"
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</section>


      {/* ===== Project Video ===== */}
<section className="bg-white rounded-xl border border-[#E5E4F0] p-8 flex flex-col gap-6">
  <h2 className="text-[18px] font-medium text-[#343079]">
    Project Video Explanation (Upload / Record)
  </h2>

  {/* Upload Video */}
  <div className="flex items-center justify-between border border-[#E5E4F0] rounded-lg px-6 py-3">
    <p className="text-[#343079] font-medium">Upload Project Video</p>
    <div>
      <input
        type="file"
        accept="video/*"
        id="projectVideo"
        onChange={handleVideoUpload}
        className="hidden"
      />
      <label
        htmlFor="projectVideo"
        className="border border-[#343079] text-[#343079] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#EBEAF2]"
      >
        {filePreviews.projectVideo ? "Replace Video" : "Upload"}
      </label>
    </div>
  </div>

  {/* Record or Preview */}
  <div className="flex flex-col items-center gap-4 mt-4">
    <div className="flex gap-3">
      {!recording ? (
        <button
          onClick={startRecording}
          className="bg-[#343079] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#27245B]"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700"
        >
          Stop Recording
        </button>
      )}
      {filePreviews.projectVideo && !recording && (
        <button
          onClick={deleteVideo}
          className="border border-red-600 text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-50"
        >
          Delete Video
        </button>
      )}
    </div>

    {/* Preview Section */}
    <div className="w-full flex justify-center mt-4">
      {videoStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-[400px] h-[250px] bg-black rounded-lg border border-[#E5E4F0]"
        />
      ) : filePreviews.projectVideo ? (
        <video
          src={filePreviews.projectVideo}
          controls
          className="w-[400px] h-[250px] rounded-lg border border-[#E5E4F0]"
        />
      ) : (
        <p className="text-gray-500 italic">
          No video recorded or uploaded.
        </p>
      )}
    </div>
  </div>
</section>


      {/* ===== Learning & Reflections ===== */}
      <section className="bg-white rounded-xl border border-[#E5E4F0] p-8 flex flex-col gap-6">
        <h2 className="text-[18px] font-medium text-[#343079]">
          Learning & Reflections
        </h2>

        {[
          ["challenges", "Challenges Faced", "Main difficulties faced"],
          ["learnings", "Key Learnings", "Skills and lessons learned"],
          ["improvements", "Future Improvements", "Ideas for enhancement"],
        ].map(([name, label, placeholder]) => (
          <div key={name} className="flex flex-col gap-1">
            <label className="text-[#343079] font-medium">{label} <span className="text-red-500">*</span></label>
            <textarea
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              rows={3}
              className="border border-[#AEADBE] rounded-lg p-3 text-[#343079]"
            />
          </div>
        ))}
      </section>

      {/* ===== Save Button ===== */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="bg-[#343079] text-white w-32 h-12 rounded-lg font-semibold hover:bg-[#27245B]"
        >
          Save
        </button>
      </div>
    </div>
  );
});

export default ProjectDetails;
