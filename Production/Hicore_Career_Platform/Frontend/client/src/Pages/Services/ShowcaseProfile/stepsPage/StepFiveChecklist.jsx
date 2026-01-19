import React from "react";

const StepFiveChecklist = ({
  checklist,
  setChecklist,
  extras,
  setExtras,
  isChecklistValid,
  setCurrentStep,
}) => {
  return (
    <div className="bg-white border min-h-screen border-gray-300 rounded-lg p-6 m-6 flex flex-col">
      <h3 className="font-bold text-md text-indigo-900 mb-6">
        Step 5: Quick Final Checklist
      </h3>

      <div className="flex flex-col md:flex-row gap-6 flex-grow">
        {/* Required Checklist */}
        <div className="bg-green-50 p-6 rounded-lg flex-1">
          <h4 className="font-semibold text-green-900 mb-4">
            Before submitting, confirm:
          </h4>
          <div className="space-y-3 text-green-900">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="accent-blue-600 mt-1"
                checked={checklist.intro}
                onChange={() =>
                  setChecklist({ ...checklist, intro: !checklist.intro })
                }
              />
              I clearly introduced myself and spoke confidently
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="accent-blue-600 mt-1"
                checked={checklist.clear}
                onChange={() =>
                  setChecklist({ ...checklist, clear: !checklist.clear })
                }
              />
              The audio and video are clear
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="accent-blue-600 mt-1"
                checked={checklist.noPrivate}
                onChange={() =>
                  setChecklist({
                    ...checklist,
                    noPrivate: !checklist.noPrivate,
                  })
                }
              />
              I didn’t share any private contact information
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="accent-blue-600 mt-1"
                checked={checklist.duration}
                onChange={() =>
                  setChecklist({ ...checklist, duration: !checklist.duration })
                }
              />
              I stayed within 2 minutes
            </label>
          </div>
          <p className="text-sm text-green-800 mt-4 font-semibold">
            All boxes must be checked to enable Submit
          </p>
        </div>

        {/* Optional Checklist */}
        <div className="bg-yellow-50 p-6 rounded-lg flex-1">
          <h4 className="font-semibold text-yellow-900 mb-4">
            Extra Features (Optional)
          </h4>
          <div className="space-y-3 text-yellow-900">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="accent-blue-600 mt-1"
                checked={extras.thumbnail}
                onChange={() =>
                  setExtras({ ...extras, thumbnail: !extras.thumbnail })
                }
              />
              Auto thumbnail generator for uploaded video
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="accent-blue-600 mt-1"
                checked={extras.trimming}
                onChange={() =>
                  setExtras({ ...extras, trimming: !extras.trimming })
                }
              />
              Video trimming (basic start/end)
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="accent-blue-600 mt-1"
                checked={extras.transcript}
                onChange={() =>
                  setExtras({ ...extras, transcript: !extras.transcript })
                }
              />
              Auto transcription preview (for accessibility)
            </label>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center mt-10">
        <button
          className={`px-6 py-2 rounded-md font-semibold transition ${
            isChecklistValid()
              ? "bg-indigo-900 text-white hover:bg-indigo-800"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          onClick={() => isChecklistValid() && setCurrentStep(5)}
          disabled={!isChecklistValid()}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default StepFiveChecklist;
