import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaFilePdf,
  FaCheckCircle,
  FaRegClock,
} from "react-icons/fa";
import { FiType, FiImage, FiTrash2 } from "react-icons/fi";
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

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const isPdfFile = (file) => {
  if (!file) return false;
  if (file.type) return file.type === "application/pdf";
  return /\.pdf$/i.test(file.name || "");
};

const AddWatermark = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileInputRef = useRef(null);

  /* ---------- FILE ---------- */
  const initialFiles =
    (state?.selectedFiles && state.selectedFiles.slice(0, 1)) || [];
  const [file, setFile] = useState(
    initialFiles[0] instanceof File ? initialFiles[0] : null
  );

  /* ---------- WATERMARK OPTIONS ---------- */
  const [watermarkType, setWatermarkType] = useState(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkSize, setWatermarkSize] = useState(50); // Default font size
  const [watermarkRotation, setWatermarkRotation] = useState(0); // Default rotation
  const [watermarkImage, setWatermarkImage] = useState(null); // For image watermark

  const [applyAllPages, setApplyAllPages] = useState(true);
  const [repeatAcrossPage, setRepeatAcrossPage] = useState(false);
  const [behindText, setBehindText] = useState(false);

  /* ---------- PDF STATE ---------- */
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const watermarkContainerRef = useRef(null);
  const pdfRef = useRef(null);
  const viewportRef = useRef(null);

  const [pdfMeta, setPdfMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------- WATERMARK STATE ---------- */
  const [placingWatermark, setPlacingWatermark] = useState(false);
  const [draftWatermark, setDraftWatermark] = useState(null);
  const [savedWatermarks, setSavedWatermarks] = useState([]);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [activeSavedId, setActiveSavedId] = useState(null);

  /* ---------- DRAG STATE ---------- */
  const [draggingId, setDraggingId] = useState(null); // 'draft' or saved watermark ID
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
    setDraftWatermark(null);
    setSavedWatermarks([]);
    setActiveSavedId(null);
  };

  const removeFile = () => {
    setFile(null);
    setDraftWatermark(null);
    setSavedWatermarks([]);
    setActiveSavedId(null);
    pdfRef.current = null;
    setPdfMeta(null);
  };

  /* ---------- LOAD & RENDER PDF ---------- */
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
    const containerWidth = canvasWrapperRef.current.clientWidth - 40;
    const scale = containerWidth / baseViewport.width;

    const viewport = page.getViewport({ scale });
    viewportRef.current = viewport;

    const canvas = canvasRef.current;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
  };

  /* ---------- PLACE WATERMARK ---------- */
  const handlePlaceWatermark = (e) => {
    if (!placingWatermark || !watermarkType) return;

    // Use watermarkContainerRef to get coordinates relative to the content area
    const rect = watermarkContainerRef.current.getBoundingClientRect();
    const xCanvas = e.clientX - rect.left;
    const yCanvas = e.clientY - rect.top;
    const scaleFactor = 1 / viewportRef.current.scale;

    setDraftWatermark({
      id: "draft-" + Date.now(),
      type: watermarkType,
      text: watermarkType === "text" ? watermarkText : null,
      size: watermarkType === "text" ? watermarkSize : null,
      rotation: watermarkRotation,
      image: watermarkType === "image" ? watermarkImage : null, // Store image file
      x: Math.round(xCanvas * scaleFactor),
      y: Math.round(yCanvas * scaleFactor),
      page: currentPage,
    });
    setPlacingWatermark(false);
    setShowActionIcons(true);
  };

  const selectSavedWatermark = (w) => {
    setActiveSavedId(w.id);
    setDraftWatermark(null);
    setShowActionIcons(false);
    setShowActionIcons(false);
    setWatermarkType("text");
    setWatermarkText(w.text || "");
    setWatermarkSize(w.size || 50);
    setWatermarkRotation(w.rotation || 0);
  };

  const handleRotationChange = (newRotation) => {
    setWatermarkRotation(newRotation);
    if (draftWatermark) {
      setDraftWatermark(prev => ({ ...prev, rotation: newRotation }));
    } else if (activeSavedId) {
      setSavedWatermarks(prev => prev.map(w =>
        w.id === activeSavedId ? { ...w, rotation: newRotation } : w
      ));
    }
  };

  const handleTypeChange = (type) => {
    setWatermarkType("text");
    setPlacingWatermark(true);
    setShowActionIcons(false);
  };

  const handleImageChange = (file) => {
    setWatermarkImage(file);
  };

  /* ---------- DRAG HANDLERS ---------- */
  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingId(id);
    
    if (draftWatermark && draftWatermark.id === id) {
      // already in sidebar
    } else {
      const saved = savedWatermarks.find(w => w.id === id);
      if (saved) selectSavedWatermark(saved);
    }

    const rect = watermarkContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let target;
    if (id && id.toString().startsWith("draft")) {
      target = draftWatermark;
    } else {
      target = savedWatermarks.find((w) => w.id === id);
    }

    if (target) {
      setDragOffset({
        x: x - target.x * viewportRef.current.scale,
        y: y - target.y * viewportRef.current.scale,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingId === null) return;

      const rect = watermarkContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;

      const scaleFactor = 1 / viewportRef.current.scale;
      const newX = Math.round(x * scaleFactor);
      const newY = Math.round(y * scaleFactor);

      if (draftWatermark && draftWatermark.id === draggingId) {
        setDraftWatermark((prev) => ({ ...prev, x: newX, y: newY }));
      } else {
        setSavedWatermarks((prev) =>
          prev.map((w) => (w.id === draggingId ? { ...w, x: newX, y: newY } : w))
        );
      }
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    if (draggingId !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId, dragOffset]);

  /* ---------- SAVE / DELETE / UPDATE ---------- */
  const handleSaveWatermark = () => {
    setSavedWatermarks((prev) => [...prev, draftWatermark]);
    setDraftWatermark(null);
    setShowActionIcons(false);
    setWatermarkType(null);
    setWatermarkRotation(0);
  };

  const handleUpdateSaved = () => {
    setActiveSavedId(null);
    setWatermarkType(null);
    setWatermarkRotation(0);
    setWatermarkText("CONFIDENTIAL");
    setWatermarkSize(50);
  };

  const handleDeleteDraft = () => {
    if (draftWatermark) {
      setDraftWatermark(null);
      setWatermarkRotation(0);
    }
    setShowActionIcons(false);
  };

  const deleteSavedWatermark = (id) => {
    setSavedWatermarks((prev) => prev.filter((w) => w.id !== id));
    if (activeSavedId === id) {
      setActiveSavedId(null);
      setWatermarkType(null);
      setWatermarkRotation(0);
      setWatermarkText("CONFIDENTIAL");
      setWatermarkSize(50);
    }
  };

  const clearAllWatermarks = () => {
    setSavedWatermarks([]);
    setDraftWatermark(null);
    setActiveSavedId(null);
    setResultUrl(null);
    setError(null);
  };

  /* ---------- API SUBMISSION ---------- */
  const handleApplyWatermark = async () => {
    if (!file) return;
    if (savedWatermarks.length === 0 && !watermarkImage) {
      setError("Please add at least one text watermark or an image watermark.");
      return;
    }

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
        body: JSON.stringify({ tool: "edit", action: "add_watermark" }),
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
      fd.append("action", "add_watermark");

      // Append global image watermark file
      if (watermarkImage) {
        fd.append("watermark_image", watermarkImage, watermarkImage.name);
      }

      // prepare settings
      const settings = {
        apply_to_all_pages: applyAllPages,
        repeat_across_page: repeatAcrossPage,
        layer_behind_text: behindText,
        watermarks: savedWatermarks.map((w, idx) => ({
          type: "text",
          text: w.text,
          size: w.size,
          rotation: w.rotation || 0,
          x: w.x,
          y: w.y,
          page: w.page
        })),
        global_image_watermark: watermarkImage ? "watermark_image" : null,
      };

      fd.append("settings", JSON.stringify(settings));

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `Watermark failed: ${res.status}`);
      }

      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      setResultUrl(url);

    } catch (err) {
      console.error("Watermark error:", err);
      setError(err.message || "Watermark failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `watermarked-${file?.name || "doc.pdf"}`;
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
            <div className="flex items-center gap-10 bg-[#F7E6E9]/30 border border  border-[#F3D9DD] rounded-md px-4 py-6">
              <button
                onClick={() => navigate("/tools/add-watermark")}
                className="flex items-center gap-2 text-gray-700"
              >
                <img src={iconBack} className="w-5 h-5" />
                Back
              </button>

              <label className="inline-flex items-center gap-2 px-3 py-2  border   border-[#B2011E] rounded bg-white cursor-pointer">
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

          {/* ================= RIGHT PANEL ================= */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-rose-100 rounded-md p-6 flex flex-col justify-between shadow-sm">
            <div className="text-center py-4">
              <h3 className="text-sm font-bold mb-6 border-b pb-5 text-center border-red-800 text-red-800 uppercase tracking-wider">
                Task Status
              </h3>

              {resultUrl ? (
                <div className="flex flex-col items-center animate-fadeIn">
                  <FaCheckCircle className="text-green-500 text-5xl mb-3" />
                  <p className="text-md font-semibold text-gray-800">
                    Watermarked Successfully!
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
                      : "Add watermark and click Apply"}
                  </p>
                </div>
              )}
              {error && (
                <div className="text-sm text-red-600 mt-2">{error}</div>
              )}
            </div>

            <button
              onClick={resultUrl ? handleDownloadResult : handleApplyWatermark}
              disabled={
                !resultUrl &&
                (!file ||
                  isProcessing ||
                  (savedWatermarks.length === 0 && !watermarkImage))
              }
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md w-full transition-all shadow-md active:scale-[0.98] disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
            >
              {isProcessing
                ? "Processing..."
                : resultUrl
                ? "Download Now"
                : "Apply Watermark"}
            </button>
          </aside>

          {/* ================= LEFT OPTIONS ================= */}
          <aside className="col-span-3 bg-gray-50  rounded-lg p-4">
            <h2 className="mb-4 font-medium">Watermark Settings</h2>

            <div className="p-3 border border  border-[#F3D9DD] bg-[#F7E6E9]/30 rounded mb-4">
              {file ? (
                <div className="flex gap-3 items-center">
                  <img src={pdfIcon} className="w-16 h-16 bg-white rounded" />
                  <div className="flex-1 truncate text-sm">{file.name}</div>
                  <button
                    onClick={removeFile}
                    className="text-red-600 flex items-center gap-1 text-sm whitespace-nowrap"
                  >
                    <FiTrash2 /> <span>Remove</span>
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-400 text-center py-6">
                  No file selected
                </div>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <label className="flex gap-3 items-center cursor-pointer">
                <input
                  type="radio"
                  name="wmType"
                  checked={watermarkType === "text"}
                  onChange={() => handleTypeChange("text")}
                  className="accent-red-600"
                />
                <FiType /> Text Watermark
              </label>

              <label className="flex gap-3 items-center cursor-pointer">
                <input
                  type="radio"
                  name="wmType"
                  checked={watermarkType === "image"}
                  onChange={() => {
                    setWatermarkType("image");
                    setPlacingWatermark(false);
                    setDraftWatermark(null);
                    setActiveSavedId(null);
                  }}
                  className="accent-red-600"
                />
                <FiImage /> Image Watermark
              </label>
            </div>

            {watermarkType === "text" && (
              <div className="space-y-2">
                <input
                  value={watermarkText}
                  onChange={(e) => {
                    const txt = e.target.value;
                    setWatermarkText(txt);
                    if (activeSavedId) {
                      setSavedWatermarks((prev) =>
                        prev.map((w) =>
                          w.id === activeSavedId ? { ...w, text: txt } : w
                        )
                      );
                    } else if (draftWatermark) {
                      setDraftWatermark((prev) => ({ ...prev, text: txt }));
                    }
                  }}
                  className="w-full px-3 py-2 border border-[#F3D9DD] rounded"
                  placeholder="Watermark text"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Size:</span>
                  <input
                    type="number"
                    value={watermarkSize === 0 ? "" : watermarkSize}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = val === "" ? "" : Number(val);
                      setWatermarkSize(num);
                      if (activeSavedId) {
                        setSavedWatermarks((prev) =>
                          prev.map((w) =>
                            w.id === activeSavedId ? { ...w, size: num } : w
                          )
                        );
                      } else if (draftWatermark) {
                        setDraftWatermark((prev) => ({ ...prev, size: num }));
                      }
                    }}
                    className="w-20 px-2 py-1 border border-[#F3D9DD] rounded text-sm"
                    max="500"
                  />
                </div>
              </div>
            )}

            {watermarkType === "image" && (
              <div className="mt-4 p-3 border border-dashed border-[#F3D9DD] rounded bg-white">
                <h3 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FiImage /> Select Watermark Image
                </h3>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(e.target.files?.[0] || null)
                    }
                    className="w-full px-2 py-1 border border-[#F3D9DD] rounded text-[10px]"
                  />
                  {watermarkImage && (
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-green-600 truncate flex-1">
                        ✓ {watermarkImage.name}
                      </div>
                      <button
                        onClick={() => setWatermarkImage(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  )}
                  {!watermarkImage && (
                    <div className="text-[10px] text-gray-500 italic">
                      This image will be applied to your PDF
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ✅ CONSOLIDATED ACTION AREA (SAVE / UPDATE / DELETE) */}
            {(draftWatermark || activeSavedId) && (
              <div className="mt-4 p-3 border border-[#F3D9DD] rounded bg-white shadow-sm">
                <div className="text-[10px] text-gray-400 uppercase font-bold mb-2 tracking-wider">
                  {draftWatermark ? "New Watermark" : "Edit Mode"}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={
                      draftWatermark ? handleSaveWatermark : handleUpdateSaved
                    }
                    className="flex-1 px-4 py-2 bg-red-700 text-white rounded text-sm font-bold hover:bg-red-800 transition-colors shadow-sm"
                  >
                    {draftWatermark ? "Save" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      if (draftWatermark) handleDeleteDraft();
                      else deleteSavedWatermark(activeSavedId);
                    }}
                    className="px-4 py-2 border border-gray-300 text-red-600 rounded text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2 text-sm">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={applyAllPages}
                  onChange={(e) => setApplyAllPages(e.target.checked)}
                />
                Apply watermark to all pages
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={repeatAcrossPage}
                  onChange={(e) => setRepeatAcrossPage(e.target.checked)}
                />
                Repeat watermark across page
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={behindText}
                  onChange={(e) => setBehindText(e.target.checked)}
                />
                Layer watermark behind text
              </label>
            </div>

            {(watermarkType || draftWatermark || activeSavedId) && (
              <div className="mt-4 p-3 border border-[#F3D9DD] rounded bg-white relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Rotation
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    {watermarkRotation}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={watermarkRotation}
                  onChange={(e) => handleRotationChange(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>-180°</span>
                  <span>0°</span>
                  <span>180°</span>
                </div>
              </div>
            )}

            {savedWatermarks.length > 0 && (
              <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={clearAllWatermarks}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  <FiTrash2 /> Clear All Watermarks
                </button>
              </div>
            )}
          </aside>

          {/* ================= CENTER PREVIEW ================= */}
          <main className="col-span-6 bg-white border border-[#E7B0B9] rounded-lg p-4 flex flex-col shadow-sm">
            {file ? (
              <div className="flex flex-col h-[80vh]">
                <div
                  ref={canvasWrapperRef}
                  className="flex-1 overflow-y-auto hide-scrollbar bg-gray-100 rounded flex justify-center items-start shadow-inner p-4"
                >
                  <div
                    ref={watermarkContainerRef}
                    className="relative"
                    onClick={handlePlaceWatermark}
                    style={{
                      cursor: placingWatermark ? "crosshair" : "default",
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      className="bg-white shadow-lg mb-4"
                    />

                    {savedWatermarks
                      .filter((w) => w.page === currentPage)
                      .map((w) => (
                        <div
                          key={w.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectSavedWatermark(w);
                          }}
                          onMouseDown={(e) => handleMouseDown(e, w.id)}
                          className={`absolute opacity-60 text-red-600 font-bold cursor-move whitespace-nowrap ${
                            activeSavedId === w.id
                              ? "ring-2 ring-red-400 ring-offset-2 rounded"
                              : ""
                          }`}
                          style={{
                            left: w.x * viewportRef.current.scale + "px",
                            top: w.y * viewportRef.current.scale + "px",
                            fontSize:
                              w.type === "text"
                                ? w.size * viewportRef.current.scale + "px"
                                : "3rem",
                            transform: `translate(-50%, -50%) rotate(${
                              w.rotation || 0
                            }deg)`,
                            userSelect: "none",
                          }}
                        >
                          {w.type === "text" ? w.text : "🖼 Image"}

                          {activeSavedId === w.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSavedWatermark(w.id);
                              }}
                              className="ml-2 text-xs text-red-700 bg-white rounded px-1"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      ))}

                    {draftWatermark && draftWatermark.page === currentPage && (
                      <div
                        className="absolute opacity-50 text-red-600 font-bold cursor-move whitespace-nowrap"
                        onMouseDown={(e) =>
                          handleMouseDown(e, draftWatermark.id)
                        }
                        style={{
                          left:
                            draftWatermark.x * viewportRef.current.scale + "px",
                          top:
                            draftWatermark.y * viewportRef.current.scale + "px",
                          fontSize:
                            draftWatermark.size * viewportRef.current.scale +
                            "px",
                          transform: `translate(-50%, -50%) rotate(${watermarkRotation}deg)`,
                          userSelect: "none",
                        }}
                      >
                        {draftWatermark.text}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 px-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => {
                      setCurrentPage((p) => p - 1);
                      renderPage(currentPage - 1);
                    }}
                    className="px-4 py-1 border border-red-200 rounded text-xs font-bold disabled:opacity-30 text-red-700 hover:bg-red-50 transition-colors uppercase"
                  >
                    Prev
                  </button>
                  <span className="text-xs font-bold text-gray-600 uppercase">
                    PAGE {currentPage} / {pdfMeta?.numPages}
                  </span>
                  <button
                    disabled={currentPage >= pdfMeta?.numPages}
                    onClick={() => {
                      setCurrentPage((p) => p + 1);
                      renderPage(currentPage + 1);
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

export default AddWatermark;
