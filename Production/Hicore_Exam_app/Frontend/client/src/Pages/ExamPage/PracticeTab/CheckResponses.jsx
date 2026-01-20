// CheckResponses.jsx
import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

const looksLikeLatex = (s) => {
  if (!s || typeof s !== "string") return false;
  return /\\|\\frac|_|{|}|\^|\$/.test(s);
};

const renderStringWithMath = (text) => {
  if (!text && text !== 0) return null;
  const s = String(text);

  const looksBlocky =
    /^\s*(\\\[|\\begin|\\frac|\\displaystyle|\$\$)/.test(s) ||
    /\\frac|\\begin|\\\[|\\\]/.test(s) ||
    (s.length < 200 && looksLikeLatex(s) && s.includes("^"));

  if (looksBlocky) {
    try {
      return (
        <div className="my-2">
          <BlockMath>
            {s.replace(/^\$\$|^\s*\$\$|^\$\s*|^\s*\\\[|\\\]\s*$/g, "")}
          </BlockMath>
        </div>
      );
    } catch (err) {
      return (
        <pre className="whitespace-pre-wrap bg-gray-50 rounded p-2 font-mono text-sm leading-5">
          {s}
        </pre>
      );
    }
  }

  if (s.includes("$")) {
    const parts = s.split(/(\$[^$]+\$)/g).filter(Boolean);
    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part, i) =>
          part.startsWith("$") && part.endsWith("$") ? (
            <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
    );
  }

  if (looksLikeLatex(s)) {
    try {
      return <InlineMath>{s}</InlineMath>;
    } catch {
      return <span>{s}</span>;
    }
  }

  return <div className="whitespace-pre-wrap">{s}</div>;
};

const CheckResponses = ({
  score,
  correctAnswers,
  wrongAnswers,
  accuracy,
  quizQuestions = [],
  setShowResponses,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = quizQuestions[currentIndex] || {};

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) setCurrentIndex((i) => i + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const labelForIndex = (idx) => String.fromCharCode(65 + idx);

  const selectedLabel = currentQuestion.selected ?? null;
  const correctLabel = currentQuestion.correctAnswer ?? null;
  const userAnswered = selectedLabel !== null && selectedLabel !== undefined;
  const answeredWrong = userAnswered && selectedLabel !== correctLabel;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-7xl shadow-xl relative overflow-hidden flex flex-col rounded-lg">
        {/* Header */}
        <div className="bg-blue-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <button
              onClick={() => {
                setShowResponses(false);
              }}
              className="text-blue-700 cursor-pointer mb-2 flex items-center font-semibold"
              type="button"
            >
              ← Back to Practice
            </button>

            <h2 className="text-2xl text-blue-800 font-semibold">
              Check Your Responses
            </h2>
            <p className="text-sm text-blue-800 mt-1">
              Review your answers for clarity and improvement
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-3 justify-end">
            <div className="min-w-[110px] bg-green-50 border border-green-100 p-3 rounded-md text-center">
              <div className="text-xs text-gray-600">Score</div>
              <div className="text-lg font-semibold text-green-700">
                {score} / {quizQuestions.length}
              </div>
            </div>

            <div className="min-w-[90px] bg-green-50 border border-green-100 p-3 rounded-md text-center">
              <div className="text-xs text-gray-600">Correct</div>
              <div className="text-lg font-semibold text-green-700">
                {correctAnswers}
              </div>
            </div>

            <div className="min-w-[90px] bg-red-50 border border-red-100 p-3 rounded-md text-center">
              <div className="text-xs text-gray-600">Wrong</div>
              <div className="text-lg font-semibold text-red-600">
                {wrongAnswers}
              </div>
            </div>

            <div className="min-w-[90px] bg-blue-50 border border-blue-100 p-3 rounded-md text-center">
              <div className="text-xs text-gray-600">Accuracy</div>
              <div className="text-lg font-semibold text-blue-700">
                {accuracy}%
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {/* Review buttons (question index quick jump) */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-blue-900 mb-3">
              Review the Answers
            </div>
            <div className="flex flex-wrap gap-2">
              {quizQuestions.map((q, idx) => {
                const isSelected = q.selected === q.correctAnswer;
                const btnClass =
                  idx === currentIndex
                    ? "bg-blue-600 text-white border-blue-700"
                    : isSelected
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-red-50 text-red-700 border-red-300";

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`${btnClass} w-9 h-9 flex items-center justify-center rounded-md text-sm border`}
                    type="button"
                    aria-label={`Jump to question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Card */}
          <div className="border border-blue-100 rounded-xl p-6 shadow-sm bg-white">
            <div className="mb-4">
              <p className="font-semibold text-blue-900 whitespace-pre-wrap">
                {currentIndex + 1}.{" "}
                <span className="font-normal">
                  {renderStringWithMath(currentQuestion.question || "")}
                </span>
              </p>
            </div>

            {/* ------------------------
                1) OPTIONS LIST FIRST (inline)
               ------------------------ */}
            <div className="space-y-3 mb-4">
              {(currentQuestion.options || []).map((opt, idx) => {
                const label = labelForIndex(idx);
                const isCorrect = label === currentQuestion.correctAnswer;
                const isSelected = label === currentQuestion.selected;

                return (
                  <div
                    key={idx}
                    className={`rounded-lg border px-4 py-3 text-sm flex items-center gap-3 ${
                      isSelected && !isCorrect
                        ? "border-red-400 bg-red-50 text-red-700"
                        : isCorrect
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {/* plain label (no background) */}
                    <div className="w-6 flex-shrink-0 font-semibold text-[#1142C3]">
                      {label}.
                    </div>

                    {/* option content (inline when possible) */}
                    <div className="flex-1">{renderStringWithMath(opt)}</div>
                  </div>
                );
              })}
            </div>

            {/* ---------------------------------------------------
                2) SHOW CORRECT ANSWER PANEL (below options)
               --------------------------------------------------- */}
            <div className="mb-4">
              {userAnswered ? (
                answeredWrong ? (
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100 text-yellow-900">
                    <div className="text-sm font-semibold mb-1">Result</div>
                    <div className="text-sm mb-1">
                      Your answer:
                      <div className="font-medium mt-1 ml-4">
                        {selectedLabel}
                      </div>
                    </div>
                    <div className="text-sm text-green-700 mt-2">
                      Correct answer:
                      <div className="font-medium mt-1 ml-4">
                        {correctLabel}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-green-700">
                    <div className="text-sm font-semibold">Correct</div>
                    <div className="text-sm">
                      You selected the correct answer.
                    </div>
                  </div>
                )
              ) : (
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100 text-yellow-900">
                  <div className="text-sm font-semibold mb-1">
                    No Answer Selected
                  </div>
                  <div className="text-sm mb-1">
                    Correct answer:
                    <div className="font-medium mt-1 ml-4">{correctLabel}</div>
                  </div>
                </div>
              )}
            </div>

            {/* ------------------------
                3) EXPLANATION BELOW
               ------------------------ */}
            {currentQuestion.explanation ? (
              <div className="mt-2 bg-blue-50 border border-blue-100 text-blue-800 text-sm p-4 rounded-lg">
                <div className="font-semibold mb-2">Explanation</div>
                <div>{renderStringWithMath(currentQuestion.explanation)}</div>
              </div>
            ) : (
              answeredWrong && (
                <div className="mt-2 bg-yellow-50 border border-yellow-100 text-yellow-900 text-sm p-4 rounded-lg">
                  <div className="font-semibold mb-1">
                    No explanation provided
                  </div>
                  <div className="text-sm">
                    An explanation for the correct answer isn't available.
                  </div>
                </div>
              )
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 text-sm font-medium">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`${
                  currentIndex === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-700"
                }`}
                type="button"
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === quizQuestions.length - 1}
                className={`${
                  currentIndex === quizQuestions.length - 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-700"
                }`}
                type="button"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckResponses;
