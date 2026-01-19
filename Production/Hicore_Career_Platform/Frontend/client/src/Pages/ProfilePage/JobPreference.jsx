import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";

const JobPreference = forwardRef(({ updateData, initialData }, ref) => {
  const [jobPreference, setJobPreference] = useState(
    initialData || {
      job_titles: "",
      work_type: "",
      current_salary: "",
      expected_salary: "",
      availability_start: "",
      relocate: false,
      remote: false,
      hybrid: false,
    }
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [missingFields, setMissingFields] = useState([]);

  // 🔄 Sync with parent
  useEffect(() => {
    if (updateData) updateData(jobPreference);
  }, [jobPreference, updateData]);

  // ✅ Format salary (Indian style commas)
  const formatWithIndianCommas = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    if (numericValue === "" || isNaN(numericValue)) return "";
    return Number(numericValue).toLocaleString("en-IN");
  };

  // ✅ Input change handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobPreference((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
    setMissingFields([]);
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setJobPreference((prev) => ({
      ...prev,
      [name]: formatWithIndianCommas(value),
    }));
    setErrorMessage("");
    setMissingFields([]);
  };

  const handleBooleanChange = (name, value) => {
    setJobPreference((prev) => ({ ...prev, [name]: value === "Yes" }));
    setErrorMessage("");
    setMissingFields([]);
  };

  // ✅ Validation logic
  useImperativeHandle(ref, () => ({
    validate: () => {
      const data = { ...jobPreference };
      const required = [
        "job_titles",
        "work_type",
        "current_salary",
        "expected_salary",
        "availability_start",
      ];

      const missing = required.filter((field) => {
        const val = data[field];
        if (field === "current_salary" || field === "expected_salary") {
          const clean = val?.replace(/,/g, "").trim();
          return !clean;
        }
        return !val || val.toString().trim() === "";
      });

      if (missing.length > 0) {
        setErrorMessage("⚠️ Please fill all required fields marked with *");
        setMissingFields(missing);
        return false;
      }

      setErrorMessage("");
      setMissingFields([]);
      return true;
    },
  }));

  // ✅ Set default radio states
  useEffect(() => {
    setJobPreference((prev) => ({
      ...prev,
      relocate: prev.relocate ?? false,
      remote: prev.remote ?? false,
      hybrid: prev.hybrid ?? false,
    }));
  }, []);

  // Helper for red border on validation error
  const getFieldClass = (name) =>
    `w-full h-12 px-4 rounded-lg border outline-none focus:border-[#343079] text-[#343079] ${
      missingFields.includes(name)
        ? "border-red-400"
        : "border-[#AEADBE]"
    }`;

  return (
    <div className="w-full h-fit pt-4 pr-32 pb-4 pl-32 gap-9 flex flex-col max-md:px-4 font-inter">
      {/* Error Banner */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md border border-red-300 font-medium">
          Please fill all required fields
        </div>
      )}

      {/* Job Title & Work Type */}
      <div className="w-full gap-4 flex max-md:flex-col">
        <div className="flex flex-col w-1/2 max-md:w-full gap-1">
          <label className="font-poppins text-[16px] text-[#343079] font-semibold">
            What job titles are you interested in?{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="job_titles"
            value={jobPreference.job_titles}
            onChange={handleChange}
            placeholder="Front End Developer, Data Analyst, etc."
            className={getFieldClass("job_titles")}
          />
        </div>

        <div className="flex flex-col w-1/2 max-md:w-full gap-1">
          <label className="font-poppins text-[16px] text-[#343079] font-semibold">
            What type(s) of work are you looking for?{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            name="work_type"
            value={jobPreference.work_type}
            onChange={handleChange}
            className={getFieldClass("work_type")}
          >
            <option value="" disabled>
              Select Option
            </option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Salary Section */}
      <div className="w-full gap-4 flex max-md:flex-col">
        <div className="flex flex-col w-1/2 gap-1">
          <label className="font-poppins text-[16px] text-[#343079] font-semibold">
            Current Salary (INR) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="current_salary"
            value={jobPreference.current_salary}
            onChange={handleSalaryChange}
            placeholder="e.g., 8,00,000"
            className={getFieldClass("current_salary")}
          />
        </div>

        <div className="flex flex-col w-1/2 gap-1">
          <label className="font-poppins text-[16px] text-[#343079] font-semibold">
            Expected Salary (INR) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="expected_salary"
            value={jobPreference.expected_salary}
            onChange={handleSalaryChange}
            placeholder="e.g., 12,00,000"
            className={getFieldClass("expected_salary")}
          />
        </div>
      </div>

      {/* Availability */}
      <div className="flex flex-col w-full gap-2">
        <label className="font-poppins text-[16px] text-[#343079] font-semibold">
          Availability to start <span className="text-red-500">*</span>
        </label>
        <div
          className={`flex flex-wrap gap-x-8 gap-y-2 mt-1 ${
            missingFields.includes("availability_start") ? "border-l-4 border-red-400 pl-2" : ""
          }`}
        >
          {["Immediately", "30 days", "60 days", "90 days"].map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-[#343079] cursor-pointer"
            >
              <input
                type="radio"
                name="availability_start"
                value={option}
                checked={jobPreference.availability_start === option}
                onChange={handleChange}
                className="w-4 h-4 accent-[#343079] cursor-pointer"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Relocate / Remote / Hybrid */}
      {[
        { key: "relocate", label: "Are you open to relocating for a job?" },
        { key: "remote", label: "Are you open to remote work?" },
        { key: "hybrid", label: "Are you open to hybrid work?" },
      ].map(({ key, label }) => (
        <div key={key} className="flex flex-col w-full gap-2">
          <label className="font-poppins text-[16px] text-[#343079] font-semibold">
            {label}
          </label>
          <div className="flex gap-x-8 gap-y-2 mt-1">
            {["Yes", "No"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-[#343079] cursor-pointer"
              >
                <input
                  type="radio"
                  name={key}
                  value={option}
                  checked={
                    option === "Yes"
                      ? jobPreference[key] === true
                      : jobPreference[key] === false
                  }
                  onChange={() => handleBooleanChange(key, option)}
                  className="w-4 h-4 accent-[#343079] cursor-pointer"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export default JobPreference;
