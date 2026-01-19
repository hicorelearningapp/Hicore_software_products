import React, { useState } from "react";

const StepFourChecklist = ({ onConfirm }) => {
  const requiredItems = [
    "The video is under 2 minutes",
    "The video is clear and audible",
    "I didn't include private or sensitive details",
    "I described my skills or goals",
  ];

  const optionalItems = [
    "Auto thumbnail generator for uploaded video",
    "Video trimming (basic start/end)",
    "Auto transcription preview (for accessibility)",
  ];

  const [checkedRequired, setCheckedRequired] = useState(
    new Array(requiredItems.length).fill(false)
  );
  const [checkedOptional, setCheckedOptional] = useState(
    new Array(optionalItems.length).fill(false)
  );

  const allRequiredChecked = checkedRequired.every(Boolean);

  const handleRequiredChange = (index) => {
    const updated = [...checkedRequired];
    updated[index] = !updated[index];
    setCheckedRequired(updated);
  };

  const handleOptionalChange = (index) => {
    const updated = [...checkedOptional];
    updated[index] = !updated[index];
    setCheckedOptional(updated);
  };

  return (
    <div className="p-10 m-4 min-h-screen border border-gray-300 rounded-lg flex flex-col justify-between">
      {/* Heading */}
      <h3 className="text-base md:text-lg font-bold text-indigo-900 mb-8">
        Step 4: Quick Final Checklist
      </h3>

      {/* Checklist Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 flex-grow">
        {/* Required Checklist */}
        <div className="bg-[#E8FFDD] border border-green-100 rounded-md p-4">
          <h4 className="font-semibold text-[16px] text-[#343079] mb-3">
            Before submitting, confirm:
          </h4>
          <ul className="space-y-2 text-[14px] text-[#343079]">
            {requiredItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <input
                  type="checkbox"
                  checked={checkedRequired[index]}
                  onChange={() => handleRequiredChange(index)}
                  className="mt-1 mr-2 accent-blue-600 cursor-pointer"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-[14px] mt-3 text-[#343079]">
            All boxes must be checked to enable Submit
          </p>
        </div>

        {/* Optional Checklist */}
        <div className="bg-[#FDFFED] border border-yellow-100 rounded-md p-4">
          <h4 className="font-semibold  text-[16px] text-[#343079] mb-3">
            Extra Features (Optional)
          </h4>
          <ul className="space-y-2 text-[14px] text-[#343079]">
            {optionalItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <input
                  type="checkbox"
                  checked={checkedOptional[index]}
                  onChange={() => handleOptionalChange(index)}
                  className="mt-1 mr-2 accent-blue-600 cursor-pointer"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center">
        <button
          disabled={!allRequiredChecked}
          onClick={() =>
            onConfirm && onConfirm({ checkedRequired, checkedOptional })
          }
          className={`px-6 py-2 rounded-md text-white text-sm transition ${
            allRequiredChecked
              ? "bg-indigo-900 hover:bg-indigo-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default StepFourChecklist;
