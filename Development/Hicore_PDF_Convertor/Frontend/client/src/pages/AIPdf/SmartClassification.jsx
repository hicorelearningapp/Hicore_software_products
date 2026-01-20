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

const SmartClassification = () => {
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

  /* ---------- CLASSIFICATION OPTIONS ---------- */
  const [showConfidence, setShowConfidence] = useState(false);
  const [hideConfidence, setHideConfidence] = useState(false);
  const [addMetadataTags, setAddMetadataTags] = useState(false);
  const [addVisibleTags, setAddVisibleTags] = useState(false);

  /* ---------- FILE HANDLERS ---------- */
  const handleAddFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
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
    const canvas = canvasRef.current;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
  };

  /* ---------- APPLY CLASSIFICATION ---------- */
  const applyClassification = () => {
    const payload = {
      showConfidence,
      hideConfidence,
      addMetadataTags,
      addVisibleTags,
    };

    console.log("SEND TO BACKEND:", payload);
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* ================= TOP BAR ================= */}
          <div className="col-span-9 relative">
            <div className="flex items-center gap-10 bg-[#F7E6E9]/30 border border-[#F3D9DD] rounded-md px-4 py-6">
              <button onClick={() => navigate("/tools/smart-classification")} className="flex gap-2">
                <img src={iconBack} className="w-5" /> Back
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
              <h3 className="font-semibold mb-2">Smart Classification</h3>
              <p className="text-sm text-gray-500">
                Automatically detect document type
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Page {currentPage} of {pdfMeta?.numPages || "-"}
              </p>
            </div>

            <button
              disabled={!file}
              onClick={applyClassification}
              className={`w-full py-3 rounded ${
                file ? "bg-red-700 text-white" : "bg-gray-300 text-gray-500"
              }`}
            >
              Classify Document
            </button>
          </aside>

          {/* ================= LEFT PANEL ================= */}
          <aside className="col-span-3 bg-gray-50 border border-[#F3D9DD] rounded-lg p-4">
            <h3 className="font-medium mb-3">Selected PDF</h3>

            {/* FILE CARD (ADDED) */}
            {file ? (
              <div className="p-3 border border-[#F3D9DD] bg-white rounded flex items-center gap-3 mb-4">
                <img src={pdfIcon} className="w-12 h-12" />
                <div className="flex-1 text-sm truncate">{file.name}</div>
                <button
                  onClick={removeFile}
                  className="text-red-600 flex items-center gap-1 text-sm"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-400 text-center py-10 mb-4">
                No file selected
              </div>
            )}

            <h3 className="font-medium mb-4">Classification Options</h3>

            <div className="space-y-3 text-sm">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={showConfidence}
                  onChange={(e) => setShowConfidence(e.target.checked)}
                />
                Show AI confidence score in download
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={hideConfidence}
                  onChange={(e) => setHideConfidence(e.target.checked)}
                />
                Hide confidence score
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={addMetadataTags}
                  onChange={(e) => setAddMetadataTags(e.target.checked)}
                />
                Add tags to PDF metadata
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={addVisibleTags}
                  onChange={(e) => setAddVisibleTags(e.target.checked)}
                />
                Add tags as visible text (header or footer)
              </label>
            </div>

            {/* HINT */}
            <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-gray-700">
              <div className="font-medium mb-1">💡 Hint</div>
              AI can classify invoices, resumes, certificates, forms, IDs,
              contracts & more.
            </div>
          </aside>

          {/* ================= CENTER PREVIEW ================= */}
          <main className="col-span-6 bg-white border border-[#F3D9DD] rounded-lg p-4 h-[80vh] overflow-y-auto">
            {file ? (
              <>
                <div ref={canvasWrapperRef}>
                  <canvas ref={canvasRef} className="w-full shadow" />
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
      </div>
    </div>
  );
};

export default SmartClassification;
