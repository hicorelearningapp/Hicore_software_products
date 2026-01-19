import React from "react";

const StepTwoForm = ({ setCurrentStep, formData, setFormData }) => {
  return (
    <div className="bg-white border border-gray-300 rounded rounded-lg p-8 m-6">
      <h3 className="font-bold text-lg text-indigo-900 mb-6">
        Step 2: Add Basic Information
      </h3>

      <div className="space-y-6">
        {/* Video Title */}
        <div>
          <label className="block text-[18px] font-medium text-gray-700 mb-2">
            Video Title
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 
           h-[140px] text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={80}
            placeholder="Type your video title here... Eg., Enthusiastic Data Analyst Seeking Remote Role"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <p className="text-right text-[14px] text-gray-500 mt-1">
            Max 80 characters
          </p>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md h-[140px] p-3 text-[14px] 
          resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={200}
            placeholder="Briefly describe what the viewer will learn about you..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <p className="text-right text-[14px] text-gray-500 mt-1">
            Max 200 characters
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          className="bg-indigo-900 text-white rounded-md py-2 px-8 font-semibold hover:bg-indigo-800 transition"
          onClick={() => setCurrentStep(2)}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default StepTwoForm;
