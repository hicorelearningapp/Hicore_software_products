// src/pages/tools/EditText.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiTrash2, FiCheck, FiZoomIn, FiZoomOut } from "react-icons/fi";

import pdfIcon from "../../assets/Pannelpage/PDF.png";
import iconBack from "../../assets/Pannelpage/Back.png";
import iconMonitor from "../../assets/Pannelpage/Desktop.png";
import iconGrid from "../../assets/Pannelpage/Dropbox.png";
import iconTriangle from "../../assets/Pannelpage/googleDrive.png";
import iconCloud from "../../assets/Pannelpage/Onedrive.png";

// libraries
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Configure PDF.js worker for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).toString();

// API base (if you later want server ops)
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const humanFileSize = (size) => {
  if (!size && size !== 0) return "";
  const i = Math.floor(Math.log(size || 1) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "KB", "MB", "GB"][i]
    }`;
};

/* ---------------- OverlayElement (renders using display scale) ---------------- */
const OverlayElement = ({
  el,
  scale = 1,
  onUpdate,
  onDelete,
  onSelect,
  selected,
}) => {
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let startClientX = 0,
      startClientY = 0,
      startLeftOriginal = el.left || 0,
      startTopOriginal = el.top || 0;

    const onMouseDown = (e) => {
      // if click on resize handle, skip (resize handled separately)
      if (e.button !== 0) return;
      if (e.target.dataset && e.target.dataset.resizeHandle) return;
      e.preventDefault();
      startClientX = e.clientX;
      startClientY = e.clientY;
      startLeftOriginal = el.left || 0;
      startTopOriginal = el.top || 0;
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      // mark selected
      if (onSelect) onSelect(el.id);
    };

    const onMouseMove = (e) => {
      const dxClient = e.clientX - startClientX;
      const dyClient = e.clientY - startClientY;
      const dxOriginal = dxClient / (scale || 1);
      const dyOriginal = dyClient / (scale || 1);
      const newLeft = Math.max(0, startLeftOriginal + dxOriginal);
      const newTop = Math.max(0, startTopOriginal + dyOriginal);
      node.style.left = `${newLeft * scale}px`;
      node.style.top = `${newTop * scale}px`;
    };

    const onMouseUp = (e) => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      const dxClient = e.clientX - startClientX;
      const dyClient = e.clientY - startClientY;
      const dxOriginal = dxClient / (scale || 1);
      const dyOriginal = dyClient / (scale || 1);
      const finalLeft = Math.max(0, startLeftOriginal + dxOriginal);
      const finalTop = Math.max(0, startTopOriginal + dyOriginal);
      onUpdate(el.id, { left: finalLeft, top: finalTop });
    };

    node.addEventListener("mousedown", onMouseDown);
    return () => node.removeEventListener("mousedown", onMouseDown);
  }, [el, onUpdate, scale, onSelect]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handle = node.querySelector("[data-resize-handle]");
    if (!handle) return;

  // Resize logic removed as handles are gone per user request
  }, [el, onUpdate, scale]);

  const onInput = (e) => {
    onUpdate(el.id, { text: e.target.innerText });
  };

  return (
    <div
      ref={ref}
      onClick={() => onSelect && onSelect(el.id)}
      style={{
        position: "absolute",
        left: `${(el.left || 0) * scale}px`,
        top: `${(el.top || 0) * scale}px`,
        width: el.width ? `${el.width * scale}px` : "auto",
        height: el.height ? `${el.height * scale}px` : "auto",
        zIndex: selected ? 30 : 20,
        transformOrigin: "top left",
        pointerEvents: "auto",
      }}
      className={`overlay-el border ${selected ? "border-blue-400" : "border-dashed"
        } p-1 bg-white/60 cursor-move`}
    >
      {el.type === "text" ? (
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
          style={{ minWidth: 30, minHeight: 20 }}
        >
          {el.text}
        </div>
      ) : (
        <img
          src={el.dataUrl}
          alt="overlay-img"
          style={{ maxWidth: "100%", maxHeight: "100%", display: "block" }}
        />
      )}
    </div>
  );
};

/* ---------------- PageView (fills wrapper height 70vh, overlays aligned, full width) ---------------- */
const PageView = ({
  p,
  overlaysForPage = [],
  updateOverlay,
  deleteOverlay,
  onSelectOverlay,
  selectedOverlayId,
  confirmOverlayLocal,
  zoomOverlayLocal,
}) => {
  const wrapperRef = useRef();
  const visibleCanvasRef = useRef();
  const overlayRootRef = useRef();
  const [displayScale, setDisplayScale] = useState(1);

  useEffect(() => {
    if (!p) return;
    const node = wrapperRef.current;
    if (!node) return;

    const resize = () => {
      if (!node || !visibleCanvasRef.current) return;
      const containerWidth = node.clientWidth - 40;
      const scale = containerWidth / p.width;
      setDisplayScale(scale);

      const canvas = visibleCanvasRef.current;
      canvas.width = p.width;
      canvas.height = p.height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, p.width, p.height);
      ctx.drawImage(p.canvas, 0, 0);

      canvas.style.width = `${Math.round(p.width * scale)}px`;
      canvas.style.height = `${Math.round(p.height * scale)}px`;
    };

    resize();
    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(resize);
      ro.observe(node);
    } else {
      window.addEventListener("resize", resize);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
    };
  }, [p]);

  if (!p) {
    return (
      <div className="text-center text-gray-400 p-8">
        <img
          src={pdfIcon}
          alt="pdf-placeholder"
          className="mx-auto mb-4 w-28 h-28"
        />
        <div>No page</div>
      </div>
    );
  }

  // compute toolbar position style relative to overlayRoot
  const toolbarFor = (el) => {
    const root = overlayRootRef.current;
    if (!root) return { display: "none" };
    const rootRect = root.getBoundingClientRect();
    const leftPx = el.left * displayScale;
    const topPx = el.top * displayScale;
    const wPx = el.width * displayScale;
    const hPx = el.height * displayScale;
    // try place above overlay
    let top = topPx - 40;
    if (top < 6) top = topPx + hPx + 8;
    let left = leftPx + wPx / 2 - 140;
    left = Math.max(6, Math.min(left, rootRect.width - 6 - 280));
    return {
      position: "absolute",
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      width: 280,
      zIndex: 999,
      pointerEvents: "auto",
      display: "flex",
      gap: 6,
      justifyContent: "space-between",
      alignItems: "center",
      background: "rgba(255,255,255,0.98)",
      padding: "6px 8px",
      borderRadius: 6,
      boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
      fontSize: 13,
      border: "1px solid rgba(0,0,0,0.06)",
    };
  };

  return (
    <div
      ref={wrapperRef}
      className="flex-1 overflow-y-auto hide-scrollbar bg-gray-100 rounded flex flex-col items-center shadow-inner p-4 h-[75vh]"
    >
      <div
        className="relative"
        style={{
          width: `${Math.round(p.width * displayScale)}px`,
          height: `${Math.round(p.height * displayScale)}px`,
          marginBottom: "1.5rem",
        }}
      >
        <canvas
          ref={visibleCanvasRef}
          className="bg-white shadow-lg block"
          style={{ width: "100%", height: "100%" }}
        />

        <div
          ref={overlayRootRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              pointerEvents: "none", // Elements inside have auto
            }}
          >
            {overlaysForPage.map((el) => (
              <React.Fragment key={el.id}>
                <OverlayElement
                  el={el}
                  scale={displayScale}
                  onUpdate={(id, changes) =>
                    updateOverlay(p.pageNumber, id, changes)
                  }
                  onDelete={(id) => deleteOverlay(p.pageNumber, id)}
                  onSelect={(id) =>
                    onSelectOverlay && onSelectOverlay(p.pageNumber, id)
                  }
                  selected={selectedOverlayId === el.id}
                />

                {/* toolbar shown when overlay selected */}
                {selectedOverlayId === el.id && (
                  <div style={toolbarFor(el)}>
                    <button
                      title="Confirm"
                      onClick={() => confirmOverlayLocal(p, el)}
                      className="px-4 py-1.5 bg-red-700 text-white rounded text-xs font-bold uppercase transition-all shadow-md active:scale-[0.98]"
                    >
                      Confirm
                    </button>

                    <div className="flex gap-2">
                      <button
                        title="Delete"
                        onClick={() => deleteOverlay(p.pageNumber, el.id)}
                        className="p-1.5 bg-white border border-[#B2011E] rounded hover:bg-gray-50 transition-colors"
                      >
                        <FiTrash2 className="text-red-700" size={14} />
                      </button>

                      <button
                        title="Zoom In"
                        onClick={() => zoomOverlayLocal(p.pageNumber, el.id, 1.1)}
                        className="p-1.5 bg-white border border-[#B2011E] rounded hover:bg-gray-50 transition-colors"
                      >
                        <FiZoomIn className="text-red-700" size={14} />
                      </button>

                      <button
                        title="Zoom Out"
                        onClick={() => zoomOverlayLocal(p.pageNumber, el.id, 0.9)}
                        className="p-1.5 bg-white border border-[#B2011E] rounded hover:bg-gray-50 transition-colors"
                      >
                        <FiZoomOut className="text-red-700" size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Main component ---------------- */
const EditText = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const incomingFiles = state?.selectedFiles || [];
  const incomingFile = incomingFiles[0] || null;

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [pageCanvases, setPageCanvases] = useState([]);
  const [overlays, setOverlays] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  // control states
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedOverlayId, setSelectedOverlayId] = useState(null);
  const [editTextValue, setEditTextValue] = useState("");
  const [replaceImageFile, setReplaceImageFile] = useState(null);

  const fileInputRef = useRef();
  const addImageInputRef = useRef();
  const replaceImageInputRef = useRef();
  const centerRef = useRef();

  // init from navigation state
  useEffect(() => {
    if (incomingFile) {
      if (incomingFile instanceof File) {
        setFile(incomingFile);
        setFileUrl(URL.createObjectURL(incomingFile));
      } else if (incomingFile.preview) {
        setFile(incomingFile);
        setFileUrl(incomingFile.preview);
      } else if (incomingFile.url) {
        setFile(incomingFile);
        setFileUrl(incomingFile.url);
      }
    }
    return () => {
      if (fileUrl && fileUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(fileUrl);
        } catch { }
      }
      if (resultUrl && resultUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(resultUrl);
        } catch { }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load pages (PDF.js)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!file) {
        setPageCanvases([]);
        return;
      }
      setIsProcessing(true);
      setError(null);
      try {
        const arrayBuffer = await (file instanceof File
          ? file.arrayBuffer()
          : fetch(fileUrl).then((r) => r.arrayBuffer()));
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const canvases = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) break;
          const page = await pdf.getPage(i);
          // Render at 1.5 for good internal resolution
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          const ctx = canvas.getContext("2d");
          const renderTask = page.render({ canvasContext: ctx, viewport });
          await renderTask.promise;
          canvases.push({
            pageNumber: i,
            canvas,
            width: canvas.width,
            height: canvas.height,
            scale: viewport.scale,
          });
        }
        if (!cancelled) {
          setPageCanvases(canvases);
          // set default selected page to first page
          if (canvases.length > 0) setSelectedPage(1);
        }
      } catch (err) {
        console.error("PDF load failed:", err);
        setError("Failed to load PDF. Check console.");
        setPageCanvases([]);
      } finally {
        if (!cancelled) setIsProcessing(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [file, fileUrl]);

  /* ---------------- file handlers ---------------- */
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (fileUrl && fileUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(fileUrl);
      } catch { }
    }
    if (resultUrl && resultUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(resultUrl);
      } catch { }
      setResultUrl(null);
    }
    setFile(f);
    setFileUrl(URL.createObjectURL(f));
    setOverlays({});
    setSelectedPage(1);
    setSelectedOverlayId(null);
    setEditTextValue("");
    setError(null);
  };

  const handleBack = () => {
    navigate("/tools/edit-text");
  };

  /* ---------------- overlay CRUD (original coordinates) ---------------- */
  const addTextOverlay = (pageNumber) => {
    const id = `el-${Date.now()}`;
    const el = {
      id,
      type: "text",
      left: 10,
      top: 10,
      width: 200,
      height: 40,
      text: "Edit me",
    };
    setOverlays((prev) => ({
      ...prev,
      [pageNumber]: [...(prev[pageNumber] || []), el],
    }));
    setSelectedOverlayId(id);
    setEditTextValue("Edit me");
  };

  const addImageOverlay = (pageNumber, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const id = `el-${Date.now()}`;
      const dataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        const w = Math.min(200, img.width);
        const h = (img.height / img.width) * w;
        const el = {
          id,
          type: "image",
          left: 10,
          top: 10,
          width: w,
          height: h,
          dataUrl,
        };
        setOverlays((prev) => ({
          ...prev,
          [pageNumber]: [...(prev[pageNumber] || []), el],
        }));
        setSelectedOverlayId(id);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const updateOverlay = (pageNumber, id, changes) => {
    setOverlays((prev) => ({
      ...prev,
      [pageNumber]: (prev[pageNumber] || []).map((el) =>
        el.id === id ? { ...el, ...changes } : el
      ),
    }));
  };

  const deleteOverlay = (pageNumber, id) => {
    setOverlays((prev) => ({
      ...prev,
      [pageNumber]: (prev[pageNumber] || []).filter((el) => el.id !== id),
    }));
    if (selectedOverlayId === id) {
      setSelectedOverlayId(null);
      setEditTextValue("");
    }
  };

  /* ---------------- replace selected overlay text ---------------- */
  const replaceSelectedText = () => {
    if (!selectedOverlayId) return alert("Select an overlay first.");
    const page = selectedPage;
    const overlaysOnPage = overlays[page] || [];
    const found = overlaysOnPage.find((o) => o.id === selectedOverlayId);
    if (!found) return alert("Selected overlay not found on this page.");
    if (found.type !== "text")
      return alert("Selected overlay is not a text element.");
    updateOverlay(page, selectedOverlayId, { text: editTextValue });
  };

  /* ---------------- replace selected overlay image ---------------- */
  const replaceSelectedImage = (file) => {
    if (!selectedOverlayId) return alert("Select an overlay first.");
    const page = selectedPage;
    const overlaysOnPage = overlays[page] || [];
    const found = overlaysOnPage.find((o) => o.id === selectedOverlayId);
    if (!found) return alert("Selected overlay not found on this page.");
    if (found.type !== "image")
      return alert("Selected overlay is not an image element.");

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        const w = Math.min(found.width || 200, img.width);
        const h = (img.height / img.width) * w;
        updateOverlay(page, selectedOverlayId, {
          dataUrl,
          width: w,
          height: h,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- zoom overlay ---------------- */
  const zoomOverlay = (pageNumber, id, factor = 1.1) => {
    const overlaysOnPage = overlays[pageNumber] || [];
    const found = overlaysOnPage.find((o) => o.id === id);
    if (!found) return;
    const newW = Math.max(10, Math.round(found.width * factor));
    const newH = Math.max(10, Math.round(found.height * factor));
    updateOverlay(pageNumber, id, { width: newW, height: newH });
  };

  /* ---------------- confirm overlay (send coords in PDF units) ---------------- */
  /* ---------------- confirm overlay (send coords in PDF units) ---------------- */
  const confirmOverlay = async (pageObj, el) => {
    if (!pageObj || !el) return;
    // pageObj.scale is the viewport scale used when rendering (e.g. 1.5)
    const scale = pageObj.scale || 1;
    // overlays store coordinates in original canvas pixels (because we drew overlay at those pixel coords)
    // to convert back to PDF points, divide by render scale
    const pdfLeft = Math.round((el.left || 0) / scale);
    const pdfTop = Math.round((el.top || 0) / scale);
    const pdfW = Math.round((el.width || 0) / scale);
    const pdfH = Math.round((el.height || 0) / scale);

    const payload = {
      page: pageObj.pageNumber,
      left: pdfLeft,
      top: pdfTop,
      width: pdfW,
      height: pdfH,
      // optionally include dataUrl if backend accepts image upload inline (can be large)
      // imageDataUrl: el.type === "image" ? el.dataUrl : undefined
    };

    try {
      setIsProcessing(true);

      // 1. Tool Action
      const actionRes = await fetch(`${API_BASE}/api/tool-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "edit", action: "confirm_overlay" }),
      });

      if (!actionRes.ok) {
        const text = await actionRes.text();
        throw new Error(text || `Tool action failed: ${actionRes.status}`);
      }

      const { redirect_to } = await actionRes.json();
      const uploadUrl = redirect_to.startsWith("/api")
        ? `${API_BASE}${redirect_to}`
        : `${API_BASE}/api${redirect_to}`;

      // 2. Post payload
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `Overlay confirm failed: ${res.status}`);
      }
      // success handling (server response)
      const body = await res.json().catch(() => null);
      console.log("overlay confirmed:", body);
      // optional: mark as confirmed; here we'll just deselect
      setSelectedOverlayId(null);
    } catch (err) {
      console.error("confirmOverlay error:", err);
      setError(err.message || "Failed to confirm overlay.");
    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------------- save/export ---------------- */
  const handleSave = async () => {
    if (!pageCanvases.length) {
      alert("No pages to save.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const newPdf = await PDFDocument.create();
      for (const p of pageCanvases) {
        const tmp = document.createElement("canvas");
        tmp.width = p.width;
        tmp.height = p.height;
        const ctx = tmp.getContext("2d");
        ctx.drawImage(p.canvas, 0, 0);

        const els = overlays[p.pageNumber] || [];
        for (const el of els) {
          if (el.type === "text") {
            ctx.fillStyle = "black";
            ctx.font = `${Math.max(12, Math.round(14))}px sans-serif`;
            const lines = String(el.text || "").split("\n");
            const lineHeight = 16;
            for (let i = 0; i < lines.length; i++) {
              ctx.fillText(lines[i], el.left, el.top + (i + 1) * lineHeight);
            }
          } else if (el.type === "image") {
            const img = new Image();
            img.src = el.dataUrl;
            await new Promise((res) => {
              img.onload = () => {
                ctx.drawImage(img, el.left, el.top, el.width, el.height);
                res(true);
              };
              img.onerror = () => res(true);
            });
          }
        }

        const imgDataUrl = tmp.toDataURL("image/png");
        const imgBytesBase64 = imgDataUrl.split(",")[1];
        const imgUint8 = Uint8Array.from(atob(imgBytesBase64), (c) =>
          c.charCodeAt(0)
        );
        const pngImage = await newPdf.embedPng(imgUint8);
        const page = newPdf.addPage([p.width, p.height]);
        page.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: p.width,
          height: p.height,
        });
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      // auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited-${file?.name || "document"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Save failed:", err);
      setError("Failed to save edited PDF. See console.");
      alert("Save failed — check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `edited-${file?.name || "document"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const removeSelectedFile = () => {
    if (fileUrl && fileUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(fileUrl);
      } catch { }
    }
    if (resultUrl && resultUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(resultUrl);
      } catch { }
    }
    setFile(null);
    setFileUrl(null);
    setPageCanvases([]);
    setOverlays({});
    setResultUrl(null);
    setError(null);
    setSelectedOverlayId(null);
  };

  /* ---------------- page navigation (prev/next) ---------------- */
  const totalPages = pageCanvases.length;
  const gotoPage = (n) => {
    if (!totalPages) return;
    const newPage = Math.min(Math.max(1, n), totalPages);
    setSelectedPage(newPage);
    setSelectedOverlayId(null);
    setEditTextValue("");
    if (centerRef.current)
      centerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const prevPage = () => gotoPage(selectedPage - 1);
  const nextPage = () => gotoPage(selectedPage + 1);

  // keyboard navigation left/right
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "ArrowRight") nextPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage, totalPages]);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 mb-4">
          {/* top bar left (col-span-9) */}
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
                  htmlFor="edit-add-file"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-[#B2011E] rounded-md bg-white cursor-pointer text-[16px]"
                >
                  Add file
                  <input
                    id="edit-add-file"
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* center icons */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 bg-white border border-[#B2011E] rounded-md"
                    title="Layout"
                  >
                    <img src={iconMonitor} alt="monitor" className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 bg-white border border-[#B2011E] rounded-md"
                    title="Grid"
                  >
                    <img src={iconGrid} alt="grid" className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 bg-white border border-[#B2011E] rounded-md"
                    title="Google Drive"
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
                  >
                    <img src={iconCloud} alt="cloud" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Panel (Task Status) */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-rose-100 rounded-md p-6 flex flex-col justify-between shadow-sm">
            <div className="text-center py-4">
              <h3 className="text-sm font-bold mb-6 border-b pb-5 text-center border-red-800 text-red-800 uppercase tracking-wider">
                Edit PDF
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Modify text, add images, and update your PDF content.
              </p>

              {resultUrl ? (
                <div className="flex flex-col items-center animate-fadeIn mb-4">
                  <div className="text-sm font-medium mb-2">Edited preview</div>
                  <iframe
                    title="edited-preview"
                    src={resultUrl}
                    style={{ width: "100%", height: 200 }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <p className="text-sm px-4 text-center leading-relaxed">
                    Edited PDF will appear here after saving.
                  </p>
                </div>
              )}

              {error && (
                <div className="text-sm text-red-600 mb-4" role="alert">
                  {error}
                </div>
              )}
            </div>

            <div>
              {resultUrl ? (
                <div className="space-y-2">
                  <button
                    onClick={downloadResult}
                    className="w-full py-3 rounded bg-red-700 text-white"
                  >
                    Download Edited PDF
                  </button>
                  <a
                    href={resultUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-sm text-gray-700 mt-2"
                  >
                    Open in new tab
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleSave}
                    disabled={isProcessing || !pageCanvases.length}
                    className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md w-full transition-all shadow-md active:scale-[0.98] disabled:bg-gray-400"
                  >
                    {isProcessing ? "Processing..." : "Save Edited PDF"}
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* left file panel (controls moved here) */}
          <div className="col-span-3">
            <aside className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between border border-rose-200 bg-[#F7E6E9]/[0.30] p-3 rounded-md">
                {file ? (
                  <div className="flex items-center gap-3">
                    <img src={pdfIcon} className="w-12 h-12" alt="pdf" />
                    <div>
                      <div
                        className="text-sm font-medium truncate"
                        title={file.name}
                      >
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {file.size ? humanFileSize(file.size) : ""}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No PDF selected</div>
                )}

                {file && (
                  <button
                    onClick={removeSelectedFile}
                    className="text-red-600 hover:text-red-800 p-1 rounded"
                    aria-label="Remove selected file"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                id="edit-file-input"
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="hidden"
              />

              {!file && (
                <label
                  htmlFor="edit-file-input"
                  className="block w-full mt-4 py-2 border rounded text-center text-sm cursor-pointer bg-white"
                >
                  Upload PDF
                </label>
              )}

              <div className="mt-4 text-sm text-gray-600">
                Controls: choose page, add overlays, or edit an existing
                overlay.
              </div>

              <div className="mt-5">
                <label className="block text-md font-medium mb-2">Page</label>
                <div className="border border-[#F3D9DD] bg-[#F7E6E9]/[0.30] rounded-md p-3">
                  <select
                    value={selectedPage}
                    onChange={(e) => {
                      setSelectedPage(Number(e.target.value));
                      setSelectedOverlayId(null);
                      setEditTextValue("");
                      if (centerRef.current)
                        centerRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    className="w-full px-2 py-2 bg-white rounded border"
                  >
                    {pageCanvases.map((pc) => (
                      <option key={pc.pageNumber} value={pc.pageNumber}>
                        Page {pc.pageNumber}
                      </option>
                    ))}
                  </select>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => addTextOverlay(selectedPage)}
                      className="px-3 py-2 border border-[#F3D9DD] rounded text-sm bg-white"
                    >
                      Add Text
                    </button>

                    <label className="px-3 py-2 border border-[#F3D9DD] rounded text-sm bg-white cursor-pointer">
                      Add Image
                      <input
                        ref={addImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) addImageOverlay(selectedPage, f);
                          e.target.value = null;
                        }}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => {
                        setOverlays({});
                        setResultUrl(null);
                      }}
                      className="px-3 py-2 border border-[#F3D9DD] rounded text-sm bg-white"
                    >
                      Clear Edits
                    </button>
                  </div>
                </div>
              </div>

              {/* overlay list & edit controls */}
              <div className="mt-5">
                <label className="block text-md font-medium mb-2">
                  Overlays (Page {selectedPage})
                </label>
                <div className="border border-[#F3D9DD] bg-[#F7E6E9]/[0.30] rounded-md p-3">
                  {(overlays[selectedPage] || []).length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No overlays on this page
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(overlays[selectedPage] || []).map((o) => (
                        <div
                          key={o.id}
                          className="flex items-center justify-between gap-2 bg-white p-2 rounded"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="radio"
                              name="selectedOverlay"
                              checked={selectedOverlayId === o.id}
                              onChange={() => {
                                setSelectedOverlayId(o.id);
                                setEditTextValue(
                                  o.type === "text" ? o.text || "" : ""
                                );
                              }}
                            />
                            <div className="text-sm truncate">
                              {o.type === "text"
                                ? `Text: ${String(o.text || "").slice(0, 40)}`
                                : "Image overlay"}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => deleteOverlay(selectedPage, o.id)}
                              className="text-xs px-2 py-1 border rounded bg-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* edit controls */}
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-2">
                      Edit selected overlay
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Overlay type & content
                        </label>
                        {selectedOverlayId ? (
                          (() => {
                            const sel = (overlays[selectedPage] || []).find(
                              (x) => x.id === selectedOverlayId
                            );
                            if (!sel)
                              return (
                                <div className="text-sm text-gray-500">
                                  Overlay not found
                                </div>
                              );
                            if (sel.type === "text") {
                              return (
                                <div>
                                  <textarea
                                    value={editTextValue}
                                    onChange={(e) =>
                                      setEditTextValue(e.target.value)
                                    }
                                    className="w-full px-2 py-2 border rounded"
                                    rows={3}
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      onClick={replaceSelectedText}
                                      className="px-3 py-2 border rounded text-sm bg-white"
                                    >
                                      Replace Text
                                    </button>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div>
                                  <div className="text-sm text-gray-700 mb-2">
                                    Replace image
                                  </div>
                                  <label className="px-3 py-2 border border-[#F3D9DD] rounded text-sm bg-white cursor-pointer">
                                    Choose image
                                    <input
                                      ref={replaceImageInputRef}
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) replaceSelectedImage(f);
                                        e.target.value = null;
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              );
                            }
                          })()
                        ) : (
                          <div className="text-sm text-gray-500">
                            Select an overlay to edit
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* extra actions */}
              <div className="mt-5">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (pageCanvases.length)
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-3 py-2 border border-[#F3D9DD] rounded text-sm bg-white"
                  >
                    Scroll Top
                  </button>
                  <button
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="px-3 py-2 border border-[#F3D9DD] rounded text-sm bg-white"
                  >
                    Replace File
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Center Main Preview */}
          <main
            ref={centerRef}
            className="col-span-6 bg-white border border-[#E7B0B9] rounded-lg p-4 flex flex-col shadow-sm"
          >
            {fileUrl ? (
              <>
                <div className="w-full">
                  {pageCanvases.length > 0 ? (
                    <div>
                      {/* single page view */}
                      <div className="mb-4">
                        <PageView
                          p={pageCanvases.find(
                            (pc) => pc.pageNumber === selectedPage
                          )}
                          overlaysForPage={overlays[selectedPage] || []}
                          updateOverlay={updateOverlay}
                          deleteOverlay={deleteOverlay}
                          onSelectOverlay={(page, id) => {
                            setSelectedPage(page);
                            setSelectedOverlayId(id);
                            const sel = (overlays[page] || []).find(
                              (x) => x.id === id
                            );
                            setEditTextValue(
                              sel && sel.type === "text" ? sel.text || "" : ""
                            );
                          }}
                          selectedOverlayId={selectedOverlayId}
                          confirmOverlayLocal={(pageObj, el) =>
                            confirmOverlay(pageObj, el)
                          }
                          zoomOverlayLocal={(pageNumber, id, factor) =>
                            zoomOverlay(pageNumber, id, factor)
                          }
                        />
                      </div>

                      {/* Prev / Next controls */}
                      <div className="flex justify-between items-center mt-4 px-2">
                        <button
                          onClick={prevPage}
                          disabled={selectedPage <= 1}
                          className="px-4 py-1 border border-red-200 rounded text-xs font-bold disabled:opacity-30 text-red-700 hover:bg-red-50 transition-colors uppercase"
                        >
                          Prev
                        </button>
                        <span className="text-xs font-bold text-gray-600 uppercase">
                          PAGE {selectedPage} / {totalPages}
                        </span>
                        <button
                          onClick={nextPage}
                          disabled={selectedPage >= totalPages}
                          className="px-4 py-1 border border-red-200 rounded text-xs font-bold disabled:opacity-30 text-red-700 hover:bg-red-50 transition-colors uppercase"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <img
                        src={pdfIcon}
                        alt="pdf-placeholder"
                        className="mx-auto mb-4 w-28 h-28"
                      />
                      <div>No pages available</div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">
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

export default EditText;
