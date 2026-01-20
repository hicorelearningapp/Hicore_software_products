import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

/**
 * Notestab
 * - Detects math in points using $...$ or $$...$$ delimiters
 * - Renders surrounding text as normal list text
 * - Renders each math fragment as a BlockMath (display/block math)
 *
 * Example supported point strings:
 * - "Newton's law: $F = ma$"
 * - "Area: $$A = \\pi r^2$$"
 * - "Mix text $x^2$ and more text $y^2$ -> both become block equations below the text"
 */

const mathRegex = /(\${1,2})([\s\S]+?)\1/g;

const renderPointWithMath = (point, key) => {
  // Find all math matches and also capture non-math text around them
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mathRegex.exec(point)) !== null) {
    const matchStart = match.index;
    const delim = match[1]; // "$" or "$$"
    const mathContent = match[2];

    // push preceding text if any
    if (matchStart > lastIndex) {
      parts.push({ type: "text", content: point.slice(lastIndex, matchStart) });
    }

    // push math
    parts.push({ type: "math", content: mathContent, delim });

    lastIndex = mathRegex.lastIndex;
  }

  // trailing text
  if (lastIndex < point.length) {
    parts.push({ type: "text", content: point.slice(lastIndex) });
  }

  // If no math found, render as plain text inside <li>
  if (parts.length === 0) {
    return <li key={key}>{point}</li>;
  }

  // Otherwise render combined: original text (joined text parts) as inline paragraph,
  // and each math part as its own BlockMath below.
  const textFragments = parts
    .filter((p) => p.type === "text")
    .map((p) => p.content)
    .join("");

  return (
    <li key={key} className="mb-2">
      {/* Render all non-math text together (trim to avoid extra whitespace) */}
      {textFragments.trim().length > 0 && (
        <div className="text-[15px] leading-[22px]">{textFragments}</div>
      )}

      {/* Render each math part as separate block math (display math) */}
      {parts
        .filter((p) => p.type === "math")
        .map((m, mi) => (
          <div key={mi} className="my-2">
            <BlockMath>{m.content}</BlockMath>
          </div>
        ))}
    </li>
  );
};

const Notestab = ({ selectedTopic }) => {
  const notes = selectedTopic?.notes || [];

  return (
    <div className="flex flex-col gap-[16px]">
      {notes.length > 0 ? (
        notes.map((item, idx) => (
          <div key={idx} className="mb-4">
            <h2 className="text-[16px] font-semibold text-[#2758B3]">
              {item.title}
            </h2>

            {item.points && (
              <ul className="list-disc mt-2 text-[15px] pl-5 text-[#2758B3] leading-[32px] ml-[16px] mr-[16px]">
                {item.points.map((point, i) => renderPointWithMath(point, i))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No notes available for this topic.</p>
      )}
    </div>
  );
};

export default Notestab;
