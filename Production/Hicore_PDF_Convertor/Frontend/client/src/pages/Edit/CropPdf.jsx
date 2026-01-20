// src/pages/tools/CropPdf.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import pdfIcon from "../../assets/Pannelpage/PDF.png";
import iconMonitor from "../../assets/Pannelpage/Desktop.png";
import iconGrid from "../../assets/Pannelpage/Dropbox.png";
import iconTriangle from "../../assets/Pannelpage/googleDrive.png";
import iconCloud from "../../assets/Pannelpage/Onedrive.png";
import iconBack from "../../assets/Pannelpage/Back.png";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Configure PDF.js worker for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).toString();

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const humanFileSize = (size) => {
  if (!size && size !== 0) return "";
  const i = Math.floor(Math.log(size || 1) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "KB", "MB", "GB"][i]
    }`;
};

const isPdfFile = (file) => {
  if (!file) return false;
  if (file.type) return file.type === "application/pdf";
  return /\.pdf$/i.test(file.name || "");
};

const CropPdf = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialFiles =
    (state?.selectedFiles && state.selectedFiles.slice(0, 1)) || [];
  const [files, setFiles] = useState(() =>
    initialFiles.map((f) => (f instanceof File ? f : f))
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  // crop options
  const [applyToAllPages, setApplyToAllPages] = useState(true);
  const [keepAspectRatio, setKeepAspectRatio] = useState(false);
  const [compressFinalOutput, setCompressFinalOutput] = useState(false);
  const [flattenAfterCrop, setFlattenAfterCrop] = useState(false);

  // selection & PDF state
  const [cropRectPdf, setCropRectPdf] = useState(null);
  const [cropRectCanvas, setCropRectCanvas] = useState(null);

  const [pdfMeta, setPdfMeta] = useState(null); // { numPages }
  const [currentPage, setCurrentPage] = useState(1);

  // refs
  const fileInputRef = useRef();
  const canvasRef = useRef();
  const canvasWrapperRef = useRef();
  const pdfRef = useRef(null); // loaded pdf document
  const pageViewportRef = useRef(null);
  const dragStateRef = useRef({ start: null, current: null, dragging: false });
  const scrollIntervalRef = useRef(null);
  const lastMouseMoveRef = useRef(null);

  // create preview for file on mount / when initial files provided
  useEffect(() => {
    const createdPreviews = [];
    setFiles((prev) =>
      prev.map((f) => {
        if (!f) return f;
        if (f.preview) return f;
        if (f instanceof File) {
          const preview = URL.createObjectURL(f);
          createdPreviews.push(preview);
          return Object.assign(f, { preview });
        }
        return f;
      })
    );

    return () => {
      createdPreviews.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) { }
      });
      if (resultUrl) {
        try {
          URL.revokeObjectURL(resultUrl);
        } catch (e) { }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revokePreview = (previewUrl) => {
    try {
      if (previewUrl && previewUrl.startsWith("blob:"))
        URL.revokeObjectURL(previewUrl);
    } catch (e) { }
  };

  const handleAddFiles = (e) => {
    const incoming = Array.from(e.target.files || []);
    if (!incoming.length) return;

    const first = incoming[0];
    if (!isPdfFile(first)) {
      setError("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    if (files[0] && files[0].preview) revokePreview(files[0].preview);

    const withPreview = Object.assign(first, {
      preview: URL.createObjectURL(first),
    });
    setFiles([withPreview]);
    setError(null);
    setResultUrl(null);
    setCropRectPdf(null);
    setCropRectCanvas(null);
    setPdfMeta(null);
    setCurrentPage(1);
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => {
      const toRemove = prev[index];
      if (toRemove && toRemove.preview) revokePreview(toRemove.preview);
      return [];
    });
    setResultUrl(null);
    setCropRectPdf(null);
    setCropRectCanvas(null);
    setPdfMeta(null);
    pdfRef.current = null;
    setCurrentPage(1);
  };

  const activeFile = files[0] || null;

  // thumbnail stack kept for parity, not used elsewhere
  const thumbnailStack = useMemo(
    () =>
      files.map((f, i) => ({
        key: i,
        url: f.preview || pdfIcon,
        name: f.name || `File ${i + 1}`,
        top: i * 18,
        scale: 1 - i * 0.02,
        z: files.length - i,
      })),
    [files]
  );

  /* ---------------- PDF loading + page render ---------------- */
  useEffect(() => {
    let cancelled = false;

    const renderPage = async (pageNum = 1) => {
      if (!pdfRef.current) return;
      try {
        const page = await pdfRef.current.getPage(pageNum);
        const node = canvasWrapperRef.current;
        if (!node) return;

        // Exactly like MergePdf: scale to fit container width
        const containerWidth = node.clientWidth - 40;
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });
        pageViewportRef.current = viewport;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        canvas.style.width = `${Math.round(viewport.width)}px`;
        canvas.style.height = `${Math.round(viewport.height)}px`;
        canvas.style.display = "block";

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const renderTask = page.render({ canvasContext: ctx, viewport });
        await renderTask.promise;

        setCropRectCanvas(null);
        setCropRectPdf(null);
      } catch (err) {
        if (!cancelled) {
          console.error("Render page failed", err);
          setError("Failed to render page. See console.");
        }
      }
    };

    const loadPdf = async () => {
      if (!activeFile) {
        pdfRef.current = null;
        setPdfMeta(null);
        return;
      }
      setIsProcessing(true);
      setError(null);

      try {
        const arrayBuffer = await activeFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setPdfMeta({ numPages: pdf.numPages });
        // render current page (default 1)
        await renderPage(currentPage);
      } catch (err) {
        console.error("PDF load failed:", err);
        setError("Failed to load PDF. See console.");
        pdfRef.current = null;
        setPdfMeta(null);
      } finally {
        if (!cancelled) setIsProcessing(false);
      }
    };

    loadPdf();

    // re-render on resize so canvas remains 70vh and selection aligns
    const onResize = () => {
      if (pdfRef.current) renderPage(currentPage);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
    // we intentionally include currentPage to re-render when page changes
  }, [activeFile, currentPage]);

  /* ---------------- Mouse handlers for drawing crop rectangle on wrapper ---------------- */
  useEffect(() => {
    const wrapper = canvasWrapperRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !wrapper) return;

    const getCanvasPoint = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect(); // Use canvas rect for exact mapping
      const rx = clientX - rect.left;
      const ry = clientY - rect.top;
      
      // Map visual pixels (rx, ry) to internal canvas pixels (canvas.width, canvas.height)
      const x = (rx / rect.width) * canvas.width;
      const y = (ry / rect.height) * canvas.height;

      // Clamp so selection always sits within page bounds
      return {
        x: Math.max(0, Math.min(canvas.width, x)),
        y: Math.max(0, Math.min(canvas.height, y)),
      };
    };

    const updateSelection = (clientX, clientY) => {
      if (!dragStateRef.current.dragging) return;
      const pt = getCanvasPoint(clientX, clientY);
      dragStateRef.current.current = pt;
      const sx = dragStateRef.current.start.x;
      const sy = dragStateRef.current.start.y;
      const x = Math.min(sx, pt.x);
      const y = Math.min(sy, pt.y);
      const w = Math.abs(pt.x - sx);
      const h = Math.abs(pt.y - sy);
      setCropRectCanvas({ x, y, w, h });
    };

    const stopAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const start = getCanvasPoint(e.clientX, e.clientY);
      dragStateRef.current = { start, current: start, dragging: true };
      setCropRectCanvas({
        x: start.x,
        y: start.y,
        w: 0,
        h: 0,
      });
    };

    const onMouseMove = (e) => {
      if (!dragStateRef.current.dragging) return;
      e.preventDefault();
      lastMouseMoveRef.current = { clientX: e.clientX, clientY: e.clientY };

      const wrapper = canvasWrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const threshold = 50;
      const scrollSpeed = 15;

      // Handle auto-scroll zones
      if (e.clientY > rect.bottom - threshold) {
        // scroll down
        if (!scrollIntervalRef.current) {
          scrollIntervalRef.current = setInterval(() => {
            wrapper.scrollTop += scrollSpeed;
            if (lastMouseMoveRef.current) {
              updateSelection(lastMouseMoveRef.current.clientX, lastMouseMoveRef.current.clientY);
            }
          }, 20);
        }
      } else if (e.clientY < rect.top + threshold) {
        // scroll up
        if (!scrollIntervalRef.current) {
          scrollIntervalRef.current = setInterval(() => {
            wrapper.scrollTop -= scrollSpeed;
            if (lastMouseMoveRef.current) {
              updateSelection(lastMouseMoveRef.current.clientX, lastMouseMoveRef.current.clientY);
            }
          }, 20);
        }
      } else {
        stopAutoScroll();
      }

      updateSelection(e.clientX, e.clientY);
    };

    const onMouseUp = (e) => {
      stopAutoScroll();
      if (!dragStateRef.current.dragging) return;
      e.preventDefault();
      const pt = getCanvasPoint(e.clientX, e.clientY);
      dragStateRef.current.current = pt;
      dragStateRef.current.dragging = false;

      const sx = dragStateRef.current.start.x;
      const sy = dragStateRef.current.start.y;
      const x = Math.min(sx, pt.x);
      const y = Math.min(sy, pt.y);
      const w = Math.abs(pt.x - sx);
      const h = Math.abs(pt.y - sy);

      const viewport = pageViewportRef.current;
      if (viewport) {
        const scaleFactor = 1 / viewport.scale;
        const pdfLeft = Math.round(x * scaleFactor);
        const pdfTop = Math.round(y * scaleFactor);
        const pdfW = Math.round(w * scaleFactor);
        const pdfH = Math.round(h * scaleFactor);
        setCropRectPdf({
          left: pdfLeft,
          top: pdfTop,
          width: pdfW,
          height: pdfH,
          page: currentPage,
        });
      } else {
        setCropRectPdf(null);
      }

      setCropRectCanvas({ x, y, w, h });
      dragStateRef.current = null;
    };

    // touch handlers
    const onTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      onMouseDown({
        button: 0,
        clientX: t.clientX,
        clientY: t.clientY,
        preventDefault: () => e.preventDefault(),
      });
    };
    const onTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      onMouseMove({
        clientX: t.clientX,
        clientY: t.clientY,
        preventDefault: () => e.preventDefault(),
      });
    };
    const onTouchEnd = (e) => {
      onMouseUp({
        clientX:
          (e.changedTouches &&
            e.changedTouches[0] &&
            e.changedTouches[0].clientX) ||
          0,
        clientY:
          (e.changedTouches &&
            e.changedTouches[0] &&
            e.changedTouches[0].clientY) ||
          0,
        preventDefault: () => e.preventDefault(),
      });
    };

    // bind to wrapper so coordinates match visual area exactly
    wrapper.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    wrapper.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      stopAutoScroll();
      wrapper.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      wrapper.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    canvasRef.current,
    canvasWrapperRef.current,
    pageViewportRef.current,
    currentPage,
  ]);

  /* ---------------- send crop to backend ---------------- */
  const handleCrop = async () => {
    if (!activeFile) {
      setError("Please select a PDF file to crop.");
      return;
    }
    if (!isPdfFile(activeFile)) {
      setError("Selected file is not a valid PDF.");
      return;
    }

    // If user requested apply-to-all-pages but didn't draw a selection,
    // automatically select full page so we can send coordinates.
    if (applyToAllPages && !cropRectPdf) {
      const canvas = canvasRef.current;
      const viewport = pageViewportRef.current;
      if (!canvas || !viewport) {
        setError("No preview available to infer full-page selection.");
        return;
      }
      const scaleFactor = 1 / viewport.scale;
      const fullPdfW = Math.round(canvas.width * scaleFactor);
      const fullPdfH = Math.round(canvas.height * scaleFactor);
      setCropRectCanvas({ x: 0, y: 0, w: canvas.width, h: canvas.height });
      setCropRectPdf({
        left: 0,
        top: 0,
        width: fullPdfW,
        height: fullPdfH,
        page: currentPage,
      });
      // set local variable so we can continue immediately without waiting for state to propagate
      // (we'll reuse those values below)
    }

    // require a selection (either user-drawn or auto-selected above)
    // Note: if we just set it above, state update might not allow us to read cropRectPdf immediately
    // so we should rely on the logic or valid state.
    // Ideally we should use a temp variable if we just calculated it, but for now we assume 
    // the user draws first or checks the box which triggers logic. 
    // However, the above 'if' block sets state which isn't immediate.
    // Let's protect against that by re-checking or passing data directly if we had to calculate it.
    // For safety in this refactor, I will assume the user has set it or will retry. 
    // But to be robust:
    let currentRect = cropRectPdf;
    if (applyToAllPages && !currentRect) {
      // re-calculate synchronously for use in this function
      const canvas = canvasRef.current;
      const viewport = pageViewportRef.current;
      if (canvas && viewport) {
        const scaleFactor = 1 / viewport.scale;
        currentRect = {
          left: 0,
          top: 0,
          width: Math.round(canvas.width * scaleFactor),
          height: Math.round(canvas.height * scaleFactor),
          page: currentPage
        };
      }
    }

    if (!currentRect) {
      setError("Please draw a crop rectangle on the preview first.");
      return;
    }

    setError(null);
    setIsProcessing(true);

    if (resultUrl) {
      try {
        URL.revokeObjectURL(resultUrl);
      } catch (e) { }
      setResultUrl(null);
    }

    try {
      // 1. Dispatch tool action
      const actionRes = await fetch(`${API_BASE}/api/tool-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "edit", action: "crop_pdf" }),
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
      fd.append("file", activeFile, activeFile.name || "file.pdf");
      fd.append("tool", "edit");
      fd.append("action", "crop_pdf");

      // Log for debugging
      console.log('Crop area:', {
        x: currentRect.left,
        y: currentRect.top,
        width: currentRect.width,
        height: currentRect.height
      });

      // Update settings object
      const settings = {
        apply_to_all_pages: applyToAllPages,
        keep_aspect_ratio: keepAspectRatio,
        compress_final_output: compressFinalOutput,
        flatten_after_crop: flattenAfterCrop,
        crop_x: currentRect.left,
        crop_y: currentRect.top,
        crop_width: currentRect.width,
        crop_height: currentRect.height,
        page: applyToAllPages ? "all" : String(currentRect.page || currentPage)
      };

      fd.append("settings", JSON.stringify(settings));

      // Legacy fields
      fd.append("apply_to_all_pages", applyToAllPages ? "1" : "0");
      fd.append("keep_aspect_ratio", keepAspectRatio ? "1" : "0");
      fd.append("compress_final_output", compressFinalOutput ? "1" : "0");
      fd.append("flatten_after_crop", flattenAfterCrop ? "1" : "0");
      if (applyToAllPages) {
        fd.append("page", "all");
      } else {
        fd.append("page", String(currentRect.page || currentPage));
      }

      // Fixed parameters for backend
      fd.append("crop_x", String(currentRect.left));
      fd.append("crop_y", String(currentRect.top));
      fd.append("crop_width", String(currentRect.width));
      fd.append("crop_height", String(currentRect.height));

      // Log FormData
      for (let [key, value] of fd.entries()) {
        console.log(key, value);
      }

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `Crop failed: ${res.status}`);
      }

      const blob = await res.blob();
      // force PDF type
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      setResultUrl(url);
    } catch (err) {
      console.error("Crop error:", err);
      setError(err.message || "Crop failed. See console.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `cropped-${activeFile?.name || "cropped.pdf"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleBack = () => {
    navigate("/tools/crop-pdf");
  };

  const clearSelection = () => {
    setCropRectCanvas(null);
    setCropRectPdf(null);
  };

  const goPrev = () => {
    if (!pdfMeta) return;
    setCropRectCanvas(null);
    setCropRectPdf(null);
    setCurrentPage((p) => Math.max(1, p - 1));
  };
  const goNext = () => {
    if (!pdfMeta) return;
    setCropRectCanvas(null);
    setCropRectPdf(null);
    setCurrentPage((p) => Math.min(pdfMeta.numPages || p, p + 1));
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 mb-4">
          <div className="col-span-9 relative">
            <div className="flex items-center justify-start bg-[#F7E6E9]/[0.30] border border-[#F3D9DD] rounded-md px-4 py-6">
              <div className="flex items-center gap-10">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-md text-gray-700 hover:text-red-700"
                  aria-label="Go back"
                >
                  <img src={iconBack} alt="back" className="w-5 h-5" />
                  Back
                </button>

                <label
                  htmlFor="add-file-crop"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-[#B2011E] rounded-md bg-white cursor-pointer text-[16px]"
                >
                  Add file
                  <input
                    id="add-file-crop"
                    type="file"
                    accept=".pdf"
                    onChange={handleAddFiles}
                    className="hidden"
                    aria-label="Add PDF file"
                    ref={fileInputRef}
                  />
                </label>
              </div>

              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 bg-white border border-[#B2011E] rounded-md"
                    title="Layout"
                    aria-label="Layout"
                  >
                    <img src={iconMonitor} alt="monitor" className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 bg-white border border-[#B2011E] rounded-md"
                    title="Grid"
                    aria-label="Grid"
                  >
                    <img src={iconGrid} alt="grid" className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 bg-white border border-[#B2011E] rounded-md"
                    title="Google Drive"
                    aria-label="Google Drive"
                  >
                    <img
                      src={iconTriangle}
                      alt="triangle"
                      className="w-5 h-5"
                    />
                  </button>
                  <button
                    className="p-2 bg-white border border-[#B2011E] rounded-md"
                    title="Cloud"
                    aria-label="Cloud"
                  >
                    <img src={iconCloud} alt="cloud" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT side info panel (Task Status) */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-rose-100 rounded-md p-6 flex flex-col justify-between shadow-sm">
            <div className="text-center py-4">
              <h3 className="text-sm font-bold mb-6 border-b pb-5 text-center border-red-800 text-red-800 uppercase tracking-wider">
                Task Status
              </h3>
              
              {resultUrl ? (
                <div className="flex flex-col items-center animate-fadeIn mb-4">
                  <p className="text-md font-bold text-gray-800 mb-2">Processed Successfully!</p>
                  <iframe
                    title="result-preview"
                    src={resultUrl}
                    style={{ width: "100%", height: 200 }}
                    className="rounded border shadow-inner mb-4 bg-white"
                  />
                  <p className="text-xs text-gray-500 uppercase tracking-tight font-bold">Your file is ready</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400 py-10">
                  <p className="text-sm px-4 text-center leading-relaxed">
                    {isProcessing ? "Processing your request..." : "Select area on the left to crop."}
                  </p>
                </div>
              )}

              {error && <div className="text-sm text-red-600 mt-4 font-bold">{error}</div>}
            </div>

            <div>
              {resultUrl ? (
                <div className="space-y-4">
                  <button
                    onClick={handleDownloadResult}
                    className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md w-full transition-all shadow-md active:scale-[0.98]"
                  >
                    Download Now
                  </button>
                  <a
                    href={resultUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-xs text-gray-500 hover:underline uppercase tracking-tight font-bold"
                  >
                    Open in new tab
                  </a>
                </div>
              ) : (
                <button
                  onClick={handleCrop}
                  disabled={isProcessing || !activeFile || !cropRectPdf}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md w-full transition-all shadow-md active:scale-[0.98] disabled:bg-gray-400"
                >
                  {isProcessing ? "Processing..." : "Crop PDF"}
                </button>
              )}
            </div>
          </aside>

          {/* LEFT COLUMN: file listing + crop controls */}
          <div className="col-span-3">
            <aside className="bg-gray-50 rounded-lg p-4">
              <h1 className="mb-4 text-gray-800 font-semibold tracking-tight uppercase text-xs">Selected PDF & options</h1>

              <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto pr-1">
                {files.length === 0 ? (
                  <div className="p-3 border border-[#E7B0B9] bg-white rounded-md mb-4 shadow-sm text-sm text-gray-400 text-center py-8">
                    No file selected
                  </div>
                ) : (
                  files.slice(0, 3).map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 border border-[#E7B0B9] bg-white rounded-md shadow-sm transition-all hover:border-red-200"
                    >
                      <img
                        src={pdfIcon}
                        alt="pdf-thumb"
                        className="w-14 h-14 object-contain bg-white rounded border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-bold truncate text-gray-800"
                          title={f.name}
                        >
                          {f.name}
                        </div>
                        <div className="text-xs text-gray-500 font-medium uppercase">
                          {humanFileSize(f.size)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(i)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        aria-label={`Remove ${f.name}`}
                      >
                        <FiTrash2 size={16} />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border border-[#E7B0B9] bg-white rounded-md shadow-sm">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2 border-gray-100">Crop options</h2>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={applyToAllPages}
                          onChange={(e) => setApplyToAllPages(e.target.checked)}
                          disabled={isProcessing}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">Apply to all pages</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={keepAspectRatio}
                          onChange={(e) => setKeepAspectRatio(e.target.checked)}
                          disabled={isProcessing}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                          Keep aspect ratio
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={compressFinalOutput}
                          onChange={(e) =>
                            setCompressFinalOutput(e.target.checked)
                          }
                          disabled={isProcessing}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">Compress output</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={flattenAfterCrop}
                          onChange={(e) =>
                            setFlattenAfterCrop(e.target.checked)
                          }
                          disabled={isProcessing}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                          Flatten PDF
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* CENTER interactive canvas preview */}
          <main className="col-span-6 bg-white border border-[#E7B0B9] rounded-lg p-4 flex flex-col shadow-sm">
            {activeFile ? (
              <div className="flex flex-col h-[75vh]">
                <div
                  ref={canvasWrapperRef}
                  className="flex-1 overflow-y-auto hide-scrollbar bg-gray-100 rounded flex justify-center items-start shadow-inner p-4 relative cursor-crosshair"
                >
                  <div className="relative">
                    <canvas ref={canvasRef} className="bg-white shadow-lg block mb-4" />
                    {/* overlay selection rectangle */}
                    {cropRectCanvas && (
                      <div
                        style={{
                          position: "absolute",
                          left: `${(cropRectCanvas.x / (canvasRef.current?.width || 1)) * 100}%`,
                          top: `${(cropRectCanvas.y / (canvasRef.current?.height || 1)) * 100}%`,
                          width: `${(cropRectCanvas.w / (canvasRef.current?.width || 1)) * 100}%`,
                          height: `${(cropRectCanvas.h / (canvasRef.current?.height || 1)) * 100}%`,
                          border: "2px dashed rgba(220,38,38,0.9)",
                          backgroundColor: "rgba(220,38,38,0.12)",
                          pointerEvents: "none",
                          zIndex: 40,
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* page nav and info (Pagination Bar like MergePdf) */}
                <div className="flex justify-between items-center mt-4 px-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={goPrev}
                    className="px-4 py-1 border border-red-200 rounded text-xs font-bold disabled:opacity-30 text-red-700 hover:bg-red-50 transition-colors uppercase"
                  >
                    Prev
                  </button>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-gray-600 uppercase">
                      PAGE {currentPage} / {pdfMeta?.numPages || 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const canvas = canvasRef.current;
                          const viewport = pageViewportRef.current;
                          if (!canvas || !viewport) return;
                          setCropRectCanvas({ x: 0, y: 0, w: canvas.width, h: canvas.height });
                          const scaleFactor = 1 / viewport.scale;
                          setCropRectPdf({
                            left: 0,
                            top: 0,
                            width: Math.round(canvas.width * scaleFactor),
                            height: Math.round(canvas.height * scaleFactor),
                            page: currentPage,
                          });
                        }}
                        className="px-3 py-1 border border-gray-200 rounded text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-colors uppercase"
                      >
                        Full
                      </button>
                      <button
                        onClick={clearSelection}
                        disabled={!cropRectCanvas}
                        className="px-3 py-1 border border-gray-200 rounded text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-colors uppercase disabled:opacity-30"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <button
                    disabled={!pdfMeta || currentPage >= pdfMeta.numPages}
                    onClick={goNext}
                    className="px-4 py-1 border border-red-200 rounded text-xs font-bold disabled:opacity-30 text-red-700 hover:bg-red-50 transition-colors uppercase"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 p-8">
                <img
                  src={pdfIcon}
                  alt="pdf-placeholder"
                  className="mx-auto mb-4 w-28 h-28"
                />
                <div>No file selected</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CropPdf;
