import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import backIcon from "../../../assets/Freelance/arrow.png";
import clockIcon from "../../../assets/Freelance/clock.png";
import rupeeIcon from "../../../assets/Freelance/rupee.png";
import levelIcon from "../../../assets/Freelance/level.png";
import calendarIcon from "../../../assets/Freelance/calendar.png";
import websiteIcon from "../../../assets/Freelance/website.png";
import locationIcon from "../../../assets/Freelance/location.png";

const ApplyGigForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gig = location.state?.gig;

  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  if (!gig) {
    return <p className="text-center text-red-600 mt-10">Gig not found.</p>;
  }

  return (
    <div className="w-full flex justify-center bg-white py-10 text-[#343079]">
      <div className="w-[90%] max-w-5xl">
        {/* Back button */}
        <div className="mb-4">
          <button
            className="flex items-center text-sm text-[#343079]"
            onClick={() => navigate(-1)}
          >
            <img src={backIcon} alt="Back" className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        {/* Main Curved Box */}
        <div className="bg-white rounded-2xl p-6 md:p-10 border border-[#C0BFD5] shadow-sm">
          <h1 className="text-2xl font-semibold mb-3">
            Apply Now: {gig.title}
          </h1>

          <div className="flex items-center gap-3 mb-5">
            <img src={gig.logo} alt="Profile" className="w-10 h-10" />
            <div>
              <p className="font-semibold text-base">{gig.title}</p>
              <p className="text-sm text-[#0072FF]">{gig.company}</p>
            </div>
          </div>

          <div className="text-sm mb-4">
            <div className="flex flex-wrap gap-4 mb-2">
              <div className="flex items-center gap-1">
                <img src={clockIcon} alt="Duration" className="w-4 h-4" />
                {gig.duration}
              </div>
              <div className="flex items-center gap-1">
                <img src={rupeeIcon} alt="Pay" className="w-4 h-4" />
                {gig.pay}
              </div>
              <div className="flex items-center gap-1">
                <img src={levelIcon} alt="Level" className="w-4 h-4" />
                Eligibility: {gig.eligibility}
              </div>
              <div className="flex items-center gap-1">
                <img src={calendarIcon} alt="Calendar" className="w-4 h-4" />
                Apply Before: {gig.applyBefore}
              </div>
            </div>

            <div className="flex items-center gap-1 mb-2">
              <img src={websiteIcon} alt="Website" className="w-4 h-4" />
              {gig.website}
            </div>

            <div className="flex items-center gap-1">
              <img src={locationIcon} alt="Location" className="w-4 h-4" />
              {gig.location}
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <span className="bg-[#E1F3FF] text-[#004BA1] text-xs px-3 py-1 rounded-md font-medium">
              Recommended
            </span>
            <span className="bg-[#E7F9F3] text-green-700 text-xs px-3 py-1 rounded-md font-medium">
              80% Profile Match
            </span>
          </div>

          <div className="border-t border-[#343079] my-6"></div>

          <h2 className="text-lg font-semibold mb-2">Freelance Gig Overview</h2>
          <p className="text-sm mb-6 max-w-10xl">
            {gig.companyInfo?.overview || "No overview available."}
          </p>

          {/* Application Form Section */}
          <div className="bg-white rounded-2xl border border-[#E1E0EB] p-6 shadow-sm">
            <h3 className="font-semibold text-base mb-6">Application Form</h3>

            {/* Question 1 */}
            <div className="bg-[#EEF4FE] rounded-2xl p-4 mb-4">
              <p className="text-sm font-medium mb-2">Do you have a working laptop and internet?</p>
              <div className="flex flex-col gap-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="laptop" />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="laptop" />
                  No
                </label>
              </div>
            </div>

            {/* Question 2 */}
            <div className="bg-[#EEF4FE] rounded-2xl p-4 mb-4">
              <p className="text-sm font-medium mb-2">How soon can you start?</p>
              <div className="flex flex-col gap-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="start" />
                  Immediately
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="start" />
                  1 day
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="start" />
                  2 days
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="start" />
                  Custom
                </label>
              </div>
            </div>

            {/* Question 3 - Textarea */}
            <div className="bg-[#EEF4FE] rounded-2xl p-4 mb-4">
              <p className="text-sm font-medium mb-2">Why are you interested in this Freelance Gig?</p>
              <textarea
                placeholder="Type your response here."
                className="w-full h-28 text-sm p-3 rounded-lg border border-gray-300 bg-[#EEF4FE]"
              ></textarea>
            </div>

            {/* Upload Resume */}
            <div className="bg-[#EEF4FE] rounded-2xl p-4 mb-4">
              <p className="text-sm font-medium mb-1">Upload a Custom Resume</p>
              <p className="text-xs mb-3">
                Choose a tailored resume specifically for this Freelance Gig. Only PDF or DOC formats are allowed.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <button
                onClick={handleUploadClick}
                className="bg-white border border-[#343079] text-[#343079] text-sm px-4 py-2 rounded-lg font-medium"
              >
                Upload Resume
              </button>
              {selectedFileName && (
                <p className="text-xs mt-2 text-[#343079]">{selectedFileName}</p>
              )}
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" />
              I agree to share my profile, and resume with the client.
            </label>
          </div>

          <p className="text-center text-xs mt-6 text-[#0072FF]">
            This is the resume that will be shared with the employer — make sure it highlights your best skills and experience.
          </p>

          <div className="flex justify-center">
            <button className="bg-[#343079] hover:bg-[#2a2762] text-white font-medium px-8 py-2 rounded-lg mt-4">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyGigForm;
