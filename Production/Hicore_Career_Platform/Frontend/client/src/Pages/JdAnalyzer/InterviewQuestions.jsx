import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Packer, Paragraph, TextRun } from "docx";

const InterviewQuestions = ({
  writtenQuestions = [],
  mcqQuestions = [],
  flashcards = [],   // ✅ updated to match API response format
  qaPairs = [],
}) => {
  const [tab, setTab] = useState("text");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    const maxIndex =
      tab === "text"
        ? writtenQuestions.length - 1
        : tab === "mcq"
        ? mcqQuestions.length - 1
        : tab === "flash"
        ? flashcards.length - 1
        : qaPairs.length - 1;

    if (questionIndex < maxIndex) {
      setQuestionIndex((prev) => prev + 1);
      resetStates();
    }
  };

  const handlePrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      resetStates();
    }
  };

  const resetStates = () => {
    setAnswer("");
    setShowAnswer(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setIsFlipped(false);
  };

  const handleMCQCheck = (index) => {
    setSelectedOption(index);
    setIsCorrect(index === mcqQuestions[questionIndex]?.correctIndex);
  };

  const downloadQAPairs = async () => {
    if (qaPairs.length === 0) return;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Question & Answer Pairs",
                  bold: true,
                  size: 28,
                  break: 2,
                }),
              ],
            }),
            ...qaPairs.map((q, i) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${i + 1}. ${q.question}`,
                    bold: true,
                    size: 24,
                    break: 2,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Ans: ${q.answer}`,
                    size: 22,
                    break: 1,
                  }),
                ],
              }),
            ]).flat(),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "QA_Pairs.docx";
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-center text-xl font-semibold text-indigo-900 mb-6">
        Interactive Interview Questions Extracted from Job Description
      </h2>

      <div className="bg-white border rounded-lg shadow flex flex-col md:flex-row h-[600px] overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 p-6 space-y-6 border-r overflow-auto">
          {[
            { key: "text", title: "Text Box Answer", desc: "Practice with Written Answers" },
            { key: "mcq", title: "Multiple Choice", desc: "Test Your Knowledge with MCQs" },
            { key: "flash", title: "Flash Card Activity", desc: "Quick Recall with Flashcards" },
            { key: "qa", title: "Question & Answer", desc: "View Question and Answer Pair" },
          ].map((item) => (
            <div key={item.key}>
              <h3
                className={`font-bold cursor-pointer ${
                  tab === item.key ? "text-indigo-800 bg-indigo-100 p-2 rounded" : ""
                }`}
                onClick={() => {
                  setTab(item.key);
                  setQuestionIndex(0);
                  resetStates();
                }}
              >
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}

          <button
            onClick={downloadQAPairs}
            className="w-full bg-blue-600 text-white py-2 rounded text-sm font-semibold"
          >
            Download All Q/A
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-6 flex flex-col justify-between overflow-auto">

          {/* Written Questions */}
          {tab === "text" && writtenQuestions.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-4">
                {writtenQuestions[questionIndex]?.question}
              </h3>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full h-32 p-3 border rounded mb-4 text-sm"
                placeholder="Type your answer here..."
              />

              <button
                onClick={() => setShowAnswer(true)}
                className="w-full bg-green-700 text-white py-2 rounded text-sm"
              >
                Check Answer
              </button>

              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-green-500 p-4 mt-6 rounded"
                  >
                    <p className="text-green-700 font-semibold mb-2">Answer:</p>
                    <p className="text-sm">{writtenQuestions[questionIndex]?.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* MCQ */}
          {tab === "mcq" && mcqQuestions.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-4">
                {mcqQuestions[questionIndex]?.question}
              </h3>

              <div className="space-y-3">
                {mcqQuestions[questionIndex]?.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isAnswerCorrect = mcqQuestions[questionIndex]?.correctIndex === idx;

                  return (
                    <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="mcq"
                        checked={isSelected}
                        onChange={() => handleMCQCheck(idx)}
                      />
                      <span
                        className={
                          isSelected
                            ? isAnswerCorrect
                              ? "text-green-600"
                              : "text-red-600"
                            : "text-gray-800"
                        }
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-green-500 mt-6 p-4 rounded"
                  >
                    <p className="text-green-700 font-semibold">Explanation:</p>
                    <p className="text-sm text-gray-800">
                      {mcqQuestions[questionIndex]?.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Flashcards */}
          {tab === "flash" && flashcards.length > 0 && (
            <div className="flex justify-center w-full">
              <div
                className="relative w-full max-w-md h-80 perspective cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  className="absolute w-full h-full rounded-lg shadow"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                    transition: "0.6s",
                  }}
                >
                  {/* Front */}
                  <div className="absolute w-full h-full flex items-center justify-center text-lg text-white font-semibold p-6 backface-hidden"
                       style={{ backgroundColor: "#1e3a8a" }}>
                    {flashcards[questionIndex]?.question}
                  </div>

                  {/* Back */}
                  <div className="absolute w-full h-full flex items-center justify-center text-lg text-white font-semibold p-6"
                       style={{ backgroundColor: "#059669", transform: "rotateY(180deg)" }}>
                    {flashcards[questionIndex]?.answer}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Q/A Pairs */}
          {tab === "qa" && qaPairs.length > 0 && (
            <div className="space-y-4">
              {qaPairs.map((item, idx) => (
                <div key={idx}>
                  <p className="font-medium text-gray-900">{idx + 1}. {item.question}</p>
                  <p className="text-gray-700 ml-4 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          {tab !== "qa" && (
            <div className="flex justify-between mt-6 max-w-md w-full">
              <button
                onClick={handlePrevious}
                disabled={questionIndex === 0}
                className="px-4 py-2 text-sm bg-gray-200 rounded"
              >
                &lt; Previous
              </button>

              <button
                onClick={handleNext}
                disabled={
                  tab === "text"
                    ? questionIndex === writtenQuestions.length - 1
                    : tab === "mcq"
                    ? questionIndex === mcqQuestions.length - 1
                    : questionIndex === flashcards.length - 1
                }
                className="px-4 py-2 text-sm bg-gray-200 rounded"
              >
                Next &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestions;
