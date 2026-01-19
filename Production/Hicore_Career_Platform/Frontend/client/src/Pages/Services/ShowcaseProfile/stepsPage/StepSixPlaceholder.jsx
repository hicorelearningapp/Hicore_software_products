import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiAward, FiTarget, FiMapPin, FiCheck } from "react-icons/fi";

const StepSixPlaceholder = ({
  playbackUrl,
  playbackVideoRef,
  handleTimeUpdate,
  progress,
  handlePlayPause,
  muted,
  handleMuteToggle,
  handleFullscreen,
  formData,
}) => {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!confirmed) return;
    setUploading(true);
    setUploadProgress(0);

    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 5;
      setUploadProgress(progressValue);

      if (progressValue >= 100) {
        clearInterval(interval);
        setSuccess(true);
        setTimeout(() => {
          setUploading(false);
          setSuccess(false);
        }, 1000); // Show success for 1 second
      }
    }, 150); // Progress speed
  };

  return (
    <div className="relative">
      {/* Main content */}
      <div
        className={`bg-white border border-gray-300 rounded-lg p-6 m-6 space-y-6 ${
          uploading ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Heading */}
        <div>
          <h2 className="text-lg font-semibold text-blue-900">
            Step 6: Review & Submit Your Video Profile
          </h2>
          <p className="text-gray-600 mt-1">
            Review all the information and your recorded video before
            submission.
          </p>
        </div>

        {/* Introduction + Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900">
              Introduction
            </h3>
            <p className="mt-2 font-medium text-blue-900">
              {formData?.title || "Your headline/introduction goes here"}
            </p>
            <p className="mt-1 text-sm text-gray-700">
              {formData?.description ||
                "Your short personal pitch will be shown here."}
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-900">
              Profile Info
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-800">
              <li className="flex items-start">
                <FiUser className="mr-2 mt-0.5 text-gray-700" />
                <span>
                  <strong>Name:</strong> {formData?.name || "Your Name"}
                </span>
              </li>
              <li className="flex items-start">
                <FiAward className="mr-2 mt-0.5 text-gray-700" />
                <span>
                  <strong>Background:</strong> {formData?.background || "—"}
                </span>
              </li>
              <li className="flex items-start">
                <FiTarget className="mr-2 mt-0.5 text-gray-700" />
                <span>
                  <strong>Looking For:</strong> {formData?.goal || "—"}
                </span>
              </li>
              <li className="flex items-start">
                <FiMapPin className="mr-2 mt-0.5 text-gray-700" />
                <span>
                  <strong>Location Preference:</strong>{" "}
                  {formData?.location || "—"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Video Player */}
        <div className="w-full rounded-lg overflow-hidden border border-indigo-300">
          {playbackUrl ? (
            <video
              ref={playbackVideoRef}
              src={playbackUrl}
              className="w-full h-[400px] bg-gray-200"
              onTimeUpdate={handleTimeUpdate}
              muted={muted}
              playsInline
            />
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No video recorded</span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-indigo-200 h-1">
            <div
              className="bg-indigo-500 h-1 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between p-3 text-indigo-900 bg-white">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handlePlayPause("play")}
                className="text-lg"
              >
                ▶
              </button>
              <button
                onClick={() => handlePlayPause("pause")}
                className="text-lg"
              >
                ⏸
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={handleMuteToggle}>{muted ? "🔇" : "🔊"}</button>
              <button onClick={handleFullscreen}>⛶</button>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="p-4 rounded-lg border border-green-200">
          <h4 className="flex items-center text-blue-900 font-semibold mb-2">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
            Checklist Confirmation
          </h4>
          <p className="text-sm text-blue-900 mb-2">
            Verified before submission:
          </p>
          <ul className="space-y-1 text-sm text-blue-900">
            <li className="flex items-center">
              <FiCheck className="mr-2 text-green-600" /> Clear introduction
            </li>
            <li className="flex items-center">
              <FiCheck className="mr-2 text-green-600" /> Clear audio & visuals
            </li>
            <li className="flex items-center">
              <FiCheck className="mr-2 text-green-600" /> No personal details
            </li>
            <li className="flex items-center">
              <FiCheck className="mr-2 text-green-600" /> Video under 2 minutes
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => navigate("/showcase-video-profile")}
            className="px-4 py-2 border border-blue-900 text-blue-900 md:w-60 rounded-md hover:bg-gray-100"
          >
            Go Back & Edit
          </button>
          <button
            onClick={handleSubmit}
            disabled={!confirmed}
            className={`px-4 py-2 rounded-md ${
              confirmed
                ? "bg-indigo-900 text-white hover:bg-indigo-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit My Video Profile
          </button>
        </div>
      </div>

      {/* Overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          {!success ? (
            // Full-width progress bar during uploading
            <div className="w-full bg-white  px-10 text-center">
              <p className="text-lg font-semibold mb-2">
                Uploading... {uploadProgress}%
              </p>
              <div className=" w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-indigo-600 h-6 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-500 mt-2">
                Updating your profile, please wait...
              </p>
            </div>
          ) : (
            // Fixed-width success card
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
              <div className="text-green-600 text-5xl flex justify-center mb-3">
                <FiCheck className="bg-green-500 rounded-full p-2 text-white" />
              </div>
              <p className="text-green-600 font-semibold">
                🎉 Profile Video Added Successfully!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepSixPlaceholder;
