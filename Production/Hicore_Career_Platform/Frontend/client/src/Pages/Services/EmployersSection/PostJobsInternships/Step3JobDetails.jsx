import React, { useEffect, useRef, useState } from "react";

// --- Helper: format date for display ---
const formatDateLabel = (d) => {
  if (!d) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// --- Calendar Component ---
const Calendar = ({ selectedDate, onSelect, onClose }) => {
  const [viewDate, setViewDate] = useState(selectedDate ? new Date(selectedDate) : new Date());

  useEffect(() => {
    if (selectedDate) setViewDate(new Date(selectedDate));
  }, [selectedDate]);

  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const weekdayIndexMonFirst = (jsDay) => (jsDay + 6) % 7;
  const buildCalendarMatrix = () => {
    const first = startOfMonth(viewDate);
    const last = endOfMonth(viewDate);
    const startOffset = weekdayIndexMonFirst(first.getDay());
    const totalDays = last.getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  };

  const weeks = buildCalendarMatrix();
  const weekDayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const isSameDay = (a, b) =>
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="absolute z-40 right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-[#343079]">
          {viewDate.toLocaleString("default", { month: "short" })} {viewDate.getFullYear()}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">‹</button>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">›</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-gray-400 mb-2">
        {weekDayLabels.map((w) => <div key={w} className="text-center">{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            const selected = isSameDay(day, selectedDate);
            return (
              <button
                key={`${wi}-${di}`}
                type="button"
                onClick={() => day && onSelect(day)}
                className={`h-8 w-8 flex items-center justify-center rounded-full transition 
                ${selected ? "bg-[#2f6bd6] text-white" : "hover:bg-gray-100 text-[#343079]"} 
                ${!day ? "invisible" : ""}`}
              >
                {day ? day.getDate() : ""}
              </button>
            );
          })
        )}
      </div>

      <div className="flex justify-end mt-3">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-500 px-3 py-1 rounded hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// --- Step 3 Component ---
const Step3JobDetails = ({ step1Data = {}, onContinue, defaultValues = {} }) => {
  const [jobId, setJobId] = useState(defaultValues.jobId || "");
  const [currency, setCurrency] = useState(defaultValues.currency || "₹");
  const [minAmount, setMinAmount] = useState(defaultValues.minAmount || "");
  const [maxAmount, setMaxAmount] = useState(defaultValues.maxAmount || "");
  const [expMin, setExpMin] = useState(defaultValues.expMin || "");
  const [expMax, setExpMax] = useState(defaultValues.expMax || "");
  const [openings, setOpenings] = useState(defaultValues.openings || "");
  const [deadline, setDeadline] = useState(defaultValues.deadline ? new Date(defaultValues.deadline) : null);
  const [industryType, setIndustryType] = useState(defaultValues.industryType || "");
  const [customIndustry, setCustomIndustry] = useState("");
  const [applyLink, setApplyLink] = useState(defaultValues.applyLink || "");
  const [whatWeOffer, setWhatWeOffer] = useState(defaultValues.whatWeOffer || "");
  const [benefits, setBenefits] = useState(defaultValues.benefits || []);
  const [selectedBenefit, setSelectedBenefit] = useState("");
  const [customBenefit, setCustomBenefit] = useState("");

  const [errors, setErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  const isInternship =
    step1Data?.jobType?.toLowerCase().includes("intern") ||
    step1Data?.title?.toLowerCase().includes("intern");

  // Close calendar outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add Benefit logic
  const handleAddBenefit = (e) => {
    const val = e.target.value;
    setSelectedBenefit(val);
    if (val && val !== "Other" && !benefits.includes(val)) {
      setBenefits((s) => [...s, val]);
    }
  };

  const handleAddCustomBenefit = () => {
    if (customBenefit && !benefits.includes(customBenefit)) {
      setBenefits((s) => [...s, customBenefit]);
      setCustomBenefit("");
      setSelectedBenefit("");
    }
  };

  const handleRemoveBenefit = (b) => setBenefits((s) => s.filter((it) => it !== b));

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    if (!minAmount || !maxAmount)
      newErrors.salary = isInternship
        ? "Stipend range is required."
        : "Salary range (LPA) is required.";
    if (!openings) newErrors.openings = "Please enter number of openings.";
    if (!deadline) newErrors.deadline = "Please select an application deadline.";
    if (!industryType) newErrors.industry = "Industry type is required.";
    if (!whatWeOffer) newErrors.offer = "Please describe what your company offers.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      jobId,
      currency,
      minAmount,
      maxAmount,
      expMin,
      expMax,
      openings,
      deadline: deadline ? deadline.toISOString() : null,
      industryType: industryType === "Other" ? customIndustry : industryType,
      applyLink,
      whatWeOffer,
      benefits,
    };
    onContinue && onContinue(data);
  };

  return (
    <div className="flex-1 p-8 relative">
      <h2 className="text-lg font-semibold text-[#343079] mb-2">
        {isInternship ? "Step 3: Internship Details" : "Step 3: Job Details"}
      </h2>
      <p className="bg-[#FFE4FF] text-[#343079] px-4 py-2 rounded mb-6 text-sm">
        Add details like {isInternship ? "stipend, duration, and perks" : "salary (in LPA), experience, and benefits"}.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Salary / Stipend */}
        <div>
          <label className="block text-sm font-medium text-[#343079] mb-2">
            {isInternship ? "Stipend Range (per month)" : "Salary Range (in LPA)"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder={isInternship ? "Min Stipend" : "Min (in LPA)"}
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="border border-gray-300 rounded-md p-3 flex-1 text-[#343079]"
            />
            <span className="text-sm text-[#343079]">to</span>
            <input
              type="number"
              placeholder={isInternship ? "Max Stipend" : "Max (in LPA)"}
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="border border-gray-300 rounded-md p-3 flex-1 text-[#343079]"
            />
          </div>
          {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
        </div>

        {/* Experience / Duration */}
        <div>
          <label className="block text-sm font-medium text-[#343079] mb-2">
            {isInternship ? "Internship Duration" : "Experience Required"}
          </label>
          <div className="flex gap-3 items-center">
            <select
              value={expMin}
              onChange={(e) => setExpMin(e.target.value)}
              className="border border-gray-300 rounded-md p-3 flex-1 text-[#343079]"
            >
              <option value="">{isInternship ? "Min Months" : "Min Years"}</option>
              {[...Array(isInternship ? 13 : 11).keys()].map((y) => (
                <option key={y} value={y}>{y} {isInternship ? "month" : "yr"}{y !== 1 ? "s" : ""}</option>
              ))}
            </select>
            <span className="text-sm text-[#343079]">to</span>
            <select
              value={expMax}
              onChange={(e) => setExpMax(e.target.value)}
              className="border border-gray-300 rounded-md p-3 flex-1 text-[#343079]"
            >
              <option value="">{isInternship ? "Max Months" : "Max Years"}</option>
              {[...Array(isInternship ? 13 : 11).keys()].map((y) => (
                <option key={y} value={y}>{y} {isInternship ? "month" : "yr"}{y !== 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Openings */}
        <div>
          <label className="block text-sm font-medium text-[#343079] mb-2">
            Number of Openings <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="Enter number of openings"
            value={openings}
            onChange={(e) => setOpenings(e.target.value)}
            className="border border-gray-300 rounded-md p-3 w-full text-[#343079]"
          />
          {errors.openings && <p className="text-red-500 text-sm mt-1">{errors.openings}</p>}
        </div>

        {/* Deadline */}
        <div className="relative">
          <label className="block text-sm font-medium text-[#343079] mb-2">
            Application Deadline <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              readOnly
              value={formatDateLabel(deadline)}
              onClick={() => setShowCalendar(!showCalendar)}
              placeholder="Select date from calendar"
              className="border border-gray-300 rounded-md p-3 w-full pr-10 text-[#343079] cursor-pointer bg-white"
            />
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-gray-100"
            >
              📅
            </button>
          </div>
          {showCalendar && (
            <div ref={calendarRef} className="absolute bottom-full mb-2">
              <Calendar
                selectedDate={deadline}
                onSelect={(d) => {
                  setDeadline(d);
                  setShowCalendar(false);
                }}
                onClose={() => setShowCalendar(false)}
              />
            </div>
          )}
          {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
        </div>

        {/* Industry Type */}
        <div>
          <label className="block text-sm font-medium text-[#343079] mb-2">
            Industry Type <span className="text-red-500">*</span>
          </label>
          <select
            value={industryType}
            onChange={(e) => setIndustryType(e.target.value)}
            className="border border-gray-300 rounded-md p-3 w-full text-[#343079]"
          >
            <option value="">Select Industry</option>
            <option>Information Technology</option>
            <option>Finance</option>
            <option>Education</option>
            <option>Healthcare</option>
            <option>Marketing</option>
            <option>Manufacturing</option>
            <option value="Other">Other</option>
          </select>
          {industryType === "Other" && (
            <input
              type="text"
              placeholder="Enter custom industry"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              className="mt-2 border border-gray-300 rounded-md p-3 w-full text-[#343079]"
            />
          )}
          {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
        </div>

        {/* Apply Link (optional) */}
        <div>
          <label className="block text-sm font-medium text-[#343079] mb-2">Apply Link</label>
          <input
            type="url"
            placeholder="https://yourcompany.com/apply"
            value={applyLink}
            onChange={(e) => setApplyLink(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-[#343079]"
          />
        </div>

        {/* What We Offer */}
        <div>
          <label className="block text-sm font-medium text-[#343079] mb-2">
            What We Offer / Perks <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="3"
            placeholder="Describe perks, culture, or benefits (each line = 1 point)"
            value={whatWeOffer}
            onChange={(e) => setWhatWeOffer(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 resize-none text-[#343079]"
          />
          {errors.offer && <p className="text-red-500 text-sm mt-1">{errors.offer}</p>}
        </div>

        {/* Benefits Dropdown */}
        <div>
          <label className="block text-sm font-medium text-[#343079] mb-2">Benefits / Extras</label>
          <select
            value={selectedBenefit}
            onChange={handleAddBenefit}
            className="border border-gray-300 rounded-md p-3 w-full text-[#343079]"
          >
            <option value="">Select option</option>
            <option>Health Insurance</option>
            <option>Flexible Hours</option>
            <option>Remote Option</option>
            <option>Annual Bonus</option>
            <option>Certificate</option>
            <option value="Other">Other</option>
          </select>
          {selectedBenefit === "Other" && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter custom benefit"
                value={customBenefit}
                onChange={(e) => setCustomBenefit(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md p-3 text-[#343079]"
              />
              <button
                type="button"
                onClick={handleAddCustomBenefit}
                className="bg-[#343079] text-white px-4 py-2 rounded-md hover:bg-[#28225e]"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Display Added Benefits */}
        {benefits.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2 border border-[#343079] rounded-full px-4 py-2 text-sm text-[#343079]"
              >
                {b}
                <button type="button" onClick={() => handleRemoveBenefit(b)} className="font-bold">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#343079] text-white px-6 py-2 rounded-md hover:bg-[#28225e] transition"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3JobDetails;
