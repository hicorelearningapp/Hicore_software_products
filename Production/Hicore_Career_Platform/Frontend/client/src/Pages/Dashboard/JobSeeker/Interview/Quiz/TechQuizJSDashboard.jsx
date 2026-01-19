import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import emptyQuizIcon from "../../../../../assets/InterviewPreparation/empty-quiz.png";

const TechQuizJSDashboard = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeSetting, setTimeSetting] = useState("Total 10 mins");

  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [count, setCount] = useState(5);
  const [mode, setMode] = useState("Practice");
  const [loading, setLoading] = useState(false);

  const [showResultModal, setShowResultModal] = useState(false);
  const [resultSummary, setResultSummary] = useState(null);

  useEffect(() => {
    if (!quizStarted) return;
    if (timeLeft === 0) {
      if (timeSetting === "1 min/question") {
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
          setTimeLeft(60);
        } else {
          handleSubmit();
        }
      } else {
        handleSubmit();
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted]);

  const getTimeFromSetting = (setting) => {
    switch (setting) {
      case "1 min/question":
        return 60;
      case "Total 10 mins":
        return 600;
      case "60 min":
        return 3600;
      default:
        return 60;
    }
  };

  const handleStartQuiz = async () => {
    if (!topic || !level || !count || !timeSetting || !mode) {
      alert("Please fill all fields before starting the quiz.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        topic: topic.toLowerCase(),
        level: level.toLowerCase(),
        number_of_questions: parseInt(count),
        mode: mode.toLowerCase(),
      };

      const response = await axios.post(
        "https://hicore.pythonanywhere.com/api/quiz/generate",
        payload
      );

      if (response.data?.questions?.length > 0) {
        const formatted = response.data.questions.map((q) => ({
          ...q,
          selected: null,
        }));
        setQuestions(formatted);
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsCorrect(null);
        setTimeLeft(getTimeFromSetting(timeSetting));
      } else {
        alert("No questions received from the server.");
      }
    } catch (error) {
      console.error("Quiz API Error:", error);
      alert("Failed to fetch quiz. Please check your input or try again later.");
    }
    setLoading(false);
  };

  const handleOptionClick = (option) => {
    const updated = [...questions];
    updated[currentQuestionIndex].selected = option;
    setQuestions(updated);
    setSelectedOption(option);
    const correct = updated[currentQuestionIndex].answer === option;
    setIsCorrect(correct);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsCorrect(null);
      if (timeSetting === "1 min/question") setTimeLeft(60);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      if (timeSetting === "1 min/question") setTimeLeft(60);
    }
  };

  const handleSubmit = () => {
    const score = questions.reduce(
      (acc, q) => acc + (q.answer === q.selected ? 1 : 0),
      0
    );

    const summary = {
      topic,
      score,
      total: questions.length,
      timeTaken: getTimeFromSetting(timeSetting) - timeLeft,
      performance:
        score >= questions.length * 0.8 ? "Above Average" : "Needs Improvement",
      breakdown: questions.map((q, i) => ({
        question: `Q${i + 1}`,
        yourAnswer: q.selected || "-",
        correctAnswer: q.answer,
        isCorrect: q.answer === q.selected,
        options: q.options,
      })),
    };

    setResultSummary(summary);
    setShowResultModal(true);
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}.${secs}`;
  };

  const current = questions[currentQuestionIndex];

  return (
    <div className="bg-white rounded-xl border border-blue-900 m-4 shadow flex flex-col overflow-hidden min-h-[650px]">
      {/* === TOP FILTER BAR === */}
      <div className="w-full flex flex-wrap items-center gap-6 p-4 border-b border-gray-200 text-sm">
        {/* Topic */}
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#3E3A75] flex items-center gap-1">
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter Topic"
            className="border border-[#CBCDCF] rounded px-3 py-1 focus:outline-none focus:border-[#343079]"
          />
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#3E3A75] flex items-center gap-1">
            Difficulty Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border border-[#CBCDCF] rounded px-3 py-1 focus:outline-none focus:border-[#343079]"
          >
            <option value="">Select Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Number of Questions */}
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#3E3A75] flex items-center gap-1">
            No. of Questions
          </label>
          <select
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="border border-[#CBCDCF] rounded px-3 py-1 focus:outline-none focus:border-[#343079]"
          >
            <option value="">No Of Questions</option>
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Time Limit */}
       {/*<div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#3E3A75] flex items-center gap-1">
            Time Limit
          </label>
          <select
            value={timeSetting}
            onChange={(e) => setTimeSetting(e.target.value)}
            className="border border-[#CBCDCF] rounded px-3 py-1 focus:outline-none focus:border-[#343079]"
          >
            <option value="1 min/question">1 min/question</option>
            <option value="Total 10 mins">Total 10 mins</option>
            <option value="60 min">60 min</option>
          </select>
        </div>*/}

        {/* Mode */}
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#3E3A75] flex items-center gap-1">
            Mode
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border border-[#CBCDCF] rounded px-3 py-1 focus:outline-none focus:border-[#343079]"
          >
            <option value="Practice">Practice</option>
            <option value="Challenge">Challenge</option>
          </select>
        </div>

        {!quizStarted && (
          <button
            onClick={handleStartQuiz}
            disabled={loading}
            className="bg-[#343079] text-white px-4 py-1.5 rounded ml-auto"
          >
            {loading ? "Loading..." : "Start Quiz"}
          </button>
        )}
      </div>

      {/* === QUIZ AREA === */}
      <div className="flex-1 flex flex-col text-[#343079] px-6 py-8">
        {!quizStarted ? (
          <div className="flex flex-col justify-center items-center text-center h-full">
            <img
              src={emptyQuizIcon}
              alt="No Quiz"
              className="w-[70px] h-[70px] mb-4 opacity-50"
            />
            <h3 className="text-lg font-semibold mb-2 text-[#AEADBE]">
              No Quiz Attempted Yet
            </h3>
            <p className="text-sm mb-4 max-w-[80%] text-[#A0A0C0]">
              You haven’t taken any quizzes yet. Practice and track your
              performance instantly.
            </p>
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="bg-[#343079] text-white px-6 py-2 rounded font-medium min-w-[200px]"
            >
              {loading ? "Loading..." : "Start Your First Quiz"}
            </button>
          </div>
        ) : (
          current && (
            <div className="flex flex-col h-full relative">
              <div className="flex justify-end mb-2">
                <span className="text-sm font-semibold text-[#343079]">
                  {formatTime(timeLeft)}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-[#343079] mb-6">
                {currentQuestionIndex + 1}. {current.question}
              </h2>

              <div className="flex flex-col gap-4">
                {current.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const correct = current.answer === option;
                  let optionStyle = "text-[#343079]";
                  if (selectedOption) {
                    if (isSelected && correct) optionStyle = "text-green-600 font-semibold";
                    else if (isSelected && !correct)
                      optionStyle = "text-red-600 font-semibold";
                  }

                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 text-base ${optionStyle}`}
                    >
                      <input
                        type="radio"
                        name={`question${current.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleOptionClick(option)}
                        className={`accent-[#343079] ${
                          selectedOption && isSelected && correct
                            ? "accent-green-600"
                            : selectedOption && isSelected && !correct
                            ? "accent-red-600"
                            : ""
                        }`}
                      />
                      {option}
                    </label>
                  );
                })}
              </div>

              {selectedOption && isCorrect && (
                <p className="text-sm mt-4 text-green-600">
                  <span className="font-semibold">Explanation:</span>{" "}
                  {current.explanation}
                </p>
              )}

              <div className="flex justify-between mt-auto pt-8">
                {currentQuestionIndex > 0 ? (
                  <button
                    onClick={handlePrevious}
                    className="bg-[#ECECFA] text-[#000000] px-6 py-2 rounded font-medium text-sm"
                  >
                    &lsaquo; Previous
                  </button>
                ) : (
                  <div />
                )}

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="bg-[#ECECFA] text-[#000000] px-6 py-2 rounded font-medium text-sm"
                  >
                    Next &rsaquo;
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-[#ECECFA] text-[#343079] px-6 py-2 rounded font-medium text-sm"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* === RESULT MODAL === */}
      {showResultModal && resultSummary && (
        <>
          <style>{`body { overflow: hidden; }`}</style>
          <div className="fixed inset-0 flex items-center justify-center bg-[#00000040] z-50">
            <div className="bg-white rounded-xl w-[90%] max-w-[640px] p-6 space-y-4 text-[#343079] max-h-screen overflow-y-auto">
              <div className="border border-[#EBEAF2] rounded-xl p-4 space-y-1">
                <h2 className="text-[#1B9600] text-lg font-semibold">
                  {resultSummary.topic} Tech Quiz Completed!
                </h2>
                <p className="text-xl font-bold">🎉 Great job!</p>
              </div>

              <div className="border border-[#EBEAF2] rounded-xl p-4 grid grid-cols-2 gap-y-2 text-sm">
                <p>
                  <strong>Topic:</strong>{" "}
                  <span className="capitalize">{resultSummary.topic}</span>
                </p>
                <p>
                  <strong>Time Taken:</strong>{" "}
                  {Math.floor(resultSummary.timeTaken / 60)} min{" "}
                  {resultSummary.timeTaken % 60} sec
                </p>
                <p>
                  <strong>Score:</strong>{" "}
                  <span className="text-[#1B9600]">
                    {resultSummary.score}/{resultSummary.total}
                  </span>
                </p>
                <p>
                  <strong>Performance:</strong>{" "}
                  <span className="text-[#1B9600]">
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

              <div className="border border-[#EBEAF2] rounded-xl p-4 text-sm">
                <p className="font-semibold mb-3">Question Breakdown</p>
                <div className="grid grid-cols-4 font-medium mb-2">
                  <span>Question</span>
                  <span>Your Answer</span>
                  <span>Correct Answer</span>
                  <span>Result</span>
                </div>
                <div className="space-y-1">
                  {resultSummary.breakdown.map((item, idx) => {
                    const optionLabels = ["A", "B", "C", "D"];
                    const getOptionLetter = (answer, options) => {
                      const index = options.findIndex((opt) => opt === answer);
                      return index !== -1 ? optionLabels[index] : "-";
                    };

                    return (
                      <div key={idx} className="grid grid-cols-4">
                        <span>Q{idx + 1}</span>
                        <span>
                          {getOptionLetter(item.yourAnswer, item.options)}
                        </span>
                        <span>
                          {getOptionLetter(item.correctAnswer, item.options)}
                        </span>
                        <span>
                          {item.isCorrect ? (
                            <span className="text-[#1B9600] font-bold">✔</span>
                          ) : (
                            <span className="text-[#F44336] font-bold">✖</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p
                  className="text-right font-medium mt-4 cursor-pointer"
                  onClick={() => {
                    navigate("/review", {
                      state: {
                        questions: questions,
                        summary: resultSummary,
                      },
                    });
                  }}
                >
                  Review All Questions <span className="ml-1">➤</span>
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  className="border border-[#343079] text-[#343079] px-6 py-2 rounded-md"
                  onClick={() => {
                    setShowResultModal(false);
                    setQuizStarted(false);
                    setQuestions([]);
                    document.body.style.overflow = "auto";
                  }}
                >
                  Retake Quiz
                </button>
                <button
                  className="bg-[#343079] text-white px-6 py-2 rounded-md"
                  onClick={() => {
                    setShowResultModal(false);
                    setQuizStarted(false);
                    setQuestions([]);
                    setTopic("");
                    setLevel("");
                    document.body.style.overflow = "auto";
                  }}
                >
                  Start Another Quiz
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TechQuizJSDashboard;
