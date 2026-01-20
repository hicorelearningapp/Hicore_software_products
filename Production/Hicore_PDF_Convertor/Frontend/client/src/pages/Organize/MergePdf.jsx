import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaFilePdf,
  FaCheckCircle,
  FaRegClock,
} from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

import pdfIcon from "../../assets/Pannelpage/PDF.png";
import iconMonitor from "../../assets/Pannelpage/Desktop.png";
import iconGrid from "../../assets/Pannelpage/Dropbox.png";
import iconTriangle from "../../assets/Pannelpage/googleDrive.png";
import iconCloud from "../../assets/Pannelpage/Onedrive.png";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.js`;

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const humanFileSize = (size) => {
  if (!size && size !== 0) return "";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${
    ["B", "KB", "MB", "GB"][i]
  }`;
};

const MergePdf = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [files, setFiles] = useState(state?.selectedFiles || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedUrl, setMergedUrl] = useState(null);

  // PDF Preview Refs
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const pdfDocRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // PDF Rendering Logic
  const renderPdfPage = async (pageNumber) => {
    if (!pdfDocRef.current || !canvasRef.current || !canvasWrapperRef.current)
      return;
    try {
      const page = await pdfDocRef.current.getPage(pageNumber);
      const containerWidth = canvasWrapperRef.current.clientWidth - 40;
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
    } catch (err) {
      console.error("Render error:", err);
    }
  };

  const loadPdfDocument = async (file) => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      renderPdfPage(1);
    } catch (err) {
      console.error("Error loading PDF:", err);
    }
  };

  useEffect(() => {
    const activeFile = files[activeIndex];
    if (activeFile) {
      loadPdfDocument(activeFile);
    }
  }, [activeIndex, files]);

  // Reorder Helpers
  const moveUp = (index) => {
    if (index <= 0) return;
    setFiles((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
    setActiveIndex((i) =>
      i === index ? index - 1 : i === index - 1 ? index : i
    );
  };

  const moveDown = (index) => {
    if (index >= files.length - 1) return;
    setFiles((prev) => {
      const arr = [...prev];
      [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      return arr;
    });
    setActiveIndex((i) =>
      i === index ? index + 1 : i === index + 1 ? index : i
    );
  };

  const handleAddFiles = (e) => {
    const incoming = Array.from(e.target.files || []);
    if (!incoming.length) return;
    setFiles((prev) => [...prev, ...incoming]);
    setMergedUrl(null);
  };

  const removeFile = (index) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    setActiveIndex((i) =>
      i === index && next.length > 0
        ? Math.max(0, index - 1)
        : i > index
        ? i - 1
        : Math.min(i, Math.max(0, next.length - 1))
    );
  };

  const handleMerge = async () => {
    if (!files.length) return;
    setIsMerging(true);
    try {
      const actionRes = await fetch(`${API_BASE}/api/tool-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "organize", action: "merge_pdf" }),
      });
      const { redirect_to } = await actionRes.json();
      const uploadUrl = `${API_BASE}${
        redirect_to.startsWith("/api") ? "" : "/api"
      }${redirect_to}`;

      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      fd.append("tool", "organize");
      fd.append("action", "merge_pdf");

      const res = await fetch(uploadUrl, { method: "POST", body: fd });
      const blob = await res.blob();
      setMergedUrl(
        URL.createObjectURL(new Blob([blob], { type: "application/pdf" }))
      );
    } catch (err) {
      alert("Merge failed.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-screen bg-white w-full font-sans">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 mb-4">
          {/* Top Bar */}
          <div className="col-span-9 relative">
            <div className="flex items-center justify-start bg-[#F7E6E9]/[0.30] border border-[#F3D9DD] rounded-md px-4 py-6">
              <div className="flex items-center gap-10">
                <button
                  onClick={() => navigate("/tools/merge-pdf")}
                  className="flex items-center gap-2 text-md text-gray-700 hover:text-red-700"
                >
                  <span className="text-red-500">
                    <FaArrowLeft />
                  </span>{" "}
                  Back
                </button>
                <label
                  htmlFor="add-files-top"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-[#B2011E] rounded-md bg-white cursor-pointer text-sm font-medium"
                >
                  Add more files
                  <input
                    id="add-files-top"
                    type="file"
                    multiple
                    onChange={handleAddFiles}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-3">
                {[iconMonitor, iconGrid, iconTriangle, iconCloud].map(
                  (img, i) => (
                    <button
                      key={i}
                      className="p-2 bg-white border border-[#B2011E] rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <img src={img} alt="icon" className="w-5 h-5" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Action Panel (Task Status) */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-rose-100 rounded-md p-6 flex flex-col justify-between shadow-sm">
            <div className="text-center py-4">
              <h3 className="text-sm font-bold mb-6 border-b pb-5 text-center border-red-800 text-red-800 uppercase tracking-wider">
                Task Status
              </h3>

              {mergedUrl ? (
                <div className="flex flex-col items-center animate-fadeIn">
                  <FaCheckCircle className="text-green-500 text-5xl mb-3" />
                  <p className="text-md font-semibold text-gray-800">
                    Merged Successfully!
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    Your file is ready for download
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  {isMerging ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mb-3"></div>
                  ) : (
                    <FaRegClock className="text-5xl mb-3 opacity-20" />
                  )}
                  <p className="text-sm px-4 text-center leading-relaxed">
                    {isMerging
                      ? "Processing your request..."
                      : "Click the button to merge PDFs"}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={
                mergedUrl
                  ? () => {
                      const a = document.createElement("a");
                      a.href = mergedUrl;
                      a.download = "merged.pdf";
                      a.click();
                    }
                  : handleMerge
              }
              disabled={isMerging}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md w-full transition-all shadow-md active:scale-[0.98]"
            >
              {isMerging
                ? "Merging..."
                : mergedUrl
                ? "Download Now"
                : "Merge PDF"}
            </button>
          </aside>

          {/* Left Sidebar: Reorder Sequence */}
          <div className="col-span-3">
            <aside className="bg-gray-50 rounded-lg p-4">
              <h1 className="mb-4 text-gray-800 font-semibold">
                Reorder your PDF files to set the merge sequence
              </h1>
              <div className="space-y-8 max-h-[70vh] overflow-auto pr-2 custom-scrollbar">
                {files.map((f, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex items-center gap-3 p-3 border border-[#E7B0B9] rounded cursor-pointer transition-colors ${
                      i === activeIndex ? "bg-red-50" : "bg-white"
                    }`}
                  >
                    <img
                      src={pdfIcon}
                      alt="PDF Icon"
                      className="w-20 h-20 object-contain bg-white rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate text-gray-800">
                        {f.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {humanFileSize(f.size)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveUp(i);
                          }}
                          disabled={i === 0}
                          className="text-xs px-1 py-2 border border-[#E7B0B9] rounded text-gray-600 disabled:opacity-30 hover:bg-gray-50"
                        >
                          ▲
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveDown(i);
                          }}
                          disabled={i === files.length - 1}
                          className="text-xs px-1 py-2 border border-[#E7B0B9] rounded text-gray-600 disabled:opacity-30 hover:bg-gray-50"
                        >
                          ▼
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        <FiTrash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {/* Center Main Preview */}
          <main className="col-span-6 bg-white border border-[#E7B0B9] rounded-lg p-4 flex flex-col shadow-sm">
            {files[activeIndex] ? (
              <div className="flex flex-col h-[75vh]">
                <div
                  ref={canvasWrapperRef}
                  className="flex-1 overflow-y-auto hide-scrollbar bg-gray-100 rounded flex justify-center items-start shadow-inner p-4"
                >
                  <canvas ref={canvasRef} className="bg-white shadow-lg mb-4" />
                </div>
                <div className="flex justify-between items-center mt-4 px-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => {
                      const p = currentPage - 1;
                      setCurrentPage(p);
                      renderPdfPage(p);
                    }}
                    className="px-4 py-1 border border-red-200 rounded text-xs font-bold disabled:opacity-30 text-red-700 hover:bg-red-50 transition-colors uppercase"
                  >
                    Prev
                  </button>
                  <span className="text-xs font-bold text-gray-600 uppercase">
                    PAGE {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                      const p = currentPage + 1;
                      setCurrentPage(p);
                      renderPdfPage(p);
                    }}
                    className="px-4 py-1 border border-red-200 rounded text-xs font-bold disabled:opacity-30 text-red-700 hover:bg-red-50 transition-colors uppercase"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
                <FaFilePdf className="text-6xl mb-4 opacity-10" />
                <p className="font-medium">No file selected</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MergePdf;
