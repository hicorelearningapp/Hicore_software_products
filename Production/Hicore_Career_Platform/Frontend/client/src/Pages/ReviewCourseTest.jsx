import React from "react";

const ReviewCourseTest = ({ questions, summary, onClose }) => {
  if (!questions || !summary) {
    return (
      <div className="fixed inset-0 bg-[#F9FAFF] flex items-center justify-center text-[#343079] font-semibold z-50">
        No review data found.
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#F9FAFF] overflow-y-auto z-50 p-6 md:p-10 text-[#343079] font-[Poppins]">
      <button
        onClick={onClose}
        className="text-[#343079] font-semibold mb-6 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white shadow border border-[#EBEAF2] rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-sm md:text-base">
          <p>
            <strong>Topic:</strong>{" "}
            <span className="capitalize">{summary.topic}</span>
          </p>
          <p>
            <strong>Time Taken:</strong> {Math.floor(summary.timeTaken / 60)}{" "}
            min {summary.timeTaken % 60} sec
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

      <div className="border border-[#EBEAF2] rounded-xl p-6 space-y-6 bg-white shadow">
        {questions.map((q, idx) => {
          const isCorrect = q.selected === q.answer;

          return (
            <div key={idx} className="space-y-4">
              <div>
                <h3 className="font-semibold text-md md:text-lg text-[#343079]">
                  {idx + 1}. {q.question}
                </h3>
              </div>

              <ul className="space-y-2">
                {q.options.map((option, index) => {
                  const isUserSelected = option.label === q.selected;
                  const isCorrectAnswer = option.label === q.answer;

                  return (
                    <li key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={option.label}
                        checked={isUserSelected}
                        disabled
                        className="accent-[#2D1B69]"
                      />
                      <label
                        className={`text-sm md:text-base ${
                          isCorrectAnswer
                            ? "text-green-700 font-medium"
                            : isUserSelected
                            ? "text-red-600"
                            : "text-[#343079]"
                        }`}
                      >
                        {option.label}. {option.value}
                      </label>
                    </li>
                  );
                })}
              </ul>

              <div>
                <p
                  className={`text-sm font-semibold ${
                    isCorrect ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {isCorrect
                    ? "Your answer is correct."
                    : `Your answer is wrong. Correct answer: ${q.answer}`}
                </p>

                {q.explanation && (
                  <p className="mt-1 text-sm text-[#343079]">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>

              {idx !== questions.length - 1 && (
                <hr className="border-t border-[#E5E7EB]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewCourseTest;
