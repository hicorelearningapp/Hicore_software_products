import React, { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import beginnerData from "./beginnerData.json";

const BeginnerQuestions = () => {
  const [step, setStep] = useState(1); // 1: Level select, 2: Quiz, 3: Result, 4: Review
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour timer

  // 🎯 Handle Level Selection
  const handleLevelSelect = (level) => {
    const selectedData = beginnerData[level];
    if (!selectedData || selectedData.length === 0) {
      alert("No questions found for this level!");
      return;
    }

    const shuffled = [...selectedData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 25);

    setDifficulty(level);
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setScore(0);
    setStep(2);
  };

  // ⏱️ Timer logic
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const currentQuestion = questions[currentIndex];

  // 🧠 Handle Answer Selection
  const handleSelect = (label) => {
    const updated = [...answers];
    updated[currentIndex] = label;
    setAnswers(updated);
  };

  // ➡️ Next / ⬅️ Previous
  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
    else {
      calculateScore();
      setStep(3);
    }
  };
  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  // 🧮 Calculate score
  const calculateScore = () => {
    let count = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) count++;
    });
    setScore(count);
  };

  // 🔁 Restart
  const restartQuiz = () => {
    setStep(1);
    setDifficulty("");
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(60 * 60);
  };

  const handleReview = () => setStep(4);

  // ⏱️ Format time
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 🧩 Render text/formula/image/video
  const renderItem = (item, idx) => {
    if (!item) return null;
    switch (item.type) {
      case "formula":
        return <BlockMath key={idx} math={item.value} />;
      case "image":
        return (
          <img
            key={idx}
            src={item.value}
            alt="Visual"
            className="max-h-48 object-contain rounded-lg my-3 mx-auto"
          />
        );
      case "video":
        return (
          <video
            key={idx}
            controls
            className="w-full rounded-lg my-3 border border-gray-200"
          >
            <source src={item.value} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        );
      default:
        return (
          <p key={idx} className="leading-relaxed">
            {item.value}
          </p>
        );
    }
  };

  // ✅ Render array-based content (for options or questions)
  const renderContent = (data) => {
    if (!data) return null;
    if (Array.isArray(data)) return data.map((v, i) => renderItem(v, i));
    if (Array.isArray(data.items))
      return data.items.map((v, i) => renderItem(v, i));
    return renderItem(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6 py-10 font-sans">
      {/* STEP 1: LEVEL SELECTION */}
      {step === 1 && (
        <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-3xl w-full">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Validate Your Knowledge in Physics
          </h2>
          <p className="text-gray-500 mb-10">
            Select your level and attempt the certification quiz.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: "Beginner", desc: "Just starting your learning journey" },
              { name: "Intermediate", desc: "Build on your existing skills" },
              { name: "Advanced", desc: "Master complex concepts" },
            ].map((lvl) => (
              <div
                key={lvl.name}
                onClick={() => handleLevelSelect(lvl.name)}
                className="border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  {lvl.name}
                </h3>
                <p className="text-gray-500 text-sm">{lvl.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: QUIZ */}
      {step === 2 && currentQuestion && (
        <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-blue-900">
              {difficulty} Quiz
            </h2>
            <span className="text-sm text-blue-900 font-semibold">
              ⏱ {formatTime(timeLeft)}
            </span>
          </div>

          {/* QUESTION SECTION */}
          <div className="mb-6 text-gray-800 text-lg leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="font-semibold">{currentIndex + 1}.</span>
              <div className="flex-1">
                <div className="flex flex-col gap-2">
                  {renderContent(currentQuestion.question)}
                </div>
              </div>
            </div>
          </div>

          {/* OPTIONS SECTION */}
          <div className="space-y-3 mt-4">
            {currentQuestion.options.map((opt, i) => (
              <label
                key={i}
                className={`block cursor-pointer transition-all rounded-lg p-3 ${
                  answers[currentIndex] === opt.label
                    ? "bg-blue-50 text-blue-900 font-semibold"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Radio button */}
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    className="accent-blue-900 h-4 w-4"
                    checked={answers[currentIndex] === opt.label}
                    onChange={() => handleSelect(opt.label)}
                  />

                  {/* Option label and content inline */}
                  <div className="flex flex-wrap items-center gap-2 text-gray-800">
                    <strong>{opt.label}.</strong>
                    {/* Inline rendering for each item */}
                    {Array.isArray(opt.items)
                      ? opt.items.map((item, j) => (
                          <span key={j} className="inline-flex items-center">
                            {item.type === "formula" ? (
                              <span className="inline-block scale-90">
                                <BlockMath math={item.value} />
                              </span>
                            ) : item.type === "image" ? (
                              <img
                                src={item.value}
                                alt="Option Visual"
                                className="inline-block h-8 w-auto object-contain"
                              />
                            ) : item.type === "video" ? (
                              <video
                                controls
                                className="inline-block h-10 w-auto rounded border border-gray-300"
                              >
                                <source src={item.value} type="video/mp4" />
                              </video>
                            ) : (
                              <span>{item.value}</span>
                            )}
                          </span>
                        ))
                      : renderContent(opt)}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* NAVIGATION */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`py-2 px-6 rounded-lg font-semibold ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-blue-900"
              }`}
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              className="text-blue-900 bg-gray-200 font-semibold py-2 px-6 rounded-lg"
            >
              {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next →"}
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-6 h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-900 rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-500 mt-2">
            {currentIndex + 1}/{questions.length}
          </p>
        </div>
      )}

      {/* STEP 3: RESULTS */}
      {step === 3 && (
        <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-3xl">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            🎉 Physics Quiz Completed!
          </h2>
          <p className="text-gray-600 mb-4">Great job!</p>
          <div className="text-left mb-6">
            <p>
              <strong>Difficulty:</strong> {difficulty}
            </p>
            <p>
              <strong>Score:</strong> {score}/{questions.length}
            </p>
            <p>
              <strong>Accuracy:</strong>{" "}
              {((score / questions.length) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleReview}
              className="bg-blue-900 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
            >
              Review All Questions →
            </button>
            <button
              onClick={restartQuiz}
              className="bg-gray-100 hover:bg-gray-200 text-blue-900 py-2 px-6 rounded-lg"
            >
              Restart Quiz
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW */}
      {step === 4 && (
        <div className="bg-white shadow-lg rounded-2xl p-10 max-w-6xl w-full">
          <button
            onClick={() => setStep(3)}
            className="text-blue-900 font-semibold mb-6"
          >
            ← Back
          </button>

          <h2 className="text-xl font-bold text-blue-900 mb-6">
            Review Answers
          </h2>

          {questions.map((q, idx) => {
            const selected = answers[idx];
            const correct = q.answer;
            const isCorrect = selected === correct;
            return (
              <div
                key={idx}
                className={`mb-6 border-b border-gray-200 pb-4 rounded-lg p-4 ${
                  isCorrect ? "" : ""
                }`}
              >
                <p className="font-semibold text-gray-800 mb-2">{idx + 1}. </p>
                {renderContent(q.question)}

                <div className="ml-4 space-y-2 mt-3">
                  {q.options.map((opt) => {
                    const isUserChoice = opt.label === selected;
                    const isCorrectChoice = opt.label === correct;
                    return (
                      <div
                        key={opt.label}
                        className={`flex flex-col rounded-md p-2 ${
                          isCorrectChoice
                            ? "bg-green-100 text-green-700 font-semibold border border-green-300"
                            : isUserChoice && !isCorrect
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="flex gap-2">
                          <strong>{opt.label}.</strong> {renderContent(opt)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-3 text-sm font-medium">
                  {isCorrect ? (
                    <span className="text-green-700">
                      Your answer is correct!
                    </span>
                  ) : (
                    <span className="text-red-700">
                      Incorrect.{" "}
                      <span className="text-green-700">
                        Correct answer: <strong>{correct}</strong>
                      </span>
                    </span>
                  )}
                </p>

                {q.explanation && q.explanation[0]?.value && (
                  <p className="text-gray-700 text-sm mt-2">
                    <strong>Explanation:</strong> {q.explanation[0].value}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BeginnerQuestions;
