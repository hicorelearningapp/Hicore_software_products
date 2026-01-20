import React, { useState, useRef } from "react";
import uploadIcon from "../../../assets/Customers/profile/Upload.png"; // adjust path if needed

const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const Toggle = ({ checked = false, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
        aria-label="toggle"
      />
      <div className="w-14 h-8 bg-white border rounded-full border-gray-300 peer-checked:border-[#115D29] peer-checked:bg-white flex items-center p-[3px]">
        <span className="block w-6 h-6 rounded-full bg-[#2B7BBF] peer-checked:translate-x-6 transition-transform" />
      </div>
    </label>
  );
};

const ProfileAndSettings = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
    PhoneNumber: "",
    ProfilePicture: null,
    DateOfBirth: "",
    Gender: "",
    BankName: "",
    AccountNumber: "",
    IFSCCode: "",
    Branch: "",
  });

  const [settings, setSettings] = useState({
    dynamicPricing: true,
    refillReminders: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, ProfilePicture: e.target.files[0] }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      
      // Append all text fields to FormData
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await fetch(`${BASE_URL}/customers`, {
        method: "POST",
        body: data,
        // multipart/form-data headers are automatically set by the browser when passing FormData
      });

      if (response.ok) {
        alert("Profile saved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to save profile"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while connecting to the server.");
    }
  };

  return (
    <div className="px-6 py-6">
      {/* Heading */}
      <h1 className="text-[22px] font-semibold text-[#115D29]">
        Profile & Settings
      </h1>

      <p className="text-[16px] text-[#6B6B6B] mt-3">
        Manage your personal information, prescriptions, and app preferences securely.
      </p>

      {/* Personal Info Card */}
      <div className="mt-8 border border-[#115D29]/20 rounded-xl p-6 bg-white">
        <h2 className="text-[20px] font-semibold text-[#115D29]">
          Personal Information
        </h2>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">Full Name</label>
            <input
              type="text"
              name="FullName"
              value={formData.FullName}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              className="border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29]/70 focus:outline-none"
            />
          </div>

          {/* Upload Picture */}
          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">Upload Picture</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <button 
              type="button"
              onClick={handleUploadClick}
              className="w-full border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29] flex items-center justify-center gap-2"
            >
              <img src={uploadIcon} alt="upload" className="w-5 h-5" />
              <span>{formData.ProfilePicture ? formData.ProfilePicture.name : "Upload Image"}</span>
            </button>
          </div>

          {/* DOB */}
          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">Date of Birth</label>
            <input
              type="text"
              name="DateOfBirth"
              value={formData.DateOfBirth}
              onChange={handleInputChange}
              placeholder="mm/dd/yyyy"
              className="border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29]/70 focus:outline-none"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">Gender</label>
            <select 
              name="Gender"
              value={formData.Gender}
              onChange={handleInputChange}
              className="border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29]/70 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">Email *</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              placeholder="medicare@example.com"
              className="border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29]/70 focus:outline-none"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">Phone Number</label>
            <input
              type="text"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleInputChange}
              placeholder="Enter 10 digit Mobile Number"
              className="border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29]/70 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bank Details Card */}
      <div className="mt-6 border border-[#115D29]/20 rounded-xl p-6 bg-white">
        <h2 className="text-[20px] font-semibold text-[#115D29]">
          Bank Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">Bank Name</label>
            <input
              type="text"
              name="BankName"
              value={formData.BankName}
              onChange={handleInputChange}
              placeholder="Enter Bank Name"
              className="border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29]/70 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">Account Number</label>
            <input
              type="text"
              name="AccountNumber"
              value={formData.AccountNumber}
              onChange={handleInputChange}
              placeholder="Enter Account Number"
              className="border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29]/70 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">IFSC Code</label>
            <input
              type="text"
              name="IFSCCode"
              value={formData.IFSCCode}
              onChange={handleInputChange}
              placeholder="e.g., SBIN0001234"
              className="border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29]/70 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">Branch</label>
            <input
              type="text"
              name="Branch"
              value={formData.Branch}
              onChange={handleInputChange}
              placeholder="Enter Branch Name"
              className="border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29]/70 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Password Card */}
      <div className="mt-6 border border-[#115D29]/20 rounded-xl p-6 bg-white">
        <h2 className="text-[20px] font-semibold text-[#115D29]">
          Account Security
        </h2>

        <div className="mt-6 space-y-5">
          <div className="flex flex-col">
            <label className="text-[#115D29] mb-1">Password *</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleInputChange}
              placeholder="************"
              className="border border-[#115D29] rounded-lg px-4 py-3 text-[#115D29]/70 focus:outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Settings & Notifications Row */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-[#115D29]/20 rounded-xl p-6 bg-white">
          <h3 className="text-[18px] font-semibold text-[#115D29] mb-6">
            Settings
          </h3>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="text-[#115D29]">Dynamic Pricing</div>
              <Toggle 
                checked={settings.dynamicPricing} 
                onChange={() => setSettings(s => ({...s, dynamicPricing: !s.dynamicPricing}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[#115D29]">Refill Reminders</div>
              <Toggle 
                checked={settings.refillReminders} 
                onChange={() => setSettings(s => ({...s, refillReminders: !s.refillReminders}))}
              />
            </div>
          </div>
        </div>

        <div className="border border-[#115D29]/20 rounded-xl p-6 bg-white">
          <h3 className="text-[18px] font-semibold text-[#115D29] mb-6">
            Notifications
          </h3>

          <div className="flex flex-col gap-4">
            {["Order Alerts", "Payment Reminders", "Expiry Notifications", "Refill Reminders"].map((item) => (
              <label key={item} className="inline-flex items-center gap-3 text-[#115D29]">
                <input type="checkbox" className="w-4 h-4 border-[#115D29]" defaultChecked />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button 
          onClick={handleSave}
          className="bg-[#115D29] text-white px-6 py-3 rounded-2xl shadow hover:bg-[#0e4b21] transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileAndSettings;