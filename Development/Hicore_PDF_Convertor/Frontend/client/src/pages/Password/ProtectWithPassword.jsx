import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { FiLock, FiTrash2, FiLoader } from "react-icons/fi";
import { FaFilePdf, FaCheckCircle, FaRegClock } from "react-icons/fa";

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

const ProtectWithPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileInputRef = useRef(null);

  /* ---------- FILE ---------- */
  const initialFiles = state?.selectedFiles || [];
  const [file, setFile] = useState(initialFiles[0] || null);

  /* ---------- PDF PREVIEW ---------- */
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const pdfRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  /* ---------- PASSWORD ---------- */
  const [password, setPassword] = useState("");

  /* ---------- OPTIONS ---------- */
  const [restrictActions, setRestrictActions] = useState(false);
  const [strongEncryption, setStrongEncryption] = useState(false);
  const [separatePasswords, setSeparatePasswords] = useState(false);
  const [renameAfter, setRenameAfter] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  /* ---------- SUBMISSION STATE ---------- */
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  /* ---------- LOAD PDF ---------- */
  const loadPdf = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    pdfRef.current = pdf;

    setTotalPages(pdf.numPages);
    setCurrentPage(1);
    renderPage(1);
  };

  const renderPage = async (pageNumber) => {
    if (!pdfRef.current || !canvasRef.current || !canvasWrapperRef.current)
      return;

    const page = await pdfRef.current.getPage(pageNumber);

    // Base viewport
    const baseViewport = page.getViewport({ scale: 1 });

    // Fit width to container (padding safe)
    const containerWidth = canvasWrapperRef.current.clientWidth - 32;
    const scale = containerWidth / baseViewport.width;

    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 🔑 Hi-DPI / Retina support
    const outputScale = window.devicePixelRatio || 1;

    // Internal canvas size
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);

    // CSS size (THIS makes it visually fit)
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    // Scale drawing context
    ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render PDF page
    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;
  };


  useEffect(() => {
    if (file) loadPdf(file);
  }, []);

  const handleAddFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    loadPdf(f);
  };

  const removeFile = () => {
    setFile(null);
    setPassword("");
    setCurrentPage(1);
    setTotalPages(0);
    pdfRef.current = null;
  };



  const applyProtection = async () => {
    if (!file || password.length < 6) return;

    setIsProcessing(true);
    setError(null);
    setResultUrl(null);

    try {
      // 1. Tool Action
      const actionRes = await fetch(`${API_BASE}/api/tool-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "password", action: "add_password" }),
      });

      if (!actionRes.ok) {
        const text = await actionRes.text();
        throw new Error(text || `Tool action failed: ${actionRes.status}`);
      }

      const { redirect_to } = await actionRes.json();
      const uploadUrl = redirect_to.startsWith("/api")
        ? `${API_BASE}${redirect_to}`
        : `${API_BASE}/api${redirect_to}`;

      // 2. Upload
      const fd = new FormData();
      fd.append("file", file, file.name || "file.pdf");
      fd.append("tool", "password");
      fd.append("action", "add_password");

      const settings = {
        password,
        restrict_actions: restrictActions,
        strong_encryption: strongEncryption,
        separate_passwords: separatePasswords,
        rename_after: renameAfter,
        remember_password: rememberPassword
      };

      fd.append("settings", JSON.stringify(settings));

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `Protect failed: ${res.status}`);
      }

      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      setResultUrl(url);

    } catch (err) {
      console.error("Protect error:", err);
      setError(err.message || "Failed to protect PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `protected-${file?.name || "doc.pdf"}`;
    a.click();
  };
 
  const FiDownload = ({ size }) => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size || "1em"} width={size || "1em"} xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  );

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* ================= TOP BAR ================= */}
          <div className="col-span-9 relative">
            <div className="flex items-center gap-10 bg-[#F7E6E9]/[0.30] border border-[#F3D9DD] rounded-md px-4 py-6 shadow-sm">
              <button
                onClick={() => navigate("/tools/protect-with-password")}
                className="flex gap-2 items-center text-md text-gray-700 hover:text-red-700 transition-colors"
              >
                <img src={iconBack} className="w-5" />
                Back
              </button>

              <label className="px-6 py-2 border border-[#B2011E] rounded-md bg-white cursor-pointer hover:bg-red-50 transition-all font-medium text-gray-800 shadow-sm active:scale-95 text-sm uppercase">
                Add file
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleAddFile}
                  hidden
                />
              </label>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
                {[iconMonitor, iconGrid, iconTriangle, iconCloud].map(
                  (i, k) => (
                    <button
                      key={k}
                      className="p-2 bg-white border border-[#B2011E] rounded-md hover:bg-gray-50 transition-colors active:scale-90"
                    >
                      <img src={i} className="w-5" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL (TASK STATUS) ================= */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-rose-100 rounded-md p-6 flex flex-col justify-between shadow-sm">
            <div className="text-center py-4">
              <h2 className="text-sm font-bold mb-6 border-b pb-5 text-center border-red-800 text-red-800 uppercase tracking-wider">
                Task Status
              </h2>

              {resultUrl ? (
                <div className="flex flex-col items-center animate-fadeIn text-center">
                  <FaCheckCircle className="text-green-500 text-5xl mb-3 shadow-sm" />
                  <p className="text-md font-semibold text-gray-800">
                    Protected Successfully!
                  </p>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Your encrypted PDF is ready for download
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  {isProcessing ? (
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-700"></div>
                      <FiLock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl text-red-600 animate-pulse" />
                    </div>
                  ) : (
                    <FaRegClock className="text-5xl mb-3 opacity-20" />
                  )}
                  <p className="text-sm px-4 text-center leading-relaxed mt-4 font-medium">
                    {isProcessing
                      ? "Securing your document..."
                      : "Enter a password and click protect"}
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 text-[10px] text-red-600 bg-red-50 p-3 rounded-md border border-red-100 italic leading-tight">
                  {error}
                </div>
              )}
            </div>

            <button
              onClick={resultUrl ? handleDownloadResult : applyProtection}
              disabled={isProcessing || (!file || password.length < 6)}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-4 rounded-md w-full transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <FiLoader className="animate-spin" /> Protecting...
                </>
              ) : resultUrl ? (
                <>
                  <FiDownload /> Download Result
                </>
              ) : (
                <>
                  <FiLock /> Protect Document
                </>
              )}
            </button>
          </aside>

          {/* ================= LEFT PANEL ================= */}
          <aside className="col-span-3 bg-gray-50 border border-[#F3D9DD] rounded-lg p-4 flex flex-col gap-4 shadow-sm h-fit">
            {/* FILE NAME CARD */}
            {file ? (
              <div className="p-3 border border-[#E7B0B9] bg-white rounded-md flex items-center gap-3 shadow-sm transition-all hover:bg-gray-50">
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
              <div className="text-sm text-gray-400 text-center py-8 border-2 border-dashed border-[#E7B0B9] rounded-md bg-white italic font-medium">
                No file selected
              </div>
            )}

            {/* PASSWORD BOX */}
            <div className="border border-[#F3D9DD] rounded-md p-4 bg-white mb-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                <FiLock /> Enter the password
              </h3>

              <input
                type="password"
                placeholder="Enter the password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-[#E7B0B9] rounded text-sm"
              />
            </div>

            {/* OPTIONS */}
           

            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-gray-700 flex gap-3">
              <span className="text-red-500">💡</span>
              <span>
                Minimum 6 characters. Use letters, numbers, or symbols.
              </span>
            </div>
          </aside>

          {/* ================= CENTER PREVIEW ================= */}
          <main className="col-span-6 bg-white border border-[#E7B0B9] rounded-lg p-4 h-[80vh] flex flex-col shadow-md">
            {file ? (
              <div className="flex flex-col h-full overflow-hidden">
                <div 
                   ref={canvasWrapperRef} 
                   className="flex-1 overflow-y-auto hide-scrollbar bg-gray-100 rounded flex justify-center items-start shadow-inner p-4"
                >
                  <canvas ref={canvasRef} className="bg-white shadow-lg mb-4 mx-auto" />
                </div>
 
                <div className="flex justify-between items-center mt-4 px-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => {
                      const p = currentPage - 1;
                      setCurrentPage(p);
                      renderPage(p);
                    }}
                    className="px-8 py-2 border border-red-200 rounded text-[11px] font-black uppercase tracking-[0.2em] disabled:opacity-30 text-red-700 hover:bg-red-50 transition-all hover:shadow-sm active:scale-95 bg-white"
                  >
                    Prev
                  </button>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                      const p = currentPage + 1;
                      setCurrentPage(p);
                      renderPage(p);
                    }}
                    className="px-8 py-2 border border-red-200 rounded text-[11px] font-black uppercase tracking-[0.2em] disabled:opacity-30 text-red-700 hover:bg-red-50 transition-all hover:shadow-sm active:scale-95 bg-white"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 group cursor-pointer hover:bg-gray-50 rounded-xl transition-all border-2 border-dashed border-[#F3D9DD] p-12 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 group-hover:scale-105 group-hover:bg-red-50 transition-all duration-500 shadow-sm ring-1 ring-[#F3D9DD] relative mx-auto">
                  <FaFilePdf size={48} className="text-rose-200 group-hover:text-red-400 group-hover:animate-pulse" />
                  <div className="absolute inset-0 border-2 border-red-500/0 rounded-full group-hover:border-red-500/5 transition-all" />
                </div>
                <h3 className="font-black text-gray-400 uppercase tracking-[0.2em] text-sm text-center mb-2">No PDF Preview Available</h3>
                <p className="text-[11px] font-medium text-gray-400 italic text-center max-w-[240px] leading-relaxed px-4 mx-auto">Select a PDF document from your device or cloud storage to initialize encryption</p>
                <div className="mt-8 px-6 py-2 bg-white border border-[#F3D9DD] rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:border-red-400 group-hover:text-red-500 transition-all mx-auto">
                  Click to Browse
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProtectWithPassword;
