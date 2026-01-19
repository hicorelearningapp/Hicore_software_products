import React, { useState } from "react";
import jobFilters from "../../../../data/jobFilters";

const JobFilterPanel = () => {
  const [quickApplyOnly, setQuickApplyOnly] = useState(false);

  return (
    <div className="mt-2 mx-4 md:mx-auto max-w-5xl">
      {/* Filter Box */}
      <div className="border border-gray-300 rounded-md p-6 bg-white">
        {/* Quick Apply Toggle */}
        <div className="flex justify-start items-center mb-6">
          <span className="text-md text-blue-900 mr-4">Quick Apply Only</span>
          <button
            onClick={() => setQuickApplyOnly(!quickApplyOnly)}
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
              quickApplyOnly ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                quickApplyOnly ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </button>
        </div>

        {/* Skills and Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills */}
          <div className="flex items-center gap-2">
            <label className="w-40 text-md font-medium text-blue-900">Skills/Tech Stack:</label>
            <select className="flex-1 h-10 border border-gray-300 rounded-md px-2 text-sm text-gray-600">
              <option>React</option>
              <option>Python</option>
            </select>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2">
            <label className="w-40 text-md font-medium text-blue-900">Salary Range:</label>
            <select className="flex-1 h-10 border border-gray-300 rounded-md px-2 text-sm text-gray-600">
              <option>Select option</option>
            </select>
          </div>
        </div>

        {/* Tag Filters using jobFilters.js */}
        <div className="mt-6 space-y-5 text-md text-gray-700">
          {jobFilters.map((section) => (
            <div key={section.title}>
              <p className="mb-1 text-md font-semibold text-blue-900">{section.title}:</p>
              <div className="flex flex-wrap gap-3">
                {section.items.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-1 border rounded-full cursor-pointer text-md text-gray-400 
                    border-gray-300 hover:text-blue-900 hover:border-blue-800"
                  >
                    + {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons outside box */}
      <div className="flex justify-end gap-4 mt-3">
        <button className="px-4 py-2 rounded-md bg-blue-900 hover:bg-blue-700 text-white">Apply Changes</button>
        <button className="px-4 py-2 rounded-md bg-white border hover:bg-gray-300 border-gray-300 text-blue-900">
          Reset Changes
        </button>
  
      </div>
    </div>
  );
};

export default JobFilterPanel;
