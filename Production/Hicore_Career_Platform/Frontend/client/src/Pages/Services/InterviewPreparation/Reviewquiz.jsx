import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Reviewquiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, summary } = location.state || {};

  if (!questions || !summary) {
    return (
      <div className="text-center mt-10 text-[#343079] font-semibold">
        No review data found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-[#343079]">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-[#343079] font-semibold mb-4 hover:underline"
      >
        ← Back
      </button>

      {/* Top Summary Bar */}
      <div className="bg-white shadow border border-[#EBEAF2] rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <p>
            <strong>Topic:</strong>{" "}
            <span className="capitalize">{summary.topic}</span>
          </p>
          <p>
            <strong>Time Taken:</strong>{" "}
            {Math.floor(summary.timeTaken / 60)} min {summary.timeTaken % 60} sec
          </p>
          <p>
            <strong>Score:</strong>{" "}
            <span className="text-[#1B9600]">
              {summary.score}/{summary.total}
            </span>
          </p>
          <p>
            <strong>Performance:</strong>{" "}
            <span className="text-[#1B9600]">{summary.performance}</span>
          </p>
          <p>
            <strong>Accuracy:</strong>{" "}
            <span className="text-[#1B9600]">
              {Math.round((summary.score / summary.total) * 100)}%
            </span>
          </p>
        </div>
      </div>

      {/* Questions Review */}
      <div className="border border-[#EBEAF2] rounded-xl p-6 space-y-6 bg-white">
        {questions.map((q, idx) => {
          const isCorrect = q.selected === q.answer;

          return (
            <div key={idx} className="space-y-4">
              {/* Question */}
              <div>
                <h3 className="font-semibold text-md md:text-lg text-[#343079]">
                  {idx + 1}. {q.question}
                </h3>
              </div>

              {/* Options */}
              <ul className="space-y-3">
                {q.options.map((option, index) => {
                  const isUserSelected = option === q.selected;
                  const isCorrectAnswer = option === q.answer;

                  return (
                    <li key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={option}
                        checked={isUserSelected}
                        disabled
                        className="accent-indigo-600"
                      />
                      <label
                        className={`text-md ${
                          isCorrectAnswer
                            ? "text-green-700 font-medium"
                            : isUserSelected
                            ? "text-red-600"
                            : "text-[#343079]"
                        }`}
                      >
                        {option}
                      </label>
                    </li>
                  );
                })}
              </ul>

              {/* Explanation */}
              <div>
                <p
                  className={`text-md font-semibold ${
                    isCorrect ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {isCorrect
                    ? "Your answer is correct."
                    : `Your answer is wrong. Correct answer: ${q.answer}`}
                </p>

                {q.explanation && (
                  <p className="mt-1 text-md border-b pb-6 text-[#343079]">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reviewquiz;
