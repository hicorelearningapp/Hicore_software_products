import React from "react";

const AIFeedbackPanel = ({ feedback }) => {
  if (!feedback) return null;

  const overall = feedback.overall || "";
  const scores = feedback.scores || {};
  const highlights = feedback.highlights || [];
  const suggestions = feedback.suggestions || [];

  const bgColors = ["bg-blue-50", "bg-green-50", "bg-yellow-50", "bg-pink-50"];

  return (
    <div className="mt-8 border border-[#E2E1F3] rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-[#343079] text-lg font-semibold mb-4">AI Feedback</h2>

      {overall && (
        <p className="italic mb-6 text-[#343079]">
          {overall}
        </p>
      )}

      {Object.keys(scores).length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(scores).map(([label, value], index) => (
            <div
              key={label}
              className={`flex flex-col ${bgColors[index % 4]} p-4 rounded-md`}
            >
              <p className="font-semibold text-[#343079] mb-1">
                {label}: {value.score}
              </p>
              <p className="text-sm text-[#4B5563]">
                {value.feedback}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {highlights.length > 0 && (
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">✨ Highlights</h3>
            <ul className="list-disc list-inside text-sm">
              {highlights.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">🛠 Suggestions</h3>
            <ul className="list-disc list-inside text-sm">
              {suggestions.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFeedbackPanel;
