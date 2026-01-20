import React, { useState, useRef } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { iconimage } from "../assets/uploadIcon";

const ChatWithPdf = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [docId, setDocId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper: generate a simple mock doc id
  const generateMockDocId = (f) =>
    `mock-${f.name.replace(/\s+/g, "_")}-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;

  // Handle file selection (mock upload, no backend)
  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // File size check (keep same rule as UI)
    const maxBytes = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > maxBytes) {
      setFile(null);
      setDocId(null);
      setMessages([
        {
          sender: "bot",
          text: "Selected file exceeds 100MB limit. Please choose a smaller file.",
        },
      ]);
      return;
    }

    setFile(selectedFile);

    // Simulate upload delay and success
    setMessages([{ sender: "bot", text: "Uploading PDF..." }]);
    setLoading(true);
    setTimeout(() => {
      const id = generateMockDocId(selectedFile);
      setDocId(id);
      setMessages([
        {
          sender: "bot",
          text: "PDF uploaded successfully. Ask your question!",
        },
      ]);
      setLoading(false);
    }, 700); // small simulated delay
  };

  // Simulated answer generator (simple mock logic)
  const generateMockAnswer = (question, uploadedFile) => {
    const q = question.trim().toLowerCase();

    // small heuristics for a slightly smarter mock response
    if (q.includes("title") || q.includes("name")) {
      return uploadedFile
        ? `Mock answer: The uploaded file is named "${uploadedFile.name}".`
        : "Mock answer: No file info available.";
    }
    if (q.includes("size") || q.includes("how big") || q.includes("mb")) {
      return uploadedFile
        ? `Mock answer: The file size is ${(
            uploadedFile.size /
            (1024 * 1024)
          ).toFixed(2)} MB.`
        : "Mock answer: I don't have the file size info.";
    }
    if (
      q.includes("pages") ||
      q.includes("page count") ||
      q.includes("how many pages")
    ) {
      return "Mock answer: Page count isn't available in this frontend mock. In the real app the backend would return it.";
    }

    // default echo-style mock answer
    return `Mock answer (frontend-only): I received your question — "${question}". In the real app I would query the PDF content and return a contextual answer.`;
  };

  // Send a question (mocked)
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!docId) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Please upload a PDF first." },
      ]);
      return;
    }

    // add user message immediately
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const questionText = input;
    setInput("");
    setLoading(true);

    // simulate processing time and return a mock response
    setTimeout(() => {
      const mock = generateMockAnswer(questionText, file);
      setMessages((prev) => [...prev, { sender: "bot", text: mock }]);
      setLoading(false);
    }, 900); // simulated thinking delay
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#efe9e9] to-white px-4 py-30">
      <div className="flex flex-col items-center text-center">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-5">
          Chat with PDF
        </h1>
        <p className="text-gray-500 mb-10">
          Upload your PDF and ask questions. Get instant answers powered by AI.
        </p>

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-red-700 hover:bg-red-800 text-white text-xl  font-light px-12  py-3 rounded-md mb-4"
        >
          {file ? `Selected: ${file.name}` : "Upload PDF"}
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Upload Source Icons */}
        <div className="flex gap-6 justify-center mb-6 mt-2">
          {[
            iconimage.grapes_icon,
            iconimage.drive_icon,
            iconimage.cloud_icon,
          ].map((img, index) => (
            <button key={index}>
              <img
                src={img}
                alt={`icon-${index}`}
                className="w-12 h-12 object-contain"
              />
            </button>
          ))}
        </div>

        {/* Supported formats text */}
        <p className="text-gray-500 text-sm">
          Supported formats: PDF (max 100MB)
        </p>

        {/* Security Info */}
        <div className="flex items-center gap-2 text-black font-medium text-lg mt-4">
          <BsCheckCircleFill className="text-green-600 w-6 h-6" />
          Your file is secure.
        </div>

        {/* Chat Section */}
        <div className="max-w-3xl w-full mt-10 bg-white shadow shadow-gray-300 rounded-lg p-6 mx-auto">
          {/* Search Bar + Ask Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
            <input
              type="text"
              placeholder="Ask something about your PDF..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded p-3 focus:outline-none focus:border-red-700 w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button
              onClick={handleSendMessage}
              className="bg-red-700 text-white px-6 py-3 rounded hover:bg-red-900 w-full sm:w-auto"
            >
              Ask
            </button>
          </div>

          {/* Output Box */}
          <div className="border border-gray-300 rounded-lg p-4 h-80 overflow-y-auto text-left">
            {messages.length === 0 && !loading && (
              <p className="text-gray-500 italic text-center">Output</p>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 p-2 rounded ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-red-500 italic">Thinking...</div>}
          </div>
        </div>

        {/* Steps Section */}
        <div className="max-w-7xl w-full mt-30">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            How to Chat with PDF
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left text-sm">
            {[
              {
                title: "Step 1",
                description: "Upload your PDF file securely.",
              },
              {
                title: "Step 2",
                description: "Type your question in the chat box.",
              },
              {
                title: "Step 3",
                description: "Receive instant AI-powered answers.",
              },
              {
                title: "Step 4",
                description: "Review the Answer.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="border border-red-300 rounded-md p-10 bg-white"
              >
                <h3 className="font-semibold text-red-700 text-[15px] mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithPdf;
