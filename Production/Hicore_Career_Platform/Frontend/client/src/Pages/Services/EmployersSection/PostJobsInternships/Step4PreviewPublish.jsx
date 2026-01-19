import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Assets
import briefcaseIcon from "../../../../assets/Employer/PostJobs/experience.png";
import salaryIcon from "../../../../assets/Employer/PostJobs/Salary.png";
import jobIdIcon from "../../../../assets/Employer/PostJobs/jobid.png";
import calendarIcon from "../../../../assets/Employer/PostJobs/calendar.png";
import globeIcon from "../../../../assets/Employer/PostJobs/Global.png";
import locationIcon from "../../../../assets/Employer/PostJobs/location.png";
import logoIcon from "../../../../assets/Employer/PostJobs/logoIcon.png";
import tickIcon from "../../../../assets/Employer/PostJobs/tickIcon.png";

const Step4PreviewPublish = ({ jobData = {}, onBack, onContinue, loading }) => {
  const navigate = useNavigate();

  const {
    jobType = "",
    companyName = "",
    companyLogo = "",
    companyWebsite = "",
    title = "",
    department = "",
    employmentType = "",
    locationType = "",
    location = "",
    aboutCompany = "",
    jobOverview = "",
    keyResponsibilities = [],
    mustHaveSkills = [],
    skills = [],
    whatWeOffer = [],
    benefits = [],
    expMin = "",
    expMax = "",
    minAmount = "",
    maxAmount = "",
    currency = "₹",
    openings = "",
    deadline = "",
    industryType = "",
    applyLink = "",
  } = jobData;

  const isInternship =
    jobType?.toLowerCase().includes("intern") ||
    title?.toLowerCase().includes("intern");

  // --- Helpers ---
  const toArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  };

  const formatExperience = () => {
    if (!expMin && !expMax) return "";
    const unit = isInternship ? "month" : "year";
    const min = expMin ? `${expMin} ${unit}${expMin > 1 ? "s" : ""}` : "";
    const max = expMax ? `${expMax} ${unit}${expMax > 1 ? "s" : ""}` : "";
    return min && max ? `${min} - ${max}` : min || max;
  };

  const formatSalary = () => {
    if (!minAmount && !maxAmount) return "";
    const min = minAmount ? `${currency} ${Number(minAmount).toLocaleString()}` : "";
    const max = maxAmount ? `${currency} ${Number(maxAmount).toLocaleString()}` : "";
    return min && max ? `${min} - ${max}` : min || max;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    console.log("🧾 Preview jobData:", jobData);
  }, [jobData]);

  // ✅ Handle Publish Button Click
  const handlePublish = async () => {
    try {
      await onContinue(jobData); // Calls parent’s API submit
    } catch (err) {
      console.error("❌ Publish failed:", err);
      alert("Something went wrong while publishing.");
    }
  };

  return (
    <div className="p-8 w-full">
      <h2 className="text-lg font-semibold text-[#343079] mb-2">
        Step 4: Preview & Publish
      </h2>

      <p className="bg-[#FFE4FF] text-[#343079] px-4 py-2 rounded mb-6 text-sm">
        Review your {isInternship ? "internship" : "job"} post, make final edits,
        and publish when ready.
      </p>

      {/* --- Header Section --- */}
      <div className="flex items-start gap-4 mb-6">
        <img
          src={
            companyLogo
              ? typeof companyLogo === "string"
                ? companyLogo
                : URL.createObjectURL(companyLogo)
              : logoIcon
          }
          alt="Company Logo"
          className="w-16 h-16 object-cover rounded-md border"
        />
        <div>
          <h3 className="text-xl font-semibold text-[#343079]">
            {title || "Untitled Role"}
          </h3>
          <p className="text-indigo-600 font-medium">
            {companyName || "Company Name"}
          </p>
          <p className="text-sm text-[#343079]">
            {jobType || "Job Type"} • {employmentType || ""}
          </p>
          {department && (
            <p className="text-xs text-gray-500 mt-1">
              Department: {department}
            </p>
          )}
        </div>
      </div>

      {/* --- Job Meta Section --- */}
      <div className="p-4 border rounded-lg mb-6 bg-[#f9f9fc]">
        <div className="flex flex-wrap gap-6 text-sm text-[#343079]">
          {formatExperience() && (
            <div className="flex items-center gap-2">
              <img src={briefcaseIcon} alt="Experience" className="w-4 h-4" />
              <span>
                {isInternship ? "Duration:" : "Experience:"}{" "}
                {formatExperience()}
              </span>
            </div>
          )}

          {formatSalary() && (
            <div className="flex items-center gap-2">
              <img src={salaryIcon} alt="Salary" className="w-4 h-4" />
              <span>
                {isInternship ? "Stipend:" : "Salary:"} {formatSalary()}
              </span>
            </div>
          )}

          {openings && (
            <div className="flex items-center gap-2">
              <img src={jobIdIcon} alt="Openings" className="w-4 h-4" />
              <span>Openings: {openings}</span>
            </div>
          )}

          {deadline && (
            <div className="flex items-center gap-2">
              <img src={calendarIcon} alt="Deadline" className="w-4 h-4" />
              <span>Apply Before: {formatDate(deadline)}</span>
            </div>
          )}
        </div>

        {/* Website */}
        {companyWebsite && (
          <div className="flex items-center gap-2 mt-3">
            <img src={globeIcon} alt="Website" className="w-4 h-4" />
            <a
              href={companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline"
            >
              {companyWebsite}
            </a>
          </div>
        )}

        {/* Location */}
        {(location || locationType) && (
          <div className="flex items-center gap-2 mt-2">
            <img src={locationIcon} alt="Location" className="w-4 h-4" />
            <span>
              {location} {locationType && `(${locationType})`}
            </span>
          </div>
        )}

        {/* Industry */}
        {industryType && (
          <div className="mt-2 text-sm text-[#343079]">
            <strong>Industry:</strong> {industryType}
          </div>
        )}
      </div>

      {/* --- About Company --- */}
      {aboutCompany && (
        <>
          <h4 className="font-semibold text-[#343079] mb-1">
            About {companyName}
          </h4>
          <p className="text-[#343079] mb-6">{aboutCompany}</p>
        </>
      )}

      {/* --- Overview --- */}
      {jobOverview && (
        <>
          <h4 className="font-semibold text-[#343079] mb-1">
            {isInternship ? "Internship Overview" : "Job Overview"}
          </h4>
          <p className="text-[#343079] mb-6">{jobOverview}</p>
        </>
      )}

      {/* --- Responsibilities --- */}
      {toArray(keyResponsibilities).length > 0 && (
        <>
          <h4 className="font-semibold text-[#343079] mb-2">
            {isInternship ? "Key Internship Tasks" : "Key Responsibilities"}
          </h4>
          <ul className="list-disc list-inside text-[#343079] mb-6 space-y-1">
            {toArray(keyResponsibilities).map((task, idx) => (
              <li key={idx}>{task}</li>
            ))}
          </ul>
        </>
      )}

      {/* --- Skills --- */}
      {toArray(mustHaveSkills).length > 0 && (
        <>
          <h4 className="font-semibold text-[#343079] mb-2">
            Must-Have Skills
          </h4>
          <ul className="list-disc list-inside text-[#343079] mb-6 space-y-1">
            {toArray(mustHaveSkills).map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </>
      )}

      {/* --- Offerings --- */}
      {toArray(whatWeOffer).length > 0 && (
        <>
          <h4 className="font-semibold text-[#343079] mb-2">
            What We Offer
          </h4>
          <ul className="list-disc list-inside text-[#343079] mb-6 space-y-1">
            {toArray(whatWeOffer).map((perk, idx) => (
              <li key={idx}>{perk}</li>
            ))}
          </ul>
        </>
      )}

      {/* --- Buttons --- */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 text-[#343079] px-6 py-2 rounded-md hover:bg-gray-300 transition"
        >
          Back
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handlePublish}
          className={`${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#28225e]"
          } bg-[#343079] text-white px-6 py-2 rounded-md transition`}
        >
          {loading
            ? "Publishing..."
            : `Publish ${isInternship ? "Internship" : "Job"} Post`}
        </button>
      </div>
    </div>
  );
};

export default Step4PreviewPublish;
