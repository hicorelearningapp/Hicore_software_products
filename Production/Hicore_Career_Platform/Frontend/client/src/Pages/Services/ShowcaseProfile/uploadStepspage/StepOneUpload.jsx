import React, { useState } from "react";
import { FiUpload, FiFile, FiTrash2 } from "react-icons/fi";

const StepOneUpload = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(fileUrl);

    // Pass file to parent so Step 2 can use it
    if (onFileSelect) {
      onFileSelect(file, fileUrl);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);

    // Reset in parent too
    if (onFileSelect) {
      onFileSelect(null, null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a video file first.");
      return;
    }
    alert(`Uploading: ${selectedFile.name}`);
  };

  return (
    <div className="p-10 m-4 min-h-screen border-2 border-dashed border-gray-300 rounded-lg">
      {/* Heading */}
      <h3 className="text-base md:text-lg font-bold text-indigo-900 mb-8">
        Step 1: Upload Video
      </h3>

      {/* Upload Area */}
      {!previewUrl ? (
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-indigo-800 font-medium text-lg mt-6 mb-2">
            Drag & Drop your video here
          </p>

          <FiUpload className="text-5xl mt-10 text-indigo-900 mb-10" />

          <label>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="px-5 py-2 bg-indigo-900 text-white text-sm rounded-md cursor-pointer hover:bg-indigo-800">
              Click to Upload Video
            </span>
          </label>

          {/* Info box */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mt-10 text-blue-900 text-sm text-left space-y-3 max-w-xs">
            <p>• Supported formats: .mp4, .mov, .avi</p>
            <p>• Max file size: 100MB</p>
            <p>• Recommended length: 60–120 seconds</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Video Preview */}
          <video
            src={previewUrl}
            controls
            className="w-full rounded-lg border border-gray-300"
          />

          {/* File Info */}
          <div className="flex items-center justify-between bg-indigo-50 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2 text-indigo-900">
              <FiFile />
              <span className="font-medium">{selectedFile.name}</span>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={handleRemoveFile}
              className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800"
            >
              Upload Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepOneUpload;
