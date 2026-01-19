import React, { useState } from "react";
import editicon from "../../../assets/ResumeBuilder/Edit.png";
import { FiMail, FiPhone, FiGlobe } from "react-icons/fi";
import { AiFillLinkedin } from "react-icons/ai";

const PersonalInfoSection = ({ personalInfo = {}, setFormData }) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    firstName = "",
    lastName = "",
    email = "",
    phone = "",
    title = "",
    location = "",
    linkedin = "",
    website = "",
  } = personalInfo || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  return (
    <div className="border rounded-xl border-[#343079] overflow-hidden mb-6">
      <div className="flex justify-between items-center bg-[#F9F9FC] px-4 py-4 border-b border-[#343079]">
        <h3 className="text-[20px] font-semibold text-[#343079]">
          Personal Information
        </h3>
        <button
          className="text-md text-[#7C67F5] font-medium"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? (
            "Save"
          ) : (
            <img src={editicon} alt="edit" className="w-[24px] h-[24px]" />
          )}
        </button>
      </div>

      <div className="px-4 py-3">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-md">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-blue-900 mb-1">Full Name</label>
              <div className="flex gap-3">
                <input
                  name="firstName"
                  value={firstName}
                  onChange={handleChange}
                  className="border text-blue-900 border-[#B4A7D6] p-3 rounded-lg w-full"
                  placeholder="First Name"
                />
                <input
                  name="lastName"
                  value={lastName}
                  onChange={handleChange}
                  className="border text-blue-900 border-[#B4A7D6] p-3 rounded-lg w-full"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-blue-900 mb-1">Email</label>
              <input
                name="email"
                value={email}
                onChange={handleChange}
                className="border text-blue-900 border-[#B4A7D6] p-3 rounded-lg w-full"
                placeholder="Email"
              />
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-blue-900 mb-1">Mobile Number</label>
              <input
                name="phone"
                value={phone}
                onChange={handleChange}
                className="border text-blue-900 border-[#B4A7D6] p-3 rounded-lg w-full"
                placeholder="Phone Number"
              />
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-blue-900 mb-1">
                Professional Title
              </label>
              <input
                name="title"
                value={title}
                onChange={handleChange}
                className="border text-blue-900 border-[#B4A7D6] p-3 rounded-lg w-full"
                placeholder="Ex: Software Developer"
              />
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-blue-900 mb-1">Location</label>
              <input
                name="location"
                value={location}
                onChange={handleChange}
                className="border text-blue-900 border-[#B4A7D6] p-3 rounded-lg w-full"
                placeholder="City, Country"
              />
            </div>

            {/* LinkedIn */}
            <div className="md:col-span-2">
              <label className="block text-blue-900 mb-1">LinkedIn</label>
              <input
                name="linkedin"
                value={linkedin}
                onChange={handleChange}
                className="border text-blue-900 border-[#B4A7D6] p-3 rounded-lg w-full"
                placeholder="LinkedIn Profile URL"
              />
            </div>

            {/* Website */}
            <div className="md:col-span-2">
              <label className="block text-blue-900 mb-1">
                Portfolio Website
              </label>
              <input
                name="website"
                value={website}
                onChange={handleChange}
                className="border text-blue-900 border-[#B4A7D6] p-3 rounded-lg w-full"
                placeholder="Website URL"
              />
            </div>
          </div>
        ) : (
          <>
            {(firstName || lastName) && (
              <p className="font-bold text-blue-800 text-2xl mb-2">
                {firstName} {lastName}
              </p>
            )}

            {title && (
              <p className="font-bold text-lg text-blue-900 mb-2">{title}</p>
            )}

            {email && (
              <p className="text-md text-blue-900 flex items-center gap-2">
                <FiMail className="inline-block" aria-hidden="true" />
                <span>{email}</span>
              </p>
            )}
            {phone && (
              <p className="text-md text-blue-900 flex items-center gap-2">
                <FiPhone className="inline-block" aria-hidden="true" />
                <span>{phone}</span>
              </p>
            )}
            {linkedin && (
              <p className="text-md text-blue-900 flex items-center gap-2">
                <AiFillLinkedin className="inline-block" aria-hidden="true" />
                <span>{linkedin}</span>
              </p>
            )}
            {website && (
              <p className="text-md text-blue-900 flex items-center gap-2">
                <FiGlobe className="inline-block" aria-hidden="true" />
                <span>{website}</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;
