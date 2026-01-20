// CheckResponses.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";


const API_BASE = import.meta.env.VITE_API_BASE || "/api";
/**
 * CheckResponses modal component
 * Props:
 * - score, correctAnswers, wrongAnswers, accuracy
 * - quizQuestions: array of question objects:
 *   {
 *     question: string,
 *     options: string[],
 *     selected: "A" | "B" | null,
 *     correctAnswer: "A" | "B",
 *     explanation: string
 *   }
 * - setShowResponses: function to close modal
 * - onAnalyse?: optional callback invoked when Analyse Report clicked
 * - unit?: optional unit name to show in header and persist with report
 * - timeTakenSeconds?: optional number of seconds taken for the test (from UnitTest)
 * - timeTakenFormatted?: optional human formatted time string (MM:SS)
 *
 * Behaviour:
 * - Shows navigation between questions.
 * - When currentIndex is last question, shows "Analyse Report" button (in header & below nav).
 * - If onAnalyse provided, it will be called (and receives time fields). Otherwise default behaviour:
 *   -> Save report to sessionStorage under "lastAnalyseReport" (includes time fields)
 *   -> Navigate to `/course/${exam}/roadmap?tab=Analyze` (or fallback to `/course/neet/roadmap?tab=Analyze`)
 *   -> Close modal
 */

const isLikelyLatex = (s) => {
  if (!s || typeof s !== "string") return false;
  return /\\|\\frac|_|{|}|\^/.test(s);
};

const RenderTextOrMath = ({ text }) => {
  if (!text && text !== "") return null;
  if (typeof text !== "string") return <span>{String(text)}</span>;

  if (isLikelyLatex(text) && !text.includes("$")) {
    return (
      <div className="my-1">
        <BlockMath>{String(text)}</BlockMath>
      </div>
    );
  }

  if (text.includes("$")) {
    const parts = text.split(/(\$[^$]+\$)/g).filter(Boolean);
    return (
      <span>
        {parts.map((part, i) => {
          if (part.startsWith("$") && part.endsWith("$")) {
            const latex = part.slice(1, -1);
            return <InlineMath key={i}>{latex}</InlineMath>;
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  }

  return <span>{text}</span>;
};

const CheckResponses = ({
  score,
  correctAnswers,
  wrongAnswers,
  accuracy,
  quizQuestions = [],
  setShowResponses,
  subject, // ✅ ADD THIS
  onAnalyse,
  unit,
  timeTakenSeconds = null,
  timeTakenFormatted = null,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = quizQuestions[currentIndex] || {};
  const navigate = useNavigate();
  const { examName } = useParams();

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) setCurrentIndex((i) => i + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const labelToIndex = (label) => {
    if (!label || typeof label !== "string") return -1;
    const code = label.charCodeAt(0);
    if (code < 65 || code > 90) return -1;
    return code - 65;
  };

  const getOptionTextByLabel = (q = {}, label) => {
    const idx = labelToIndex(label);
    if (!Array.isArray(q.options) || idx < 0 || idx >= q.options.length)
      return null;
    return q.options[idx];
  };

  const selectedLabel = currentQuestion.selected ?? null;
  const correctLabel = currentQuestion.correctAnswer ?? null;
  const selectedText = getOptionTextByLabel(currentQuestion, selectedLabel);
  const correctText = getOptionTextByLabel(currentQuestion, correctLabel);

  const isLast =
    quizQuestions.length > 0 && currentIndex === quizQuestions.length - 1;

  // Build analyse payload from what we have here (now includes time fields)
  const buildAnalysePayload = () => {
    const totalQuestions = quizQuestions.length || 0;
    const attempted = quizQuestions.filter(
      (q) => q.selected && q.selected !== ""
    ).length;
    const correct = correctAnswers ?? 0;
    const wrong = wrongAnswers ?? totalQuestions - correct;
    const overallScore = `${score ?? 0}/${totalQuestions}`;
    const accString =
      typeof accuracy === "number" ? `${accuracy}%` : String(accuracy || "0%");

    return {
      totalQuestions,
      attempted,
      correct,
      wrong,
      overallScore,
      accuracy: accString,
      percentage: accString,
      unit: unit ?? null,
      timeTakenSeconds:
        typeof timeTakenSeconds === "number" ? timeTakenSeconds : null,
      timeTakenFormatted: timeTakenFormatted ?? null,
      timestamp: Date.now(),
    };
  };

  if (!subject || typeof subject !== "string") {
    console.warn("subject_name invalid, using fallback", subject);
  }


 const getUserId = () => {
   const userId = localStorage.getItem("userId");
   return userId ? Number(userId) : null;
 };

 const handleAnalyseClick = async () => {
   const userId = getUserId();

   if (!userId) {
     alert("Session expired. Please login again.");
     return;
   }

   const payload = {
     user_id: userId,
     exam_id: examName || "neet",
     subject_name: String(subject || "Unknown"),
     unit_name: String(unit || ""),
     total_questions: quizQuestions.length,
     attempted: quizQuestions.filter((q) => q.selected).length,
     correct: correctAnswers,
     wrong: wrongAnswers,
     timeTakenSeconds: timeTakenSeconds ?? 0,
   };

   console.log("Analyse payload:", payload);

   try {
     const res = await fetch(`${API_BASE}/analyzer/unit`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(payload),
     });

     if (!res.ok) {
       const err = await res.text();
       throw new Error(err);
     }

     sessionStorage.setItem(
       "lastAnalyseReport",
       JSON.stringify(buildAnalysePayload())
     );
   } catch (err) {
     console.error("Analyse API failed:", err);

     // Fallback still guarantees Analyze tab works
     sessionStorage.setItem(
       "lastAnalyseReport",
       JSON.stringify(buildAnalysePayload())
     );
   }

   setShowResponses(false);
   navigate(`/course/${examName || "neet"}/roadmap?tab=Analyze`);
 };



  const hasQuestions = Array.isArray(quizQuestions) && quizQuestions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-7xl shadow-xl relative overflow-hidden flex flex-col h-full md:h-auto rounded-lg">
        {/* Header */}
        <div className="bg-blue-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* BACK BUTTON: ONLY CLOSES THE MODAL NOW (no navigate call) */}
            <button
              onClick={() => {
                setShowResponses(false);
              }}
              className="text-blue-700 cursor-pointer mb-2 flex items-center font-semibold"
              type="button"
            >
              ← Back to <span className="ml-1 font-medium">Test</span>
            </button>

            <h2 className="text-2xl text-blue-800 font-semibold flex items-center gap-3">
              Check Your Responses
              {unit ? (
                <span className="text-sm text-blue-600 font-medium">
                  — {unit}
                </span>
              ) : null}
            </h2>
            <p className="text-sm text-blue-800 mt-1">
              Review your answers for clarity and improvement
            </p>
          </div>

          {/* Analyse Report button visible in header as well */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyseClick}
              type="button"
              className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium ${
                !hasQuestions ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Analyse Report"
              disabled={!hasQuestions}
            >
              Analyse Report
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {/* Review buttons (quick jump) */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-blue-900 mb-3">
              Review the Answers
            </div>
            <div className="flex flex-wrap gap-2">
              {quizQuestions.map((q, idx) => {
                const isCorrect = q.selected === q.correctAnswer;
                const btnClass =
                  idx === currentIndex
                    ? "bg-blue-600 text-white border-blue-700"
                    : isCorrect
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

          {/* Question Display */}
          <div className="border border-blue-100 rounded-xl p-6 shadow-sm bg-white">
            <p className="font-semibold text-blue-900 mb-4 whitespace-pre-wrap">
              {currentIndex + 1}.{" "}
              {currentQuestion.question ? (
                <span className="whitespace-pre-wrap">
                  <RenderTextOrMath text={currentQuestion.question} />
                </span>
              ) : (
                "—"
              )}
            </p>

            <div className="space-y-2">
              {Array.isArray(currentQuestion.options) &&
              currentQuestion.options.length > 0 ? (
                currentQuestion.options.map((opt, idx) => {
                  const label = String.fromCharCode(65 + idx);
                  const isCorrect = label === currentQuestion.correctAnswer;
                  const isSelected = label === currentQuestion.selected;

                  return (
                    <div
                      key={idx}
                      className={`rounded-lg border px-4 py-2 text-sm ${
                        isSelected && !isCorrect
                          ? "border-red-400 bg-red-50 text-red-700"
                          : isCorrect
                          ? "border-green-400 bg-green-50 text-green-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      aria-live="polite"
                    >
                      <strong className="mr-2">{label}.</strong>
                      <span className="inline">
                        <RenderTextOrMath text={String(opt)} />
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500">No options available</div>
              )}
            </div>

            {/* When user's answer is wrong show both user's answer and correct answer */}
            <div className="mt-4">
              {selectedLabel === null || selectedLabel === undefined ? (
                <div className="text-sm text-gray-600">
                  You did not select an answer for this question.
                </div>
              ) : selectedLabel === correctLabel ? (
                <div className="text-sm text-green-700 font-medium">
                  You answered correctly.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-md">
                    <div className="font-semibold">Your answer</div>
                    <div className="mt-1">
                      <strong className="mr-2">{selectedLabel}.</strong>
                      <span>
                        <RenderTextOrMath text={String(selectedText ?? "—")} />
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-100 text-green-700 text-sm p-3 rounded-md">
                    <div className="font-semibold">Correct answer</div>
                    <div className="mt-1">
                      <strong className="mr-2">{correctLabel}.</strong>
                      <span>
                        <RenderTextOrMath text={String(correctText ?? "—")} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation */}
            {currentQuestion.explanation && (
              <div className="mt-4 bg-green-50 border border-green-100 text-green-700 text-sm p-4 rounded-lg">
                <span className="font-semibold">Explanation: </span>
                <div className="mt-2">
                  <RenderTextOrMath
                    text={String(currentQuestion.explanation)}
                  />
                </div>
              </div>
            )}

            {/* Navigation (and Analyse button below nav on last) */}
            <div className="flex justify-between mt-6 text-sm font-medium items-center">
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

              <div className="flex items-center gap-4">
                {/* Analyse shown here too for visibility at bottom when last */}
                {isLast && (
                  <button
                    onClick={handleAnalyseClick}
                    type="button"
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
                    aria-label="Analyse Report"
                  >
                    Analyse Report
                  </button>
                )}

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
    </div>
  );
};

export default CheckResponses;
