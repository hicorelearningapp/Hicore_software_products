import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import LeftSuggestions from "./LeftSuggestions";
import LayoutEditor from "./LayoutEditor";
import ResumePreview from "./ResumePreview";
import ExportIcon from "../../../assets/Download.png";

const BACKEND_URL = import.meta.env.VITE_API_BASE || "/api";

const emptyFormData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    linkedin: "",
    phone: "",
    website: "",
    location: "",
  },
  summary: "",
  workExperiences: [],
  education: [],
  skills: [],
  certifications: [],
};

const AIResumeEditor = () => {
  const location = useLocation();
  const importedData = location.state?.importedResume || null;

  const [formData, setFormData] = useState(importedData || emptyFormData);
  const [isSuggestionsCollapsed, setIsSuggestionsCollapsed] = useState(false);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [activeSection, setActiveSection] = useState("Summary");
  const [newExperienceDraft, setNewExperienceDraft] = useState("");
  const resumeRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleToggleSuggestions = () =>
    setIsSuggestionsCollapsed((prev) => !prev);
  const handleTogglePreview = () => setIsPreviewCollapsed((prev) => !prev);

  const getCenterWidth = () => {
    if (isSuggestionsCollapsed && isPreviewCollapsed) return "mx-2 w-[96%]";
    if (isSuggestionsCollapsed && !isPreviewCollapsed)
      return "ml-3 mr-2 w-[calc(100%-60px-50%-14px)]";
    if (!isSuggestionsCollapsed && isPreviewCollapsed)
      return "ml-3 mr-3 w-[calc(100%-16%-60px-12px)]";
    return "w-1/2";
  };

  const handleSummaryChange = (newSummary) =>
    setFormData((prev) => ({ ...prev, summary: newSummary }));

  const handleWorkExperiencesChange = (updatedList) =>
    setFormData((prev) => ({ ...prev, workExperiences: updatedList }));

  const handleEducationChange = (updatedEducation) =>
    setFormData((prev) => ({ ...prev, education: updatedEducation }));

  const handleCertificationsChange = (updatedCertifications) =>
    setFormData((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }));

  const handleApplySuggestion = (section, newContent) => {
    if (section === "Summary") {
      setFormData((prev) => ({ ...prev, summary: newContent }));
    } else if (section.toLowerCase().startsWith("experience-")) {
      const index = parseInt(section.split("-")[1], 10) - 1;
      setFormData((prev) => {
        const updated = [...prev.workExperiences];
        if (updated[index]) updated[index].responsibilities = newContent;
        return { ...prev, workExperiences: updated };
      });
    } else if (section === "Experience") {
      setFormData((prev) => {
        const updated = [...prev.workExperiences];
        if (updated[0]) updated[0].responsibilities = newContent;
        return { ...prev, workExperiences: updated };
      });
    } else if (section === "NewExperience") {
      setNewExperienceDraft(newContent);
      setActiveSection("NewExperience");
    }
  };

  const getCurrentContent = () => {
    if (activeSection === "Summary") return formData.summary || "";
    if (activeSection === "Experience" && formData.workExperiences.length > 0)
      return formData.workExperiences[0].responsibilities || "";
    if (activeSection.startsWith("Experience-")) {
      const index = parseInt(activeSection.split("-")[1], 10) - 1;
      return formData.workExperiences[index]?.responsibilities || "";
    }
    if (activeSection === "NewExperience") return newExperienceDraft || "";
    return "";
  };

  // Normalizer: map your formData fields into backend-expected schema
  const normalizePayload = (data) => {
    // helper to create ISO-like date fallback from year
    const yearToStartDate = (y) =>
      y && String(y).length === 4 ? `${y}-01-01` : "";
    const yearToEndDate = (y) =>
      y && String(y).length === 4 ? `${y}-12-31` : "";

    const normalized = {
      personalInfo: {
        firstName: data.personalInfo?.firstName || "",
        lastName: data.personalInfo?.lastName || "",
        title: data.personalInfo?.title || "",
        email: data.personalInfo?.email || "",
        linkedin: data.personalInfo?.linkedin || "",
        phone: data.personalInfo?.phone || "",
        website: data.personalInfo?.website || "",
        location: data.personalInfo?.location || "",
      },
      summary: data.summary || "",
      workExperiences: Array.isArray(data.workExperiences)
        ? data.workExperiences.map((w) => ({
            // keep `company` but ensure we also include `role`
            company: w.company || w.companyName || "",
            role: w.role || w.title || w.position || "Not specified",
            location: w.location || "",
            startDate: w.startDate || yearToStartDate(w.startYear) || "",
            endDate: w.endDate || yearToEndDate(w.endYear) || "",
            current: !!w.current,
            responsibilities:
              w.responsibilities || w.description || w.summary || "",
          }))
        : [],
      education: Array.isArray(data.education)
        ? data.education.map((e) => ({
            institution:
              e.institution || e.college || e.school || e.university || "",
            degree: e.degree || e.level || "",
            field: e.field || e.fieldOfStudy || "",
            startDate: e.startDate || yearToStartDate(e.startYear) || "",
            endDate: e.endDate || yearToEndDate(e.endYear) || "",
            // preserve any other fields the backend might accept
            grade: e.grade || e.percentage || "",
            notes: e.notes || "",
          }))
        : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      certifications: Array.isArray(data.certifications)
        ? data.certifications.map((c) => ({
            name: c.name || "",
            issuer: c.issuer || c.org || c.provider || "",
            date: c.date || c.issue || "",
            expiry: c.expiry || "",
            credentialUrl: c.credentialUrl || c.url || "",
          }))
        : [],
    };

    return normalized;
  };

  // NEW: send normalized JSON to backend and download returned PDF blob
  const handleExportPDF = async () => {
    try {
      setDownloadStatus("Preparing download...");

      const url = `${BACKEND_URL.replace(/\/$/, "")}/resume/pdf`;
      const payload = normalizePayload(formData);

      // helpful debug — remove in production
      // console.log("Sending resume payload:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        // include credentials if your backend uses cookies:
        // credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // extract detailed error text if present
        let serverMsg = `Server returned ${response.status}`;
        try {
          const txt = await response.text();
          if (txt) {
            // sometimes backend returns JSON error object
            try {
              const parsed = JSON.parse(txt);
              serverMsg = JSON.stringify(parsed);
            } catch {
              serverMsg = txt;
            }
          }
        } catch (e) {
          /* ignore */
        }
        throw new Error(serverMsg);
      }

      const contentType = response.headers.get("content-type") || "";
      const blob = await response.blob();

      if (contentType.includes("application/pdf") || blob.size > 0) {
        const filename = `${
          payload.personalInfo.firstName || "resume"
        }.pdf`.replace(/\s+/g, "_");

        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);

        setDownloadStatus("Downloaded!");
        setTimeout(() => setDownloadStatus(""), 3000);
      } else {
        throw new Error("Received unexpected file type from server.");
      }
    } catch (err) {
      console.error("Error downloading PDF:", err);
      // show helpful, readable error message if server returned JSON with detail
      let message = "Error downloading PDF";
      try {
        message =
          typeof err.message === "string" && err.message.length > 0
            ? err.message
            : message;
      } catch (e) {
        /* ignore */
      }
      setDownloadStatus(message);
      setTimeout(() => setDownloadStatus(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🧭 Top Bar */}
      <div className="flex justify-between items-center p-4 bg-white m-4 rounded-lg border border-[#E1E0EB]">
        <h1 className="text-[32px] font-bold text-[#343079]">
          AI Resume Builder
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExportPDF}
            className="w-[140px] h-[44px] flex items-center justify-center gap-[4px] bg-[#1F5CAC] hover:bg-[#2785FF] text-white text-[16px] rounded-[4px] border border-white"
          >
            <img src={ExportIcon} alt="Export" className="w-[16px] h-[16px]" />
            Export PDF
          </button>
          {downloadStatus && (
            <span className="text-sm font-semibold text-[#312c81]">
              {downloadStatus}
            </span>
          )}
        </div>
      </div>

      {/* 🧩 Main Layout */}
      <div className="flex p-4 gap-3 transition-all duration-300">
        {/* Left Suggestions */}
        <div
          className={`transition-all duration-300 ${
            isSuggestionsCollapsed ? "w-[60px]" : "w-1/4"
          }`}
        >
          <LeftSuggestions
            collapsed={isSuggestionsCollapsed}
            onToggle={handleToggleSuggestions}
            section={activeSection}
            currentContent={getCurrentContent()}
            onApplySuggestion={handleApplySuggestion}
          />
        </div>

        {/* Center Editor */}
        <div
          className={`transition-all duration-300 ease-in-out ${getCenterWidth()}`}
        >
          <LayoutEditor
            formData={formData}
            setFormData={setFormData}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            newExperienceDraft={newExperienceDraft}
            setNewExperienceDraft={setNewExperienceDraft}
            onSummaryChange={handleSummaryChange}
            onWorkExperiencesChange={handleWorkExperiencesChange}
            onEducationChange={handleEducationChange}
            onCertificationsChange={handleCertificationsChange}
          />
        </div>

        {/* Right Resume Preview */}
        <div
          ref={resumeRef}
          className={`transition-all duration-300 ${
            isPreviewCollapsed ? "w-[60px]" : "w-1/2"
          }`}
        >
          <ResumePreview
            collapsed={isPreviewCollapsed}
            onToggle={handleTogglePreview}
            formData={formData}
          />
        </div>
      </div>

      {/* PDF Export Styles */}
      <style>{`
        .pdf-export * {
          font-size: 0.85em !important;
        }
        .pdf-export .no-pdf {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default AIResumeEditor;
