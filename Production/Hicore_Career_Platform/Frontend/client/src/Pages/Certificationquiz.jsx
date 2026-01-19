// src/Pages/CertificationQuiz.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewCourseTest from "./ReviewCourseTest";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import axios from "axios";

const CertificationQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { course = "HTML", level = "Beginner" } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    import.meta.env.MODE === "production"
      ? "/api"
      : import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch Quiz Data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);

        // Fetch quiz catalog
        const catalogRes = await axios.get(`${API_BASE}/quiz/catalog`);
        const catalog = catalogRes.data?.data || [];

        const selectedCourse = catalog.find(
          (c) => c.name?.toLowerCase() === course.toLowerCase()
        );

        const selectedQuiz = selectedCourse?.quizzes?.find(
          (q) => q.level?.toLowerCase() === level.toLowerCase()
        );

        if (!selectedQuiz) {
          setQuestions([]);
          return;
        }

        const params = {
          user_id: 1,
          item_type: "quiz_level",
          item_id: selectedQuiz.quiz_id,
          course_name: selectedQuiz.course_name,
          level: selectedQuiz.level,
        };

        // Fetch actual quiz questions
        const quizRes = await axios.get(`${API_BASE}/quiz/get-quiz`, {
          params,
        });

        const quizData = quizRes.data?.data?.quiz || [];
        setQuestions(Array.isArray(quizData) ? quizData : []);
      } catch (error) {
        console.error("❌ Error fetching quiz:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [course, level, API_BASE]);

  // ✅ Timer
  useEffect(() => {
    if (!questions.length || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [questions.length, timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleAnswerSelect = (optionLabel) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionLabel });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1)
      setCurrentQuestion((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) newScore++;
    });
    setScore(newScore);
    setShowResultModal(true);
  };

  const resultSummary = {
    topic: course,
    timeTaken: 3600 - timeLeft,
    score,
    total: questions.length,
    performance: (score / questions.length) * 100 >= 70 ? "Passed" : "Failed",
    breakdown: questions.map((q, i) => ({
      question: q.question?.[0]?.value || q.question || "",
      options: q.options?.map((o) => ({ label: o.label, value: o.value })),
      answer: q.correct,
      selected: selectedAnswers[i],
      explanation: q.explanation?.[0]?.value || q.explanation || "",
    })),
  };

  const question = questions[currentQuestion];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFF] text-[#343079] font-semibold">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#343079] mb-4"></div>
        <p>Loading your quiz...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#343079] font-semibold">
        No quiz available for this level or access denied.
      </div>
    );
  }

  if (showReview) {
    return (
      <ReviewCourseTest
        questions={resultSummary.breakdown}
        summary={resultSummary}
        onClose={() => {
          setShowReview(false);
          setShowResultModal(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFF] flex flex-col items-center py-10 px-5 font-[Poppins]">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#2D1B69]">
            {course} - {level} Quiz
          </h2>
          <div className="text-sm font-semibold text-[#2D1B69]">
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question */}
        <div className="flex items-start gap-3 mb-6 text-[#2D1B69] text-base leading-relaxed">
          <h3 className="font-semibold">{currentQuestion + 1}.</h3>
          <div className="flex-1">
            {question?.question?.map
              ? question.question.map((q, i) =>
                  q.type === "formula" ? (
                    <div key={i} className="my-2">
                      <BlockMath math={q.value} />
                    </div>
                  ) : (
                    <div key={i}>{q.value}</div>
                  )
                )
              : question?.question}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-8">
          {question?.options?.map((opt, i) => (
            <label
              key={i}
              className={`flex items-center text-[#2D1B69] text-md cursor-pointer transition ${
                selectedAnswers[currentQuestion] === opt.label
                  ? "bg-[#F0EFFF] font-semibold rounded-lg px-3 py-2"
                  : "hover:bg-[#F8F7FF] rounded-lg px-3 py-2"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={opt.label}
                checked={selectedAnswers[currentQuestion] === opt.label}
                onChange={() => handleAnswerSelect(opt.label)}
                className="mr-3 accent-[#2D1B69]"
              />
              <span className="font-medium mr-2">{opt.label}.</span>
              {opt.type === "formula" ? (
                <BlockMath math={opt.value} />
              ) : (
                <span>{opt.value}</span>
              )}
            </label>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              currentQuestion === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#E8E5FF] text-[#2D1B69] hover:bg-[#D9D4FF]"
            }`}
          >
            ← Previous
          </button>
          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-[#2D1B69] text-white rounded-lg font-medium hover:bg-[#3A268C] transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {/* Results Modal */}
      {showResultModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#00000040] z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-[640px] p-6 space-y-4 text-[#343079] max-h-screen overflow-y-auto shadow-2xl">
            <div className="border border-[#EBEAF2] rounded-xl p-4 space-y-1 text-center">
              <h2 className="text-[#1B9600] text-lg font-semibold">
                {resultSummary.topic} Tech Quiz Completed!
              </h2>
              <p className="text-xl font-bold">🎉 Great job!</p>
            </div>

            {/* Summary */}
            <div className="border border-[#EBEAF2] rounded-xl p-4 grid grid-cols-2 gap-y-2 text-sm">
              <p>
                <strong>Topic:</strong> {resultSummary.topic}
              </p>
              <p>
                <strong>Score:</strong>{" "}
                <span className="text-[#1B9600]">
                  {resultSummary.score}/{resultSummary.total}
                </span>
              </p>
              <p>
                <strong>Performance:</strong>{" "}
                <span
                  className={
                    resultSummary.performance === "Passed"
                      ? "text-[#1B9600]"
                      : "text-[#F44336]"
                  }
                >
                  {resultSummary.performance}
                </span>
              </p>
              <p>
                <strong>Accuracy:</strong>{" "}
                <span className="text-[#1B9600]">
                  {Math.round(
                    (resultSummary.score / resultSummary.total) * 100
                  )}
                  %
                </span>
              </p>
            </div>

            {/* Breakdown */}
            <div className="border border-[#EBEAF2] rounded-xl p-4 text-sm">
              <p className="font-semibold mb-3">Question Breakdown</p>
              <div className="grid grid-cols-4 font-medium mb-2">
                <span>Q</span>
                <span>Your</span>
                <span>Correct</span>
                <span>Result</span>
              </div>

              {resultSummary.breakdown.map((item, idx) => (
                <div key={idx} className="grid grid-cols-4">
                  <span>Q{idx + 1}</span>
                  <span>{item.selected || "-"}</span>
                  <span>{item.answer}</span>
                  <span>
                    {item.selected === item.answer ? (
                      <span className="text-[#1B9600] font-bold">✔</span>
                    ) : (
                      <span className="text-[#F44336] font-bold">✖</span>
                    )}
                  </span>
                </div>
              ))}

              <p
                className="text-right font-medium mt-4 cursor-pointer hover:underline"
                onClick={() => {
                  setShowReview(true);
                  setShowResultModal(false);
                }}
              >
                Review All Questions ➤
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-2">
              <button
                className="bg-[#343079] text-white px-6 py-2 rounded-md hover:bg-[#2A247A]"
                onClick={() => navigate("/")}
              >
                View Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationQuiz;
