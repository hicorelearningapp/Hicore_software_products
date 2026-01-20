import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { FiTrash2, FiSend, FiCpu, FiUser } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";

import pdfIcon from "../../assets/Pannelpage/PDF.png";
import iconBack from "../../assets/Pannelpage/Back.png";
import iconMonitor from "../../assets/Pannelpage/Desktop.png";
import iconGrid from "../../assets/Pannelpage/Dropbox.png";
import iconTriangle from "../../assets/Pannelpage/googleDrive.png";
import iconCloud from "../../assets/Pannelpage/Onedrive.png";

/* ---------- pdf.js worker ---------- */
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).toString();

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const isPdfFile = (file) => {
  if (!file) return false;
  if (file.type) return file.type === "application/pdf";
  return /\.pdf$/i.test(file.name || "");
};

const ChatwithPdf = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  /* ---------- STATE ---------- */
  const initialFiles =
    (state?.selectedFiles && state.selectedFiles.slice(0, 1)) || [];

  const [file, setFile] = useState(
    initialFiles[0] instanceof File ? initialFiles[0] : null
  );

  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isSetup, setIsSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);

  /* ---------- EFFECT: SCROLL TO BOTTOM ---------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- EFFECT: AUTO SETUP ON FILE LOAD ---------- */
  useEffect(() => {
    if (file && !isSetup) {
      setupChatSession(file);
    }
  }, [file]);

  /* ---------- HANDLERS ---------- */
  const handleAddFile = (e) => {
    const f = e.target.files?.[0];
    if (!f || !isPdfFile(f)) return;
    setFile(f);
    resetChat();
  };

  const removeFile = () => {
    setFile(null);
    resetChat();
  };

  const resetChat = () => {
    setMessages([]);
    setSessionId(null);
    setIsSetup(false);
    setError(null);
    setInputValue("");
  };

  /* ---------- API ACTIONS ---------- */
  const setupChatSession = async (pdfFile) => {
    setIsLoading(true);
    setMessages([{ role: "system", text: "Initializing chat session..." }]);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("action", "chat_with_pdf");
      fd.append("mode", "setup");
      fd.append("files", pdfFile);

      const res = await fetch(`${API_BASE}/api/ai`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        let errMsg = `Setup failed: ${res.status}`;
        try {
          const errJson = await res.json();
          errMsg = errJson.detail || errMsg;
        } catch {
          errMsg = await res.text();
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      setSessionId(data.session_id);
      setIsSetup(true);

      setMessages([
        {
          role: "system",
          text: `I've analyzed **${pdfFile.name}**. You can now ask me questions about it!`,
        },
      ]);
    } catch (err) {
      console.error("Setup error:", err);
      setError(err.message || "Failed to initialize chat. Please try again.");
      setMessages((prev) => [
        ...prev,
        { role: "error", text: err.message || "Failed to load PDF context." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId || isLoading) return;

    const question = inputValue.trim();
    setInputValue("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("action", "chat_with_pdf");
      fd.append("mode", "query");
      fd.append("session_id", sessionId);
      fd.append("question", question);

      const res = await fetch(`${API_BASE}/api/ai`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error("Query failed");
      }

      const data = await res.json();

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer || "I couldn't find an answer." },
      ]);

    } catch (err) {
      console.error("Query error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "error", text: "Sorry, I encountered an error answering that." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {/* ================= TOP BAR ================= */}
        <div className="relative mb-6">
          <div className="flex items-center gap-10 bg-[#F7E6E9]/30 border border-[#F3D9DD] rounded-md px-4 py-6">
            <button
              onClick={() => navigate("/tools/chat-with-pdf")}
              className="flex items-center gap-2 text-gray-700"
            >
              <img src={iconBack} className="w-5 h-5" />
              Back
            </button>

            {/* ADD FILE */}
            <label className="inline-flex items-center gap-2 px-3 py-2 border border-[#B2011E] rounded bg-white cursor-pointer hover:bg-red-50 transition-colors">
              Add file
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleAddFile}
                className="hidden"
              />
            </label>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
              {[iconMonitor, iconGrid, iconTriangle, iconCloud].map(
                (icon, i) => (
                  <button
                    key={i}
                    className="p-2 bg-white border border-[#B2011E] rounded-md hover:shadow-sm"
                  >
                    <img src={icon} className="w-5 h-5" />
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-12 gap-6">
          {/* ===== LEFT FILE INFO PANEL ===== */}
          <aside className="col-span-4 bg-gray-50 border border-[#F3D9DD] rounded-lg p-4 h-fit">
            <h3 className="font-medium mb-3">Selected PDF</h3>

            {file ? (
              <div className="p-3 border border-[#F3D9DD] bg-white rounded flex items-center gap-3 shadow-sm transition-all hover:bg-gray-50">
                <FaFilePdf className="text-red-600 text-3xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate text-gray-800">{file.name}</div>
                  <div className="text-[11px] text-gray-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button
                  onClick={removeFile}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-bold transition-colors"
                >
                  <FiTrash2 size={16} /> Remove
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-400 text-center py-20 border-2 border-dashed border-gray-200 rounded">
                No file selected
              </div>
            )}

            <div className="mt-8 text-sm text-gray-600">
              <p className="font-semibold mb-2">Instructions:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Upload a PDF to start.</li>
                <li>Wait for initialization.</li>
                <li>Ask specific questions about the content.</li>
              </ul>
            </div>
          </aside>

          {/* ===== RIGHT CHAT AREA ===== */}
          <main className="col-span-8 bg-white border border-[#F3D9DD] rounded-lg flex flex-col h-[70vh]">
            {/* Header */}
            <div className="border-b border-[#F3D9DD] px-6 py-4 bg-gray-50 rounded-t-lg">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiCpu className="text-red-600" /> Chat with PDF
              </h2>
              <p className="text-sm text-gray-500">
                Ask anything, search info, or extract data
              </p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 px-6 py-4 overflow-y-auto bg-gray-50/30 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-20">
                  <p>Upload a PDF to start chatting</p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm shadow-sm ${msg.role === 'user'
                    ? 'bg-red-600 text-white'
                    : msg.role === 'error'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                    {msg.role === 'ai' && <div className="text-xs text-red-600 font-bold mb-1 flex items-center gap-1"><FiCpu /> AI</div>}
                    {msg.role === 'system' && <div className="text-xs text-red-700 font-bold mb-1">SYSTEM</div>}

                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                  </div>
                </div>
              ))}

              {/* LOADING INDICATOR */}
              {isLoading && isSetup && sessionId && (
                <div className="flex justify-start animate-pulse">
                  <div className="max-w-[80%] rounded-lg px-4 py-3 text-sm shadow-sm bg-white border border-rose-100 text-gray-400">
                    <div className="text-xs text-red-400 font-bold mb-1 flex items-center gap-1"><FiCpu className="animate-spin" /> AI</div>
                    <div className="italic flex items-center gap-2">
                       Searching...
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[#F3D9DD] px-4 py-3 flex items-center gap-3 bg-white rounded-b-lg">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isSetup ? "Ask a question about your document..." : "Upload a PDF to start..."}
                className="flex-1 border border-[#F3D9DD] rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 transition-shadow"
                disabled={!isSetup || isLoading}
              />
              <button
                disabled={!isSetup || isLoading || !inputValue.trim()}
                onClick={handleSendMessage}
                className={`p-3 rounded-full transition-colors ${isSetup && !isLoading && inputValue.trim()
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <FiSend />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChatwithPdf;
