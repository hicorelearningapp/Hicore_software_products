import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { price, courseName, courseId, level, redirectTo } = location.state || {
    price: 0,
    courseName: "",
    courseId: "",
    level: "",
    redirectTo: "",
  };

  // ✅ Auto-bypass payment for admin account
  useEffect(() => {
    const userEmail = localStorage.getItem("user_email");
    if (userEmail === "hicoresoft@gmail.com") {
      if (redirectTo === "certification-test") {
        navigate(`/certification-test/${courseId}?level=${level}`);
      } else {
        navigate(`/courses/${courseId}/learn`);
      }
    }
  }, [courseId, level, redirectTo, navigate]);

  // ✅ Simulate Payment Success
  const handlePayment = () => {
    if (redirectTo === "certification-test") {
      // ✅ Certification test flow
      navigate("/success", {
        state: {
          courseId,
          level,
          redirectTo: "certification-test",
        },
      });
    } else {
      // ✅ Course learning flow (skip enroll)
      navigate("/success", {
        state: {
          courseId,
          redirectTo: "course-learn",
        },
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 font-[Poppins]">
      <div className="bg-white shadow-xl rounded-xl p-8 w-96 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#312c81]">
          Pay for {courseName || "Course"}
        </h2>

        <p className="text-lg font-medium mb-4 text-center text-[#343079]">
          Amount to Pay:{" "}
          <span className="text-green-600 font-bold">₹{price}</span>
        </p>

        <button
          onClick={handlePayment}
          className="bg-[#312c81] hover:bg-[#403B93] text-white py-2 px-4 rounded-lg w-full font-semibold transition duration-200"
        >
          Pay ₹{price}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg w-full mt-3 font-semibold transition duration-200"
        >
          ← Back
        </button>

        {redirectTo === "certification-test" && (
          <p className="text-center text-sm mt-4 text-gray-500 italic">
            *Payment required to unlock your certification test.*
          </p>
        )}
      </div>
    </div>
  );
}
