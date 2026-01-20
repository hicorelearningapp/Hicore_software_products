import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { FiTrash2 } from "react-icons/fi";
import {
  FaFilePdf,
  FaCheckCircle,
  FaRegClock,
} from "react-icons/fa";

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

const AddNumberPages = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileInputRef = useRef(null);

  /* ---------- FILE ---------- */
  const initialFiles =
    (state?.selectedFiles && state.selectedFiles.slice(0, 1)) || [];
  const [file, setFile] = useState(
    initialFiles[0] instanceof File ? initialFiles[0] : null
  );

  /* ---------- PDF STATE ---------- */
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const pdfRef = useRef(null);
  const viewportRef = useRef(null);

  const [pdfMeta, setPdfMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------- NUMBER OPTIONS ---------- */
  const [numberFormat, setNumberFormat] = useState("numbers");
  const [fontSize, setFontSize] = useState(12);
  const [fontColor, setFontColor] = useState("#000000");
  const [opacity, setOpacity] = useState(1);

  const [addAllPages, setAddAllPages] = useState(true);
  const [skipFirstPage, setSkipFirstPage] = useState(false);
  const [compressAfter, setCompressAfter] = useState(false);
  const [keepFileName, setKeepFileName] = useState(true);
  const [flattenNumbers, setFlattenNumbers] = useState(false);

  /* ---------- NEW RANGE OPTIONS ---------- */
  const [startNumberFrom, setStartNumberFrom] = useState(1);
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  /* ---------- SUBMISSION STATE ---------- */
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  /* ---------- FILE HANDLERS ---------- */
  const handleAddFile = (e) => {
    const f = e.target.files?.[0];
    if (!f || !isPdfFile(f)) return;
    setFile(f);
    setCurrentPage(1);
  };

  const removeFile = () => {
    setFile(null);
    pdfRef.current = null;
    setPdfMeta(null);
  };

  /* ---------- LOAD PDF ---------- */
  useEffect(() => {
    if (!file) return;

    const loadPdf = async () => {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      pdfRef.current = pdf;
      setPdfMeta({ numPages: pdf.numPages });
      renderPage(1);
    };

    loadPdf();
  }, [file]);

  const renderPage = async (pageNum) => {
    const page = await pdfRef.current.getPage(pageNum);
    const baseViewport = page.getViewport({ scale: 1 });
    const width = canvasWrapperRef.current.clientWidth;
    const scale = width / baseViewport.width;

    const viewport = page.getViewport({ scale });
    viewportRef.current = viewport;

    const canvas = canvasRef.current;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
  };

  /* ---------- API SUBMISSION ---------- */
  const handleAddNumber = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    // cleanup old result
    if (resultUrl) {
      try { URL.revokeObjectURL(resultUrl); } catch { }
      setResultUrl(null);
    }

    try {
      // 1. Tool Action
      const actionRes = await fetch(`${API_BASE}/api/tool-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "edit", action: "add_page_numbers" }),
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
      fd.append("tool", "edit");
      fd.append("action", "add_page_numbers");

      const settings = {
        number_format: numberFormat,
        font_size: fontSize,
        font_color: fontColor,
        opacity: opacity,
        add_to_all_pages: addAllPages,
        skip_first_page: skipFirstPage,
        compress_after: compressAfter,
        keep_filename: keepFileName,
        flatten_numbers: flattenNumbers,
        start_number_from: startNumberFrom,
        range_from: rangeFrom,
        range_to: rangeTo
      };

      fd.append("settings", JSON.stringify(settings));

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `Add Number Pages failed: ${res.status}`);
      }

      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      setResultUrl(url);

    } catch (err) {
      console.error("Add Number Pages error:", err);
      setError(err.message || "Failed to add page numbers.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `numbered-${file?.name || "doc.pdf"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* ================= TOP BAR ================= */}
          <div className="col-span-9 relative">
            <div className="flex items-center gap-10 bg-[#F7E6E9]/30 border border-[#F3D9DD] rounded-md px-4 py-6">
              <button
                onClick={() => navigate("/tools/add-numberpages")}
                className="flex items-center gap-2 text-gray-700"
              >
                <img src={iconBack} className="w-5 h-5" />
                Back
              </button>

              <label className="inline-flex items-center gap-2 px-3 py-2 border  border-[#B2011E] rounded bg-white cursor-pointer">
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
                      className="p-2 bg-white border  border-[#B2011E] rounded-md"
                    >
                      <img src={icon} className="w-5 h-5" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL (TASK STATUS) ================= */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-rose-100 rounded-md p-6 flex flex-col justify-between shadow-sm">
            <div className="text-center py-4">
              <h3 className="text-sm font-bold mb-6 border-b pb-5 text-center border-red-800 text-red-800 uppercase tracking-wider">
                Task Status
              </h3>

              {resultUrl ? (
                <div className="flex flex-col items-center animate-fadeIn">
                  <FaCheckCircle className="text-green-500 text-5xl mb-3" />
                  <p className="text-md font-semibold text-gray-800">
                    Numbered Successfully!
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    Your file is ready for download
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mb-3"></div>
                  ) : (
                    <FaRegClock className="text-5xl mb-3 opacity-20" />
                  )}
                  <p className="text-sm px-4 text-center leading-relaxed">
                    {isProcessing
                      ? "Processing your request..."
                      : "Click the button to apply page numbers"}
                  </p>
                </div>
              )}
              {error && <div className="text-xs text-red-600 mt-4">{error}</div>}
            </div>

            <button
              onClick={resultUrl ? handleDownloadResult : handleAddNumber}
              disabled={!file || isProcessing}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md w-full transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing
                ? "Processing..."
                : resultUrl
                ? "Download Now"
                : "Apply Page Numbers"}
            </button>
          </aside>

          {/* ================= LEFT OPTIONS ================= */}
          <aside className="col-span-3 bg-gray-50 rounded-lg p-4">
            <h2 className="mb-4 font-medium">Page Number Settings</h2>

            {/* FILE */}
            <div className="p-3 border border-[#F3D9DD] bg-[#F7E6E9]/30 rounded mb-4">
              {file ? (
                <div className="flex gap-3 items-center">
                  <img src={pdfIcon} className="w-16 h-16 bg-white rounded" />
                  <div className="flex-1 truncate text-sm">{file.name}</div>
                  <button
                    onClick={removeFile}
                    className="text-red-600 flex gap-1 text-sm"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-400 text-center py-6">
                  No file selected
                </div>
              )}
            </div>

            {/* NUMBER FORMAT */}
            <h4 className="text-sm font-medium mb-2">Number Format</h4>
            <div className="space-y-2 mb-4">
              <label className="flex gap-2">
                <input
                  type="radio"
                  checked={numberFormat === "numbers"}
                  onChange={() => setNumberFormat("numbers")}
                />
                Numbers
              </label>
              <label className="flex gap-2">
                <input
                  type="radio"
                  checked={numberFormat === "roman"}
                  onChange={() => setNumberFormat("roman")}
                />
                Roman Numbers
              </label>
            </div>

            {/* STYLE */}
            <h4 className="text-sm font-medium mb-2">Style Options</h4>
            <div className="space-y-2 mb-4 text-sm">
              <label className="flex justify-between">
                Font Size
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-20 border border-[#F3D9DD] rounded px-1"
                />
              </label>

              <label className="flex justify-between">
                Color
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                />
              </label>

              <label className="flex justify-between">
                Opacity
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(e.target.value)}
                />
              </label>
            </div>

            {/* RANGE CONTROLS */}
            <h4 className="text-sm font-medium mb-2">Page Range</h4>
            <div className="space-y-2 mb-4 text-sm">
              <label className="flex justify-between">
                Start numbering from
                <input
                  type="number"
                  min="1"
                  value={startNumberFrom}
                  onChange={(e) => setStartNumberFrom(e.target.value)}
                  className="w-20 border border-[#F3D9DD] rounded px-1"
                />
              </label>

              <div className="flex justify-between gap-2">
                <input
                  type="number"
                  placeholder="From page"
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  className="w-full border border-[#F3D9DD] rounded px-2 py-1"
                />
                <input
                  type="number"
                  placeholder="To page"
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  className="w-full border border-[#F3D9DD] rounded px-2 py-1"
                />
              </div>
            </div>

            {/* OPTIONS */}
            <div className="space-y-2 text-sm">
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={addAllPages}
                  onChange={(e) => setAddAllPages(e.target.checked)}
                />
                Add to all pages
              </label>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={skipFirstPage}
                  onChange={(e) => setSkipFirstPage(e.target.checked)}
                />
                Skip first page
              </label>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={compressAfter}
                  onChange={(e) => setCompressAfter(e.target.checked)}
                />
                Compress PDF after numbering
              </label>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={keepFileName}
                  onChange={(e) => setKeepFileName(e.target.checked)}
                />
                Keep original file name
              </label>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={flattenNumbers}
                  onChange={(e) => setFlattenNumbers(e.target.checked)}
                />
                Flatten page numbers
              </label>
            </div>
          </aside>

          {/* ================= CENTER PREVIEW ================= */}
          <main className="col-span-6 bg-white border border-[#F3D9DD] rounded-lg p-4 h-[80vh] overflow-y-auto">
            {file ? (
              <>
                <div ref={canvasWrapperRef} className="w-full">
                  <canvas ref={canvasRef} className="w-full block shadow" />
                </div>

                <div className="flex justify-between mt-3 text-sm">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => {
                      setCurrentPage((p) => p - 1);
                      renderPage(currentPage - 1);
                    }}
                  >
                    ← Prev
                  </button>
                  <span>
                    Page {currentPage} of {pdfMeta?.numPages}
                  </span>
                  <button
                    disabled={currentPage >= pdfMeta?.numPages}
                    onClick={() => {
                      setCurrentPage((p) => p + 1);
                      renderPage(currentPage + 1);
                    }}
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-20">
                <img src={pdfIcon} className="mx-auto w-24 mb-4" />
                No file selected
              </div>
            )}
          </main>
        </div>
      </div >
    </div >
  );
};

export default AddNumberPages;
