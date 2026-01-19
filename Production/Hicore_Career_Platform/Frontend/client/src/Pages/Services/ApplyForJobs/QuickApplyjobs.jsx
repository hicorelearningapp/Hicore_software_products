import React, { useState, useRef } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuickApply = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleCreateNewResume = () => {
    navigate("/resume-builder");
  };

  const handleUploadClick = () => {
    // Open the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Please upload only PDF or DOC/DOCX files.");
        event.target.value = "";
        return;
      }

      setUploadedFile(file);
    }
  };

  const cards = [
    {
      title: "Create Your Career Project Resume",
      desc: "Easily generate your job resume by importing your existing profile – save time and stay consistent",
      footer: "Recommended for faster application",
      button: "Import From Profile",
    },
    {
      title: "Build Your Resume Manually",
      desc: "Fill the information in each form to create your resume. Fully customizable and editable anytime",
      footer: "Your information will also be saved to your profile for future use.",
      button: "Create New Resume",
      onClick: handleCreateNewResume,
    },
    {
      title: "Upload a Custom Resume",
      desc: "Choose a tailored resume specifically for this job. Only PDF or DOC formats are allowed.",
      footer: "Best for advanced users with a ready-made resume",
      button: "Upload Resume",
      onClick: handleUploadClick,
    },
  ];

  return (
    <div className="min-h-screen font-[Poppins] bg-white flex flex-col items-center px-4 sm:px-10 py-8">
      {/* Back Button */}
      <div className="w-full max-w-6xl mb-6">
        <div
          className="flex items-center gap-2 text-[#343079] text-sm font-medium cursor-pointer"
          onClick={() => navigate("/applyforjobs")}
        >
          <FaArrowLeft className="text-[14px]" />
          <span>Back</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl border border-[#D6D6D6] rounded-lg px-6 sm:px-10 py-10">
        {/* Heading */}
        <h2 className="text-center text-[#343079] text-[20px] sm:text-[24px] font-bold">
          Choose How You Apply
        </h2>
        <p className="text-center text-[#343079] text-sm sm:text-base mt-2">
          Import, build, or upload the resume that fits this opportunity best.
        </p>

        {/* Option Cards */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="w-[354px] h-[340px] bg-[#F0F7FF] rounded-[8px] p-9 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-y-4">
                <h3 className="w-[282px] text-[#343079] text-[14px] leading-[32px] font-semibold font-[Poppins]">
                  {card.title}
                </h3>
                <p className="text-[13px] leading-[24px] text-[#343079]">
                  {card.desc}
                </p>
                <div className="flex items-start gap-2 text-green-600 text-sm">
                  <FaCheckCircle className="mt-[2px]" />
                  <p className="text-xs sm:text-sm">{card.footer}</p>
                </div>

                {/* Show selected file name only for Upload Resume card */}
                {card.title === "Upload a Custom Resume" && uploadedFile && (
                  <p className="text-[#343079] text-xs mt-2 italic">
                    ✅ Uploaded: {uploadedFile.name}
                  </p>
                )}
              </div>

              <button
                onClick={card.onClick}
                className="w-[282px] h-[37px] px-6 py-2 bg-white text-[#343079] text-[14px] font-[Poppins] rounded-[8px] border border-[#343079] cursor-pointer hover:bg-[#8F88F9] hover:shadow-[0_4px_8px_0_#D9D9DA] hover:border-[#FFFFFF] transition-all duration-200"
              >
                {card.button}
              </button>
            </div>
          ))}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf, .doc, .docx"
          className="hidden"
        />

        {/* Bottom Note */}
        <p className="text-[#4F80BF] text-sm text-center mt-8">
          This is the resume that will be shared with the employer — make sure it
          highlights your best skills and experience.
        </p>

        {/* Proceed Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              if (!uploadedFile && !window.confirm("No resume uploaded. Continue?"))
                return;
              navigate("/applyforjobs/quick-fit-check");
            }}
            className="bg-[#343079] text-white text-sm rounded-md px-6 py-2 hover:bg-[#2c276a] transition"
          >
            Proceed to application
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickApply;
