import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { FaFilePdf, FaCheckCircle, FaRegClock } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

import pdfIcon from "../../assets/Pannelpage/PDF.png";
import iconBack from "../../assets/Pannelpage/Back.png";
import iconMonitor from "../../assets/Pannelpage/Desktop.png";
import iconGrid from "../../assets/Pannelpage/Dropbox.png";
import iconTriangle from "../../assets/Pannelpage/googleDrive.png";
import iconCloud from "../../assets/Pannelpage/Onedrive.png";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.js`;

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const humanFileSize = (size) => {
  if (!size) return "0 KB";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${
    ["B", "KB", "MB", "GB"][i]
  }`;
};

const SplitPdf = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [file, setFile] = useState(state?.selectedFiles?.[0] || null);
  const [ranges, setRanges] = useState([""]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  // PDF Preview States
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const pdfDocRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const numPagesNote = file ? `This PDF has ${totalPages} pages.` : null;

  const renderPdfPage = async (pageNumber) => {
    if (!pdfDocRef.current || !canvasRef.current || !canvasWrapperRef.current)
      return;
    if (renderTaskRef.current) renderTaskRef.current.cancel();

    try {
      const page = await pdfDocRef.current.getPage(pageNumber);
      const wrapper = canvasWrapperRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = (wrapper.clientWidth - 40) / unscaledViewport.width;
      const viewport = page.getViewport({ scale });

      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
      const renderContext = { canvasContext: context, transform, viewport };

      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;
    } catch (err) {
      if (err.name !== "RenderingCancelledException")
        console.error("Render error:", err);
    }
  };

  const loadPdfDocument = async (targetFile) => {
    if (!targetFile) return;
    try {
      const arrayBuffer = await targetFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setTimeout(() => renderPdfPage(1), 100);
    } catch (err) {
      console.error("Error loading PDF:", err);
    }
  };

  useEffect(() => {
    if (file) loadPdfDocument(file);
  }, [file]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setResultUrl(null);
    setError(null);
    setFile(f);
    setRanges([""]);
  };

  const updateRangeAt = (index, value) => {
    setRanges((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const removeRangeAt = (index) => {
    if (ranges.length > 1) {
      setRanges(ranges.filter((_, i) => i !== index));
    } else {
      setRanges([""]);
    }
  };

  const addRange = () => setRanges([...ranges, ""]);

  const handleSplit = async () => {
    if (!file) return alert("Please upload a PDF first.");
    const combined = ranges
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
      .join(",");
    if (!combined) return alert("Please enter at least one page range.");

    setIsSplitting(true);
    setError(null);

    try {
      const actionRes = await fetch(`${API_BASE}/api/tool-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "organize", action: "split_pdf" }),
      });
      const { redirect_to } = await actionRes.json();
      const uploadUrl = `${API_BASE}${
        redirect_to.startsWith("/api") ? "" : "/api"
      }${redirect_to}`;

      const fd = new FormData();
      fd.append("files", file);
      fd.append("tool", "organize");
      fd.append("action", "split_pdf");
      fd.append("page_ranges", combined);

      const res = await fetch(uploadUrl, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Split failed");

      const blob = await res.blob();
      setResultUrl(
        URL.createObjectURL(new Blob([blob], { type: "application/zip" }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white w-full font-sans">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E7B0B9; border-radius: 10px; }
      `}</style>

      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 mb-4">
          {/* Top Bar */}
          <div className="col-span-9 relative">
            <div className="flex items-center justify-start bg-[#F7E6E9]/[0.30] border border-[#F3D9DD] rounded-md px-4 py-6">
              <div className="flex items-center gap-10">
                <button
                  onClick={() => navigate("/tools/split-pdf")}
                  className="flex items-center gap-2 text-md text-gray-700 hover:text-red-700"
                >
                  <img src={iconBack} alt="back" className="w-5 h-5" /> Back
                </button>
                <label className="inline-flex items-center gap-2 px-3 py-2 border border-[#B2011E] rounded-md bg-white cursor-pointer text-[16px]">
                  Add file
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-3">
                {[iconMonitor, iconGrid, iconTriangle, iconCloud].map(
                  (img, i) => (
                    <button
                      key={i}
                      className="p-2 bg-white border border-[#B2011E] rounded-md"
                    >
                      <img src={img} alt="icon" className="w-5 h-5" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Action Panel */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-rose-100 rounded-md p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-sm font-bold mb-6 border-b pb-5 text-center border-red-800 text-red-800 uppercase tracking-wider">
                Task Status
              </h3>
              {resultUrl ? (
                <div className="flex flex-col items-center animate-fadeIn">
                  <FaCheckCircle className="text-green-500 text-5xl mb-3" />
                  <p className="text-md font-semibold text-gray-800 text-center">
                    Split Successfully!
                  </p>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Your ZIP package is ready for download.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  {isSplitting ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mb-3"></div>
                  ) : (
                    <FaRegClock className="text-5xl mb-3 opacity-20" />
                  )}
                  <p className="text-xs px-4 text-center leading-relaxed">
                    {isSplitting
                      ? "Splitting your PDF..."
                      : "Define your page ranges in the settings panel and click split."}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={
                resultUrl
                  ? () => {
                      const a = document.createElement("a");
                      a.href = resultUrl;
                      a.download = `${
                        file?.name?.replace(".pdf", "") || "split"
                      }_files.zip`;
                      a.click();
                    }
                  : handleSplit
              }
              disabled={isSplitting || !file}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md w-full transition-all shadow-md active:scale-[0.98] disabled:bg-gray-300"
            >
              {isSplitting
                ? "Processing..."
                : resultUrl
                ? "Download ZIP"
                : "Split PDF"}
            </button>
          </aside>

          {/* UPDATED Left Sidebar (Exactly as requested) */}
          <div className="col-span-3">
            <aside className="bg-gray-50 rounded-lg p-4 h-[75vh] flex flex-col">
              {/* Selected file container */}
              <div className="flex items-center justify-between border border-rose-200 bg-[#F7E6E9]/[0.30] p-3 rounded-md">
                {file ? (
                  <div className="flex items-center gap-3">
                    <img src={pdfIcon} className="w-12 h-12" alt="pdf" />
                    <div>
                      <div className="text-sm font-medium">{file.name}</div>
                      <div className="text-xs text-gray-500">
                        {humanFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No PDF selected</div>
                )}

                {/* Remove icon */}
                {file && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setRanges([""]);
                      setResultUrl(null);
                      setError(null);
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 p-1 rounded"
                    aria-label="Remove selected file"
                  >
                    <FiTrash2 size={18} />
                    <span className="text-sm font-medium">Remove</span>
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                id="split-file-input"
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="hidden"
              />

              {/* Upload button (only when no file) */}
              {!file && (
                <label
                  htmlFor="split-file-input"
                  className="block w-full mt-4 py-2 border rounded text-center text-sm cursor-pointer bg-white"
                >
                  Upload PDF
                </label>
              )}

              {/* Tip text */}
              <div className="mt-4 text-sm text-gray-600">
                {numPagesNote ||
                  "Upload a PDF and enter your page ranges below."}
              </div>

              {/* Page ranges wrapped in a single bordered container */}
              <div className="mt-5 flex-1 overflow-y-auto custom-scrollbar">
                <label className="block text-md font-medium mb-2">
                  Page ranges
                </label>

                <div className="border border-[#F3D9DD] bg-[#F7E6E9]/[0.30] rounded-md p-3 ">
                  <div className="space-y-3">
                    {ranges.map((r, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          value={r}
                          onChange={(e) => updateRangeAt(idx, e.target.value)}
                          placeholder={idx === 0 ? "e.g. 1-3" : "e.g. 4,6"}
                          className="w-[70%] px-3 py-2 border border-[#F3D9DD] bg-white rounded text-sm"
                          aria-label={`Page range ${idx + 1}`}
                        />

                        <button
                          onClick={() => removeRangeAt(idx)}
                          className="px-3 py-2 border border-[#F3D9DD] bg-white rounded text-sm whitespace-nowrap"
                          aria-label={`Remove range ${idx + 1}`}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                      onClick={addRange}
                      className="px-3 py-2 border border-[#F3D9DD] rounded text-sm bg-white"
                    >
                      Add Range
                    </button>
                    <button
                      onClick={() => setRanges(["1-3"])}
                      className="px-3 py-2 border bg-white border-[#F3D9DD] rounded text-sm"
                    >
                      Example: 1-3
                    </button>
                    <button
                      onClick={() => setRanges([""])}
                      className="px-3 py-2 border border-[#F3D9DD] bg-white rounded text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Center Main Preview */}
          <main className="col-span-6 bg-white border border-[#E7B0B9] rounded-lg p-4 flex flex-col shadow-sm">
            {file ? (
              <div className="flex flex-col h-[75vh]">
                <div
                  ref={canvasWrapperRef}
                  className="flex-1 overflow-y-auto hide-scrollbar bg-gray-100 rounded flex justify-center items-start p-4 shadow-inner"
                >
                  <canvas ref={canvasRef} className="bg-white shadow-lg" />
                </div>
                <div className="flex justify-between items-center mt-4 px-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => {
                      const p = currentPage - 1;
                      setCurrentPage(p);
                      renderPdfPage(p);
                    }}
                    className="px-6 py-1.5 border border-red-200 rounded text-[10px] font-black disabled:opacity-30 text-red-700 uppercase tracking-widest hover:bg-red-50"
                  >
                    Prev
                  </button>
                  <span className="text-[11px] font-bold text-gray-500 tracking-tighter">
                    PAGE {currentPage} OF {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                      const p = currentPage + 1;
                      setCurrentPage(p);
                      renderPdfPage(p);
                    }}
                    className="px-6 py-1.5 border border-red-200 rounded text-[10px] font-black disabled:opacity-30 text-red-700 uppercase tracking-widest hover:bg-red-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[70vh] text-gray-300">
                <FaFilePdf className="text-8xl mb-4 opacity-10" />
                <p className="font-bold text-gray-400">
                  No file selected for preview
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SplitPdf;
