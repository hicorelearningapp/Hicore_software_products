// components/QuizResultPopup.jsx
import React from "react";

const QuizResultPopup = ({ result, onClose }) => {
  const {
    topic,
    score,
    total,
    timeTaken,
    accuracy,
    performance,
    questionBreakdown,
  } = result;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-3xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-green-700">🎉 HTML Tech Quiz Completed!</h2>
          <p className="text-lg font-semibold text-[#343079]">Great job!</p>
        </div>

        <div className="grid grid-cols-2 text-sm text-[#343079] mb-6">
          <div>
            <p><strong>Topic:</strong> {topic}</p>
            <p><strong>Score:</strong> {score}/{total}</p>
            <p><strong>Accuracy:</strong> {accuracy}%</p>
          </div>
          <div>
            <p><strong>Time Taken:</strong> {timeTaken}</p>
            <p><strong>Performance:</strong> <span className="text-green-700 font-semibold">{performance}</span></p>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-center border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Question</th>
                <th className="p-2 border">Your Answer</th>
                <th className="p-2 border">Correct Answer</th>
                <th className="p-2 border">Result</th>
              </tr>
            </thead>
            <tbody>
              {questionBreakdown.map((q, i) => (
                <tr key={i}>
                  <td className="border p-2">Q{i + 1}</td>
                  <td className="border p-2">{q.userAnswer}</td>
                  <td className="border p-2">{q.correctAnswer}</td>
                  <td className="border p-2">
                    {q.userAnswer === q.correctAnswer ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#343079] text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPopup;
