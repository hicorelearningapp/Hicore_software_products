import React, { useState } from "react";
import emptyIcon from "../../../../../assets/InterviewPreparation/empty.png";

const FlashcardActivityDashboard = () => {
  const [enteredTopic, setEnteredTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [cardCount, setCardCount] = useState("");
  const [flashCards, setFlashCards] = useState([]);
  const [showFlashCards, setShowFlashCards] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!enteredTopic || !difficulty || !cardCount) {
      alert(
        "Failed to fetch flash card. Please check your input or try again later."
      );
      return;
    }
    setLoading(true);
    setIsFlipped(false);
    setCurrentIndex(0);
    try {
      const response = await fetch(
        "https://hicore.pythonanywhere.com/api/flashcard/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: enteredTopic.toLowerCase(),
            level: difficulty.toLowerCase(),
            number_of_questions: Number(cardCount),
          }),
        }
      );
      const data = await response.json();
      if (data?.questions?.length > 0) {
        setFlashCards(data.questions);
        setShowFlashCards(true);
      } else {
        alert("Failed to fetch quiz. Please check your input or try again.");
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      alert("Failed to fetch quiz. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-blue-900 m-4 shadow flex flex-col overflow-hidden min-h-[600px]">
      {/* === TOP FILTER BAR === */}
      <div className="w-full flex flex-wrap items-center justify-start gap-6 p-4 border-b border-gray-200">
        {/* Topic Dropdown/Text */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#3E3A75] flex items-center gap-1">
            Topic
          </label>
          <input
            type="text"
            placeholder="Enter topic"
            value={enteredTopic}
            onChange={(e) => setEnteredTopic(e.target.value)}
            className="border border-[#CBCDCF] rounded px-3 py-1 text-sm focus:outline-none focus:ring-0 focus:border-[#343079]"
          />
        </div>

        {/* Difficulty Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#3E3A75] flex items-center gap-1">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-[#CBCDCF] rounded px-3 py-1 text-sm focus:outline-none focus:border-[#343079]"
          >
            <option value="">Select option</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Number of Cards Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#3E3A75] flex items-center gap-1">
            No Of Cards
          </label>
          <select
            value={cardCount}
            onChange={(e) => setCardCount(e.target.value)}
            className="border border-[#CBCDCF] rounded px-3 py-1 text-sm focus:outline-none focus:border-[#343079]"
          >
            <option value="">Select option</option>
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Start Button */}
        {!showFlashCards && (
          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-[#3E3A75] text-white px-4 py-1.5 rounded text-sm font-medium ml-auto"
          >
            {loading ? "Loading..." : "Start"}
          </button>
        )}
      </div>

      {/* === FLASHCARD AREA === */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
        {!showFlashCards ? (
          <>
            <img
              src={emptyIcon}
              alt="No Flash Card"
              className="w-[70px] h-[70px] mb-4 opacity-50"
            />
            <h3 className="text-lg font-semibold mb-2 text-[#AAA8BD]">
              No Flash Card Activity Found
            </h3>
            <p className="text-sm mb-6 max-w-[80%] text-[#AAA8BD]">
              Start flipping through key concepts and test your recall quickly.
            </p>
          </>
        ) : (
          <>
            {/* Flip Card */}
            <div
              className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] mb-10 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                className={`absolute w-full h-full rounded-lg text-white text-lg px-6 flex items-center justify-center transition-transform duration-500 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* Front */}
                <div className="absolute w-full h-full bg-[#3E3A75] rounded-lg flex items-center justify-center px-6 text-center [backface-visibility:hidden]">
                  {flashCards[currentIndex]?.question}
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-[#F5F4C3] text-black  rounded-lg flex items-center justify-center px-6 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  {flashCards[currentIndex]?.answer}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between w-full max-w-[400px]">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="bg-[#ECECFA] text-[#000000] px-6 py-2 rounded font-medium text-sm"
              >
                ‹ Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === flashCards.length - 1}
                className="bg-[#ECECFA] text-[#000000] px-6 py-2 rounded font-medium text-sm"
              >
                Next ›
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlashcardActivityDashboard;
