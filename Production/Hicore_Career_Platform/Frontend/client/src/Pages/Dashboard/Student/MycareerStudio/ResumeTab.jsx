// 📂 src/components/StudentDashboard/Tabs/ResumeTab.jsx
import React, { useState } from "react";

// ✅ Import icons from assets
import aiIcon from "../../../../assets/StudentResumeTab/icon-one.png";
import uploadedIcon from "../../../../assets/StudentResumeTab/icon-two.png";
import calendarIcon from "../../../../assets/StudentResumeTab/Calendar.png";
import editIcon from "../../../../assets/StudentResumeTab/edit.png";
import downloadIcon from "../../../../assets/StudentResumeTab/Download.png";
import deleteIcon from "../../../../assets/StudentResumeTab/delete.png";

// ✅ Import sample resume images
import aiResumeImg from "../../../../assets/StudentResumeTab/image-two.png";
import uploadedResumeImg from "../../../../assets/StudentResumeTab/image-one.png";

// ✅ Main icon for initial empty state
import resumeMainIcon from "../../../../assets/StudentResumeTab/Resume.png";

const ResumeTab = () => {
  const [showResumes, setShowResumes] = useState(false);

  return (
    <div className="p-6">
      {!showResumes ? (
        // ================= Empty State =================
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          {/* Icon */}
          <img
            src={resumeMainIcon}
            alt="Resume"
            className="w-24 h-24 mb-6 object-contain"
          />

          {/* Message */}
          <p className="text-md text-gray-600 mb-6">
            You haven’t created a resume yet. Build your professional profile in
            minutes
          </p>

          {/* Button */}
          <button
            onClick={() => setShowResumes(true)}
            className="bg-indigo-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition"
          >
            Build Resume
          </button>
        </div>
      ) : (
        // ================= Resume Cards =================
        <div className="m-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI-Built Resume Card */}
          <div className="bg-blue-50 rounded-xl shadow p-6 flex flex-col">
            {/* Icon + Title */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 flex items-center justify-center mb-2">
                <img src={aiIcon} alt="AI Resume" className="w-13 h-13" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">
                AI-Built Resume
              </h3>
            </div>

            {/* Resume Image */}
            <div className="border border-gray-300 p-4 rounded-lg">
              <div className="w-full h-80 bg-white rounded-md shadow overflow-hidden mb-5">
                <img
                  src={aiResumeImg}
                  alt="AI Resume"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Resume Info */}
              <div className="w-full">
                <p className="font-semibold text-indigo-900 flex justify-between items-center mb-3">
                  Karthi – AI Built Resume
                  <img
                    src={editIcon}
                    alt="Edit"
                    className="w-6 h-8 cursor-pointer"
                  />
                </p>
                <p className="text-md font-semibold text-blue-900 mb-3">
                  Crafted using our AI-powered builder
                </p>
                <div className="flex items-center font-semibold text-md text-blue-900 gap-2 mb-5">
                  <img src={calendarIcon} alt="Updated" className="w-6 h-6" />
                  <span>Updated on Aug 15, 2025</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-auto">
                <button className="flex-1 px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800">
                  Download PDF
                </button>
                <button className="flex-1 px-4 py-2 border border-indigo-900 text-indigo-900 rounded-md hover:bg-indigo-50">
                  Share Link
                </button>
              </div>
            </div>
          </div>

          {/* Uploaded Resume Card */}
          <div className="bg-purple-50 rounded-xl shadow p-6 flex flex-col">
            {/* Icon + Title */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 flex items-center justify-center mb-2">
                <img
                  src={uploadedIcon}
                  alt="Uploaded Resume"
                  className="w-14 h-14"
                />
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">
                Uploaded Resumes
              </h3>
            </div>

            {/* Resume Image */}
            <div className="border border-gray-300 p-4 rounded-lg">
              <div className="w-full h-80 bg-white rounded-md shadow overflow-hidden mb-6">
                <img
                  src={uploadedResumeImg}
                  alt="Uploaded Resume"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Resume Info */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold text-indigo-900">
                    Karthi_Resume_V1.pdf
                  </p>
                  <div className="flex gap-4">
                    <img
                      src={downloadIcon}
                      alt="Download"
                      className="w-6 h-7 cursor-pointer"
                    />
                    <img
                      src={editIcon}
                      alt="Edit"
                      className="w-6 h-7 cursor-pointer"
                    />
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="w-6 h-7 cursor-pointer"
                    />
                  </div>
                </div>

                <p className="text-md text-blue-900 font-semibold mb-3">
                  Aug 15, 2025 • 125KB
                </p>
                <p className="text-md font-semibold text-blue-900 mb-4">
                  Supported formats: PDF, DOCX | Max size: 5 MB
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-auto">
                <button className="flex-1 px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800">
                  Upload Resume
                </button>
                <button className="flex-1 px-4 py-2 border border-indigo-900 text-indigo-900 rounded-md hover:bg-indigo-50">
                  Share Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeTab;
