import React, { useState } from "react";
import topicIcon from "../../../assets/InterviewPreparation/topic.png";
import difficultyIcon from "../../../assets/InterviewPreparation/difficulty.png";
import cardsIcon from "../../../assets/InterviewPreparation/cards.png";
import emptyIcon from "../../../assets/InterviewPreparation/empty.png";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const FlashCardActivity = () => {
  const [enteredTopic, setEnteredTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [cardCount, setCardCount] = useState(5);
  const [flashCards, setFlashCards] = useState([]);
  const [showFlashCards, setShowFlashCards] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!enteredTopic || !difficulty || !cardCount) {
      alert("Failed to fetch flash card. Please check your input or try again later.");
      return;
    }

    setLoading(true);
    setIsFlipped(false);
    setCurrentIndex(0);

    try {
      const response = await fetch(`${API_BASE}/ai/flashcard/generate`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
      topic: enteredTopic.toLowerCase(),
      level: difficulty.toLowerCase(),
      number_of_questions: cardCount,
       }),
      });


      const data = await response.json();

      if (data?.questions?.length > 0) {
        setFlashCards(data.questions);
        setShowFlashCards(true);
      } else {
        alert("Failed to fetch quiz. Please check your input or try again later.");
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      alert("Failed to fetch quiz. Please check your input or try again later.");
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
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow flex flex-col md:flex-row overflow-hidden h-[650px]">
      {/* Left Filter Box */}
      <div className="w-full md:w-[300px] border-r border-gray-200 p-6 overflow-y-auto">
        {/* Enter Topic */}
        <div className="mb-8">
          <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
            <img src={topicIcon} alt="Topic" className="w-5 h-5" />
            Enter Your Topic
          </label>
          <input
            type="text"
            placeholder="e.g., JavaScript"
            value={enteredTopic}
            onChange={(e) => setEnteredTopic(e.target.value)}
            className="w-50 px-3 py-2 border border-[#CBCDCF] rounded text-sm ml-[26px] focus:outline-none focus:ring-0 focus:border-[#343079]"
          />
        </div>

        {/* Difficulty Level */}
        <div className="mb-8">
          <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
            <img src={difficultyIcon} alt="Difficulty" className="w-5 h-5" />
            Select Difficulty Level
          </label>
          <div className="flex flex-col gap-2 text-sm text-[#3E3A75]">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <label className="flex items-center gap-2 ml-[28px]" key={level}>
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={difficulty === level}
                  onChange={() => setDifficulty(level)}
                  className="accent-[#3E3A75]"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        {/* Number of Cards */}
<div className="mb-4">
  <label className="flex items-center gap-2 font-semibold text-[#343079] mb-2">
    <img src={cardsIcon} alt="Cards" className="w-5 h-5" />
    Number of Cards
  </label>

  <div className="flex flex-col gap-2 text-sm text-[#3E3A75]">
    {[5, 10, 15, 20].map((num) => (
      <label
        className={`flex items-center gap-2 ml-[28px] opacity-5}`}
        key={num}
      >
        <input
          type="radio"
          name="cardCount"
          value={num}
          checked={cardCount === num}
          onChange={() => setCardCount(num)}
          className="accent-[#3E3A75]"
        />
        {num}
      </label>
    ))}
  </div>
</div>

      </div>

      {/* Right Flash Card Display Area */}
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
            <button
              onClick={handleStart}
              disabled={loading}
              className="bg-[#3E3A75] text-white px-6 py-2 rounded font-medium text-sm min-w-[200px] flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Start Flash Cards Activity"
              )}
            </button>
          </>
        ) : (
          <>
            {/* Flash Card Flip Box */}
            <div
              className="relative w-[400px] h-[400px] mb-10 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                className={`absolute w-full h-full rounded-lg text-white text-lg px-6 flex items-center justify-center transition-transform duration-500 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* Front - Question */}
                <div className="absolute w-full h-full bg-[#3E3A75] rounded-lg flex items-center justify-center px-6 text-center [backface-visibility:hidden]">
                  {flashCards[currentIndex]?.question}
                </div>

                {/* Back - Answer */}
                <div className="absolute w-full h-full bg-[#F5F4C3] text-black rounded-lg flex items-center justify-center px-6 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  {flashCards[currentIndex]?.answer}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between w-full px-10">
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

export default FlashCardActivity;
