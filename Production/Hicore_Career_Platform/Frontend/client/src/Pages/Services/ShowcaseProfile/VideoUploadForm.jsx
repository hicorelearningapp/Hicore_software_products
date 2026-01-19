import React, { useState } from "react";
import StepOneUpload from "./uploadStepspage/StepOneUpload";
import StepTwoPreview from "./uploadStepspage/StepTwoPreview";
import StepThreeInfo from "./uploadStepspage/StepThreeInfo";
import StepFourChecklist from "./uploadStepspage/StepFourChecklist";
import StepFiveSubmit from "./uploadStepspage/StepFiveSubmit";

const VideoUploadPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [checklistData, setChecklistData] = useState({});

  const profileData = {
    name: "Sanjay",
    background: "Final Year CS Student | Certified in Python & ML",
    lookingFor: "Internship, Mentorship, or Entry-Level Role",
    location: "Remote or Hybrid",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-6">
      {/* Outer border container */}
      <div className="flex w-full max-w-8xl border border-gray-300 rounded-lg bg-white">
        {/* Sidebar */}
        <div className="w-[294px] border-r border-gray-200 p-6">
          <div className="space-y-4">
            {[
              "Step 1: Upload Video",
              "Step 2: Video Preview Section",
              "Step 3: Video Information",
              "Step 4: Quick Final Checklist",
              "Step 5: Submit Your Video",
            ].map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index + 1)}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  currentStep === index + 1
                    ? "bg-indigo-100 text-indigo-900 font-semibold"
                    : "text-indigo-900 hover:bg-gray-100"
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="mt-8 bg-[#E8FFDD]  p-4 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              💡 Quick Tips
            </h4>
            <ul className="list-disc pl-5 text-sm text-blue-900 space-y-3">
              <li>Keep it short: Aim for 60–120 seconds</li>
              <li>Use a stable camera: Avoid shaky or blurry footage</li>
              <li>Face the camera directly: Keep your face centered and well-lit</li>
              <li>Be authentic: Show personality — don't read a script</li>
              <li>Dress appropriately Reflect the role or audience you're targeting</li>
              <li>Clear audio matters a quiet space and speak clearly</li>
            </ul>
          </div>
        </div>

        {/* Right side content */}
        <div className="flex-1 p-6">
          {currentStep === 1 && (
            <StepOneUpload
              onFileSelect={(file) => {
                setVideoFile(file);
                setVideoUrl(URL.createObjectURL(file));
                setCurrentStep(2); // Auto go to Step 2 after upload
              }}
            />
          )}

          {currentStep === 2 && (
            <StepTwoPreview
              videoUrl={videoUrl}
              fileName={videoFile?.name}
              duration={"1:45 mins"} // could calculate actual
              onReupload={() => setCurrentStep(1)}
              onContinue={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <StepThreeInfo
              onConfirm={(data) => {
                setVideoTitle(data.title);
                setVideoDescription(data.description);
                setCurrentStep(4);
              }}
            />
          )}

          {currentStep === 4 && (
            <StepFourChecklist
              onConfirm={(data) => {
                setChecklistData(data);
                setCurrentStep(5);
              }}
            />
          )}

          {currentStep === 5 && (
            <StepFiveSubmit
              videoUrl={videoUrl}
              introTitle={videoTitle}
              introDescription={videoDescription}
              profileData={profileData}
              onGoBack={() => setCurrentStep(4)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUploadPage;
