import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { FiTrash2 } from "react-icons/fi";

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

const AutoNaming = () => {
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

  /* ---------- NAMING OPTIONS ---------- */
  const [shortName, setShortName] = useState(false);
  const [keywordName, setKeywordName] = useState(false);
  const [professionalName, setProfessionalName] = useState(false);
  const [descriptiveName, setDescriptiveName] = useState(false);
  const [removeRepeats, setRemoveRepeats] = useState(false);
  const [autoVersion, setAutoVersion] = useState(false);

  const [suggestedName, setSuggestedName] = useState(
    "Q3_2024_Financial_Report_Revenue_Analysis"
  );

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
    if (!pdfRef.current) return;

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

  useEffect(() => {
    if (file) loadPdf(file);
  }, []);

  const handleAddFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    loadPdf(f);
  };

  /* ---------- REMOVE FILE (FIXED) ---------- */
  const handleRemoveFile = () => {
    setFile(null);
    setCurrentPage(1);
    setTotalPages(0);
    pdfRef.current = null;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const applyAutoNaming = () => {
    console.log("AUTO NAMING SETTINGS:", {
      shortName,
      keywordName,
      professionalName,
      descriptiveName,
      removeRepeats,
      autoVersion,
      suggestedName,
    });
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* ================= TOP BAR ================= */}
          <div className="col-span-9 relative">
            <div className="flex items-center gap-10 bg-[#F7E6E9]/30 border border-[#F3D9DD] rounded-md px-4 py-6">
              <button
                onClick={() => navigate("/tools/auto-naming")}
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

          {/* ================= RIGHT PANEL ================= */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-[#F3D9DD] rounded-md p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-2">Auto Naming</h3>
              <p className="text-sm text-gray-500">
                AI-powered document renaming
              </p>
            </div>

            <button
              disabled={!file}
              onClick={applyAutoNaming}
              className={`w-full py-3 rounded ${
                file ? "bg-red-700 text-white" : "bg-gray-300 text-gray-500"
              }`}
            >
              Apply Auto Naming
            </button>
          </aside>

          {/* ================= LEFT PANEL ================= */}
          <aside className="col-span-3 bg-gray-50 border border-[#F3D9DD] rounded-lg p-4 flex flex-col">
            {file ? (
              <div className="p-3 border border-[#F3D9DD] bg-white rounded flex items-center gap-3 mb-4">
                <img src={pdfIcon} className="w-10 h-10" />
                <div className="flex-1 text-sm truncate">{file.name}</div>
                <button
                  onClick={handleRemoveFile}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-400 text-center py-6 mb-4">
                No file selected
              </div>
            )}

            <h3 className="font-semibold mb-1">AI-Generated Title</h3>
            <p className="text-xs text-gray-500 mb-3">
              Based on keywords, structure & context analysis
            </p>

            <input
              value={suggestedName}
              onChange={(e) => setSuggestedName(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-[#F3D9DD] rounded bg-white text-sm"
            />

            <div className="space-y-4 text-sm">
              <label className="flex gap-3 items-start">
                <input
                  type="checkbox"
                  onChange={(e) => setShortName(e.target.checked)}
                />
                Short & Minimal Name
              </label>

              <label className="flex gap-3 items-start">
                <input
                  type="checkbox"
                  onChange={(e) => setKeywordName(e.target.checked)}
                />
                Keyword-Focused Name
              </label>

              <label className="flex gap-3 items-start">
                <input
                  type="checkbox"
                  onChange={(e) => setProfessionalName(e.target.checked)}
                />
                Professional Name
              </label>

              <label className="flex gap-3 items-start">
                <input
                  type="checkbox"
                  onChange={(e) => setDescriptiveName(e.target.checked)}
                />
                Descriptive Name
              </label>

              <label className="flex gap-3 items-start">
                <input
                  type="checkbox"
                  onChange={(e) => setRemoveRepeats(e.target.checked)}
                />
                Remove repeated keywords
              </label>

              <label className="flex gap-3 items-start">
                <input
                  type="checkbox"
                  onChange={(e) => setAutoVersion(e.target.checked)}
                />
                Auto-append version numbers (v1, v2, v3…)
              </label>
            </div>

            <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4 text-sm text-gray-700 flex gap-3">
              <span className="text-red-500">💡</span>
              <span>You can edit the suggested name before saving</span>
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

export default AutoNaming;
