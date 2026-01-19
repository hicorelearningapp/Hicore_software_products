import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const DynamicContentRenderer = ({ content, editable = false, onEdit }) => {
  const [quizAnswers, setQuizAnswers] = useState({});

  const handleQuizChange = (qIdx, option) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  if (!content || content.length === 0) {
    return <p className="text-red-500">⚠️ No content to display</p>;
  }

  return (
    <div className="space-y-6 text-black"> {/* black text globally */}
      {content.map((block, idx) => {
        switch (block.type) {
          case "heading":
            const HeadingTag = `h${block.level || 2}`;
            return (
              <HeadingTag
                key={idx}
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) => onEdit?.(idx, e.target.innerText)}
                className="font-poppins font-bold text-[1rem] leading-8 outline-none text-black"
              >
                {block.text}
              </HeadingTag>
            );

          case "paragraph":
            return (
              <p
                key={idx}
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) => onEdit?.(idx, e.target.innerText)}
                className="font-poppins text-[0.875rem] font-normal leading-6 outline-none text-black"
              >
                {block.text}
              </p>
            );

          case "list":
            return (
              <ul
                key={idx}
                className="list-disc pl-6 font-poppins text-[0.875rem] font-normal leading-6 text-black"
              >
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onEdit?.(idx, e.target.innerText, itemIdx)
                    }
                    className="outline-none"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <blockquote
                key={idx}
                className="flex flex-col items-start gap-1 p-2 rounded border-l-4 border-[#FFC107] bg-[#FFFAEF] font-poppins text-[0.875rem] font-bold leading-6 text-black"
              >
                {block.text}
              </blockquote>
            );

          case "divider":
            return <hr key={idx} className="border-t border-gray-300" />;

          case "code":
            return (
              <div
                key={idx}
                className="flex flex-col items-start gap-4 p-2 rounded-lg border border-white shadow"
                style={{ background: "#FFF" }}
              >
                <SyntaxHighlighter
                  language={block.language || "html"}
                  style={{}} // No theme
                  customStyle={{
                    background: "transparent",
                    color: "#000000",
                    fontFamily: "Poppins, monospace",
                    fontSize: "0.875rem",
                    lineHeight: "1.5rem",
                    padding: "0.5rem",
                    margin: 0,
                    width: "100%",
                  }}
                  showLineNumbers={false}
                >
                  {block.content}
                </SyntaxHighlighter>
              </div>
            );

          case "table":
            return (
              <table
                key={idx}
                className="table-auto border border-gray-400 w-full text-left"
              >
                <thead>
                  <tr>
                    {block.headers.map((header, i) => (
                      <th
                        key={i}
                        className="border px-4 py-2 bg-gray-100 font-poppins text-[0.875rem] font-medium text-black"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className="border px-4 py-2 font-poppins text-[0.875rem] text-black"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );

          case "image":
            return (
              <img
                key={idx}
                src={block.src}
                alt={block.alt}
                className="max-w-full h-auto rounded shadow"
              />
            );

          case "link":
            return (
              <a
                key={idx}
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {block.text}
              </a>
            );

          case "video":
            return (
              <div key={idx} className="aspect-video">
                <ReactPlayer url={block.src} controls width="100%" height="100%" />
              </div>
            );

          case "spacer":
            return <div key={idx} style={{ height: block.size }} />;

          case "quiz":
            return (
              <div
                key={idx}
                className="space-y-6 font-poppins text-black mt-4"
              >
                <h3 className="text-xl font-bold">Quick Quiz</h3>
                {block.questions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className="border border-[#E1E0EB] rounded-[8px] p-4 flex flex-col gap-2"
                  >
                    <p className="font-medium text-sm">
                      {qIndex + 1}. {q.question}
                    </p>
                    <div className="flex flex-col gap-2">
                      {q.options.map((option, oIndex) => (
                        <label
                          key={oIndex}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={option}
                            checked={quizAnswers[qIndex] === option}
                            onChange={() => handleQuizChange(qIndex, option)}
                            className="accent-[#4F80BF]"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default DynamicContentRenderer;
