import React, { useState, useRef, useEffect } from "react";

const Step1BasicDetails = ({ onContinue = () => {}, initialData = {} }) => {
  const [formData, setFormData] = useState({
    jobType: initialData.jobType || "",
    companyName: initialData.companyName || "",
    title: initialData.title || "",
    department: initialData.department || "",
    eligibility: initialData.eligibility || "",
    employmentType: initialData.employmentType || "",
    locationType: initialData.locationType || "",
    location: initialData.location || "",
    companyLogo: initialData.companyLogo || null,
    companyWebsite: initialData.companyWebsite || "",
  });

  const [preview, setPreview] = useState(
    typeof initialData.companyLogo === "string"
      ? initialData.companyLogo
      : initialData.companyLogo
      ? URL.createObjectURL(initialData.companyLogo)
      : null
  );

  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  // ✅ Clear employment type when switching jobType
  useEffect(() => {
    setFormData((prev) => ({ ...prev, employmentType: "" }));
  }, [formData.jobType]);

  // ✅ Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, companyLogo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.jobType) newErrors.jobType = "Please select posting type.";
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required.";
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.eligibility.trim()) newErrors.eligibility = "Eligibility is required.";
    if (!formData.employmentType) newErrors.employmentType = "Please select type.";
    if (!formData.locationType) newErrors.locationType = "Please select location type.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onContinue(formData);
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-lg font-semibold text-[#343079] mb-2">
        Step 1: Basic Details
      </h2>
      <p className="bg-[#FFE4FF] text-[#343079] px-4 py-2 rounded mb-6 text-sm">
        Start by entering the core information about the role you’re hiring for.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Posting Type */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            Posting Type <span className="text-red-500">*</span>
          </label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 text-[#343079] rounded-md p-2"
            required
          >
            <option value="">Select Posting Type</option>
            <option value="Job">Job</option>
            <option value="Internship">Internship</option>
          </select>
          {errors.jobType && <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter Company Name"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
        </div>

        {/* Company Logo */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            Company Logo/Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className="mt-2 bg-[#343079] text-white px-4 py-2 text-sm rounded-md hover:bg-[#28225e] transition"
          >
            Upload Image
          </button>

          {preview && (
            <div className="mt-3 flex items-center gap-4">
              <img
                src={preview}
                alt="Company Logo Preview"
                className="w-20 h-20 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, companyLogo: null }));
                  setPreview(null);
                  fileInputRef.current.value = null;
                }}
                className="text-sm text-red-600 underline hover:text-red-800"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Company Website */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            Company Website Link
          </label>
          <input
            type="url"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="https://www.companyname.com"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            {formData.jobType === "Internship" ? "Internship Title" : "Job Title"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={
              formData.jobType === "Internship"
                ? "e.g., Web Development Intern"
                : "e.g., Frontend Developer"
            }
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            Department / Team
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Engineering, Design, Sales, etc."
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Eligibility */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            Eligibility <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            placeholder="e.g., B.Tech / MCA / Any graduate"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.eligibility && <p className="text-red-500 text-sm mt-1">{errors.eligibility}</p>}
        </div>

        {/* Employment & Location Type */}
        <div className="grid grid-cols-2 gap-4">
          {/* Employment / Internship Type */}
          <div>
            <label className="block text-sm font-medium text-[#343079]">
              {formData.jobType === "Internship" ? "Internship Type" : "Employment Type"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 text-[#343079] rounded-md p-2"
            >
              <option value="">Select option</option>
              {formData.jobType === "Internship" ? (
                <>
                  <option>Internship (Paid)</option>
                  <option>Internship (Unpaid)</option>
                </>
              ) : (
                <>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Freelance</option>
                  <option>Contract</option>
                </>
              )}
            </select>
            {errors.employmentType && (
              <p className="text-red-500 text-sm mt-1">{errors.employmentType}</p>
            )}
          </div>

          {/* Location Type */}
          <div>
            <label className="block text-sm font-medium text-[#343079]">
              Location Type <span className="text-red-500">*</span>
            </label>
            <select
              name="locationType"
              value={formData.locationType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 text-[#343079] rounded-md p-2"
            >
              <option value="">Select option</option>
              <option>On Site</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
            {errors.locationType && (
              <p className="text-red-500 text-sm mt-1">{errors.locationType}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-[#343079]">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={
              formData.locationType === "Remote"
                ? "Remote"
                : "e.g., Bengaluru, India"
            }
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#343079] text-white px-6 py-2 rounded-md hover:bg-[#28225e] transition"
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1BasicDetails;
