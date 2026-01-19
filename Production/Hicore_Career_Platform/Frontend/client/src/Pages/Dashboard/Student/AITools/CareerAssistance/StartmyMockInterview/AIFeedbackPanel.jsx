import React from "react";

const AIFeedbackPanel = ({ feedback }) => {
  if (!feedback || Object.keys(feedback).length === 0) return null;

  const {
    overall = "",
    scores = {},
    highlights = [],
    suggestions = [],
  } = feedback;

  // List of background colors to cycle through
  const bgColors = ["bg-blue-50", "bg-green-50", "bg-yellow-50", "bg-pink-50"];

  return (
    <div
      className="mt-8 border border-[#E2E1F3] rounded-xl p-6 bg-white shadow-sm"
      aria-label="AI Feedback Panel"
    >
      <h2 className="text-[#343079] text-lg font-semibold mb-4">AI Feedback</h2>

      {overall && (
        <p className="italic mb-6 text-[#343079]" aria-label="Overall Feedback">
          {overall}
        </p>
      )}

      {!overall && highlights.length > 0 && (
        <p className="italic mb-6 text-[#343079]">{highlights[0]}</p>
      )}

      {/* Score Cards */}
      {Object.keys(scores).length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(scores).map(([label, value], index) => {
            const formattedLabel =
              label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, " ");

            const bgColor = bgColors[index % bgColors.length];

            return (
              <div
                key={label}
                className={`flex flex-col ${bgColor} p-4 rounded-md shadow-sm border border-gray-300`}
                aria-label={`${label} score`}
              >
                <p className="font-semibold text-black mb-1">
                  {formattedLabel}: {value?.score || 0}/10
                </p>
                <p className="text-sm text-black">{value?.feedback || ""}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Highlights and Suggestions in Separate Containers */}
      <div className="grid md:grid-cols-2 gap-6">
        {highlights.length > 0 && (
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <h3 className="text-[#343079] font-semibold mb-2">✨ Highlights</h3>
            <ul className="list-disc list-inside text-black text-sm space-y-1">
              {highlights.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        {suggestions.length > 0 && (
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <h3 className="text-[#343079] font-semibold mb-2">🛠 Suggestions</h3>
            <ul className="list-disc list-inside text-black text-sm space-y-1">
              {suggestions.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFeedbackPanel;
