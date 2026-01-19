import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const EnrollPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate(`/find-my-courses/${courseId}/learn`);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-3xl font-bold text-[#2C2470] mb-4">
        Enroll Page for {courseId.toUpperCase()}
      </h1>
      <p className="text-gray-600 mb-6">
        You're almost ready. Click below to begin your journey.
      </p>
      <button
        onClick={handleStartLearning}
        className="bg-[#2C2470] text-white px-6 py-3 rounded-xl hover:bg-[#1e1a56] transition"
      >
        Start Learning
      </button>
    </div>
  );
};

export default EnrollPage;
