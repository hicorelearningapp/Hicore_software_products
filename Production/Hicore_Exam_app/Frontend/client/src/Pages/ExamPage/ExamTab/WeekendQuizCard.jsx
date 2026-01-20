import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ added
import timingIcon from "../../../assets/TestTab/Timer.png";
import leftArrowIcon from "../../../assets/TestTab/left-arrow.png";
import rightArrowIcon from "../../../assets/TestTab/right-arrow.png";
import quizQuestions from "./quizQuestions";
import CheckResponses from "./CheckResponses";

const WeekendQuizCard = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [time, setTime] = useState("02:47");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResponses, setShowResponses] = useState(false);

  const navigate = useNavigate(); // ✅ added
  const { examName } = useParams(); // ✅ added

  const currentQuestion = quizQuestions[currentIndex];

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption("");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption("");
    }
  };

  const handleOptionSelect = (opt) => {
    setSelectedOption(opt);
    quizQuestions[currentIndex].selected = opt;
  };

  const handleSubmit = () => {
    if (currentIndex < quizQuestions.length - 1) {
      handleNext();
    } else {
      setIsSubmitted(true);
    }
  };

  const totalQuestions = quizQuestions.length;
  const correctAnswers = quizQuestions.filter(
    (q) => q.selected === q.answer
  ).length;
  const wrongAnswers = totalQuestions - correctAnswers;
  const score = ((correctAnswers / totalQuestions) * 180).toFixed(0);
  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(0);

  // Show Responses Page
  if (showResponses) {
    return (
      <CheckResponses
        score={score}
        correctAnswers={correctAnswers}
        subject={subjectName}
        wrongAnswers={wrongAnswers}
        accuracy={accuracy}
        quizQuestions={quizQuestions}
        setShowResponses={setShowResponses}
        setIsSubmitted={setIsSubmitted}
      />
    );
  }

  // Result Modal
  if (isSubmitted) {
    return (
      <div
        className="fixed inset-0 bg-white bg-opacity-30 z-50 flex items-center justify-center p-4"
        onClick={() => setIsSubmitted(false)}
      >
        <div
          className="bg-white w-full max-w-6xl p-8 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold text-green-700 text-center mb-6">
            🎉 Fantastic Job! You’ve Completed This Weekend’s Exam.
          </h2>

          {/* Performance Snapshot */}
          <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-lg mb-6">
            <h3 className="text-lg text-blue-800 font-semibold mb-4">
              Your Performance Snapshot
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="border border-blue-300 p-4 rounded-lg bg-white shadow-sm">
                <p className="text-blue-800 text-sm">Score</p>
                <p className="text-md font-semibold text-green-600">
                  {score} / 180
                </p>
              </div>
              <div className="border border-blue-300 p-4 rounded-lg bg-white shadow-sm">
                <p className="text-blue-800 text-sm">Accuracy</p>
                <p className="text-md font-semibold text-green-600">
                  {accuracy}%
                </p>
              </div>
              <div className="border border-blue-300 p-4 rounded-lg bg-white shadow-sm">
                <p className="text-blue-900 text-sm">Rank</p>
                <p className="text-md font-semibold text-green-600">
                  Top 10% among peers
                </p>
              </div>
              <div className="border border-blue-300 p-4 rounded-lg bg-white shadow-sm">
                <p className="text-blue-900 text-sm">Time Taken</p>
                <p className="text-md font-semibold text-green-600">
                  {time} hrs
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="border border-gray-100 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              AI Insights
            </h3>
            <div className="space-y-3">
              <div className="bg-red-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-800 font-semibold text-sm mb-1">
                  Weakest Area
                </p>
                <p className="text-blue-800 text-sm">
                  Dimensional Analysis – struggled with derived unit conversions
                </p>
              </div>
              <div className="bg-green-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-800 font-semibold text-sm mb-1">
                  Strongest Area
                </p>
                <p className="text-blue-800 text-sm">
                  Physics – Laws of Motion
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-800 font-semibold text-sm mb-1">
                  Recommendation
                </p>
                <p className="text-blue-800 text-sm">
                  Revise Newton’s Laws before the next test.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            {/* ✅ Navigate to roadmap Analyze tab */}
            <button
              onClick={() => navigate(`/exam/${examName}/roadmap?tab=Analyze`)}
              className="bg-blue-700 w-full md:w-auto text-white px-6 py-2 rounded-full hover:bg-blue-800"
            >
              Analyze My Results
            </button>
            <button
              onClick={() => setShowResponses(true)}
              className="border w-full md:w-auto border-blue-700 text-blue-700 px-6 py-2 rounded-full hover:bg-blue-50"
            >
              Check Your Responses
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Interface
  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-8xl h-full shadow-lg flex flex-col overflow-hidden rounded-xl">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="flex items-center text-blue-800 hover:text-blue-900 font-medium"
          >
            ← Back
          </button>
        </div>

        {/* Quiz Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/2 bg-blue-50 p-6 flex flex-col">
            <div className="flex justify-end items-center pb-2 gap-2">
              <button onClick={handlePrev}>
                <img
                  src={leftArrowIcon}
                  alt="prev"
                  className="w-8 h-8 hover:opacity-70"
                />
              </button>
              <button onClick={handleNext}>
                <img
                  src={rightArrowIcon}
                  alt="next"
                  className="w-8 h-8 hover:opacity-70"
                />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="font-medium text-blue-800 text-center text-lg">
                {currentIndex + 1}. {currentQuestion.question}
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 p-6 flex flex-col overflow-y-auto scrollbar-hide">
            <div className="flex justify-end items-center gap-2 text-gray-600 text-sm mb-4">
              <img src={timingIcon} alt="timer" className="w-6 h-6" />
              {time}
            </div>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`border border-blue-100 text-blue-800 rounded-lg px-4 py-2 cursor-pointer ${
                    selectedOption === opt
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="option"
                    value={opt}
                    checked={selectedOption === opt}
                    onChange={() => handleOptionSelect(opt)}
                    className="hidden"
                  />
                  {String.fromCharCode(65 + idx)}. {opt}
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekendQuizCard;
