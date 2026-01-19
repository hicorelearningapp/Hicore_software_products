import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import closeIcon from "../assets/close.png";
import tickIcon from "../assets/MentorPage/tick.png";
import partyIcon from "../assets/party.png";
import axios from "axios";

const OrderSummaryModal = ({ course, level, icon, onClose, userId = 1 }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_API_BASE || "/api";

  // ✅ Fetch quiz catalog from backend
  useEffect(() => {
    const fetchQuizCatalog = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/quiz/catalog`);
        console.log("📘 Quiz Catalog API Response:", response.data);

        const catalog = response.data?.data || [];
        const courseItem = catalog.find(
          (item) => item.name.toLowerCase() === course.toLowerCase()
        );

        const quizLevel = courseItem?.quizzes?.find(
          (q) => q.level.toLowerCase() === level.toLowerCase()
        );

        setQuizData(quizLevel || null);
      } catch (err) {
        console.error("❌ Error fetching quiz catalog:", err);
      }
    };

    fetchQuizCatalog();
  }, [course, level, BACKEND_URL]);

  // ✅ Directly Show Success Screen (Payment Removed)
  const handleProceed = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setShowSuccess(true);
      setIsProcessing(false);
    }, 800); // small delay for better UX feel
  };

  // ✅ Start Quiz and Log API Response
  const handleStartQuiz = async () => {
    try {
      console.log("🎯 Starting quiz for:", { course, level, userId });

      // Optional backend call to initialize quiz session
      const response = await axios.post(`${BACKEND_URL}/quiz/start`, {
        user_id: userId,
        course,
        level,
      });

      console.log("✅ Quiz Start API Response:", response.data);
    } catch (error) {
      console.error("❌ Error starting quiz:", error);
    }

    // Navigate to quiz page
    navigate("/certification-quiz", { state: { course, level } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      {!showSuccess && (
        <div className="bg-white w-[550px] rounded-2xl shadow-2xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:scale-110 transition-transform"
          >
            <img src={closeIcon} alt="close" className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold text-[#2D1B69] mb-4">
            Order Summary
          </h2>

          <div className="bg-gradient-to-r from-[#E8F0FF] to-[#F4F7FF] rounded-xl shadow-sm p-4 mb-5 flex gap-4 items-center">
            <img
              src={icon || ""}
              alt={course}
              className="w-20 h-20 object-contain"
            />
            <div>
              <h3 className="text-lg font-semibold text-[#2D1B69] mb-1">
                {course}
              </h3>
              <p className="text-sm text-[#343079]">
                Certification:{" "}
                <span className="font-semibold text-[#2D1B69]">
                  HiCore Software Technologies (MNC)
                </span>
              </p>
              <p className="text-sm text-[#343079]">
                Level: <span className="font-semibold">{level}</span>{" "}
                &nbsp;&nbsp;|&nbsp;&nbsp; Duration:{" "}
                <span className="font-semibold">1 Hour</span>
              </p>
              <p className="text-sm text-[#343079]">
                Total Questions: <span className="font-semibold">50</span>
                &nbsp;&nbsp;|&nbsp;&nbsp; Passing Score:{" "}
                <span className="font-semibold">70%</span>
              </p>
              <p className="text-sm text-red-600 mt-1">
                NOTE: You must complete the quiz in one attempt.
              </p>
            </div>
          </div>

          <div className="bg-[#F9FAFF] rounded-xl p-4 mb-5 shadow-sm">
            <h4 className="font-semibold text-[#2D1B69] mb-3">
              {course} - {level} Quiz
            </h4>
            <div className="flex justify-between text-sm mb-1 text-[#343079]">
              <span>Course Fee</span>
              <span>₹{quizData ? quizData.amount : "Loading..."}</span>
            </div>
            <div className="flex justify-between text-sm mb-1 text-[#343079]">
              <span>Platform Fee</span>
              <span>₹0</span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold text-[#2D1B69]">
              <span>Total Amount</span>
              <span>₹{quizData ? quizData.amount : "Loading..."}</span>
            </div>
          </div>

          <button
            onClick={handleProceed}
            disabled={!quizData || isProcessing}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              quizData && !isProcessing
                ? "bg-[#2D1B69] text-white hover:bg-[#3A268C]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isProcessing
              ? "Processing..."
              : quizData
              ? `Proceed to Pay ₹${quizData.amount}`
              : "Please wait..."}
          </button>
        </div>
      )}

      {/* ✅ Success Screen */}
      {showSuccess && (
        <div className="bg-white rounded-xl shadow-2xl p-10 w-[600px] text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:scale-110 transition-transform"
          >
            <img src={closeIcon} alt="close" className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-6">
            <img src={tickIcon} alt="Success" className="w-20 h-20" />
          </div>

          <div className="flex justify-center items-center gap-2 mb-2">
            <h2 className="text-2xl font-semibold text-green-600">
              Purchase Successful
            </h2>
            <img src={partyIcon} alt="Celebration" className="w-6 h-6" />
          </div>

          <p className="text-[#343079] mb-1">
            You’re all set to begin your Certification Quiz.
          </p>

          <p className="text-[#343079] font-semibold mb-6">
            Your Certification has been unlocked!
          </p>

          <button
            onClick={handleStartQuiz}
            className="bg-[#343079] text-white px-8 py-3 rounded-md font-medium hover:bg-[#2d286b] transition"
          >
            Start Certification Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryModal;
