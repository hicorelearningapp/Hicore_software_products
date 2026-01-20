import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { FiTrash2, FiGlobe, FiDownload, FiLoader } from "react-icons/fi";
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

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ta", label: "Tamil" },
  { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "ar", label: "Arabic" },
  { code: "zh-cn", label: "Chinese (Simplified)" },
  { code: "ja", label: "Japanese" },
  { code: "ru", label: "Russian" },
];

const TranslatePdf = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileInputRef = useRef(null);

  /* ---------- FILE ---------- */
  const initialFiles =
    (state?.selectedFiles && state.selectedFiles.slice(0, 1)) || [];
  const [file, setFile] = useState(initialFiles[0] || null);

  /* ---------- PDF ---------- */
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const pdfRef = useRef(null);

  const [pdfMeta, setPdfMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  /* ---------- TRANSLATION ---------- */
  const [language, setLanguage] = useState("");

  /* ---------- FILE HANDLERS ---------- */
  const handleAddFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl(null);
    setCurrentPage(1);
    setError(null);
  };

  const removeFile = () => {
    setFile(null);
    pdfRef.current = null;
    setPdfMeta(null);
    setResultUrl(null);
    setError(null);
  };

  /* ---------- LOAD PDF ---------- */
  useEffect(() => {
    if (!file) return;

    const loadPdf = async () => {
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        pdfRef.current = pdf;
        setPdfMeta({ numPages: pdf.numPages });
        renderPage(1);
      } catch (err) {
        console.error("PDF load error:", err);
        setError("Failed to load PDF preview.");
      }
    };

    loadPdf();
  }, [file]);

  const renderPage = async (pageNum) => {
    if (!pdfRef.current) return;
    try {
      const page = await pdfRef.current.getPage(pageNum);
      const baseViewport = page.getViewport({ scale: 1 });

      // Handle wrapper width safely
      const width = canvasWrapperRef.current ? canvasWrapperRef.current.clientWidth : 600;
      const scale = width / baseViewport.width;

      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;

      if (canvas) {
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
      }
    } catch (err) {
      console.warn("Page render error:", err);
    }
  };

  /* ---------- APPLY TRANSLATION ---------- */
  const applyTranslate = async () => {
    if (!file || !language || isProcessing) return;
    setIsProcessing(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("action", "translate");
      fd.append("files", file);
      fd.append("target_lang", language);

      const res = await fetch(`${API_BASE}/api/ai`, {
        method: "POST",
        body: fd
      });

      if (!res.ok) {
        let errMsg = `Translation failed: ${res.status}`;
        try {
          const errJson = await res.json();
          errMsg = errJson.detail || errMsg;
        } catch {
          errMsg = await res.text();
        }
        throw new Error(errMsg);
      }

      // Update state for Task Status panel
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setResultUrl(url);

    } catch (err) {
      console.error("Translation error:", err);
      setError(err.message || "Failed to translate document.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* ================= TOP BAR ================= */}
          <div className="col-span-9 relative">
            <div className="flex items-center gap-10 bg-[#F7E6E9]/[0.30] border border-[#F3D9DD] rounded-md px-4 py-6 shadow-sm">
              <button
                onClick={() => navigate("/tools/mulitilanguage-translate")}
                className="flex gap-2 items-center text-md text-gray-700 hover:text-red-700 transition-colors"
              >
                <img src={iconBack} className="w-5" /> Back
              </button>

              <label className="px-6 py-2 border border-[#B2011E] rounded-md bg-white cursor-pointer hover:bg-red-50 transition-all font-medium text-gray-800 shadow-sm active:scale-95 text-sm">
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
                <div className="flex flex-col items-center animate-fadeIn">
                  <FaCheckCircle className="text-green-500 text-5xl mb-3 shadow-sm" />
                  <p className="text-md font-semibold text-gray-800">
                    Translated Successfully!
                  </p>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Your translated file is ready for download
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  {isProcessing ? (
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-700"></div>
                      <FiGlobe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl text-red-600 animate-pulse" />
                    </div>
                  ) : (
                    <FaRegClock className="text-5xl mb-3 opacity-20" />
                  )}
                  <p className="text-sm px-4 text-center leading-relaxed mt-4">
                    {isProcessing
                      ? "Processing your request..."
                      : "Choose a language and click translate"}
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
              onClick={
                resultUrl
                  ? () => {
                      const a = document.createElement("a");
                      a.href = resultUrl;
                      a.download = `translated_${language}_${file?.name || 'document.pdf'}`;
                      a.click();
                    }
                  : applyTranslate
              }
              disabled={isProcessing || (!file || !language)}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-4 rounded-md w-full transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <FiLoader className="animate-spin" /> Translating...
                </>
              ) : resultUrl ? (
                <>
                  <FiDownload /> Download Now
                </>
              ) : (
                <>
               Translate PDF
                </>
              )}
            </button>
          </aside>

          {/* ================= LEFT PANEL (FILE INFO & OPTIONS) ================= */}
          <aside className="col-span-3 bg-gray-50 border border-[#F3D9DD] rounded-lg p-4 h-fit flex flex-col gap-6 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-3">Selected PDF</h3>

              {file ? (
                <>
                  <div className="p-3 border border-[#E7B0B9] bg-white rounded flex items-center gap-3 shadow-sm transition-all hover:bg-gray-50">
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
                  {pdfMeta && (
                    <div className="mt-2 text-[11px] font-bold text-gray-500 flex justify-center px-1 uppercase tracking-widest border-t pt-2 border-rose-50">
                      <span>{pdfMeta.numPages} Pages Detected</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-400 text-center py-8 border-2 border-dashed border-[#E7B0B9] rounded bg-white italic font-medium">
                  No document selected
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-3 px-1 text-center">Target Language</h3>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setResultUrl(null);
                }}
                className="w-full border border-[#E7B0B9] rounded px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-100 transition-all font-medium text-gray-700 shadow-sm"
                disabled={!file}
              >
                <option value="">Choose language</option>
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
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
                    {currentPage} / {pdfMeta?.numPages || 0}
                  </span>
                  <button
                    disabled={currentPage >= (pdfMeta?.numPages || 0)}
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
              <div 
                className="flex flex-col items-center justify-center h-full text-gray-300 group cursor-pointer hover:bg-gray-50 rounded-xl transition-all border-2 border-dashed border-[#F3D9DD] p-12 shadow-inner" 
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 group-hover:scale-105 group-hover:bg-red-50 transition-all duration-500 shadow-sm ring-1 ring-[#F3D9DD] relative mx-auto">
                  <FaFilePdf size={48} className="text-rose-200 group-hover:text-red-400 group-hover:animate-pulse" />
                  <div className="absolute inset-0 border-2 border-red-500/0 rounded-full group-hover:border-red-500/5 transition-all" />
                </div>
                <h3 className="font-black text-gray-400 uppercase tracking-[0.2em] text-sm text-center mb-2">No PDF Preview Available</h3>
                <p className="text-[11px] font-medium text-gray-400 italic text-center max-w-[240px] leading-relaxed px-4 mx-auto">Select a PDF document from your device or cloud storage to initialize translation</p>
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

export default TranslatePdf;
