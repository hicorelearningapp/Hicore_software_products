import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { FaFilePdf, FaCheckCircle, FaRegClock } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

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

const SmartCleanup = () => {
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

  /* ---------- CLEANUP OPTIONS ---------- */
  const [removeDuplicatePages, setRemoveDuplicatePages] = useState(false);
  const [removeBlankPages, setRemoveBlankPages] = useState(false);
  const [fixOrientation, setFixOrientation] = useState(false);
  const [mergeNearIdentical, setMergeNearIdentical] = useState(false);
  const [highlightSuspicious, setHighlightSuspicious] = useState(false);
  const [visualEnhancement, setVisualEnhancement] = useState(false);
  const [textEnhancement, setTextEnhancement] = useState(false);

  /* ---------- STATE FOR LOADING & RESULTS ---------- */
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { success: true/false, message: string }

  /* ---------- LOAD PDF ---------- */
  const loadPdf = async (pdfFile) => {
    if (!pdfFile) return;

    const buffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    pdfRef.current = pdf;

    setTotalPages(pdf.numPages);
    setCurrentPage(1);
    renderPage(1);
  };

  const renderPage = async (pageNumber) => {
    if (!pdfRef.current || !canvasWrapperRef.current) return;

    const page = await pdfRef.current.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });

    const width = canvasWrapperRef.current.clientWidth;
    const scale = width / baseViewport.width;

    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
  };

  /* ---------- AUTO LOAD WHEN FILE CHANGES (FIX) ---------- */
  useEffect(() => {
    if (file) {
      loadPdf(file);
    } else {
      // clear canvas when file removed
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      pdfRef.current = null;
      setTotalPages(0);
      setCurrentPage(1);
    }
  }, [file]);

  /* ---------- HANDLERS ---------- */
  const handleAddFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleCleanup = async () => {
    if (!file) return;

    // Check if at least one option is selected
    if (!removeDuplicatePages && !removeBlankPages && !fixOrientation) {
      setResult({
        success: false,
        message: "Please select at least one cleanup option",
      });
      return;
    }
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("action", "smart_cleanup");
      formData.append("file", file);

      // Send cleanup options as form fields
      formData.append(
        "remove_duplicates",
        removeDuplicatePages ? "true" : "false"
      );
      formData.append("remove_blanks", removeBlankPages ? "true" : "false");
      formData.append("fix_orientation", fixOrientation ? "true" : "false");
      const response = await fetch("/api/edit", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || `Error: ${response.status}`);
      }
      // Download the cleaned PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cleaned_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      // Build success message based on selected options
      let operations = [];
      if (removeDuplicatePages) operations.push("duplicate pages removed");
      if (removeBlankPages) operations.push("blank pages removed");
      if (fixOrientation) operations.push("orientation fixed");

      setResult({
        success: true,
        message: `PDF cleaned successfully! ${operations
          .join(", ")
          .replace(/,([^,]*)$/, " and$1")}.`,
        fileName: `cleaned_${file.name}`,
      });
    } catch (err) {
      console.error("Cleanup error:", err);
      setError(err.message);
      setResult({
        success: false,
        message: `Failed to clean PDF: ${err.message}`,
      });
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
            <div className="flex items-center gap-10 bg-[#F7E6E9]/30 border border-[#F3D9DD] rounded-md px-4 py-6">
              <button
                onClick={() => navigate("/tools/remove-duplicate")}
                className="flex gap-2 items-center"
              >
                <img src={iconBack} className="w-5" />
                Back
              </button>

              <label className="px-3 py-2 border border-[#B2011E] rounded bg-white cursor-pointer">
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
                      className="p-2 bg-white border border-[#B2011E] rounded"
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
              <h3 className="text-sm font-bold mb-6 border-b pb-5 text-center border-red-800 text-red-800 uppercase tracking-wider">
                Task Status
              </h3>

              {result && result.success ? (
                <div className="flex flex-col items-center animate-fadeIn">
                  <FaCheckCircle className="text-green-500 text-5xl mb-3" />
                  <p className="text-md font-semibold text-gray-800">
                    Cleaned Successfully!
                  </p>
                  <p className="text-xs text-center text-gray-500 mt-3 leading-relaxed px-2">
                    {result.message}
                  </p>
                </div>
              ) : result && !result.success ? (
                <div className="flex flex-col items-center text-red-400">
                  <div className="text-5xl mb-3">❌</div>
                  <p className="text-xs text-center leading-relaxed">
                    {result.message}
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
                      ? "Processing your PDF..."
                      : "Clean & optimize your PDF"}
                  </p>
                </div>
              )}
              {error && <div className="text-xs text-red-600 mt-4 px-2">{error}</div>}
            </div>

            <button
              disabled={!file || isProcessing}
              onClick={handleCleanup}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md w-full transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Apply Cleanup"}
            </button>
          </aside>

          {/* ================= LEFT PANEL ================= */}
          <aside className="col-span-3 bg-gray-50 border border-[#F3D9DD] rounded-lg p-4 flex flex-col">
            {file ? (
              <div className="p-3 border border-[#F3D9DD] bg-red-50  rounded flex items-center gap-3 mb-4">
                <img src={pdfIcon} className="w-10 h-10" />
                <div className="flex-1 text-sm truncate">{file.name}</div>
                <button
                  onClick={handleRemoveFile}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  Remove <FiTrash2 />
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-400 text-center py-6 mb-4">
                No file selected
              </div>
            )}

            <h3 className="font-semibold mb-1">Cleanup Options</h3>
            <p className="text-xs text-gray-500 mb-4">
              Clean & optimize your PDF
            </p>

            <div className="space-y-4 text-sm">
              <label className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  onChange={(e) => setRemoveDuplicatePages(e.target.checked)}
                />
                Remove duplicate pages
              </label>

              <label className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  onChange={(e) => setRemoveBlankPages(e.target.checked)}
                />
                Remove blank pages
              </label>

              <label className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  onChange={(e) => setFixOrientation(e.target.checked)}
                />
                Fix orientation (Smart structural correction)
              </label>
            </div>
          </aside>

          {/* ================= CENTER PANEL ================= */}
          <main className="col-span-6 bg-white border border-[#F3D9DD] rounded-lg p-4 h-[80vh] flex flex-col">
            {file ? (
              <>
                <div ref={canvasWrapperRef} className="flex-1 overflow-y-auto">
                  <canvas ref={canvasRef} className="w-full shadow" />
                </div>

                <div className="flex justify-between items-center mt-3 text-sm">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => {
                      const p = currentPage - 1;
                      setCurrentPage(p);
                      renderPage(p);
                    }}
                  >
                    ← Prev
                  </button>

                  <span>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                      const p = currentPage + 1;
                      setCurrentPage(p);
                      renderPage(p);
                    }}
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <img src={pdfIcon} className="w-20 mb-3" />
                Select a PDF to preview
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SmartCleanup;
