import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import tickIcon from "../../../../assets/MentorPage/tick.png";
import partyIcon from "../../../../assets/MentorPage/party.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const LabelWithAsterisk = ({ text }) => (
  <label className="block text-sm font-medium mb-1">
    {text} <span className="text-red-500">*</span>
  </label>
);

// ✅ DEFINED INITIAL STATE TO REUSE FOR RESET
const INITIAL_STATE = {
  first_name: "",
  last_name: "",
  email: "",
  mobile: "",
  professional_title: "",
  experience_years: "",
  company_name: "",
  domain: "",
  mentoring_formats: [],
  available_time_slots: [],
  professional_bio: "",
  why_become_mentor: "",
  linkedin: "",
  portfolio: "",
  github: "",
  tags: "",
  image: null,
};

/* ---------------- SUCCESS MODAL ---------------- */
const ApplicationSuccessPage = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="max-w-3xl w-full text-center bg-white rounded-3xl p-10 shadow-xl border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src={tickIcon} alt="Success" className="w-16 h-16" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-green-700 mb-2">
          <img src={partyIcon} alt="Celebration" className="inline w-6 h-6 mr-2" />
          Application Submitted Successfully!
        </h2>
        <p className="text-gray-700 mb-4 text-sm md:text-base">
          Thanks for applying to be a mentor. Your journey to inspire others has just begun.
        </p>
        <div className="bg-green-100 text-green-900 rounded-md p-4 text-sm font-medium mb-6">
          Keep an eye on your email. You’ll hear from us within{" "}
          <strong>3–5 working days</strong>.
        </div>
        <button
          onClick={onClose}
          className="bg-[#343079] hover:bg-[#2c2765] text-white px-6 py-2 rounded-lg font-medium text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

/* ---------------- MAIN FORM ---------------- */
const MentorApplication = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // ✅ REF TO CLEAR FILE INPUT

  // ✅ SAFE USER ID FETCH
  const storedUser =
    JSON.parse(localStorage.getItem("user")) ||
    localStorage.getItem("user_id") ||
    localStorage.getItem("id");

  const userId = storedUser?.id || storedUser;

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckbox = (type, value) => {
    setFormData((prev) => {
      const current = [...prev[type]];
      return {
        ...prev,
        [type]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      localStorage.getItem("user_id") ||
      localStorage.getItem("id");

    const userId = storedUser?.id || storedUser;

    console.log("✅ USER ID SENT:", userId);

    if (!userId) {
      setError("User not logged in.");
      return;
    }

    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "mobile",
      "professional_title",
      "experience_years",
      "company_name",
      "domain",
      "professional_bio",
      "why_become_mentor",
    ];

    const emptyField = requiredFields.find((field) => !formData[field]?.trim());

    if (
      emptyField ||
      formData.mentoring_formats.length === 0 ||
      formData.available_time_slots.length === 0 ||
      !formData.image
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = new FormData();
    payload.append("user_id", String(userId));
    payload.append("first_name", formData.first_name);
    payload.append("last_name", formData.last_name);
    payload.append("email", formData.email);
    payload.append("mobile", formData.mobile);
    payload.append("professional_title", formData.professional_title);
    payload.append("experience_years", formData.experience_years);
    payload.append("company_name", formData.company_name);
    payload.append("domain", formData.domain);
    payload.append("mentoring_formats", formData.mentoring_formats.join(","));
    payload.append("available_time_slots", formData.available_time_slots.join(","));
    payload.append("professional_bio", formData.professional_bio);
    payload.append("why_become_mentor", formData.why_become_mentor);
    payload.append("linkedin", formData.linkedin);
    payload.append("portfolio", formData.portfolio);
    payload.append("github", formData.github);
    payload.append("tags", formData.tags);
    payload.append("image", formData.image);

    try {
      const res = await fetch(`${API_BASE}/mentor/apply`, {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      console.log("✅ API RESPONSE:", data);

      if (!res.ok) throw new Error(data.message || "Submission failed");

      setSubmitted(true);

      // ✅ RESET FORM VALUES
      setFormData(INITIAL_STATE);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clears the file input visually
      }
      
    } catch (err) {
      console.error("❌ API ERROR:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-10">
      {submitted && (
        <ApplicationSuccessPage onClose={() => setSubmitted(false)} />
      )}

      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#343079] text-sm font-medium mb-6"
        >
          <IoIosArrowBack className="mr-1 text-lg" /> Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto border rounded-2xl shadow-md p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-[#343079]">
          Mentor Application Form
        </h2>

        <form className="space-y-6 text-[#343079]" onSubmit={handleSubmit}>
          {/* BASIC DETAILS */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <LabelWithAsterisk text="Full Name" />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Karthi"
                className="w-full border border-[#343079] rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <LabelWithAsterisk text="Last Name" />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Kumar"
                className="w-full border border-[#343079] rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <LabelWithAsterisk text="Email address" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="abc@email.com"
                className="w-full border border-[#343079] rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <LabelWithAsterisk text="Mobile Number" />
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 8234567890"
                className="w-full border border-[#343079] rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <LabelWithAsterisk text="Professional Title" />
              <input
                type="text"
                name="professional_title"
                value={formData.professional_title}
                onChange={handleChange}
                placeholder="Senior Full Stack Developer"
                className="w-full border border-[#343079] rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <LabelWithAsterisk text="Experience" />
              <input
                type="text"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="Years of Experience"
                className="w-full border border-[#343079] rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <LabelWithAsterisk text="Company Name" />
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full border border-[#343079] rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <LabelWithAsterisk text="Domains You Can Mentor In" />
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-full border border-[#343079] rounded-lg px-4 py-2"
              >
                <option value="">Select option</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
              </select>
            </div>
          </div>

          {/* CHECKBOXES */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <LabelWithAsterisk text="Preferred mentoring format" />
              {[
                "1:1 Sessions",
                "Group Sessions",
                "Resume/Portfolio Reviews",
                "Mock Interviews",
              ].map((label) => (
                <label key={label} className="block">
                  <input
                    type="checkbox"
                    className="mr-2 accent-[#343079]"
                    checked={formData.mentoring_formats.includes(label)}
                    onChange={() => handleCheckbox("mentoring_formats", label)}
                  />
                  {label}
                </label>
              ))}
            </div>
            <div>
              <LabelWithAsterisk text="Available time slots" />
              {[
                "Weekdays (Mon–Fri)",
                "Weekends (Sat & Sun)",
                "Everyday",
                "Evenings Only",
              ].map((label) => (
                <label key={label} className="block">
                  <input
                    type="checkbox"
                    className="mr-2 accent-[#343079]"
                    checked={formData.available_time_slots.includes(label)}
                    onChange={() => handleCheckbox("available_time_slots", label)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* TEXT AREAS */}
          <div>
            <LabelWithAsterisk text="Professional Bio" />
            <textarea
              name="professional_bio"
              value={formData.professional_bio}
              onChange={handleChange}
              className="w-full border border-[#343079] rounded-lg px-4 py-2 min-h-[120px]"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <LabelWithAsterisk text="Why do you want to be a mentor?" />
            <textarea
              name="why_become_mentor"
              value={formData.why_become_mentor}
              onChange={handleChange}
              className="w-full border border-[#343079] rounded-lg px-4 py-2 min-h-[120px]"
              placeholder="Tell us why you want to be a mentor."
            />
          </div>

          {/* EXTRA FIELDS */}
          <div className="space-y-6">
            <LabelWithAsterisk text="LinkedIn Profile" />
            <input
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn Profile"
              className="w-full border border-[#343079] rounded-lg px-4 py-2"
            />
          </div>
          <div className="space-y-6">
            <LabelWithAsterisk text="Portfolio Website" />
            <input
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="Portfolio Website"
              className="w-full border border-[#343079] rounded-lg px-4 py-2"
            />
          </div>
          <div className="space-y-6">
            <LabelWithAsterisk text="GitHub Profile" />
            <input
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="GitHub Profile"
              className="w-full border border-[#343079] rounded-lg px-4 py-2"
            />
          </div>
          <div className="space-y-6">
            <LabelWithAsterisk text="Tags" />
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="html,java,python"
              className="w-full border border-[#343079] rounded-lg px-4 py-2"
            />
          </div>

          {/* IMAGE */}
          <div className="space-y-6">
            <LabelWithAsterisk text="Profile Image" />
            <input
              type="file"
              name="image"
              ref={fileInputRef} // ✅ ATTACH REF
              className="border border-[#343079] rounded-lg p-2"
              onChange={handleChange}
            />
          </div>
          {preview && (
            <div className="mt-4 flex justify-start">
              <img
                src={preview}
                alt="Preview"
                className="w-10 h-10 object-cover rounded-full border"
              />
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="text-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#343079] hover:bg-[#2c2765] text-white px-8 py-2 rounded-lg font-medium"
            >
              {loading ? "Submitting..." : "Apply Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorApplication;