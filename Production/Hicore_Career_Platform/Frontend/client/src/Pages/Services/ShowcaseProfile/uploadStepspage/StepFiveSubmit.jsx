import React, { useState } from "react";
import { FiCheckCircle, FiCheck } from "react-icons/fi";

const StepFiveSubmit = ({
  videoUrl,
  introTitle,
  introDescription,
  profileData,
  onGoBack,
  onSubmit,
}) => {
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false); // checkbox state

  const handleSubmitClick = () => {
    if (!isConfirmed) return; // safety check

    setTimeout(() => {
      setShowProgress(true);
      setProgress(0);
      setUploadComplete(false);

      let value = 0;
      const interval = setInterval(() => {
        value += 10;
        setProgress(value);
        if (value >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadComplete(true);
            onSubmit && onSubmit();

            setTimeout(() => {
              setShowProgress(false);
            }, 1000);
          }, 300);
        }
      }, 300);
    }, 2000); // delay before showing window
  };

  return (
    <>
      {/* Main content */}
      <div className="p-8 m-4 min-h-screen border border-gray-300 rounded-lg">
        {/* Heading */}
        <h3 className="text-base md:text-lg font-bold text-indigo-900 mb-2">
          Step 5: Submit Your Video
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Your video is ready to be reviewed and added to your profile. This
          appears on the profile page after you submit it.
        </p>

        {/* Intro & Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-md p-6 ">
            <h1 className="text-lg text-indigo-900 mb-6">Introduction</h1>
            <h4 className="font-semibold text-indigo-900 mb-2">{introTitle}</h4>
            <p className="text-sm text-gray-700">{introDescription}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
            <h1 className="text-lg text-indigo-900 mb-6">Profile Card</h1>
            <p className="text-sm text-gray-800">
              <span className="font-semibold">👤 Name:</span> {profileData.name}
            </p>
            <p className="text-sm text-gray-800 mt-1">
              <span className="font-semibold">📚 Background:</span>{" "}
              {profileData.background}
            </p>
            <p className="text-sm text-gray-800 mt-1">
              <span className="font-semibold">🎯 Looking For:</span>{" "}
              {profileData.lookingFor}
            </p>
            <p className="text-sm text-gray-800 mt-1">
              <span className="font-semibold">📍 Location Preference:</span>{" "}
              {profileData.location}
            </p>
          </div>
        </div>

        {/* Video Preview */}
        <div className="mb-6">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg border border-gray-300"
          />
        </div>

        {/* Checklist Confirmation */}
        <div className="border border-gray-200 rounded-md p-6 mb-8">
          <h4 className="font-semibold text-blue-900 mb-3 text-[#343079] flex items-center">
            <input
              type="checkbox"
              className="mr-4 w-4 h-4 rounded accent-blue-900 cursor-pointer"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            Checklist Confirmation
          </h4>

          <p className="text-[14px] text-[#343079] mb-3">
            All these were verified before submission:
          </p>
          <ul className="space-y-2 text-[14px] text-[#343079]">
            <li className="flex items-center">
              <FiCheckCircle className="mr-2 text-green-600" /> Video is under 2
              minutes
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="mr-2 text-green-600" /> Clear audio &
              visuals
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="mr-2 text-green-600" /> No personal
              contact details
            </li>
            <li className="flex items-center">
              <FiCheckCircle className="mr-2 text-green-600" /> Clear
              introduction of skills/goals
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onGoBack}
            className="px-6 py-2 border border-indigo-900 text-indigo-900 rounded-md hover:bg-indigo-50 text-sm"
          >
            Go Back & Edit
          </button>
          <button
            onClick={handleSubmitClick}
            disabled={!isConfirmed}
            className={`px-6 py-2 rounded-md text-sm ${
              isConfirmed
                ? "bg-indigo-900 text-white hover:bg-indigo-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit My Video Profile
          </button>
        </div>
      </div>

      {/* Overlay Progress Bar */}
      {showProgress && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          {!uploadComplete ? (
            // Full width progress
            <div className="w-full px-10 text-center">
              <p className="mb-4 font-medium text-gray-700 text-lg">
                Uploading... {progress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-indigo-600 h-6 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Updating your profile, please wait...
              </p>
            </div>
          ) : (
            // Fixed success box
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
              <div className="text-green-600 text-5xl flex justify-center mb-3">
                <FiCheck className="bg-green-500 rounded-full p-2 text-white" />
              </div>
              <p className="text-green-600 font-semibold text-lg">
                🎉 Video Profile Added Successfully!
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StepFiveSubmit;
