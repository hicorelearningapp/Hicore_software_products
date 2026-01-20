import React, { useEffect, useMemo, useState } from "react";
import soundIcon from "../../../assets/Revision/Audio.png";
import bookmarkIcon from "../../../assets/Revision/Save.png";
import resetIcon from "../../../assets/Revision/Refresh.png";

const Diagrams = ({ subject, unit }) => {
  /* ---------- BUILD DIAGRAM LIST ---------- */
  const diagrams = useMemo(() => {
    if (!unit) return [];

    // Allow multiple diagrams per unit (future-proof)
    if (Array.isArray(unit.diagram)) return unit.diagram;

    // Single diagram structure
    if (unit.diagram) {
      return [
        {
          title: unit.chapterName,
          description: unit.diagram.description,
          image: unit.diagram.image,
        },
      ];
    }

    return [];
  }, [unit]);

  const [index, setIndex] = useState(0);

  /* ---------- RESET WHEN UNIT CHANGES ---------- */
  useEffect(() => {
    setIndex(0);
  }, [unit]);

  if (!diagrams.length) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-blue-700 font-medium">
        Diagrams coming soon for this unit 🚧
      </div>
    );
  }

  const current = diagrams[index];

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      {/* Diagram Card */}
      <div className="w-full max-w-4xl border border-blue-100 rounded-2xl shadow-sm p-6 flex flex-col items-center">
        {/* Title and subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-blue-800 font-semibold text-xl">
            {current.title}
          </h2>
          <p className="text-blue-800 text-md mt-3 mb-6">
            {current.description}
          </p>
        </div>

        {/* Diagram image */}
        <div className="w-full flex justify-center mb-6">
          <img
            src={current.image}
            alt={current.title}
            className="rounded-xl max-h-[600px] object-contain"
          />
        </div>
      </div>

      {/* Navigation + Icons */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-6 text-blue-700 text-sm font-medium">
        {/* Previous */}
        <button
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          className="hover:underline cursor-pointer disabled:opacity-40"
        >
          Previous Diagram
        </button>

        {/* Icons */}
        <div className="flex items-center justify-center gap-6">
          <img
            src={soundIcon}
            alt="sound"
            className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
          />
          <img
            src={bookmarkIcon}
            alt="bookmark"
            className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
          />
          <img
            src={resetIcon}
            alt="reset"
            onClick={() => setIndex(0)}
            className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
          />
        </div>

        {/* Next */}
        <button
          disabled={index === diagrams.length - 1}
          onClick={() => setIndex((i) => Math.min(i + 1, diagrams.length - 1))}
          className="hover:underline cursor-pointer disabled:opacity-40"
        >
          Next Diagram
        </button>
      </div>
    </div>
  );
};

export default Diagrams;
