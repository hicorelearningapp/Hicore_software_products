import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Components
import BasicInfo from "./BasicInfo";
import JobPreference from "./JobPreference";
import WorkExperience from "./WorkExperience";
import Education from "./Education";
import SkillsResume from "./SkillsResume";
import Certifications from "./Certifications";
import Projects from "./Projects";

// Assets
import successImg from "../../assets/profile/profileset.png";
import iconStep1 from "../../assets/profile/step1.png";
import iconStep2 from "../../assets/profile/step2.png";
import iconStep3 from "../../assets/profile/step3.png";
import iconStep4 from "../../assets/profile/step4.png";
import iconStep5 from "../../assets/profile/step5.png";
import iconStep6 from "../../assets/profile/step6.png";
import iconStep7 from "../../assets/profile/step7.png";

// ✅ Backend URL
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const stepsData = [
  { id: 1, title: "Personal Information", icon: iconStep1 },
  { id: 2, title: "Job Preferences", icon: iconStep2 },
  { id: 3, title: "Work Experience", icon: iconStep3 },
  { id: 4, title: "Education", icon: iconStep4 },
  { id: 5, title: "Skills & Resume", icon: iconStep5 },
  { id: 6, title: "Certifications", icon: iconStep6 },
  { id: 7, title: "Projects", icon: iconStep7 },
  { id: 8, title: "Success" },
];

const CreateProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showProjectDetailsMode, setShowProjectDetailsMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Detect edit mode
  const editProfileData = location.state?.profileData || null;
  const isEditMode = !!editProfileData;

  // ✅ Section data
  const [basicInfoData, setBasicInfoData] = useState({});
  const [jobPreferenceData, setJobPreferenceData] = useState({});
  const [workExperienceData, setWorkExperienceData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [skillsData, setSkillsData] = useState({ resume_skills: [], resume_file: "" });
  const [certificationsData, setCertificationsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Prefill form in edit mode
  useEffect(() => {
    if (editProfileData) {
      setBasicInfoData(editProfileData.basicInfo || {});
      setJobPreferenceData(editProfileData.jobPreference || {});
      setWorkExperienceData(editProfileData.workExperience || []);
      setEducationData(editProfileData.education || []);
      setSkillsData(editProfileData.skillsResume || { resume_skills: [], resume_file: "" });
      setCertificationsData(editProfileData.certifications || []);
      setProjectsData(editProfileData.projects || []);
    }
  }, [editProfileData]);

  // ✅ Refs for each step
  const basicInfoRef = useRef();
  const jobPrefRef = useRef();
  const workExpRef = useRef();
  const eduRef = useRef();
  const skillsRef = useRef();
  const certRef = useRef();
  const projRef = useRef();

  // ✅ Validation and Navigation logic
  const handleNext = async () => {
    let isValid = true;
    switch (currentStep) {
      case 1: isValid = basicInfoRef.current?.validate(); break;
      case 2: isValid = jobPrefRef.current?.validate?.(); break;
      case 3: isValid = workExpRef.current?.validate?.(); break;
      case 4: isValid = eduRef.current?.validate?.(); break;
      case 5: isValid = skillsRef.current?.validate?.(); break;
      case 6: isValid = certRef.current?.validate?.(); break;
      case 7: isValid = projRef.current?.validate?.(); break;
      default: isValid = true;
    }

    if (!isValid) return;
    if (currentStep === 7) {
      await handleProfileSubmit();
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // ✅ Submit or Update Profile
  const handleProfileSubmit = async () => {
    try {
      setIsSaving(true);
      const userId = localStorage.getItem("user_id") || localStorage.getItem("userId");

      const cleanWorkExperience = (workExperienceData || []).map(({ company_preview, ...rest }) => rest);
      const cleanProjects = (projectsData || []).map(({ project_preview, hasDetails, ...rest }) => rest);
      const { profile_preview, selfintro_preview, ...cleanBasicInfo } = basicInfoData;

      const cleanSkillsResume = {
        resume_skills: Array.isArray(skillsData.resume_skills)
          ? skillsData.resume_skills.map((s) => s.trim())
          : skillsData.resume_skills
          ? [String(skillsData.resume_skills).trim()]
          : [],
        resume_file: skillsData.resume_file,
      };

      const profileData = {
        basicInfo: { ...cleanBasicInfo, user_id: Number(userId) },
        jobPreference: jobPreferenceData,
        workExperience: cleanWorkExperience,
        education: educationData,
        skillsResume: cleanSkillsResume,
        certifications: certificationsData,
        projects: cleanProjects,
      };

      const formData = new FormData();
      formData.append("json_data", JSON.stringify(profileData));

      // ✅ Attach files
      if (basicInfoData.profile_image instanceof File)
        formData.append("profile_image", basicInfoData.profile_image);
      if (basicInfoData.selfintro_video instanceof File)
        formData.append("selfintro_video", basicInfoData.selfintro_video);
      if (skillsData.resume_file instanceof File)
        formData.append("resume_file", skillsData.resume_file);

      (workExperienceData || []).forEach((exp) => {
        if (exp.company_image instanceof File)
          formData.append("company_images", exp.company_image);
      });

      (projectsData || []).forEach((proj) => {
        if (proj.project_image instanceof File)
          formData.append("project_images", proj.project_image);

        const details = proj.details || {};
        if (details.projectVideo instanceof File)
          formData.append("project_videos", details.projectVideo);
        if (details.srsFile instanceof File)
          formData.append("srs_files", details.srsFile);
        if (details.reportFile instanceof File)
          formData.append("report_files", details.reportFile);
        if (details.demoFile instanceof File)
          formData.append("demo_files", details.demoFile);
      });

      console.log(isEditMode ? "✏️ Updating profile..." : "📤 Creating profile...");

      const response = isEditMode
        ? await axios.put(`${API_BASE}/profile/${userId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axios.post(`${API_BASE}/profile/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (response.status === 200 || response.status === 201) {
        setIsSaving(false);
        alert(isEditMode ? "✅ Profile updated successfully!" : "✅ Profile created successfully!");
        setCurrentStep(8);
        setTimeout(() => navigate("/profile", { replace: true }), 1500);
      } else {
        setIsSaving(false);
        alert("⚠️ Something went wrong. Please try again.");
      }
    } catch (error) {
      setIsSaving(false);
      console.error("❌ Error saving profile:", error);
      alert("❌ Failed to save profile. Check your connection or data.");
    }
  };

  // ✅ UI
  return (
    <div className="w-full h-fit font-poppins">
      {currentStep === 8 ? (
        <div className="flex flex-col items-center justify-center mt-16 min-h-[60vh] text-center">
          <img src={successImg} alt="Success" className="w-[200px] h-[200px] mb-6" />
          <h2 className="font-bold text-[32px] text-[#343079]">
            {isEditMode ? "Profile Updated!" : "You're All Set!"}
          </h2>
          <p className="text-[20px] text-[#343079] mt-2">
            Redirecting to your profile...
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="relative w-full h-[96px] rounded-b-[24px] px-[100px] py-6 flex items-center justify-center bg-[#EBEAF2] max-md:px-6">
            <h2 className="text-[#343079] font-semibold text-center text-[20px] max-md:text-[16px]">
              {isEditMode
                ? "Update your details and save changes."
                : "Help us get to know you — share your details to personalize your experience."}
            </h2>
            {currentStep === 1 && (
              <button
                onClick={() => navigate(-1)}
                className="absolute left-[100px] flex items-center gap-2 text-[#343079] font-medium hover:underline max-md:left-4"
              >
                <ArrowLeft size={20} /> Back
              </button>
            )}
          </div>

          {/* Step Info */}
          <div className="flex items-center gap-2 px-[100px] mt-6 max-md:px-4">
            <img src={stepsData[currentStep - 1].icon} alt="Step Icon" className="w-6 h-6" />
            <h3 className="text-[#343079] font-semibold text-[20px]">
              {stepsData[currentStep - 1].title}
            </h3>
            <span className="ml-2 text-[#343079] text-[16px]">
              Step {currentStep} of {stepsData.length - 1}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full px-[100px] mt-6 max-md:px-4">
            <div className="flex justify-between items-center w-full">
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-[12px] rounded-md mx-[4px] transition-all duration-500 ${
                    index + 1 <= currentStep ? "bg-[#343079]" : "bg-[#DAD8EE]"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="px-[100px] mt-6 max-md:px-4">
            {currentStep === 1 && <BasicInfo ref={basicInfoRef} updateData={setBasicInfoData} initialData={basicInfoData} />}
            {currentStep === 2 && <JobPreference ref={jobPrefRef} updateData={setJobPreferenceData} initialData={jobPreferenceData} />}
            {currentStep === 3 && <WorkExperience ref={workExpRef} updateData={setWorkExperienceData} initialData={workExperienceData} />}
            {currentStep === 4 && <Education ref={eduRef} updateData={setEducationData} initialData={educationData} />}
            {currentStep === 5 && <SkillsResume ref={skillsRef} updateData={setSkillsData} initialData={skillsData} />}
            {currentStep === 6 && <Certifications ref={certRef} updateData={setCertificationsData} initialData={certificationsData} />}
            {currentStep === 7 && (
              <Projects
                ref={projRef}
                updateData={setProjectsData}
                initialData={projectsData}
                setShowProjectDetailsMode={setShowProjectDetailsMode}
              />
            )}
          </div>

          {/* Navigation */}
          {!showProjectDetailsMode && (
            <div className="flex justify-between items-center px-[100px] mt-6 mb-6 max-md:px-4">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSaving}
                className="px-5 py-2 border border-[#282655] text-[#282655] rounded-lg font-medium disabled:opacity-50"
              >
                Previous
              </button>

              {isSaving ? (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-wait"
                >
                  ⏳ Saving...
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={
                    currentStep === 7 &&
                    !projectsData.every(
                      (proj) => proj.hasDetails && proj.project_image && proj.project_name && proj.project_description
                    )
                  }
                  className={`px-5 py-2 rounded-lg font-medium text-white ${
                    currentStep === 7 &&
                    !projectsData.every(
                      (proj) => proj.hasDetails && proj.project_image && proj.project_name && proj.project_description
                    )
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#282655] hover:bg-[#3c398e]"
                  }`}
                >
                  {currentStep === 7
                    ? isEditMode
                      ? "Update Profile"
                      : "Finish & Submit"
                    : "Next"}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreateProfile;
