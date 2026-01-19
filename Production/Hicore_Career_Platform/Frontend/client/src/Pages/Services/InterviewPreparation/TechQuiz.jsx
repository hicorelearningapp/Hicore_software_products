import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import topicIcon from "../../../assets/InterviewPreparation/topic.png";
import difficultyIcon from "../../../assets/InterviewPreparation/difficulty.png";
import questionIcon from "../../../assets/InterviewPreparation/questions.png";
import timeIcon from "../../../assets/InterviewPreparation/time.png";
import modeIcon from "../../../assets/InterviewPreparation/mode.png";
import emptyQuizIcon from "../../../assets/InterviewPreparation/empty-quiz.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const TechQuiz = () => {
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
      case "1 min/question": return 60;
      case "Total 10 mins": return 600;
      case "60 min": return 3600;
      default: return 60;
    }
  };

  const handleStartQuiz = async () => {
  setLoading(true);

  try {
    const payload = {
      topic: topic.toLowerCase(),
      level: level.toLowerCase(),
      number_of_questions: parseInt(count),
      mode: mode.toLowerCase(),
    };

    // ✅ Build API URL using BASE
    const url = `${API_BASE}/ai/quiz/generate`;

    const response = await axios.post(url, payload);

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
  } finally {
    setLoading(false);
  }
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
      performance: score >= questions.length * 0.8 ? "Above Average" : "Needs Improvement",
      breakdown: questions.map((q, i) => ({
  question: `Q${i + 1}`,
  yourAnswer: q.selected || "-",
  correctAnswer: q.answer,
  isCorrect: q.answer === q.selected,
  options: q.options 
}))
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
<div className="bg-white rounded-xl border border-[#E0E0E0] shadow flex flex-col md:flex-row overflow-hidden h-[650px]">
      {/* Left Filters */}
      <div className="w-full md:w-[300px] border-r border-gray-200 p-6">
        {/* Topic Input */}
        <div className="mb-6">
          <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
            <img src={topicIcon} alt="Topic" className="w-5 h-5" />
            Enter Your Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
            className="w-50 px-3 py-2 border border-[#CBCDCF] rounded text-sm ml-[26px] focus:outline-none focus:ring-0 focus:border-[#343079]"
          />
        </div>

        {/* Difficulty Level */}
        <div className="mb-6">
          <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
            <img src={difficultyIcon} alt="Difficulty" className="w-5 h-5" />
            Select Difficulty Level
          </label>
          <div className="flex flex-col gap-2 text-sm text-[#343079] pl-[26px]">
            {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
              <label className="flex items-center gap-2" key={lvl}>
                <input
                  type="radio"
                  name="level"
                  value={lvl}
                  checked={level === lvl}
                  onChange={() => setLevel(lvl)}
                  className="accent-[#343079]"
                />
                {lvl}
              </label>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
       <div className="mb-6">
        <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
       <img src={questionIcon} alt="Questions" className="w-5 h-5" />
         Number of Questions
       </label>

  <div className="flex flex-col gap-2 text-sm text-[#343079] pl-[26px]">
    {[5, 10, 15, 20].map((num) => (
      <label
        className={`flex items-center gap-2 ${
          num !== 5 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        key={num}
      >
        <input
          type="radio"
          name="count"
          value={num}
          checked={count === num}
          onChange={() => setCount(num)}
          disabled={num !== 5}   // ✅ Only 5 is enabled
          className="accent-[#343079]"
        />
        {num}
      </label>
    ))}
  </div>
</div>


        {/* Time Limit */}
        {/*<div className="mb-6">
          <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
            <img src={timeIcon} alt="Time" className="w-5 h-5" />
            Time Limit
          </label>
          <div className="flex flex-col gap-2 text-sm text-[#343079] pl-[26px]">
            {["1 min/question", "Total 10 mins", "60 min"].map((time) => (
              <label className="flex items-center gap-2" key={time}>
                <input
                  type="radio"
                  name="time"
                  value={time}
                  checked={timeSetting === time}
                  onChange={() => setTimeSetting(time)}
                  className="accent-[#343079]"
                />
                {time}
              </label>
            ))}
          </div>
        </div>*/}

        {/* Mode */}
        <div className="mb-6">
          <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
            <img src={modeIcon} alt="Mode" className="w-5 h-5" />
            Mode
          </label>
          <div className="flex flex-col gap-2 text-sm text-[#343079] pl-[26px]">
            {["Practice", "Challenge"].map((m) => (
              <label className="flex items-center gap-2" key={m}>
                <input
                  type="radio"
                  name="mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                  className="accent-[#343079]"
                />
                {m}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Quiz Area */}
      <div className="flex-1 flex flex-col text-[#343079] px-6 py-8 min-h-[400px]">
        {!quizStarted ? (
          // Empty quiz screen (same as before)
          <div className="flex flex-col justify-center items-center text-center h-full">
            <img src={emptyQuizIcon} alt="No Quiz" className="w-[70px] h-[70px] mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2 text-[#AEADBE]">No Quiz Attempted Yet</h3>
            <p className="text-sm mb-4 max-w-[80%] text-[#A0A0C0]">
              You haven’t taken any quizzes yet. Practice and track your performance instantly.
            </p>
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="bg-[#343079] text-white px-6 py-2 rounded font-medium flex items-center justify-center min-w-[200px]"
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
                    else if (isSelected && !correct) optionStyle = "text-red-600 font-semibold";
                  }

                  return (
                    <label key={idx} className={`flex items-center gap-2 text-base ${optionStyle}`}>
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
                  <span className="font-semibold">Explanation:</span> {current.explanation}
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
                ) : <div />}

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

    {showResultModal && resultSummary && (
  <>
    {/* Background Scroll Lock */}
    <style>{`body { overflow: hidden; }`}</style>

    {/* Modal Overlay */}
    <div className="fixed inset-0 flex items-center justify-center bg-[#00000040] z-50">
      <div className="bg-white rounded-xl w-[90%] max-w-[640px] p-6 space-y-4 text-[#343079] max-h-screen overflow-y-auto">

        {/* Header Box */}
        <div className="border border-[#EBEAF2] rounded-xl p-4 space-y-1">
          <h2 className="text-[#1B9600] text-lg font-semibold">
            {resultSummary.topic} Tech Quiz Completed!
          </h2>
          <p className="text-xl font-bold">🎉 Great job!</p>
        </div>

        {/* Info Summary Box */}
        <div className="border border-[#EBEAF2] rounded-xl p-4 grid grid-cols-2 gap-y-2 text-sm">
          <p><strong>Topic:</strong> <span className="capitalize">{resultSummary.topic}</span></p>
          <p><strong>Time Taken:</strong> {Math.floor(resultSummary.timeTaken / 60)} min {resultSummary.timeTaken % 60} sec</p>
          <p>
            <strong>Score:</strong> <span className="text-[#1B9600]">{resultSummary.score}/{resultSummary.total}</span>
          </p>
          <p>
            <strong>Performance:</strong> <span className="text-[#1B9600]">{resultSummary.performance}</span>
          </p>
          <p>
            <strong>Accuracy:</strong> <span className="text-[#1B9600]">{Math.round((resultSummary.score / resultSummary.total) * 100)}%</span>
          </p>
        </div>

        {/* Question Breakdown Box */}
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
                const index = options.findIndex(opt => opt === answer);
                return index !== -1 ? optionLabels[index] : "-";
              };

              return (
                <div key={idx} className="grid grid-cols-4">
                  <span>Q{idx + 1}</span>
                  <span>{getOptionLetter(item.yourAnswer, item.options)}</span>
                  <span>{getOptionLetter(item.correctAnswer, item.options)}</span>
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
                  summary: resultSummary
                }
              });
            }}
          >
            Review All Questions <span className="ml-1">➤</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-2">
          <button
            className="border border-[#343079] text-[#343079] px-6 py-2 rounded-md"
            onClick={() => {
              setShowResultModal(false);
              setQuizStarted(false);
              setQuestions([]);
              document.body.style.overflow = "auto"; // unlock scroll
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
              document.body.style.overflow = "auto"; // unlock scroll
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

export default TechQuiz;