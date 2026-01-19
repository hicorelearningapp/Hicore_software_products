import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { courseId, level, redirectTo } = location.state || {
    courseId: "default-course-id",
    level: "",
    redirectTo: "",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (redirectTo === "certification-test") {
        navigate(`/certification-test/${courseId}?level=${level}`, {
          replace: true,
        });
      } else {
        navigate(`/courses/${courseId}/learn`, { replace: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [courseId, level, redirectTo, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 font-[Poppins]">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-[18px] font-semibold text-green-600 mb-2">
          Payment Successful!
        </h2>
        <p className="text-[#343079] mb-4">
          Redirecting you to{" "}
          {redirectTo === "certification-test"
            ? "your certification test"
            : "your learning page"}{" "}
          ...
        </p>
        <p className="font-regular text-[14px] text-[#343079] italic">Please wait a moment...</p>
      </div>
    </div>
  );
};

export default SuccessPage;
