import React, { useState } from "react";

const StepThreeInfo = ({ onConfirm }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleConfirm = () => {
    if (!title.trim()) {
      alert("Please enter a video title.");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a short description.");
      return;
    }
    if (onConfirm) {
      onConfirm({ title, description });
    }
  };

  return (
    <div className="p-8 m-4 min-h-screen border border-gray-300 rounded-lg">
      {/* Heading */}
      <h3 className="text-base md:text-lg font-bold text-indigo-900 mb-8">
        Step 3: Video Information
      </h3>

      {/* Video Title */}
      <div className="mb-8">
        <label className="block text-[16px] font-medium text-gray-700 mb-2">
          Video Title
        </label>
        <textarea
          value={title}
          onChange={(e) =>
            e.target.value.length <= 80 && setTitle(e.target.value)
          }
          placeholder="Type your video title here... Eg., Enthusiastic Data Analyst Seeking Remote Role"
          className="w-full border border-gray-300 rounded-md p-3 
           h-[140px] text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={2}
        />
        <div className="text-right text-[14px] text-gray-500 mt-1">
          Max 80 characters
        </div>
      </div>

      {/* Short Description */}
      <div className="mb-8">
        <label className="block text-[16px] font-medium text-gray-700 mb-2">
          Short Description
        </label>
        <textarea
          value={description}
          onChange={(e) =>
            e.target.value.length <= 200 && setDescription(e.target.value)
          }
          placeholder="Briefly describe what the viewer will learn about you..."
          className="w-full border border-gray-300 rounded-md h-[140px] p-3 text-[14px] 
          resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
        />
        <div className="text-right text-[14px] text-gray-500 mt-1">
          Max 200 characters
        </div>
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center">
        <button
          onClick={handleConfirm}
          className="px-6 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800 text-sm"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default StepThreeInfo;
