// UnitTest.jsx
import React, { useEffect, useRef, useState } from "react";
import { BiCheckCircle } from "react-icons/bi";
import practiceIcon from "../../../assets/Learn/book.png";
import CheckResponses from "./CheckResponses";

// KaTeX
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

/**
 * UnitTest (KaTeX-enabled) with:
 * - Slider for number of questions
 * - Difficulty: Mixed, Easy, Medium, Hard
 * - Timer enable toggle (1 minute per question)
 * - Shuffle option and Start button
 */

const RenderBlock = ({ block }) => {
  if (!block) return null;
  const { type, value } = block;

  if (type === "formula") {
    try {
      return (
        <div className="my-2">
          <BlockMath>{String(value)}</BlockMath>
        </div>
      );
    } catch (e) {
      return (
        <pre
          className="whitespace-pre-wrap bg-gray-50 rounded p-3 font-mono text-sm leading-5"
          aria-hidden="true"
        >
          {String(value)}
        </pre>
      );
    }
  }

  if (typeof value === "string" && value.includes("$")) {
    const parts = value.split(/(\$[^$]+\$)/g).filter(Boolean);
    return (
      <div className="text-[16px] text-[#1142C3] leading-[22px]">
        {parts.map((part, idx) => {
          if (part.startsWith("$") && part.endsWith("$")) {
            const inner = part.slice(1, -1);
            try {
              return <InlineMath key={idx}>{inner}</InlineMath>;
            } catch {
              return <span key={idx}>{part}</span>;
            }
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    );
  }

  return (
    <div className="text-[16px] text-[#1142C3] leading-[22px]">{value}</div>
  );
};

const RenderContentArray = ({ blocks = [] }) => {
  return (
    <>
      {blocks.map((b, i) => (
        <div key={i} className={i === 0 ? "mb-0" : "mt-2"}>
          <RenderBlock block={b} />
        </div>
      ))}
    </>
  );
};

const RenderOptionItems = ({ items = [] }) => {
  return (
    <div className="flex flex-col gap-1">
      {items.map((it, i) => {
        if (it.type === "formula") {
          try {
            return (
              <div
                key={i}
                className="my-0 -mt-1 transform scale-90 origin-left"
                aria-hidden="true"
              >
                <BlockMath>{String(it.value)}</BlockMath>
              </div>
            );
          } catch {
            return (
              <pre
                key={i}
                className="whitespace-pre-wrap bg-gray-50 rounded p-1 font-mono text-sm leading-5"
              >
                {String(it.value)}
              </pre>
            );
          }
        }
        if (typeof it.value === "string" && it.value.includes("$")) {
          const parts = it.value.split(/(\$[^$]+\$)/g).filter(Boolean);
          return (
            <div key={i} className="text-[15px] text-blue-900 leading-[20px]">
              {parts.map((part, idx) =>
                part.startsWith("$") && part.endsWith("$") ? (
                  <InlineMath key={idx}>{part.slice(1, -1)}</InlineMath>
                ) : (
                  <span key={idx}>{part}</span>
                )
              )}
            </div>
          );
        }
        return (
          <div key={i} className="text-[15px] text-blue-900 leading-[20px]">
            {it.value}
          </div>
        );
      })}
    </div>
  );
};

// Normalize difficulty strings into one of: easy, medium, hard, unknown
const normalizeDifficulty = (raw) => {
  if (!raw) return "unknown";
  const s = String(raw).toLowerCase();
  if (s.includes("easy") || s.includes("begin")) return "easy";
  if (s.includes("hard") || s.includes("adv") || s.includes("advanced"))
    return "hard";
  if (s.includes("med") || s.includes("intermediate")) return "medium";
  // if it's a single letter or number mapping, try common cases
  if (s === "e" || s === "1") return "easy";
  if (s === "m" || s === "2") return "medium";
  if (s === "h" || s === "3") return "hard";
  return "unknown";
};

// helper: get difficulty from the question object (looks into question blocks)
const extractDifficulty = (q) => {
  if (!q || !Array.isArray(q.question)) return "unknown";
  for (const b of q.question) {
    if (b && b.difficulty) return normalizeDifficulty(b.difficulty);
  }
  // also check top-level q.difficulty if present
  if (q.difficulty) return normalizeDifficulty(q.difficulty);
  return "unknown";
};

// helper: shuffle array (Fisher-Yates)
const shuffleArray = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const UnitTest = ({ unitName, practiceSetName, questions = [] }) => {
  // Setup state (pre-quiz)
  const availableCount = Math.max(1, (questions || []).length);
  const [setupCount, setSetupCount] = useState(Math.min(5, availableCount));
  const [setupDifficulty, setSetupDifficulty] = useState("Mixed"); // Mixed = any
  const [shuffleOnStart, setShuffleOnStart] = useState(true);
  const [timerEnabled, setTimerEnabled] = useState(false);

  // Quiz state
  const [answers, setAnswers] = useState({}); // { [qId]: "A" }
  const [submitted, setSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResponses, setShowResponses] = useState(false);

  // whether quiz has started and the selected questions subset
  const [started, setStarted] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef(null);

  // Reset when user switches to a new set
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
    setShowResponses(false);

    // Reset setup and started state when switching sets
    setStarted(false);
    setSelectedQuestions([]);
    setSetupCount(Math.min(5, availableCount));
    setSetupDifficulty("Mixed");
    setTimerEnabled(false);
    setShuffleOnStart(true);

    // cleanup interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSecondsLeft(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitName, practiceSetName, questions]);

  // Use the active question list (selectedQuestions when started, else questions prop)
  const activeQuestions = started ? selectedQuestions : [];

  const handleOptionSelect = (qId, optionLabel) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionLabel }));
  };

  const handleSubmit = () => {
    // stop timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSubmitted(true);
  };

  const totalCorrect = activeQuestions.filter(
    (q) => answers[q.id] === q.answer
  ).length;
  const total = activeQuestions.length;

  const goNext = () => {
    if (currentIndex < activeQuestions.length - 1)
      setCurrentIndex((i) => i + 1);
  };
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  // Build simplified quizQuestions for CheckResponses modal
  const buildQuizQuestionsForReview = () => {
    return activeQuestions.map((q) => {
      const questionText = (q.question || [])
        .map((b) => String(b.value))
        .join("\n\n");
      const optionStrings = (q.options || []).map((opt) =>
        opt.items.map((it) => String(it.value)).join(" ")
      );
      const selectedLabel = answers[q.id] ?? null;
      return {
        question: questionText,
        options: optionStrings,
        selected: selectedLabel,
        correctAnswer: q.answer,
        explanation: (q.explanation || [])
          .map((b) => String(b.value))
          .join("\n\n"),
      };
    });
  };

  // Start quiz: filter questions by difficulty and pick requested number
  const handleStart = () => {
    const desired = Math.max(1, Math.floor(Number(setupCount) || 1));
    // find matching questions
    let pool = (questions || []).slice();

    // Mixed = no filter (pick any)
    if (setupDifficulty && setupDifficulty !== "Mixed") {
      const wanted = String(setupDifficulty).toLowerCase();
      pool = pool.filter((q) => {
        const d = extractDifficulty(q); // normalized lower-case like 'easy', 'medium', 'hard' or 'unknown'
        return d === wanted;
      });
    }

    if (pool.length === 0) {
      // nothing matched, set started and show empty state
      setSelectedQuestions([]);
      setStarted(true);
      setAnswers({});
      setSubmitted(false);
      setCurrentIndex(0);
      return;
    }

    // shuffle or not, then slice
    const finalPool = shuffleOnStart ? shuffleArray(pool) : pool;
    const picked = finalPool.slice(0, Math.min(desired, finalPool.length));

    setSelectedQuestions(picked);
    setAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
    setStarted(true);

    // setup timer: 1 minute per question if timer enabled
    if (timerEnabled) {
      const totalSeconds = picked.length * 60;
      setSecondsLeft(totalSeconds);

      // clear old interval if any
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // time up -> auto submit
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setTimeout(() => {
              // ensure we submit after React state updates
              handleSubmit();
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // ensure timer cleared if previously running
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setSecondsLeft(0);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // If quiz hasn't started, show setup panel
  if (!started) {
    return (
      <div className="w-full bg-white p-6">
        <div className="flex border-b pb-6 border-blue-300 items-center gap-3 mb-6">
          <img
            src={practiceIcon}
            alt="quiz"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="text-[20px] font-semibold text-[#1142C3] leading-[26px]">
              {unitName} – MCQ Test
            </h2>
            <div className="text-sm text-gray-600 mt-1">
              {availableCount} question(s) available
            </div>
          </div>
        </div>

        {/* Setup container styled similar to screenshot */}
        <div className="p-6 rounded-lg border border-blue-300 shadow-sm">
          <div className="grid grid-cols-3 gap-6 items-center">
            {/* Number of Questions (slider) */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-3">
                Number of Questions:{" "}
                <span className="font-semibold">{setupCount}</span>
              </label>

              <input
                type="range"
                min={1}
                max={availableCount}
                value={setupCount}
                onChange={(e) => setSetupCount(Number(e.target.value))}
                className="w-full"
              />

              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>{availableCount}</span>
              </div>
            </div>

            {/* Difficulty select */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-3">
                Difficulty
              </label>
              <select
                value={setupDifficulty}
                onChange={(e) => setSetupDifficulty(e.target.value)}
                className="px-4 py-2 border border-blue-900 text-blue-900 rounded w-full max-w-xs"
              >
                <option value="Mixed">Mixed</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Timer enable toggle */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-3">
                Timer Enable
              </label>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setTimerEnabled((s) => !s)}
                  aria-pressed={timerEnabled}
                  className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${
                    timerEnabled ? "bg-[#1142C3]" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                      timerEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm text-gray-600">
                  {timerEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={handleStart}
              className="px-6 py-3 bg-[#1142C3] text-white rounded-full text-lg"
            >
              Start Test
            </button>
          </div>

          {/* Notes about selection */}
          <div className="mt-4 text-sm text-blue-900 text-center">
            {setupDifficulty !== "Mixed" ? (
              <span>
                Showing only questions with difficulty:{" "}
                <strong>{setupDifficulty}</strong>
              </span>
            ) : (
              <span>Mixed difficulty — questions can be from any level.</span>
            )}

            {setupCount > availableCount && (
              <div className="mt-2 text-red-600">
                Requested {setupCount} questions but only {availableCount}{" "}
                available.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // started === true: show quiz UI
  if (!activeQuestions || activeQuestions.length === 0) {
    // started but no questions matched the filter
    return (
      <div className="w-full bg-white p-6">
        <div className="flex border-b pb-6 border-blue-300 items-center gap-3 mb-6">
          <img
            src={practiceIcon}
            alt="quiz"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="text-[20px] font-semibold text-[#1142C3] leading-[26px]">
              Practice Quiz – {unitName}: {practiceSetName}
            </h2>
            <div className="text-sm text-gray-600 mt-1">
              No questions matched your selection.
            </div>
          </div>
        </div>

        <div className="text-gray-700">
          Try going back and selecting "Mixed" difficulty or reducing the number
          of questions.
        </div>

        <div className="mt-4">
          <button
            onClick={() => {
              setStarted(false);
              setSelectedQuestions([]);
            }}
            className="px-4 py-2 border rounded"
          >
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="w-full bg-white p-6">
      {/* Header */}
      <div className="flex border-b pb-6 border-blue-300 items-center gap-3 mb-6 justify-between">
        <div className="flex items-center gap-3">
          <img
            src={practiceIcon}
            alt="quiz"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="text-[20px] font-semibold text-[#1142C3] leading-[26px]">
              Practice Quiz – {unitName}: {practiceSetName}
            </h2>
            <div className="text-sm text-gray-600 mt-1">
              Question {currentIndex + 1} of {total}
            </div>
          </div>
        </div>

        {/* Timer display on the right */}
        <div>
          {timerEnabled && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Time Remaining</div>
              <div className="text-lg font-semibold text-[#1142C3]">
                {formatTime(secondsLeft)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Question */}
      <div className="flex flex-col gap-5 shadow shadow-blue-300 border rounded-md border-blue-300 p-10">
        <div className="pb-1">
          {/* Question number and text inline */}
          <div className="flex items-start gap-4">
            <div className="text-[15px] text-[#1142C3] font-medium">
              {currentIndex + 1}.
            </div>
            <div className="flex-1">
              <RenderContentArray blocks={currentQ?.question ?? []} />
            </div>
          </div>
        </div>

        {/* Options (inline layout tweaks) */}
        <div className="grid gap-2">
          {currentQ?.options?.map((opt) => {
            const checked = answers[currentQ.id] === opt.label;
            const optId = `q_${currentQ.id}_opt_${opt.label}`;
            return (
              <label
                key={opt.label}
                htmlFor={optId}
                className={`flex items-start gap-2 p-3 rounded cursor-pointer ${
                  checked ? "bg-blue-50" : "bg-white"
                }`}
              >
                {/* Radio input */}
                <input
                  id={optId}
                  type="radio"
                  name={`q_${currentQ.id}`}
                  value={opt.label}
                  checked={checked}
                  onChange={() => handleOptionSelect(currentQ.id, opt.label)}
                  className="mt-1 accent-[#1142C3]"
                />

                {/* Letter and content inline */}
                <div className="flex-1 leading-[22px]">
                  <div className="flex items-start">
                    <div className="w-8 flex-shrink-0 font-semibold text-[#1142C3]">
                      {opt.label}.
                    </div>
                    <div className="text-[15px] text-blue-900 leading-[20px] break-words">
                      {opt.items.length === 1 &&
                      opt.items[0].type === "text" ? (
                        typeof opt.items[0].value === "string" &&
                        opt.items[0].value.includes("$") ? (
                          opt.items[0].value
                            .split(/(\$[^$]+\$)/g)
                            .filter(Boolean)
                            .map((part, idx) =>
                              part.startsWith("$") && part.endsWith("$") ? (
                                <InlineMath key={idx}>
                                  {part.slice(1, -1)}
                                </InlineMath>
                              ) : (
                                <span key={idx}>{part}</span>
                              )
                            )
                        ) : (
                          <span>{opt.items[0].value}</span>
                        )
                      ) : (
                        <RenderOptionItems items={opt.items} />
                      )}
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-full ${
                currentIndex === 0
                  ? "border-gray-200 text-gray-400"
                  : "border-[#1142C3] text-[#1142C3]"
              }`}
            >
              Prev
            </button>

            {currentIndex < activeQuestions.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-4 py-2 bg-[#1142C3] text-white rounded-full"
              >
                Next
              </button>
            ) : !submitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#1142C3] text-white rounded-full"
              >
                Submit Test
              </button>
            ) : null}
          </div>

          {/* Score / answered count */}
          {!submitted ? (
            <div className="text-sm text-gray-600">
              Answered: {Object.keys(answers).length} / {total}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#E4FFE4] rounded-lg text-green-700 font-semibold flex items-center">
                <BiCheckCircle className="inline-block mr-1" />
                You scored {totalCorrect} / {total}
              </div>

              <button
                type="button"
                onClick={() => setShowResponses(true)}
                className="px-4 py-2 bg-white border border-[#1142C3] text-[#1142C3] rounded-full"
              >
                Review All Questions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review modal */}
      {showResponses && (
        <CheckResponses
          score={totalCorrect}
          correctAnswers={totalCorrect}
          wrongAnswers={total - totalCorrect}
          accuracy={total === 0 ? 0 : Math.round((totalCorrect / total) * 100)}
          quizQuestions={buildQuizQuestionsForReview()}
          setShowResponses={setShowResponses}
        />
      )}
    </div>
  );
};

export default UnitTest;
