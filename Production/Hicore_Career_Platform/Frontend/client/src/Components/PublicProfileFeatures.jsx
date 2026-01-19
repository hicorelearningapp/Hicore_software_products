import React from "react";

const features = [
  "Global Shareable Profile Link",
  "Certifications & Skills Display",
  "Freelance & Job Preferences Listed",
  "1-Min Video Pitch + Project Videos",
  "Badges, Leaderboards & Achievements",
  "Smart Resume + JD Fit Score Summary",
];

const PublicProfileFeatures = ({ onClose, onCreateProfile }) => {
  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") {
      onClose();
    }
  };

  return (
    <div
      id="overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-[#2B2160] mb-6">
          Key Features of Public Profile
        </h2>

        <ul className="space-y-4 text-left text-[#5B5395] text-sm md:text-base list-disc pl-5">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        <button
          className="mt-6 bg-[#2B2160] hover:bg-indigo-900 transition duration-200 text-white px-6 py-3 rounded-lg font-medium"
          onClick={onCreateProfile}
        >
          Create Your Public Profile
        </button>
      </div>
    </div>
  );
};

export default PublicProfileFeatures;
