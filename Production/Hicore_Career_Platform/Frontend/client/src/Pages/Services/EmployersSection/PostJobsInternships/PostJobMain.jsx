import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBanner from "./TopBanner";
import SidebarSteps from "./SidebarSteps";

import Step1BasicDetails from "./Step1BasicDetails";
import Step2JobOverview from "./Step2JobOverview";
import Step3JobDetails from "./Step3JobDetails";
import Step4PreviewPublish from "./Step4PreviewPublish";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const PostJobMain = () => {
  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    jobType: "",
    companyName: "",
    companyLogo: "",
    companyWebsite: "",
    title: "",
    department: "",
    employmentType: "",
    locationType: "",
    location: "",
    eligibility: "",
    aboutCompany: "",
    jobOverview: "",
    keyResponsibilities: [],
    mustHaveSkills: [],
    skills: [],
    preferredSkills: [],
    jobId: "",
    currency: "₹",
    minAmount: "",
    maxAmount: "",
    expMin: "",
    expMax: "",
    openings: "",
    deadline: "",
    benefits: [],
    whatWeOffer: [],
    industryType: "",
    applyLink: "",
  });

  // ✅ Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("postJobFormData");
    if (saved) setJobData(JSON.parse(saved));
  }, []);

  // ✅ Auto-save form data
  useEffect(() => {
    localStorage.setItem("postJobFormData", JSON.stringify(jobData));
  }, [jobData]);

  // ✅ Fetch logged-in user's ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) return;

        const res = await axios.get(`${API_BASE}/auth/users`);
        if (res.data && Array.isArray(res.data)) {
          const matchedUser = res.data.find((u) => u.email === email);
          if (matchedUser) {
            console.log("✅ Found user:", matchedUser);
            setUserId(matchedUser.id);
          } else {
            console.warn("⚠️ No user found for email:", email);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching user ID:", err);
      }
    };

    fetchUserId();
  }, []);

  // ✅ Normalize array inputs
  const normalizeArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value
      .toString()
      .split(/\r?\n|,/)
      .map((v) => v.trim())
      .filter(Boolean);
  };

  // ✅ Submit job/internship to backend
  const handleSubmitToBackend = async (data) => {
    try {
      setLoading(true);

      if (!userId) {
        alert("⚠️ Unable to fetch user ID. Please re-login.");
        return;
      }

      const postingType = data.jobType;
      let endpoint = "";
      let payload = {};
      let formKey = "";

      // === Job Posting ===
      if (postingType === "Job") {
        endpoint = `${API_BASE}/jobs`;
        formKey = "job_data"; // ✅ backend expects this
        payload = {
          user_id: userId,
          posting_type: "Job",
          company_name: data.companyName,
          company_website: data.companyWebsite,
          title: data.title,
          department: data.department,
          eligibility: data.eligibility,
          employment_type: data.employmentType,
          location_type: data.locationType,
          location: data.location,
          job_overview: data.jobOverview,
          about_company: data.aboutCompany,
          key_responsibilities: normalizeArray(data.keyResponsibilities),
          must_have_skills: normalizeArray(data.mustHaveSkills),
          preferred_skills: normalizeArray(data.skills),
          what_we_offer: normalizeArray(data.whatWeOffer),
          benefits: normalizeArray(data.benefits),
          salary_min_lpa: Number(data.minAmount || 0),
          salary_max_lpa: Number(data.maxAmount || 0),
          experience_min_years: Number(data.expMin || 0),
          experience_max_years: Number(data.expMax || 0),
          openings: Number(data.openings || 0),
          application_deadline: data.deadline,
          industry_type: data.industryType || "Information Technology",
          apply_link: data.applyLink || "",
        };
      }

      // === Internship Posting ===
      else if (postingType === "Internship") {
        endpoint = `${API_BASE}/internships`;
        formKey = "internship_data"; // ✅ backend expects this
        payload = {
          user_id: userId,
          posting_type: "Internship",
          company_name: data.companyName,
          company_website: data.companyWebsite,
          title: data.title,
          department: data.department,
          eligibility: data.eligibility,
          employment_type: data.employmentType,
          location_type: data.locationType,
          location: data.location,
          internship_overview: data.jobOverview,
          about_company: data.aboutCompany,
          highlights: normalizeArray(data.keyResponsibilities),
          required_skills: normalizeArray(data.mustHaveSkills),
          preferred_skills: normalizeArray(data.skills),
          what_we_offer: normalizeArray(data.whatWeOffer),
          benefits: normalizeArray(data.benefits),
          stipend_min: Number(data.minAmount || 0),
          stipend_max: Number(data.maxAmount || 0),
          duration_min_months: Number(data.expMin || 0),
          duration_max_months: Number(data.expMax || 0),
          openings: Number(data.openings || 0),
          application_deadline: data.deadline,
          industry_type: data.industryType || "Information Technology",
          apply_link: data.applyLink || "",
        };
      } else {
        alert("❌ Invalid posting type selected.");
        return;
      }

      // === Send FormData ===
      const formData = new FormData();
      formData.append(formKey, JSON.stringify(payload)); // ✅ key changes dynamically

      if (data.companyLogo instanceof File)
        formData.append("company_logo", data.companyLogo);

      console.log("📤 Submitting to:", endpoint);
      console.log("🧾 Payload:", payload);

      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Submission successful:", response.data);
        localStorage.removeItem("postJobFormData");
        navigate("/employer/job-post-success");
      } else {
        console.error("⚠️ Unexpected response:", response);
        alert("⚠️ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error submitting:", error);
      if (error.response) {
        alert(
          `Error ${error.response.status}: ${
            typeof error.response.data === "object"
              ? JSON.stringify(error.response.data, null, 2)
              : error.response.data
          }`
        );
      } else {
        alert("⚠️ Could not reach backend. Please check connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle steps navigation
  const handleNext = async (newData = {}) => {
    setJobData((prev) => ({ ...prev, ...newData }));
    if (currentStep === 4) {
      await handleSubmitToBackend({ ...jobData, ...newData });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const stepLabels = [
    "Basic Details",
    "Job / Internship Overview",
    "Job / Internship Details",
    "Preview & Publish",
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicDetails initialData={jobData} onContinue={handleNext} />;
      case 2:
        return (
          <Step2JobOverview
            step1Data={jobData}
            onContinue={handleNext}
            initialData={jobData}
          />
        );
      case 3:
        return (
          <Step3JobDetails
            step1Data={jobData}
            onContinue={handleNext}
            defaultValues={jobData}
          />
        );
      case 4:
        return (
          <Step4PreviewPublish
            jobData={jobData}
            onBack={handleBack}
            onContinue={handleNext}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <TopBanner />

      <div className="max-w-6xl mx-auto px-8">

        {/* Progress Bar */}
        <div className="w-full px-4 sm:px-12 pt-6 pb-9">
          <div className="flex justify-between items-center gap-[12px] mb-4">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-[12px] rounded-[4px] ${
                  index < currentStep - 1
                    ? "bg-[#008000]"
                    : index === currentStep - 1
                    ? "bg-[#282655]"
                    : "bg-[#E9E8F3]"
                }`}
              />
            ))}
          </div>
          <p className="text-[14px] font-poppins text-[#343079] font-semibold">
            Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
          </p>
        </div>

        {/* Step Content */}
        <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white mb-12">
          <div className="flex">
            <SidebarSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobMain;
