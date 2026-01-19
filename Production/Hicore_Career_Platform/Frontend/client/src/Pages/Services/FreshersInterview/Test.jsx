import React, { useState, useEffect } from "react";
import arrowIcon from "../../../assets/FreshersInterview/doublearrow.png";

const Test = ({ testData }) => {
  // Use the testData prop, with a fallback to prevent crashes
  const questions = testData?.questions || [];
  const totalQuestions = questions.length;
  // Calculate total time based on the number of questions (1 min per question)
  const totalTime = totalQuestions * 60;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalTime);

  // Timer
  useEffect(() => {
    if (!isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSubmitted]);

  // Handle initial state and reset when the test data changes
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswer("");
    setAnswers({});
    setIsSubmitted(false);
    setTimeLeft(totalTime);
  }, [testData, totalTime]);

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerSubmit = () => {
    setAnswers({ ...answers, [currentIndex]: selectedAnswer });

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer("");
    } else {
      setIsSubmitted(true);
    }
  };

  const getResults = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) correct++;
    });
    const incorrect = totalQuestions - correct;
    const timeTaken = totalTime - timeLeft;
    const accuracy = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    const speed = timeTaken > 0 ? (correct / (timeTaken / 60)).toFixed(2) : 0;

    return { correct, incorrect, accuracy, timeTaken, speed };
  };

  if (totalQuestions === 0) {
    return <p className="text-red-500 text-sm">⚠️ No timed test questions available for this topic.</p>;
  }

  if (isSubmitted) {
    const { correct, incorrect, accuracy, timeTaken, speed } = getResults();

    return (
      <div className="p-2">
        <h2 className="text-[#343079] font-poppins text-[20px] font-semibold">
          Timed Test ({totalQuestions} Questions – {totalQuestions} Minutes)
        </h2>
        
        {/* ... (rest of the submission result JSX remains the same) */}
        <div className="bg-[#F0F7FF] p-3 mt-8 rounded-md">
          <p className="text-[#343079] text-[16px]">
            <strong>Objective:</strong> Assess speed and accuracy under time constraints. Results affect leaderboard and badge unlocks.
          </p>
        </div>

        <div className="mt-6 bg-white ">
          <h3 className="text-[#000000] text-[18px] font-poppins font-semibold mb-2">🎉 Great Job, [User Name]!</h3>
          <p className="w-[568px] h-[36px] text-[18px] leading-[36px] font-poppins font-normal text-black mt-6 ">You’ve completed the {totalQuestions}-minute challenge. Here’s how you did:</p>

          <div className="w-full inline-flex  mt-5 gap-6">
            <button className="bg-[#4F2D7F] text-white px-4 py-2 rounded-md">Practice More Series</button>
            <button className="border border-[#4F2D7F] text-[#4F2D7F] px-4 py-2 rounded-md">Retake Test</button>
            <button className="border border-[#4F2D7F] text-[#4F2D7F] px-4 py-2 rounded-md">Review Answers</button>
          </div>

          <div className="bg-[#F2F6FE] rounded-md p-4 grid grid-cols-2 gap-4 text-[#343079] text-[14px] font-[Poppins] mt-4 border border-[#C0BFD5]">
            <p>❓ Total Questions: {totalQuestions}</p>
            <p>⏱ Time Taken: {Math.floor(timeTaken / 60)} min {timeTaken % 60} sec</p>
            <p>✅ Correct Answers: {correct}</p>
            <p>📈 Rank: Top 25% of learners</p>
            <p>❌ Incorrect Answers: {incorrect}</p>
            <p>⚡ Speed: {speed} questions/min</p>
            <p>🎯 Accuracy: {accuracy}%</p>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="flex-1 bg-[#E8FFDD] p-4 rounded-md border border-[#C0BFD5]">
              <h4 className="font-semibold text-[#008000]">Your Strengths</h4>
              <ul className="list-disc ml-5 text-[#008000]">
                <li>Pattern Recognition</li>
                <li>Multiplication-based Series</li>
              </ul>
            </div>

            <div className="flex-1 bg-[#FFE4FF] p-4 rounded-md border border-[#C0BFD5]">
              <h4 className="font-semibold text-[#FF0000]">Improvement Areas</h4>
              <ul className="list-disc ml-5 text-[#FF0000]">
                <li>Complex patterns</li>
                <li>Skipped alternating series</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  // Add a check to prevent errors if the questions array is empty
  if (!currentQuestion) {
    return null;
  }

  const allOptions = [...currentQuestion.options].sort();

  return (
    <div className="w-full h-fit p-2 gap-6 border border-[#EBEAF2] rounded-[4px]">
      <h2 className="w-[393px] h-[48px] text-[#343079] font-poppins font-semibold text-[20px] leading-[48px]">
        Timed Test ({totalQuestions} Questions – {totalQuestions} Minutes)
      </h2>

      <div className="w-full h-fit p-2 rounded-[4px] bg-[#D1E5FF]">
        <p className="text-[#343079] text-[16px] leading-[32px] font-[Poppins]">
          <span className="font-bold">Objective:</span> Assess speed and accuracy under time constraints. Results affect leaderboard and badge unlocks.
        </p>
      </div>

      {/* Progress Bar & Timer */}
      <div className="w-full h-[32px] px-4 flex justify-between items-center">
        <div className="flex gap-2 mt-8 flex-grow">
          {[...Array(totalQuestions)].map((_, i) => (
            <div
              key={i}
              className={`h-[10px] flex-1 rounded-[4px] ${
                i < currentIndex ? "bg-[#4F80BF]" : "bg-[#D9D9D9]"
              }`}
            />
          ))}
        </div>
        <div className="w-[50px] mt-8 h-[32px] text-[#4F80BF] text-[14px] font-semibold font-[Poppins] leading-[32px] text-right">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Section */}
      <div className="w-full h-fit gap-[36px] mt-6">
        <div className="w-full h-fit gap-[16px]">
          <p className="w-full h-[32px] text-[#343079] font-[Poppins] text-[14px] font-semibold leading-[32px]">
            {currentIndex + 1}. {currentQuestion.question}
          </p>

          <div className="w-full h-fit gap-[16px] px-6 flex flex-col mt-2">
            {allOptions.map((option, i) => (
              <label key={i} className="flex items-center gap-2 text-[#343079] font-[Poppins] text-[14px]">
                <input
                  type="radio"
                  name={`question${currentIndex}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  className="w-[16px] h-[16px]"
                />
                <span className="w-full h-fit">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 px-6">
        <button
          onClick={handleAnswerSubmit}
          disabled={!selectedAnswer}
          className="w-[82px] h-[40px] bg-[#343079] text-white text-sm font-medium text-center rounded-[8px] py-2 disabled:opacity-50"
        >
          {currentIndex === totalQuestions - 1 ? "Finish" : "Submit"}
        </button>
      </div>

      {/* Navigation */}
      <div className="w-full flex justify-between items-center mt-4 px-6">
        {currentIndex > 0 ? (
          <button
            onClick={() => {
              setAnswers({ ...answers, [currentIndex]: selectedAnswer });
              setCurrentIndex(currentIndex - 1);
              setSelectedAnswer(answers[currentIndex - 1] || "");
            }}
            className="flex items-center gap-1 text-[16px] text-[#343079] font-[Poppins] leading-[32px]"
          >
            <img
              src={arrowIcon}
              alt="Previous Arrow"
              className="w-[24px] h-[24px] rotate-180"
            />
            Previous
          </button>
        ) : (
          <div />
        )}

        {currentIndex < totalQuestions - 1 ? (
          <button
            onClick={() => {
              handleAnswerSubmit();
            }}
            className="flex items-center gap-1 text-[16px] text-[#343079] font-[Poppins] leading-[32px]"
          >
            Next
            <img src={arrowIcon} alt="Next Arrow" className="w-[24px] h-[24px]" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default Test;