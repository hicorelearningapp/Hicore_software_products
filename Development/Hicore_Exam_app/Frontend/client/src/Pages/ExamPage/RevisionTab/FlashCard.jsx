import React, { useEffect, useMemo, useState } from "react";
import headphoneIcon from "../../../assets/Revision/Audio.png";
import bookmarkIcon from "../../../assets/Revision/Save.png";
import reloadIcon from "../../../assets/Revision/Refresh.png";

const FlashCard = ({ subject, unit }) => {
  /* ---------- BUILD FLASHCARDS FROM UNIT ---------- */
  const cards = useMemo(() => {
    if (!unit) return [];

    // ✅ PRIMARY: multiple flashcards
    if (Array.isArray(unit.flashcards) && unit.flashcards.length > 0) {
      return unit.flashcards;
    }

    // ✅ FALLBACK: single flashcard format
    if (unit.flashcardAnswer) {
      return [
        {
          question: unit.flashcardQuestion || unit.chapterName,
          answer: unit.flashcardAnswer,
        },
      ];
    }

    return [];
  }, [unit]);

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  /* ---------- RESET WHEN UNIT CHANGES ---------- */
  useEffect(() => {
    setIndex(0);
    setShowAnswer(false);
  }, [unit]);

  if (!cards.length) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center text-blue-700 font-medium">
        Flashcards coming soon 🚧
      </div>
    );
  }

  const current = cards[index];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[400px] font-[Poppins] text-[#1E47A1] relative">
      {/* === FLASHCARD BOX === */}
      <div
        onClick={() => setShowAnswer((prev) => !prev)}
        className={`w-full max-w-4xl rounded-2xl h-[360px] mt-10 flex flex-col items-center justify-center cursor-pointer transition duration-500 ease-in-out ${
          showAnswer
            ? "bg-[#2654B0] text-white"
            : "bg-[#EDF2FA] text-[#1E47A1] hover:shadow-md"
        }`}
      >
        {!showAnswer ? (
          <>
            <div className="border border-[#1E47A1] bg-white rounded-full px-6 py-2 text-sm mb-3">
              {subject}
            </div>

            <h3 className="font-semibold text-[18px] md:text-[20px] mt-3 mb-3 text-center px-6">
              {current.question}
            </h3>

            <p className="text-blue-700 text-[16px]">Click to reveal answer</p>
          </>
        ) : (
          <div className="text-center px-6">
            <h3 className="text-white text-[18px] md:text-[20px] font-medium">
              {current.answer}
            </h3>
          </div>
        )}
      </div>

      {/* === SPACING === */}
      <div className="h-20"></div>

      {/* === BOTTOM TOOLBAR === */}
      <div className="w-full max-w-4xl flex items-center justify-between text-[15px] mt-auto pb-8 px-4">
        {/* Previous */}
        <button
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => Math.max(i - 1, 0));
            setShowAnswer(false);
          }}
          className="text-[#1E47A1] font-medium hover:underline disabled:opacity-40"
        >
          Previous Card
        </button>

        {/* Icons */}
        <div className="flex items-center justify-center gap-8">
          <img
            src={headphoneIcon}
            alt="Listen"
            className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
          />
          <img
            src={bookmarkIcon}
            alt="Bookmark"
            className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
          />
          <img
            src={reloadIcon}
            alt="Reset"
            onClick={() => setShowAnswer(false)}
            className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
          />
        </div>

        {/* Next */}
        <button
          disabled={index === cards.length - 1}
          onClick={() => {
            setIndex((i) => Math.min(i + 1, cards.length - 1));
            setShowAnswer(false);
          }}
          className="text-[#1E47A1] font-medium hover:underline disabled:opacity-40"
        >
          Next Card
        </button>
      </div>
    </div>
  );
};

export default FlashCard;
