import React, { useState } from 'react';

const QuickQuiz = ({ questions = [] }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (qIndex, option) => {
    if (!submitted) {
      setAnswers({ ...answers, [qIndex]: option });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (!questions.length) {
    return <p className="text-red-500 text-sm">⚠️ No quiz questions found.</p>;
  }

  return (
    <div className="space-y-6 font-poppins text-[#343079]">
      <h3 className="text-xl font-bold">Quick Quiz</h3>

      {questions.map((q, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === q.correctAnswer;

        return (
          <div key={index} className="border border-[#E1E0EB] rounded-[8px] p-4 space-y-3">
            <p className="font-medium text-[0.9rem]">
              {index + 1}. {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-2 text-sm leading-6 cursor-pointer ${
                    submitted && userAnswer === option && !isCorrect
                      ? 'text-red-600 font-semibold'
                      : ''
                  } ${submitted && option === q.correctAnswer ? 'text-green-600 font-semibold' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={userAnswer === option}
                    onChange={() => handleOptionChange(index, option)}
                    className="accent-[#343079]"
                    disabled={submitted}
                  />
                  {option}
                </label>
              ))}
            </div>

            {submitted && (
              <div className="mt-2 text-sm">
                {isCorrect ? (
                  <p className="text-green-700 font-medium">✅ Correct!</p>
                ) : (
                  <p className="text-red-600 font-medium">
                    ❌ Incorrect. Correct Answer: <span className="text-[#343079]">{q.correctAnswer}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-4 bg-[#343079] text-white px-6 py-2 rounded-[4px] text-sm font-medium"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
};

export default QuickQuiz;
