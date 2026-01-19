import React from "react";

const ResumeBullets = ({ bullets = [] }) => {
  const cleanText = (text) => text?.trim() || "";

  return (
    <div className="w-[92%] mx-auto mt-8 pb-16">
      <h2 className="text-center text-2xl font-bold text-indigo-800 mb-6">
        Suggested Resume Bullet Points
      </h2>

      <div className="p-12 border border-indigo-200 rounded-2xl shadow-sm bg-white">
        {bullets.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No resume bullets found for this job.
          </p>
        ) : (
          <ul className="list-disc pl-6 space-y-4 text-gray-700 text-[17px] leading-relaxed">
            {bullets.map((point, index) => (
              <li key={index}>{cleanText(point)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResumeBullets;
