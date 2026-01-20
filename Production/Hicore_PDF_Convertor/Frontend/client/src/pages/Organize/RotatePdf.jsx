import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { LuLightbulb } from "react-icons/lu"; // Changed from Fi to Lu for Lightbulb
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

const RotatePdf = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [file, setFile] = useState(state?.selectedFiles?.[0] || null);
  const [isRotating, setIsRotating] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);
  const [degree, setDegree] = useState(0);
  const [customDegree, setCustomDegree] = useState("");
  const [pageNumber, setPageNumber] = useState("");

  // PDF Preview States
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const pdfDocRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const renderPdfPage = async (pageNumber) => {
    if (!pdfDocRef.current || !canvasRef.current || !canvasWrapperRef.current)
      return;
    if (renderTaskRef.current) renderTaskRef.current.cancel();

    try {
      const page = await pdfDocRef.current.getPage(pageNumber);
      const wrapper = canvasWrapperRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Apply selected rotation to preview
      const rotationToApply = selectedDegree();

      const unscaledViewport = page.getViewport({
        scale: 1,
        rotation: rotationToApply,
      });
      const scale = (wrapper.clientWidth - 40) / unscaledViewport.width;
      const viewport = page.getViewport({ scale, rotation: rotationToApply });

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

  useEffect(() => {
    if (pdfDocRef.current) renderPdfPage(currentPage);
  }, [degree, customDegree]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setResultUrl(null);
    setError(null);
    setFile(f);
  };

  const selectedDegree = () => {
    if (customDegree !== "") {
      const parsed = parseInt(customDegree, 10);
      return isNaN(parsed) ? degree : ((parsed % 360) + 360) % 360;
    }
    return degree;
  };

  const handleRotate = async () => {
    if (!file) return alert("Please upload a PDF first.");
    setIsRotating(true);
    setError(null);

    try {
      const actionRes = await fetch(`${API_BASE}/api/tool-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "organize", action: "rotate_pdf" }),
      });
      const { redirect_to } = await actionRes.json();
      const uploadUrl = `${API_BASE}${
        redirect_to.startsWith("/api") ? "" : "/api"
      }${redirect_to}`;

      const fd = new FormData();
      fd.append("files", file);
      fd.append("tool", "organize");
      fd.append("action", "rotate_pdf");

      const settings = {
        degree: String(selectedDegree()),
        pages: pageNumber.trim(),
      };
      fd.append("settings", JSON.stringify(settings));

      const res = await fetch(uploadUrl, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Rotate failed");

      const blob = await res.blob();
      setResultUrl(
        URL.createObjectURL(new Blob([blob], { type: "application/pdf" }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRotating(false);
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
                  onClick={() => navigate("/tools/rotate-pdf")}
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
                    Rotated Successfully!
                  </p>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Your PDF is ready for download.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  {isRotating ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mb-3"></div>
                  ) : (
                    <FaRegClock className="text-5xl mb-3 opacity-20" />
                  )}
                  <p className="text-xs px-4 text-center leading-relaxed">
                    {isRotating
                      ? "Rotating your PDF..."
                      : "Configure rotation settings on the left and click rotate."}
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
                      a.download = `rotated-${file?.name || "file.pdf"}`;
                      a.click();
                    }
                  : handleRotate
              }
              disabled={isRotating || !file}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md w-full transition-all shadow-md active:scale-[0.98] disabled:bg-gray-300"
            >
              {isRotating
                ? "Processing..."
                : resultUrl
                ? "Download PDF"
                : "Rotate PDF"}
            </button>
          </aside>

          {/* Left Sidebar */}
          <div className="col-span-3">
            <aside className="bg-gray-50 rounded-lg p-4 h-[75vh] flex flex-col">
              <div className="flex items-center justify-between border border-rose-200 bg-[#F7E6E9]/[0.30] p-3 rounded-md mb-4">
                {file ? (
                  <div className="flex items-center gap-3">
                    <img src={pdfIcon} className="w-12 h-12" alt="pdf" />
                    <div>
                      <div className="text-sm font-medium max-w-[100px] truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {humanFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No PDF selected</div>
                )}
                {file && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setResultUrl(null);
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 p-1 rounded"
                  >
                    <FiTrash2 size={18} />
                    <span className="text-sm font-medium">Remove</span>
                  </button>
                )}
              </div>

              {/* Rotation Options Container */}
              <div className="p-3 border border-[#F3D9DD] bg-[#F7E6E9]/[0.30] rounded-md flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <div>
                    <label className="text-[16px] font-medium block mb-3">
                      Page(s) (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1,5,7"
                      value={pageNumber}
                      onChange={(e) => setPageNumber(e.target.value)}
                      className="w-full bg-white px-2 py-1 border border-[#E7B0B9] rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[16px] font-medium block mb-3">
                      Rotation (degrees)
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={degree}
                        onChange={(e) => {
                          setDegree(Number(e.target.value));
                          setCustomDegree("");
                        }}
                        className="w-full px-2 py-1 border bg-white border-[#E7B0B9] rounded text-sm"
                      >
                        <option value={90}>90°</option>
                        <option value={180}>180°</option>
                        <option value={270}>270°</option>
                        <option value={0}>0°</option>
                      </select>
                      <input
                        type="number"
                        placeholder="custom"
                        value={customDegree}
                        onChange={(e) => setCustomDegree(e.target.value)}
                        className="w-full bg-white px-2 py-1 border border-[#E7B0B9] rounded text-sm"
                      />
                    </div>
                  </div>

                  {/* Tips Section */}
                  <div className="mt-8 pt-5 border-t border-[#E7B0B9]/50">
                    <h4 className="flex items-center gap-2 text-[14px] font-bold text-red-800 uppercase tracking-widest mb-3">
                      <LuLightbulb className="text-yellow-600" /> Pro Tips
                    </h4>
                    <ul className="space-y-3">
                      <li className="text-[13px] text-gray-600 leading-relaxed flex gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          Use <strong>1-5</strong> for ranges or{" "}
                          <strong>1,3,5</strong> for specific pages.
                        </span>
                      </li>
                      <li className="text-[13px] text-gray-600 leading-relaxed flex gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          Degrees are applied <strong>clockwise</strong>. 180°
                          flips the page upside down.
                        </span>
                      </li>
                      <li className="text-[13px] text-gray-600 leading-relaxed flex gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          Leaving "Pages" empty will rotate the{" "}
                          <strong>entire document</strong>.
                        </span>
                      </li>
                    </ul>
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

export default RotatePdf;
