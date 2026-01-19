import React from "react";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AiAssistantPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#2C297D] text-lg font-medium mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Back
      </button>

      <div className="border border-gray-300 p-6 mb-6 rounded-lg">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#2C297D] mb-4">
          AI Assistance for JD Based Shortlisting
        </h1>
        <p className="text-xl text-blue-900">
          No Job Description ready yet? Use our AI Job Description Generator
        </p>
      </div>

      <div className="border border-gray-300 p-5 rounded-lg">
        <div className="flex mb-4 items-center gap-2">
          <FiEdit2 className="text-[#2C297D] text-2xl" />
          <h2 className="text-2xl font-semibold text-[#2C297D]">
            Employer’s Prompt
          </h2>
        </div>
        <div className="border border-blue-900 rounded-lg overflow-hidden">
          {/* Top Bar */}
          <div className="bg-[#F8F8FC] border-b border-blue-900 px-4 py-4">
            <h2 className="text-lg font-semibold text-[#2C297D]">
              Let’s Create Your Job Description!
            </h2>
          </div>

          {/* Inner Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-blue-900 font-medium mb-2">
                Company Details
              </label>
              <textarea
                placeholder="Type the company details..."
                className="w-full p-6 border border-blue-900 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-[#2C297D]"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-blue-900 font-medium mb-1">
                Job Title Input
              </label>
              <textarea
                placeholder="Type the job title..."
                className="w-full p-6 border border-blue-900 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-[#2C297D]"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-blue-900 font-medium mb-1">
                Job Summary
              </label>
              <textarea
                placeholder="Describe the job in 1–2 lines..."
                className="w-full p-6 border border-blue-900 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-[#2C297D]"
                rows={2}
              />
            </div>

            {/* ✅ Navigate to /ai-shortlisting */}
            <button
              onClick={() => navigate("/hiring")}
              className="bg-[#2C297D] text-white px-6 py-3 rounded-md hover:bg-[#1f1c5a]"
            >
              Create a New Job Description
            </button>
          </div>
        </div>

        {/* Note Section */}
        <div className="bg-green-100 text-green-700 p-4 mt-6 rounded-md text-md flex items-center">
          <span className="mr-2">💡</span>
          All AI suggestions are fully editable - customize them to match your
          needs.
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
