// src/pages/tools/Annotate.jsx
import React, { useEffect, useRef, useState } from "react";
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
  if (size === 0) return "0 B";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${
    ["B", "KB", "MB", "GB"][i]
  }`;
};

const isPdfFile = (file) => {
  if (!file) return false;
  if (file.type) return file.type === "application/pdf";
  return /\.pdf$/i.test(file.name || "");
};

const Annotate = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // initial file
  const initialFiles =
    (state?.selectedFiles && state.selectedFiles.slice(0, 1)) || [];

  const [file, setFile] = useState(() => {
    if (!initialFiles.length) return null;
    return initialFiles[0];
  });

  const [error, setError] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);

  // page selection
  const [pageInput, setPageInput] = useState(1);
  const [appliedPage, setAppliedPage] = useState(1);

  // PDF Rendering State
  const pdfRef = useRef(null); // Loaded PDF document
  const [pdfMeta, setPdfMeta] = useState(null); // { numPages }
  const canvasWrapperRef = useRef(null);
  const pdfCanvasRef = useRef(null); // Background PDF canvas

  // Track active page to prevent stale renders
  const activePageRef = useRef(1);

  // Store actual PDF page dimensions (unscaled) for coordinate normalization
  const pdfPageWidthRef = useRef(null);
  const pdfPageHeightRef = useRef(null);
  const renderScaleRef = useRef(1); // Scale used when rendering

  // Annotation/Drawing State
  const drawCanvasRef = useRef(null); // Foreground drawing canvas
  const [tool, setTool] = useState("pen"); // pen | highlight | text | eraser
  const [color, setColor] = useState("#FFEB3B"); // Default Yellow
  const [size, setSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]); // for undo
  const [currentPath, setCurrentPath] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // text insertion
  const [textInputValue, setTextInputValue] = useState("");

  // Load PDF when file changes
  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      if (!file) {
        pdfRef.current = null;
        setPdfMeta(null);
        return;
      }

      // If file has a preview blob but it's not a File object, we might need to fetch it?
      // CropPdf used file.arrayBuffer(). File object has this.
      // If it's a blob URL from previous page... we might need to fetch it.
      // But usually `file` is a File object here.

      setIsProcessing(true);
      setError(null);
      setPaths([]); // Clear annotations on new file
      setAppliedPage(1);
      setPageInput(1);

      try {
        let data = null;
        if (file instanceof File) {
          data = await file.arrayBuffer();
        } else {
          // Fallback if we just have a preview URL (unlikely in this flow but possible)
          // For now assume File object as per existing logic
          setError("Invalid file object");
          return;
        }

        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        pdfRef.current = pdf;
        setPdfMeta({ numPages: pdf.numPages });
        // Render first page
        await renderPage(1);
      } catch (err) {
        console.error("PDF load failed:", err);
        setError("Failed to load PDF. " + err.message);
        pdfRef.current = null;
        setPdfMeta(null);
      } finally {
        if (!cancelled) setIsProcessing(false);
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [file]);

  // Render Page
  const renderPage = async (pageNum) => {
    if (!pdfRef.current) return;
    try {
      if (pageNum !== activePageRef.current) return;
      const page = await pdfRef.current.getPage(pageNum);
      if (pageNum !== activePageRef.current) return;

      // Calculate scale to fit 70vh (matching CropPdf look)
      const unscaledViewport = page.getViewport({ scale: 1 });

      // ⭐ FIT TO CONTAINER WIDTH
      const wrapperWidth = canvasWrapperRef.current.clientWidth;
      const desiredScale = wrapperWidth / unscaledViewport.width;

      const viewport = page.getViewport({ scale: desiredScale });

      // Store unscaled PDF dimensions and render scale for coordinate normalization
      pdfPageWidthRef.current = unscaledViewport.width;
      pdfPageHeightRef.current = unscaledViewport.height;
      renderScaleRef.current = desiredScale;

      const pdfCanvas = pdfCanvasRef.current;
      const drawCanvas = drawCanvasRef.current;

      if (!pdfCanvas || !drawCanvas) return;

      // Set dimensions
      pdfCanvas.width = Math.floor(viewport.width);
      pdfCanvas.height = Math.floor(viewport.height);
      drawCanvas.width = Math.floor(viewport.width);
      drawCanvas.height = Math.floor(viewport.height);

      // Styling for centering
      const styleWidth = `${viewport.width}px`;
      const styleHeight = `${viewport.height}px`;
      pdfCanvas.style.width = styleWidth;
      pdfCanvas.style.height = styleHeight;
      drawCanvas.style.width = styleWidth;
      drawCanvas.style.height = styleHeight;
      
      pdfCanvas.className = "block bg-white shadow-lg mb-4";
      drawCanvas.className = "absolute top-0 left-0 cursor-crosshair";

      const ctx = pdfCanvas.getContext("2d");
      ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      if (pageNum !== activePageRef.current) return;

      redrawAll();
    } catch (err) {
      console.error("Render failed", err);
      setError("Render failed: " + err.message);
    }
  };

  // Re-render when appliedPage changes
  useEffect(() => {
    activePageRef.current = appliedPage;

    // 🔥 REQUIRED to avoid ghost annotations
    const dCtx = drawCanvasRef.current?.getContext("2d");
    if (dCtx) {
      dCtx.clearRect(0, 0, dCtx.canvas.width, dCtx.canvas.height);
    }

    if (pdfRef.current) {
      renderPage(appliedPage);
    }
  }, [appliedPage]);

  // Handle Resize
  useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (pdfRef.current) renderPage(appliedPage);
      }, 300);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [appliedPage]);

  /* ---------------- Drawing Logic (Adapted) ---------------- */

  const getCtx = () => {
    const c = drawCanvasRef.current;
    if (!c) return null;
    return c.getContext("2d");
  };

  const drawFullPath = (ctx, path) => {
    if (!ctx || !path || !path.points || path.points.length === 0) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle =
      path.tool === "highlight" ? hexWithAlpha(path.color, 0.35) : path.color;
    ctx.globalCompositeOperation =
      path.tool === "eraser" ? "destination-out" : "source-over";
    ctx.lineWidth = path.size * (path.tool === "highlight" ? 4 : 1);
    ctx.beginPath();
    ctx.moveTo(path.points[0].x, path.points[0].y);
    for (let i = 1; i < path.points.length; i++)
      ctx.lineTo(path.points[i].x, path.points[i].y);
    ctx.stroke();
    ctx.closePath();
    ctx.globalCompositeOperation = "source-over";
  };

  const redrawAll = () => {
    // ⛔ Prevent stale redraws
    if (appliedPage !== activePageRef.current) return;

    const ctx = getCtx();
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const p of paths) {
      if (p.page !== appliedPage) continue;

      if (p.tool === "text") {
        ctx.font = `${p.size * 6}px sans-serif`;
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
      } else {
        drawFullPath(ctx, p);
      }
    }

    // Draw live stroke ONLY for current page
    if (currentPath && currentPath.page === appliedPage) {
      drawFullPath(ctx, currentPath);
    }
  };

  useEffect(() => {
    redrawAll();
  }, [paths, currentPath, appliedPage]);

  // Pointer Handlers
  const pointerToCanvas = (clientX, clientY) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return {
      x: Math.max(0, Math.min(x, rect.width)),
      y: Math.max(0, Math.min(y, rect.height)),
    };
  };

  const startDraw = (x, y) => {
    if (tool === "text") {
      if (textInputValue.trim()) {
         setPaths((prev) => [
          ...prev,
          { tool: "text", color, size, text: textInputValue.trim(), x, y, page: appliedPage },
        ]);
        setTextInputValue("");
      }
      return;
    }
    setIsDrawing(true);
    const p = { tool, color, size, points: [{ x, y }], page: appliedPage };
    setCurrentPath(p);
  };

  const continueDraw = (x, y) => {
    if (!isDrawing || !currentPath) return;
    const updated = {
      ...currentPath,
      points: [...currentPath.points, { x, y }],
    };
    setCurrentPath(updated);
    // Partial redraw optimization could go here, but redrawAll is safer
  };

  const endDraw = () => {
    if (isDrawing && currentPath && currentPath.page === appliedPage) {
      setPaths((prev) => [...prev, currentPath]);
    }
    setCurrentPath(null);
    setIsDrawing(false);
  };

  // Event Listeners
  const handlePointerDown = (e) => {
    if (e.button === 2) return; // right click
    const pt = pointerToCanvas(e.clientX, e.clientY);
    startDraw(pt.x, pt.y);
    e.preventDefault();
  };
  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    const pt = pointerToCanvas(e.clientX, e.clientY);
    continueDraw(pt.x, pt.y);
    e.preventDefault();
  };
  const handlePointerUp = (e) => {
    endDraw();
    e.preventDefault();
  };

  // attach listeners
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    // Basic mouse
    canvas.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    // Touch
    const onTouchStart = (e) => {
      const t = e.touches[0];
      const pt = pointerToCanvas(t.clientX, t.clientY);
      startDraw(pt.x, pt.y);
      e.preventDefault();
    };
    const onTouchMove = (e) => {
      const t = e.touches[0];
      const pt = pointerToCanvas(t.clientX, t.clientY);
      continueDraw(pt.x, pt.y);
      e.preventDefault();
    };
    const onTouchEnd = (e) => {
      endDraw();
      e.preventDefault();
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDrawing, currentPath, tool, color, size, textInputValue, appliedPage]);

  /* ---------------- UI Helpers ---------------- */

  const handleAddFile = (e) => {
    const incoming = Array.from(e.target.files || []);
    if (!incoming.length) return;
    const first = incoming[0];
    if (!isPdfFile(first)) {
      setError("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }
    setFile(first);
    setResultUrl(null);
    e.target.value = "";
  };

  const removeFile = () => {
    setFile(null);
    setResultUrl(null);
    setPaths([]);
    setPageInput(1);
    setAppliedPage(1);
    setPdfMeta(null);
    pdfRef.current = null;
  };

  const handleBack = () => navigate("/tools/annotate-pdf"); // Or whatever page

  const handleUndo = () =>
    setPaths((prev) => (prev.length ? prev.slice(0, -1) : prev));
  const handleClear = () => {
    setPaths((prev) => prev.filter((p) => p.page !== appliedPage));
    setCurrentPath(null);
    redrawAll();
  };



  const hexWithAlpha = (hex, alpha) => {
    const h = (hex || "#000000").replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const hexToRgb = (hex) => {
    const h = (hex || "#000000").replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16) / 255,
      parseInt(h.substring(2, 4), 16) / 255,
      parseInt(h.substring(4, 6), 16) / 255,
    ];
  };

  /* ---------------- Backend Save ---------------- */
  const handleSave = async () => {
    if (!file) {
      setError("Add a PDF first.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const canvas = drawCanvasRef.current;

      // Use the ACTUAL PDF page dimensions (unscaled) for normalization
      // This ensures coordinates map correctly regardless of canvas scale
      const scale = renderScaleRef.current || 1;
      const pdfWidth =
        pdfPageWidthRef.current || (canvas ? canvas.width / scale : 1000);
      const pdfHeight =
        pdfPageHeightRef.current || (canvas ? canvas.height / scale : 1000);

      // Canvas coordinates are in scaled pixels, so divide by scale first,
      // then divide by PDF dimensions to get 0-1 normalized coordinates

      const annotations = paths
        .map((p) => {
          const colorArr = hexToRgb(p.color);

          if (p.tool === "text") {
            // Convert canvas coords to normalized PDF coords
            const normX = p.x / scale / pdfWidth;
            const normY = p.y / scale / pdfHeight;
            // PRE-FLIP Y: Backend applies y_pdf = 1 - y for text
            const preFlippedY = 1 - normY;
            return {
              type: "text",
              text: p.text,
              page: p.page,
              x: normX,
              y: preFlippedY,
              rect: null,
              color: colorArr,
              font_size: p.size * 6,
            };
          }

          // Highlight - Use MARKER MODE for freehand highlighting
          // Backend supports points + width for thick translucent strokes
          if (p.tool === "highlight") {
            // Convert canvas coords to normalized PDF coords and PRE-FLIP Y
            const preFlippedPoints = p.points.map((pt) => {
              const normX = pt.x / scale / pdfWidth;
              const normY = pt.y / scale / pdfHeight;
              return [normX, 1 - normY]; // Pre-flip Y
            });

            // Send as marker stroke with width for thick highlighter effect
            return {
              type: "highlight",
              page: p.page,
              points: preFlippedPoints, // Freehand path
              width: p.size * 8, // Thick marker width (scaled from brush size)
              rect: null, // Not using rect mode
              color: colorArr,
              opacity: 0.4, // Slightly more visible
            };
          }

          // Pen
          if (p.tool === "pen") {
            // PRE-FLIP Y: Backend applies y_pdf = 1 - y for ink points
            // Pre-flip so backend's flip results in correct position
            const preFlippedPoints = p.points.map((pt) => {
              const normX = pt.x / scale / pdfWidth;
              const normY = pt.y / scale / pdfHeight;
              return [normX, 1 - normY]; // Pre-flip Y
            });

            return {
              type: "ink",
              points: preFlippedPoints,
              page: p.page,
              rect: null,
              color: colorArr,
              width: p.size,
            };
          }
          return null;
        })
        .filter(Boolean);

      await sendToServer(file, annotations);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to export annotations.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sendToServer = async (pdfFile, annotations) => {
    try {
      const actionRes = await fetch(`${API_BASE}/api/tool-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "edit", action: "annotate_pdf" }),
      });

      if (!actionRes.ok) {
        throw new Error((await actionRes.text()) || "Tool action failed");
      }
      const { redirect_to } = await actionRes.json();
      const uploadUrl = redirect_to.startsWith("/api")
        ? `${API_BASE}${redirect_to}`
        : `${API_BASE}/api${redirect_to}`;

      const fd = new FormData();
      fd.append("file", pdfFile, pdfFile.name || "file.pdf");
      fd.append("tool", "edit");
      fd.append("action", "annotate_pdf");
      fd.append("annotations", JSON.stringify(annotations));

      const res = await fetch(uploadUrl, { method: "POST", body: fd });
      if (!res.ok) {
        throw new Error((await res.text()) || "Server failed");
      }

      const blob = await res.blob();
      const pdfUrl = URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      setResultUrl(pdfUrl);
    } catch (err) {
      console.error("Annotate error", err);
      throw err;
    }
  };

  const handleDownloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `annotated-${file?.name || "result"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePageEnter = () => {
    const p = Math.max(
      1,
      Math.min(pdfMeta?.numPages || 1, Number(pageInput) || 1)
    );
    setAppliedPage(p);
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 mb-4">
          {/* Top area */}
          <div className="col-span-9 relative">
            <div className="flex items-center justify-start bg-[#F7E6E9]/[0.30] border border-[#F3D9DD] rounded-md px-4 py-6">
              <div className="flex items-center gap-10">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-md text-gray-700 hover:text-red-700"
                >
                  <img src={iconBack} alt="back" className="w-5 h-5" />
                  Back
                </button>

                <label className="inline-flex items-center gap-2 px-3 py-2 border border-[#B2011E] rounded-md bg-white cursor-pointer text-[16px]">
                  Add file
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleAddFile}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-3">
                  <button
                    className={`p-2 rounded-md border ${
                      tool === "pen" ? "ring-2 ring-red-400" : "bg-white"
                    }`}
                    onClick={() => setTool("pen")}
                  >
                    Pen
                  </button>
                  <button
                    className={`p-2 rounded-md border ${
                      tool === "highlight" ? "ring-2 ring-red-400" : "bg-white"
                    }`}
                    onClick={() => setTool("highlight")}
                  >
                    Highlight
                  </button>
                  <button
                    className={`p-2 rounded-md border ${
                      tool === "text" ? "ring-2 ring-red-400" : "bg-white"
                    }`}
                    onClick={() => setTool("text")}
                  >
                    Text
                  </button>
                  <button
                    className={`p-2 rounded-md border ${
                      tool === "eraser" ? "ring-2 ring-red-400" : "bg-white"
                    }`}
                    onClick={() => setTool("eraser")}
                  >
                    Eraser
                  </button>
                  <button
                    className="p-2 bg-white border border-[#B2011E] rounded-md"
                    onClick={handleUndo}
                  >
                    Undo
                  </button>
                  <button
                    className="p-2 bg-white border border-[#B2011E] rounded-md"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    className="p-2 bg-red-700 text-white rounded-md"
                    onClick={handleSave}
                    disabled={isProcessing || !file}
                  >
                    {isProcessing ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Tools & Status */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-rose-100 rounded-md p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-sm font-bold mb-6 border-b pb-5 text-center border-red-800 text-red-800 uppercase tracking-wider">
                Annotate PDF
              </h3>
              <div className="mb-4">
                <label className="block text-sm mb-2">
                  Color
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="ml-2"
                  />
                </label>
                <label className="block text-sm">
                  Size: {size}
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </label>
              </div>

              {/* Text Input Panel - Show whenever Text tool is active */}
              {tool === "text" && (
                <div className="mb-4 p-3 bg-white border border-rose-200 rounded shadow-sm">
                  <div className="text-sm font-semibold mb-2 text-gray-700">
                    Add Text
                  </div>
                  <input
                    type="text"
                    value={textInputValue}
                    onChange={(e) => setTextInputValue(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 mb-2 text-sm focus:outline-none focus:border-red-400"
                    placeholder="Type text here..."
                    autoFocus
                  />
                  <div className="text-xs text-gray-500 mt-1">
                     Step 1: Type text above.<br/>
                     Step 2: Click on the PDF to place valid text.
                  </div>
                </div>
              )}
              {resultUrl ? (
                <div className="mb-4">
                  <div className="text-md font-medium mb-2">Result preview</div>
                  <iframe
                    title="result"
                    src={resultUrl}
                    style={{ width: "100%", height: 200 }}
                  />
                </div>
              ) : (
                <div className="text-gray-500 mb-4">
                  Result will appear here.
                </div>
              )}
              {error && <div className="text-red-500 mb-4">{error}</div>}
            </div>
            {resultUrl && (
              <button
                onClick={handleDownloadResult}
                className="w-full py-3 bg-red-700 text-white rounded"
              >
                Download Result
              </button>
            )}
          </aside>

          <div className="col-span-3">
            <aside className="bg-gray-50 rounded-lg p-4">
              <h1 className="mb-4">Selected PDF</h1>
              <div className="p-3 border border-rose-200  rounded mb-4">
                {!file ? (
                  <div className="text-gray-400">No file</div>
                ) : (
                  <div className="flex items-center gap-2">
                    <img src={pdfIcon} className="w-10 h-10" alt="PDF" />{" "}
                    <span className="truncate">{file.name}</span>
                    <button
                      onClick={removeFile}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
            </aside>

            {/* Instructions / Tips */}
            <aside className="bg-[#fbf8f8] border border-rose-100 rounded-md p-4 mt-4">
              <h3 className="text-md font-semibold mb-3 text-gray-800">
                Tips & Instructions
              </h3>
              <ul className="text-sm text-gray-600 list-disc pl-4 space-y-2">
                <li>Select a tool (Pen, Highlight, Text) from the top bar.</li>
                <li>Draw or annotate directly on the PDF page.</li>
                <li>
                  Use <b>Prev / Next</b> buttons below the PDF to navigate
                  pages.
                </li>
                <li>
                  Annotations are saved automatically when switching pages.
                </li>
                <li>
                  Click <b>Save</b> to export your annotated PDF.
                </li>
              </ul>
            </aside>
          </div>

          {/* Center Main Preview */}
          <main className="col-span-6 bg-white border border-[#E7B0B9] rounded-lg p-4 flex flex-col shadow-sm">
            {/* Scrollable PDF Area */}
            <div className="flex-1 overflow-y-auto hide-scrollbar bg-gray-100 rounded flex justify-center items-start shadow-inner p-4 h-[75vh]">
              <div
                ref={canvasWrapperRef}
                className="relative shadow-md w-full flex justify-center"
                style={{ display: pdfRef.current ? "block" : "none" }}
              >
                <canvas ref={pdfCanvasRef} />
                <canvas
                  ref={drawCanvasRef}
                />
              </div>

              {!pdfRef.current && (
                <div className="text-gray-400 flex flex-col items-center justify-center h-full">
                  <img src={pdfIcon} className="w-16 h-16 opacity-50 mb-2" />
                  <p>Load a PDF to start annotating</p>
                </div>
              )}
            </div>

            {/* Prev / Next controls */}
            {pdfMeta && (
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={() => setAppliedPage((p) => Math.max(1, p - 1))}
                  disabled={appliedPage === 1}
                  className="px-4 py-1 border border-red-200 rounded text-xs font-bold disabled:opacity-30 text-red-700 hover:bg-red-50 transition-colors uppercase"
                >
                  Prev
                </button>
                <span className="text-xs font-bold text-gray-600 uppercase">
                  PAGE {appliedPage} / {pdfMeta.numPages}
                </span>
                <button
                  onClick={() =>
                    setAppliedPage((p) => Math.min(pdfMeta.numPages, p + 1))
                  }
                  disabled={appliedPage === pdfMeta.numPages}
                  className="px-4 py-1 border border-red-200 rounded text-xs font-bold disabled:opacity-30 text-red-700 hover:bg-red-50 transition-colors uppercase"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Annotate;
