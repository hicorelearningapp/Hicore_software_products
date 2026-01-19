import React, { useState } from "react";
import LeftSuggestions from "./EmployersPrompt";
import LayoutEditor from "./LayoutEditor";

const AiAssistance = () => {
  const [fullScreen, setFullScreen] = useState(false);

  const handleAiClick = () => {
    setFullScreen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="p-4 bg-white m-4 rounded-lg border border-[#E1E0EB]">
        <h1 className="text-2xl font-bold text-indigo-900">
          AI Assistance for Job Creation
        </h1>
        <p className="text-sm text-indigo-900 mt-1">
          Smartly craft job opportunities with our AI copilot. Just answer a few quick questions!
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 p-4">
        {!fullScreen && (
          <div className="w-1/2 transition-all duration-300">
            <LeftSuggestions />
          </div>
        )}

        <div
          className={`transition-all duration-300 ${
            fullScreen ? "w-full" : "w-1/2"
          }`}
        >
          <div className="space-y-4">
            <LayoutEditor onAiClick={handleAiClick} expanded={fullScreen} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistance;
