import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";

const TechQuizzes = () => {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("text");
  const [generated, setGenerated] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    writtenQuestions: [],
    mcqQuestions: [],
    flashCards: [],
    qaPairs: [],
  });

  const handleGenerate = async () => {
    if (!topic.trim()) return alert("Please enter a topic.");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://hicore.pythonanywhere.com/tech-quiz",
        { topic: topic.trim() }
      );

      const result = {
        writtenQuestions: response.data.writtenQuestions || [],
        mcqQuestions: response.data.mcqQuestions || [],
        flashCards: response.data.flashcards || [],
        qaPairs: response.data.qaPairs || [],
      };

      setData(result);
      setGenerated(true);
    } catch (err) {
      alert("Error fetching questions.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetStates = () => {
    setAnswer("");
    setShowAnswer(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setIsFlipped(false);
  };

  const handleNext = () => {
    const maxIndex =
      type === "text"
        ? data.writtenQuestions.length - 1
        : type === "mcq"
        ? data.mcqQuestions.length - 1
        : type === "flash"
        ? data.flashCards.length - 1
        : data.qaPairs.length - 1;

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

  const handleMCQCheck = (index) => {
    setSelectedOption(index);
    const correct = index === data.mcqQuestions[questionIndex]?.correctIndex;
    setIsCorrect(correct);
  };

  const downloadQAPairs = async () => {
    if (data.qaPairs.length === 0) return;

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
            ...data.qaPairs.map((q, i) => [
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {!generated ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl mx-auto">
          <h2 className="text-center text-2xl font-semibold text-indigo-800 mb-6">
            Tech Quizzes
          </h2>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter a Topic to Practice:
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., React, Java, C#"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-6 text-sm"
          />

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded text-sm font-semibold ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {isLoading ? "Generating..." : "Generate Quiz Sections"}
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto mt-10 px-4">
          <h2 className="text-center text-xl font-semibold text-indigo-900 mb-6">
            Tech Quizzes for Practice 
          </h2>

          <div className="bg-white border border-gray-300 rounded-lg shadow overflow-hidden flex flex-col md:flex-row h-[600px]">
            <div className="w-full md:w-1/4 p-6 space-y-6 border-r border-gray-300 overflow-auto">
              {[
                { key: "text", title: "Text Box Answer", desc: "Practice with Written Answers" },
                { key: "mcq", title: "Multiple Choice", desc: "Test Your Knowledge with MCQs" },
                { key: "flash", title: "Flash Card Activity", desc: "Quick Recall with Flashcards" },
                { key: "qa", title: "Question & Answer", desc: "View Question and Answer Pair" },
              ].map((item) => (
                <div key={item.key}>
                  <h3
                    className={`font-bold cursor-pointer ${
                      type === item.key
                        ? "text-indigo-800 bg-indigo-100 p-2 rounded"
                        : "text-indigo-900"
                    }`}
                    onClick={() => {
                      setType(item.key);
                      setQuestionIndex(0);
                      resetStates();
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              ))}
              <button
                onClick={downloadQAPairs}
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 text-sm"
              >
                Download All Q/A
              </button>
            </div>

            <div className="w-full md:w-3/4 p-6 flex flex-col justify-between items-center overflow-auto">
              {type === "text" && data.writtenQuestions.length > 0 && (
                <div className="w-full">
                  <h3 className="mb-4 font-medium text-gray-800">
                    {data.writtenQuestions[questionIndex]?.question}
                  </h3>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-32 p-3 border border-gray-300 rounded mb-4 resize-none text-sm"
                  />
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 text-sm"
                  >
                    Check Answer
                  </button>
                  <AnimatePresence>
                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="bg-white border border-green-500 rounded mt-6 p-4"
                      >
                        <p className="text-green-700 font-semibold mb-2 text-sm">Answer:</p>
                        <p className="text-sm whitespace-pre-line text-gray-800">
                          {data.writtenQuestions[questionIndex]?.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {type === "mcq" && data.mcqQuestions.length > 0 && (
                <div className="w-full">
                  <h3 className="mb-4 font-medium text-gray-800">
                    {data.mcqQuestions[questionIndex]?.question}
                  </h3>
                  <div className="space-y-3">
                    {data.mcqQuestions[questionIndex]?.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isAnswerCorrect = data.mcqQuestions[questionIndex]?.correctIndex === idx;
                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-2 text-sm cursor-pointer ${
                            isSelected
                              ? isAnswerCorrect
                                ? "text-green-600"
                                : "text-red-600"
                              : "text-gray-800"
                          }`}
                        >
                          <input
                            type="radio"
                            name="mcq"
                            checked={isSelected}
                            onChange={() => handleMCQCheck(idx)}
                            className={
                              isSelected
                                ? isAnswerCorrect
                                  ? "accent-green-600"
                                  : "accent-red-600"
                                : "accent-gray-400"
                            }
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {isCorrect && (
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="bg-white border border-green-500 rounded mt-6 p-4"
                      >
                        <p className="text-green-700 font-semibold mb-2 text-sm">Explanation:</p>
                        <p className="text-sm text-gray-800">
                          {data.mcqQuestions[questionIndex]?.explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {type === "flash" && data.flashCards.length > 0 && (
                <div className="w-full flex flex-col items-center">
                  <div
                    className="relative w-full max-w-md h-80 perspective cursor-pointer"
                    onClick={() => setIsFlipped((prev) => !prev)}
                  >
                    <motion.div
                      className="absolute w-full h-full rounded-lg shadow-lg"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        transition: "transform 0.6s ease-in-out",
                      }}
                    >
                      <div
                        className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-lg text-white text-center text-lg font-semibold p-6"
                        style={{ backgroundColor: "#1e3a8a" }}
                      >
                        {data.flashCards[questionIndex]?.question}
                      </div>
                      <div
                        className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-lg text-white text-center text-lg font-semibold p-6"
                        style={{
                          transform: "rotateY(180deg)",
                          backgroundColor: "#059669",
                        }}
                      >
                        {data.flashCards[questionIndex]?.answer}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {type === "qa" && data.qaPairs.length > 0 && (
                <div className="w-full space-y-6">
                  {data.qaPairs.map((item, idx) => (
                    <div key={idx}>
                      <p className="text-gray-900 font-medium text-base mb-1">
                        {idx + 1}. {item.question}
                      </p>
                      <p className="text-gray-700 text-sm ml-4">{item.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between mt-6 w-full max-w-md">
                <button
                  onClick={handlePrevious}
                  className="bg-gray-200 px-4 py-2 rounded text-sm"
                  disabled={questionIndex === 0}
                >
                  &lt; Previous
                </button>
                <button
                  onClick={handleNext}
                  className="bg-gray-200 px-4 py-2 rounded text-sm"
                  disabled={
                    type === "text"
                      ? questionIndex === data.writtenQuestions.length - 1
                      : type === "mcq"
                      ? questionIndex === data.mcqQuestions.length - 1
                      : type === "flash"
                      ? questionIndex === data.flashCards.length - 1
                      : questionIndex === data.qaPairs.length - 1
                  }
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechQuizzes;
