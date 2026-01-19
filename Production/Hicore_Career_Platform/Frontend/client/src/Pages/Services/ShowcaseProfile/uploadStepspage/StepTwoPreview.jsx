import React, { useEffect, useRef, useState } from "react";

const StepTwoPreview = ({ videoUrl, fileName, onReupload, onContinue }) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(null);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const durationInSeconds = videoRef.current.duration;
      setDuration(formatDuration(durationInSeconds));
    }
  };

  return (
    <div className="p-8 border border-gray-300 rounded-lg bg-white">
      <h3 className="text-lg font-bold text-indigo-900 mb-6">
        Step 2: Video Preview Section
      </h3>

      {/* Video Player */}
      <div className="border border-indigo-200 rounded-lg overflow-hidden mb-4">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            className="w-full"
            ref={videoRef}
            onLoadedMetadata={handleLoadedMetadata}
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
            Video preview not available
          </div>
        )}
      </div>

      {/* File Info + Re-upload */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <span
            className="font-medium text-indigo-900 max-w-[200px] truncate"
            title={fileName || "Video.mp4"}
          >
            {fileName || "Video.mp4"}
          </span>
          <span>Duration: {duration || "Loading..."}</span>
        </div>
        <button
          onClick={onReupload}
          className="px-4 py-1 border border-indigo-900 text-indigo-900 rounded-md hover:bg-indigo-50 text-sm"
        >
          Re-Upload
        </button>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="px-6 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepTwoPreview;
