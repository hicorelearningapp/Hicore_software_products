import React, { useState } from "react";
import ReactPlayer from "react-player";
import { InlineMath, BlockMath } from "react-katex";


const DynamicTopicRenderer = ({ content }) => {
  const [quizAnswers, setQuizAnswers] = useState({});

  const handleQuizChange = (qIdx, option) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  if (!content || content.length === 0) {
    return <p className="text-red-500">⚠️ No content to display</p>;
  }

  return (
    <div className="space-y-6 text-[#343079]">
      {content.map((block, idx) => {
        const type = block.type || (block.items ? "list" : null);

        switch (type) {
          /* ---------------------- HEADINGS ------------------------ */
          case "heading":
            return (
              <h2
                key={idx}
                className="text-[#343079] font-bold text-[16px] leading-8"
              >
                {block.text}
              </h2>
            );

          /* ---------------------- PARAGRAPH ------------------------ */
          case "paragraph":
            return (
              <p
                key={idx}
                className="text-[#343079] text-[14px] leading-6"
              >
                {block.text}
              </p>
            );

          /* ---------------------- FORMULA ------------------------ */
          case "formula":
            return (
              <div
                 key={idx}
                 className="p-3 bg-gray-100 border-l-4 border-purple-500 rounded w-fit text-[12px] font-semibold overflow-x-auto"
              >
              <BlockMath math={block.text.replace(/\\\\/g, "\\")} />
             </div>
            );

          /* ---------------------- TASK ------------------------ */
          case "task":
            return (
              <div
                key={idx}
                className="p-8 bg-green-50 w-fit border-l-4 border-green-500 rounded text-[14px] overflow-x-auto whitespace-pre-wrap break-words"
              >
                <strong className="block mb-1">Task:</strong>
                <p>{block.text}</p>
              </div>
            );

          /* ---------------------- CODE BLOCK ------------------------ */
         case "code":
           return (
            <pre
              key={idx}
              className="bg-[#F9F9FC] p-8 rounded-md border text-[14px] font-mono w-fit overflow-x-auto whitespace-pre-wrap break-words"
            >
            <code>
             {block.text.replace(/\\n/g, "\n")}
            </code>
            </pre>
            );


          /* ---------------------- LIST ------------------------ */
          case "list":
            return (
              <ul
                key={idx}
                className={`${
                  block.style === "numbered"
                    ? "list-decimal"
                    : "list-disc"
                } pl-6 text-[14px]`}
              >
                {block.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );

          /* ---------------------- NOTES INSIDE LESSON ------------------------ */
          case "notes":
            return (
              <div key={idx} className="space-y-3 mt-2">
                {block.items?.map((note, nIdx) => (
                  <div key={nIdx}>
                    <h4 className="font-semibold text-[16px] mb-1">
                      {note.title}
                    </h4>
                    <ul className="list-disc pl-6 text-[14px] flex flex-col gap-1">
                      {note.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );

          /* ---------------------- QUICK QUIZ ------------------------ */
          case "quickquiz":
            return (
              <div key={idx} className="space-y-4 text-[14px]">
                {block.questions?.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 border rounded bg-gray-50 space-y-2"
                  >
                    <p className="font-medium">{q.question}</p>
                    {q.options.map((opt, oIdx) => (
                      <label key={oIdx} className="block cursor-pointer">
                        <input
                          type="radio"
                          name={`quiz-${qIdx}`}
                          value={opt}
                          checked={quizAnswers[qIdx] === opt}
                          onChange={() => handleQuizChange(qIdx, opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                    {quizAnswers[qIdx] && (
                      <p
                        className={`text-[14px] font-semibold ${
                          quizAnswers[qIdx] === q.correctAnswer
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {quizAnswers[qIdx] === q.correctAnswer
                          ? "✓ Correct!"
                          : "✗ Incorrect"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );

          /* ---------------------- IMAGE ------------------------ */
          case "image":
            return (
              <img
                key={idx}
                src={block.src}
                alt={block.alt || ""}
                className="max-w-full rounded shadow"
              />
            );

          /* ---------------------- VIDEO ------------------------ */
          case "video":
            return (
              <div key={idx} className="aspect-video">
                <ReactPlayer
                  url={block.src}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
            );

          /* ---------------------- UNKNOWN BLOCK ------------------------ */
          default:
            return (
              <pre
                key={idx}
                className="text-gray-500 text-xs bg-gray-50 p-2 rounded"
              >
                ⚠️ Unknown block type: {JSON.stringify(block, null, 2)}
              </pre>
            );
        }
      })}
    </div>
  );
};

export default DynamicTopicRenderer;
