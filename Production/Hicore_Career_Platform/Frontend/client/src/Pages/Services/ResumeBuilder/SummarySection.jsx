import React, { useState, useEffect } from "react";
import { FiEdit3 } from "react-icons/fi";

const SummarySection = ({ summary = "", onSummaryChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSummary, setLocalSummary] = useState(summary);

  // ✅ Sync with external updates (e.g., from AI suggestion)
  useEffect(() => {
    setLocalSummary(summary);
  }, [summary]);

  // ✅ Display placeholder if no summary yet
  const displaySummary =
    localSummary && localSummary.trim() !== ""
      ? localSummary
      : "No summary added yet. Click the edit button to write your professional summary.";

  // ✅ Handle manual typing changes
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalSummary(newValue);
    onSummaryChange(newValue);
  };

  // ✅ Toggle editing mode
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="border rounded-xl border-blue-900 overflow-hidden mb-6 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#F2F2FF] px-4 py-4 border-b border-blue-900">
        <h3 className="text-[20px] font-semibold text-blue-900">
          Professional Summary
        </h3>
        <button
          className="flex items-center justify-center text-md text-[#7C67F5] font-medium hover:scale-105 transition-transform"
          onClick={handleToggleEdit}
        >
          {isEditing ? (
            <span className="text-[15px] font-medium">Done</span>
          ) : (
            <FiEdit3 className="text-[20px]" />
          )}
        </button>
      </div>

      {/* Summary Body */}
      <div className="px-4 py-3 bg-white">
        {isEditing ? (
          <textarea
            className="p-2 border border-blue-900 text-blue-900 rounded w-full text-md leading-relaxed resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={localSummary}
            onChange={handleChange}
            rows={4}
            autoFocus
            placeholder="Write a short professional summary..."
          />
        ) : (
          <p
            className={`text-md leading-relaxed whitespace-pre-wrap ${
              localSummary?.trim()
                ? "text-blue-900"
                : "text-gray-500 italic select-none"
            }`}
          >
            {displaySummary}
          </p>
        )}
      </div>
    </div>
  );
};

export default SummarySection;
