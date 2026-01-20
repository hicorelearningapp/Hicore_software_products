// UnitTest.jsx
import React, { useEffect, useState, useRef } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import quizIcon from "../../../assets/TestTab/image.png";
import celebrateIcon from "../../../assets/TestTab/Party.png";
import snapshotIcon from "../../../assets/TestTab/Analyze.png";
import closeIcon from "../../../assets/PracticeTab/CircleCancel.png";
import CheckResponses from "./CheckResponses";

/**
 * UnitTest with KaTeX rendering and a total-test timer:
 * - Question number + question text render on the same line (uses inline math for formulas in the header).
 * - Options: only the selected option shows a light-blue background; others stay white.
 * - Other layout/design preserved.
 *
 * Changes made:
 * - Default number of questions set to 5 (or unit length if <5). User can still change via slider.
 * - When unit changes (and test not started), slider initializes accordingly.
 * - Track test start time and compute time taken when the test finishes.
 * - Pass `unit` and `timeTakenSeconds` + `timeTakenFormatted` to CheckResponses.
 * - Robust difficulty detection/filtering (checks q.level, q.difficulty and q.question blocks).
 */

const isLikelyLatex = (s) => {
  if (!s || typeof s !== "string") return false;
  return /\\|\\frac|_|{|}|\^/.test(s);
};

const RenderQuestionInline = ({ blocks = [] }) => {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <span className="inline">
      {blocks.map((b, i) => {
        if (!b) return null;
        const { type, value } = b;
        if (type === "formula") {
          try {
            return (
              <InlineMath key={i} className="align-middle">
                {String(value)}
              </InlineMath>
            );
          } catch {
            return <span key={i}>{String(value)}</span>;
          }
        }

        if (typeof value === "string" && value.includes("$")) {
          const parts = value.split(/(\$[^$]+\$)/g).filter(Boolean);
          return (
            <span key={i} className="align-middle">
              {parts.map((part, idx) =>
                part.startsWith("$") && part.endsWith("$") ? (
                  <InlineMath key={idx}>{part.slice(1, -1)}</InlineMath>
                ) : (
                  <span key={idx}>{part}</span>
                )
              )}
            </span>
          );
        }

        return (
          <span key={i} className="align-middle">
            {String(value)}
          </span>
        );
      })}
    </span>
  );
};

const RenderBlock = ({ block }) => {
  if (!block) return null;
  const { type, value } = block;

  if (type === "formula") {
    if (isLikelyLatex(value)) {
      try {
        return (
          <div className="my-2">
            <BlockMath>{String(value)}</BlockMath>
          </div>
        );
      } catch {
        return (
          <pre className="whitespace-pre-wrap bg-gray-50 rounded p-3 font-mono text-sm leading-5">
            {String(value)}
          </pre>
        );
      }
    }
    return (
      <pre className="whitespace-pre-wrap bg-gray-50 rounded p-3 font-mono text-sm leading-5">
        {String(value)}
      </pre>
    );
  }

  if (typeof value === "string" && value.includes("$")) {
    const parts = value.split(/(\$[^$]+\$)/g).filter(Boolean);
    return (
      <div className="text-[18px] text-blue-800 leading-[26px]">
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
    <div className="text-[18px] text-blue-800 leading-[26px]">{value}</div>
  );
};

const RenderContentArray = ({ blocks = [] }) => (
  <>
    {blocks.map((b, i) => (
      <div key={i} className={i === 0 ? "" : "mt-2"}>
        <RenderBlock block={b} />
      </div>
    ))}
  </>
);

const OptionItems = ({ items = [] }) => (
  <div className="flex flex-col gap-1">
    {items.map((it, i) => {
      if (it.type === "formula") {
        try {
          return (
            <div
              key={i}
              className="inline-block italic -mt-1 transform scale-95 origin-left"
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
          <div key={i} className="text-[15px] text-blue-900 leading-[22px]">
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
        <div key={i} className="text-[15px] text-blue-900 leading-[22px]">
          {it.value}
        </div>
      );
    })}
  </div>
);

const ONE_QUESTION_SECONDS = 60;

const UnitTest = ({ unit, subjectName }) => {
  // default number of questions: 5 or unit length if less than 5
  const initialCount = Math.max(
    1,
    Math.min(5, (unit?.questions?.length && unit.questions.length) || 1)
  );
  const [questionCount, setQuestionCount] = useState(initialCount);
  // default to Mixed so all questions are used unless user selects a level
  const [difficulty, setDifficulty] = useState("Mixed");
  const [timerEnabled, setTimerEnabled] = useState(false);

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [started, setStarted] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showResponses, setShowResponses] = useState(false);

  // total-test timer (seconds)
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef(null);

  // track test start time and computed time taken
  const startTimeRef = useRef(null);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);

  const allQuestions = unit?.questions || [];
  const maxQuestions = allQuestions.length;
  const currentQuestion = selectedQuestions[currentIndex] || {};

  // If unit changes and test not started, reset the default slider to min(5, unit length)
  useEffect(() => {
    if (!started) {
      const newDefault = Math.max(
        1,
        Math.min(5, (unit?.questions?.length && unit.questions.length) || 1)
      );
      setQuestionCount(newDefault);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  // helper: find difficulty from multiple possible places
  const getQuestionDifficulty = (q) => {
    if (!q) return "Unknown";
    if (q.level) return String(q.level);
    if (q.difficulty) return String(q.difficulty);

    if (Array.isArray(q.question)) {
      for (const b of q.question) {
        if (b && b.difficulty) return String(b.difficulty);
      }
    }

    return "Unknown";
  };

  const startTest = () => {
    let count = Number(questionCount) || 1;
    if (count > allQuestions.length) count = allQuestions.length;

    let filtered = [...allQuestions];
    if (difficulty && difficulty !== "Mixed") {
      const wanted = String(difficulty).toLowerCase();
      filtered = filtered.filter((q) => {
        const qd = String(getQuestionDifficulty(q) || "unknown").toLowerCase();
        return qd === wanted;
      });
    }

    if (filtered.length === 0) {
      alert("No questions available for selected difficulty");
      return;
    }

    const shuffled = filtered.sort(() => 0.5 - Math.random());
    // ensure correctAnswer label exists in picked questions (normalize)
    const picked = shuffled.slice(0, count).map((q) => {
      let correct = q.correctAnswer || null;
      if (!correct && q.answer) {
        const ans = String(q.answer).trim();
        if (/^[A-Z]$/.test(ans)) {
          correct = ans;
        } else {
          const opts = (q.options || []).map((opt) =>
            (opt.items || []).map((it) => String(it.value)).join(" ")
          );
          const idx = opts.findIndex((s) => s.trim() === ans);
          if (idx >= 0) correct = String.fromCharCode(65 + idx);
        }
      }
      return { ...q, selected: "", correctAnswer: correct };
    });

    setSelectedQuestions(picked);
    setStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setShowResponses(false);

    // set start time
    startTimeRef.current = Date.now();
    setTimeTakenSeconds(0);

    // total timer = count * ONE_QUESTION_SECONDS
    if (timerEnabled) {
      const total = count * ONE_QUESTION_SECONDS;
      setSecondsLeft(total);
    } else {
      setSecondsLeft(0);
    }
  };

  // start/stop interval for total-test timer
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!started || !timerEnabled || showResult) return undefined;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [started, timerEnabled, showResult]);

  // when secondsLeft reaches 0 -> auto submit
  useEffect(() => {
    if (!started || !timerEnabled) return;
    if (secondsLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      calculateScore();
    }
  }, [secondsLeft, started, timerEnabled]);

  const handleOptionSelect = (label) => {
    const copy = [...selectedQuestions];
    if (!copy[currentIndex]) return;
    copy[currentIndex] = { ...copy[currentIndex], selected: label };
    setSelectedQuestions(copy);
  };

  console.log("UnitTest subjectName =", subjectName);


  const handleNext = () => {
    if (currentIndex < selectedQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const calculateScore = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // compute final score
    const finalScore = selectedQuestions.reduce(
      (acc, q) => (q.selected === q.correctAnswer ? acc + 1 : acc),
      0
    );
    setScore(finalScore);

    // compute time taken:
    let taken = 0;
    if (timerEnabled) {
      // if timer was enabled, time taken = total allocated - secondsLeft (but ensure >= 0)
      const used =
        Math.max(
          0,
          selectedQuestions.length * ONE_QUESTION_SECONDS -
            Math.max(0, secondsLeft)
        ) || 0;
      taken = used;
    } else {
      // if timer was not enabled, use difference between now and startTimeRef
      if (startTimeRef.current) {
        taken = Math.round((Date.now() - startTimeRef.current) / 1000);
      } else {
        taken = 0;
      }
    }

    setTimeTakenSeconds(taken);
    setShowResult(true);
  };

  const correctAnswers = selectedQuestions.filter(
    (q) => q.selected === q.correctAnswer
  ).length;
  const wrongAnswers = selectedQuestions.length - correctAnswers;
  const accuracy =
    selectedQuestions.length === 0
      ? 0
      : Math.round((correctAnswers / selectedQuestions.length) * 100);
  const percentage =
    selectedQuestions.length === 0
      ? 0
      : Math.round((score / selectedQuestions.length) * 100);

  const resetQuiz = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStarted(false);
    setShowResult(false);
    setShowResponses(false);
    setSelectedQuestions([]);
    setScore(0);
    setCurrentIndex(0);
    setDifficulty("Mixed");
    setQuestionCount(initialCount);
    setSecondsLeft(0);
    startTimeRef.current = null;
    setTimeTakenSeconds(0);
  };

  // convert to shape expected by CheckResponses (simple strings for display)
  const buildQuizQuestionsForReview = () => {
    return selectedQuestions.map((q) => {
      const questionText = (q.question || [])
        .map((b) => String(b.value))
        .join("\n\n");

      const optionStrings = (q.options || []).map((opt) =>
        (opt.items || []).map((it) => String(it.value)).join(" ")
      );

      const selectedLabel = q.selected || null;
      const correctLabel = q.correctAnswer || null;

      return {
        question: questionText,
        options: optionStrings,
        selected: selectedLabel,
        correctAnswer: correctLabel,
        explanation: (q.explanation || [])
          .map((b) => String(b.value))
          .join("\n\n"),
      };
    });
  };

  const formatTime = (secs) => {
    const s = Math.max(0, Math.floor(secs));
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div className="w-full">
      {/* TOP SETTINGS */}
      <div className="relative p-6 border border-[#DCE6FF] rounded-xl shadow-sm bg-white top-0 z-30">
        <div className="flex items-center mb-6">
          <img src={quizIcon} alt="quiz" className="w-16 h-16 mr-4" />
          <h2 className="text-md font-semibold text-blue-800">
            {unit?.unit} – MCQ Test
          </h2>

          {/* Timer display in top-right corner when started & timerEnabled */}
          {started && timerEnabled && !showResult && (
            <div className="absolute right-6 top-6 bg-white border border-blue-100 px-3 py-2 rounded-md text-sm font-semibold text-blue-700 shadow-sm">
              ⏱ {formatTime(secondsLeft)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div>
            <p className="font-medium text-gray-700 mb-2">
              Number of Questions: {questionCount}
            </p>
            <input
              type="range"
              min="1"
              max={maxQuestions}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>1</span>
              <span>{maxQuestions}</span>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">Difficulty</p>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            >
              <option value="Mixed">Mixed</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">Timer Enable</p>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={timerEnabled}
                onChange={(e) => setTimerEnabled(e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600">
                <div className="absolute w-5 h-5 bg-white rounded-full top-[2px] left-[2px] peer-checked:translate-x-5 transition" />
              </div>
            </label>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={startTest}
            className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Test
          </button>
        </div>
      </div>

      {/* QUESTIONS */}
      {started && !showResult && (
        <div className="border border-blue-300 shadow shadow-blue-300 rounded-lg overflow-hidden mt-4">
          <div className="p-6 bg-white">
            {/* Question number and inline question text on the same line */}
            <p className="text-[18px] text-blue-800 font-semibold mb-6">
              {currentIndex + 1}.{" "}
              <span className="font-normal">
                <RenderQuestionInline
                  blocks={currentQuestion?.question ?? []}
                />
              </span>
            </p>

            {/* Options - single column, spaced. Only selected shows light blue */}
            <div className="mt-4">
              {(currentQuestion?.options || []).map((opt, idx) => {
                const label = opt.label ?? String.fromCharCode(65 + idx);
                const isSelected = currentQuestion?.selected === label;
                const optId = `q_${
                  currentQuestion?.id ?? currentIndex
                }_${label}`;

                return (
                  <label
                    key={label}
                    htmlFor={optId}
                    onClick={() => handleOptionSelect(label)}
                    className={`flex items-start gap-4 cursor-pointer rounded px-4 py-6 mb-4 ${
                      isSelected ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    {/* visible outline radio circle */}
                    <div className="flex items-start pt-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 mt-1 ${
                          isSelected ? "border-blue-600" : "border-gray-300"
                        }`}
                        aria-hidden="true"
                      />
                    </div>

                    {/* small blue badge with the letter */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#EEF6FF] text-[#1142C3] flex items-center justify-center font-semibold">
                        {label}
                      </div>
                    </div>

                    {/* Hidden radio input for semantics */}
                    <input
                      id={optId}
                      type="radio"
                      name={`q_${currentQuestion?.id ?? currentIndex}`}
                      value={label}
                      checked={isSelected}
                      onChange={() => handleOptionSelect(label)}
                      className="hidden"
                    />

                    {/* Option content (inline or block) */}
                    <div className="flex-1">
                      {opt.items?.length === 1 &&
                      opt.items[0].type === "text" ? (
                        typeof opt.items[0].value === "string" &&
                        opt.items[0].value.includes("$") ? (
                          <div className="text-[16px] text-blue-900 leading-[28px]">
                            {opt.items[0].value
                              .split(/(\$[^$]+\$)/g)
                              .filter(Boolean)
                              .map((part, i) =>
                                part.startsWith("$") && part.endsWith("$") ? (
                                  <InlineMath key={i}>
                                    {part.slice(1, -1)}
                                  </InlineMath>
                                ) : (
                                  <span key={i}>{part}</span>
                                )
                              )}
                          </div>
                        ) : (
                          <div className="text-[16px] text-blue-900 leading-[28px]">
                            {opt.items[0].value}
                          </div>
                        )
                      ) : (
                        <div className="text-[16px] text-blue-900 leading-[28px]">
                          <OptionItems items={opt.items || []} />
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* bottom row: Prev / Next on left, Answered on right */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-6">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="text-blue-600 disabled:opacity-30"
                >
                  Prev
                </button>

                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
                >
                  {currentIndex === selectedQuestions.length - 1
                    ? "Finish"
                    : "Next"}
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Answered:{" "}
                {
                  selectedQuestions.filter(
                    (q) => q.selected && q.selected !== ""
                  ).length
                }{" "}
                / {selectedQuestions.length || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULT */}
      {showResult && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 w-[750px] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowResult(false)}
              className="absolute top-4 right-4"
            >
              <img src={closeIcon} alt="close" className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <img
                src={celebrateIcon}
                alt="celebrate"
                className="w-12 h-12 mx-auto mb-2"
              />
              <h2 className="text-green-600 text-xl font-semibold">
                Quiz Completed – Great Job!
              </h2>
            </div>

            <div className="bg-[#FFFEEA] border border-blue-100 rounded-xl shadow-md w-full p-6">
              <div className="flex items-center gap-2 mb-4">
                <img src={snapshotIcon} alt="snapshot" className="w-6 h-6" />
                <h3 className="text-blue-800 font-semibold">
                  Your Performance Snapshot
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    Score {score}/{selectedQuestions.length}
                  </p>
                  <p className="text-green-700 text-lg font-semibold">
                    {percentage}%
                  </p>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">Correct Answers</p>
                  <p className="text-green-700 text-lg font-semibold">
                    {correctAnswers}
                  </p>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">Wrong Answers</p>
                  <p className="text-red-600 text-lg font-semibold">
                    {wrongAnswers}
                  </p>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">Accuracy</p>
                  <p className="text-green-700 text-lg font-semibold">
                    {accuracy}%
                  </p>
                </div>
              </div>

              <div className="text-right mt-4">
                <button
                  onClick={() => {
                    setShowResult(false);
                    setShowResponses(true);
                  }}
                  className="text-blue-700 font-medium hover:underline"
                >
                  Check Your Responses &gt;&gt;
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={resetQuiz}
                className="border w-full border-blue-700 text-blue-700 px-6 py-2 rounded-full hover:bg-blue-50"
              >
                Retry Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check Responses modal */}
      {showResponses && (
        <CheckResponses
          quizQuestions={buildQuizQuestionsForReview()}
          score={score}
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
          accuracy={accuracy}
          setShowResponses={setShowResponses}
          subject={subjectName} // ✅ MUST BE THIS
          unit={unit?.unit ?? null}
          timeTakenSeconds={timeTakenSeconds}
          timeTakenFormatted={formatTime(timeTakenSeconds)}
        />
      )}
    </div>
  );
};

export default UnitTest;
