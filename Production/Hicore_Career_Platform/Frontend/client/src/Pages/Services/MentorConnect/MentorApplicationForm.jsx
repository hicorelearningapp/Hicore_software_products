import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import tickIcon from "../../../assets/MentorPage/tick.png";
import partyIcon from "../../../assets/MentorPage/party.png";

const LabelWithAsterisk = ({ text }) => (
  <label className="block text-sm font-medium mb-1">
    {text} <span className="text-red-500">*</span>
  </label>
);

const ApplicationSuccessPage = ({ onClose }) => {
  // Disable scroll when success modal is shown
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
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
          Keep an eye on your email. You’ll hear from us within <strong>3–5 working days</strong> regarding your application status.
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

const MentorApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    experience: "",
    company: "",
    domain: "",
    format: [],
    times: [],
    bio: "",
    reason: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (type, value) => {
    setFormData((prev) => {
      const current = [...prev[type]];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "fullName", "lastName", "email", "phone",
      "title", "experience", "company", "domain", "bio", "reason"
    ];

    const emptyField = requiredFields.find((field) => !formData[field]?.trim());
    if (emptyField || formData.format.length === 0 || formData.times.length === 0) {
      setError("Please fill all required fields.");
      return;
    }

    setError("");
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-10">
      {submitted && <ApplicationSuccessPage onClose={() => setSubmitted(false)} />}

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#343079] text-sm font-medium mb-6"
        >
          <IoIosArrowBack className="mr-1 text-lg" /> Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto border border-[#EBEAF2] rounded-2xl shadow-md p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-[#343079]">
          Mentor Application Form
        </h2>

        <form className="space-y-6 text-[#343079]" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <LabelWithAsterisk text="Full Name" />
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Karthi" className="w-full border border-[#343079] rounded-lg px-4 py-2" />
            </div>
            <div>
              <LabelWithAsterisk text="Last Name" />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Kumar" className="w-full border border-[#343079] rounded-lg px-4 py-2" />
            </div>
            <div>
              <LabelWithAsterisk text="Email address" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="abc@email.com" className="w-full border border-[#343079] rounded-lg px-4 py-2" />
            </div>
            <div>
              <LabelWithAsterisk text="Mobile Number" />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 8234567890" className="w-full border border-[#343079] rounded-lg px-4 py-2" />
            </div>
            <div>
              <LabelWithAsterisk text="Professional Title" />
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Senior Full Stack Developer" className="w-full border border-[#343079] rounded-lg px-4 py-2" />
            </div>
            <div>
              <LabelWithAsterisk text="Experience" />
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="Years of Experience" className="w-full border border-[#343079] rounded-lg px-4 py-2" />
            </div>
            <div>
              <LabelWithAsterisk text="Company Name" />
              <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" className="w-full border border-[#343079] rounded-lg px-4 py-2" />
            </div>
            <div>
              <LabelWithAsterisk text="Domains You Can Mentor In" />
              <select name="domain" value={formData.domain} onChange={handleChange} className="w-full border border-[#343079] rounded-lg px-4 py-2">
                <option value="">Select option</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <LabelWithAsterisk text="Preferred mentoring format" />
              <div className="space-y-2 mt-2">
                {["1:1 Sessions", "Group Sessions", "Resume/Portfolio Reviews", "Mock Interviews"].map((label) => (
                  <label key={label} className="block">
                    <input type="checkbox" className="mr-2 accent-[#343079]" onChange={() => handleCheckbox("format", label)} checked={formData.format.includes(label)} /> {label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <LabelWithAsterisk text="Available time slots" />
              <div className="space-y-2 mt-2">
                {["Weekdays (Mon–Fri)", "Weekends (Sat & Sun)", "Everyday", "Evenings Only"].map((label) => (
                  <label key={label} className="block">
                    <input type="checkbox" className="mr-2 accent-[#343079]" onChange={() => handleCheckbox("times", label)} checked={formData.times.includes(label)} /> {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <LabelWithAsterisk text="Professional Bio" />
            <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full border border-[#343079] rounded-lg px-4 py-2 min-h-[120px]" placeholder="Tell us about yourself, your experience and your passions."></textarea>
          </div>

          <div>
            <LabelWithAsterisk text="Why do you want to be a mentor?" />
            <textarea name="reason" value={formData.reason} onChange={handleChange} className="w-full border border-[#343079] rounded-lg px-4 py-2 min-h-[120px]" placeholder="Tell us why you want to be a mentor."></textarea>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
              <input type="text" placeholder="www.linkedin.com/in/username" className="w-full border border-[#343079] rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Personal Portfolio Website</label>
              <input type="text" placeholder="www.yourwebsite.com" className="w-full border border-[#343079] rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub Profile</label>
              <input type="text" placeholder="www.github.com/username" className="w-full border border-[#343079] rounded-lg px-4 py-2" />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="text-center mt-10">
            <button type="submit" className="bg-[#343079] hover:bg-[#2c2765] text-white px-8 py-2 rounded-lg font-medium">
              Apply Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorApplicationForm;
