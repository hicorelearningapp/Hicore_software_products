import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToolDetails } from "../data/toolDetails";
import { BsCheckCircleFill } from "react-icons/bs";
import { iconimage } from "../assets/uploadIcon";

const ToolPage = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const config = ToolDetails[toolId];

  if (!config) {
    return (
      <div className="text-center mt-20 text-red-600 text-xl">
        Tool not found.
      </div>
    );
  }

  // ALWAYS open file picker for all tools (convert & custom)
  const handlePrimaryAction = () => {
    fileInputRef.current?.click();
  };

  // When files are selected, always navigate to the shared upload route.
  // UploadPage will forward to custom UI if needed.
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      navigate(`/tools/${toolId}/upload`, { state: { selectedFiles: files } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#efe9e9] to-white px-4 py-30">
      <div className="flex flex-col items-center text-center">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-5">
          {config.title}
        </h1>
        <p className="text-gray-500 mb-10">{config.description}</p>

        {/* Primary Action Button (always upload first) */}
        <button
          onClick={handlePrimaryAction}
          className="bg-red-700 hover:bg-red-800 text-white text-xl font-light px-6 py-3 rounded-md mb-4"
        >
          {config.button || "Upload"}
        </button>

        {/* Hidden File Input (used for ALL tools) */}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept={config.accept || "*/*"}
          className="hidden"
          onChange={handleFileSelect}
        />
       

        {/* Supported formats text */}
        <p className="text-gray-500 mt-8 mb-4 text-md">
          Supported formats: {config.formats} (max 100MB)
        </p>

        {/* Security Info */}
        <div className="flex items-center gap-2 text-black font-medium text-lg mt-4">
          <BsCheckCircleFill className="text-green-600 w-6 h-6" />
          Your file is secure. All uploads are encrypted and auto-deleted after
          1 hour.
        </div>

        {/* Steps Section */}
        {config.steps?.length > 0 && (
          <div className="max-w-7xl w-full mt-20">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              How to {config.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left text-sm">
              {config.steps.map((step, index) => (
                <div
                  key={index}
                  className="border border-red-200 rounded-md p-10 bg-white"
                >
                  <h3 className="font-semibold text-red-700 text-[15px] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolPage;
