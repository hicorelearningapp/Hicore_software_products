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

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const AddSignature = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileInputRef = useRef(null);
  const uploadSignatureRef = useRef(null);

  /* ---------- FILE ---------- */
  const initialFiles =
    (state?.selectedFiles && state.selectedFiles.slice(0, 1)) || [];
  const [file, setFile] = useState(initialFiles[0] || null);

  /* ---------- PDF ---------- */
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const pdfRef = useRef(null);
  const viewportRef = useRef(null);

  const [pdfMeta, setPdfMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------- SIGNATURE ---------- */
  const signCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [signatureSize, setSignatureSize] = useState(150); // Size in pixels

  const [draftSignature, setDraftSignature] = useState(null);
  const [savedSignatures, setSavedSignatures] = useState([]);
  const [activeId, setActiveId] = useState(null);

  /* ---------- SUBMISSION STATE ---------- */
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  /* ---------- FILE HANDLERS ---------- */
  const handleAddFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setCurrentPage(1);
    setDraftSignature(null);
    setSavedSignatures([]);
    setActiveId(null);
  };

  const removeFile = () => {
    setFile(null);
    setDraftSignature(null);
    setSavedSignatures([]);
    setActiveId(null);
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

  /* ---------- DRAW SIGNATURE (FIXED) ---------- */
  const startDraw = (e) => {
    const ctx = signCanvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = signCanvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const endDraw = () => {
    const ctx = signCanvasRef.current.getContext("2d");
    ctx.closePath(); // ✅ CRITICAL FIX
    setIsDrawing(false);

    const dataUrl = signCanvasRef.current.toDataURL("image/png");
    setSignatureImage(dataUrl);
  };

  const clearSignatureCanvas = () => {
    const ctx = signCanvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 300, 120);
    setSignatureImage(null);
  };

  /* ---------- UPLOAD SIGNATURE ---------- */
  const handleUploadSignature = (e) => {
    const img = e.target.files?.[0];
    if (!img) return;

    const reader = new FileReader();
    reader.onload = () => setSignatureImage(reader.result);
    reader.readAsDataURL(img);
  };

  /* ---------- PLACE SIGNATURE (FIXED) ---------- */
  const placeSignature = (e) => {
    if (!signatureImage || !viewportRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleFactor = 1 / viewportRef.current.scale;

    setDraftSignature({
      id: Date.now(),
      image: signatureImage,
      x: Math.round((e.clientX - rect.left) * scaleFactor),
      y: Math.round((e.clientY - rect.top) * scaleFactor),
      page: currentPage,
      size: signatureSize, // Store the size with the signature
    });
  };

  /* ---------- SAVE / DELETE ---------- */
  const saveSignature = () => {
    setSavedSignatures((prev) => [...prev, draftSignature]);
    setDraftSignature(null);
    setActiveId(null);
  };

  const deleteDraft = () => setDraftSignature(null);

  /* ---------- APPLY TO ALL ---------- */
  const applyToAll = () => {
    if (!draftSignature || !pdfMeta) return;

    const newSigs = [];
    newSigs.push(draftSignature);

    for (let p = 1; p <= pdfMeta.numPages; p++) {
      if (p === draftSignature.page) continue;
      newSigs.push({
        ...draftSignature,
        id: Date.now() + p,
        page: p,
      });
    }

    setSavedSignatures((prev) => [...prev, ...newSigs]);
    setDraftSignature(null);
    setActiveId(null);
  };

  const deleteSaved = (id) => {
    setSavedSignatures((prev) => prev.filter((s) => s.id !== id));
    setActiveId(null);
  };

  /* ---------- API SUBMISSION ---------- */
  const handleApplySignature = async () => {
    if (!file) return;
    if (savedSignatures.length === 0) {
      setError("Please add at least one signature.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    // cleanup old result
    if (resultUrl) {
      try {
        URL.revokeObjectURL(resultUrl);
      } catch {}
      setResultUrl(null);
    }

    try {
      // 1. Tool Action
      const actionRes = await fetch(`${API_BASE}/api/tool-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "signature", action: "add_signature" }),
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
      fd.append("tool", "signature");
      fd.append("action", "add_signature");

      // prepare settings
      // Group signatures by content/position to optimize payload
      const groupedSignatures = [];
      const processedIds = new Set();

      savedSignatures.forEach((sig) => {
        if (processedIds.has(sig.id)) return;

        // Find matches (same image, x, y)
        const matches = savedSignatures.filter(
          (s) =>
            s.image === sig.image &&
            s.x === sig.x &&
            s.y === sig.y &&
            !processedIds.has(s.id)
        );

        if (matches.length > 0) {
          matches.forEach((m) => processedIds.add(m.id));
          groupedSignatures.push({
            image: sig.image,
            x: sig.x,
            y: sig.y,
            pages: matches.map((m) => m.page), // Send list of pages
          });
        }
      });

      const settings = {
        signatures: groupedSignatures,
      };

      fd.append("settings", JSON.stringify(settings));

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `Signature failed: ${res.status}`);
      }

      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      setResultUrl(url);
    } catch (err) {
      console.error("Signature error:", err);
      setError(err.message || "Signature failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `signed-${file?.name || "doc.pdf"}`;
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
                onClick={() => navigate("/tools/add-signature")}
                className="flex gap-2"
              >
                <img src={iconBack} className="w-5" /> Back
              </button>

              <label className="inline-flex items-center gap-2 px-3 py-2 border border-[#B2011E] rounded bg-white cursor-pointer">
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
                      className="p-2 bg-white border border-[#B2011E] rounded-md"
                    >
                      <img src={icon} className="w-5 h-5" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-[#F3D9DD] rounded-md p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-2">Add Signature</h3>
              <div className="text-sm text-gray-500">
                Draw / Upload → Click PDF → Save
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Page {currentPage} of {pdfMeta?.numPages || "-"}
              </div>
            </div>

            {resultUrl ? (
              <div className="mb-4">
                <div className="text-sm font-medium mb-1">Result Preview</div>
                <iframe
                  src={resultUrl}
                  className="w-full h-40 border bg-white"
                  title="Signed Result"
                />
              </div>
            ) : (
              <div className="text-sm text-gray-500 mt-2">
                Signatures added: {savedSignatures.length}
              </div>
            )}

            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}

            {resultUrl ? (
              <div className="space-y-2">
                <button
                  onClick={handleDownloadResult}
                  className="w-full py-3 rounded bg-red-700 text-white"
                >
                  Download PDF
                </button>
              </div>
            ) : (
              <button
                onClick={handleApplySignature}
                disabled={!file || savedSignatures.length === 0 || isProcessing}
                className={`w-full py-3 rounded ${
                  file && savedSignatures.length && !isProcessing
                    ? "bg-red-700 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {isProcessing ? "Processing..." : "Apply Signature"}
              </button>
            )}
          </aside>

          {/* ================= LEFT PANEL ================= */}
          <aside className="col-span-3 bg-gray-50 rounded-lg p-4">
            <h2 className="mb-4 font-medium">Signature Settings</h2>

            {/* FILE INFO */}
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

            <h4 className="text-sm font-medium mb-2">Draw Signature</h4>

            <canvas
              ref={signCanvasRef}
              width={300}
              height={120}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              className="border border-[#F3D9DD] bg-white rounded cursor-crosshair"
            />

            <div className="flex justify-between mt-2">
              <button
                onClick={clearSignatureCanvas}
                className="text-sm text-red-600"
              >
                Clear
              </button>
              <button
                onClick={() => uploadSignatureRef.current.click()}
                className="text-sm text-blue-600"
              >
                Upload Signature
              </button>
              <input
                ref={uploadSignatureRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleUploadSignature}
              />
            </div>

            {/* Signature Size Control */}
            <div className="mt-4">
              <label className="text-sm font-medium block mb-2">
                Signature Size: {signatureSize}px
              </label>
              <input
                type="range"
                min="50"
                max="300"
                value={signatureSize}
                onChange={(e) => setSignatureSize(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Small</span>
                <span>Medium</span>
                <span>Large</span>
              </div>
            </div>

            {draftSignature && (
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex gap-2">
                  <button
                    onClick={saveSignature}
                    className="flex-1 px-3 py-1 border rounded text-sm bg-blue-50 text-blue-600 border-blue-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={deleteDraft}
                    className="flex-1 px-3 py-1 border rounded text-sm text-red-600 border-red-200"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={applyToAll}
                  className="w-full px-3 py-1 border rounded text-sm bg-purple-50 text-purple-600 border-purple-200"
                >
                  Apply to All Pages
                </button>
              </div>
            )}
          </aside>

          {/* ================= CENTER PREVIEW ================= */}
          <main
            className={`col-span-6 bg-white border border-[#F3D9DD] rounded-lg p-4 h-[80vh] overflow-y-auto ${
              signatureImage ? "cursor-crosshair" : ""
            }`}
            onClick={placeSignature}
          >
            {file ? (
              <>
                <div ref={canvasWrapperRef} className="relative">
                  <canvas ref={canvasRef} className="w-full shadow" />

                  {savedSignatures
                    .filter((s) => s.page === currentPage)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="absolute cursor-pointer"
                        style={{
                          left: s.x * viewportRef.current.scale,
                          top: s.y * viewportRef.current.scale,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveId(s.id);
                        }}
                      >
                        <img
                          src={s.image}
                          style={{
                            width: `${
                              (s.size || 150) * viewportRef.current.scale
                            }px`,
                          }}
                        />
                        {activeId === s.id && (
                          <button
                            onClick={() => deleteSaved(s.id)}
                            className="absolute -top-2 -right-2 bg-white rounded-full"
                          >
                            <FiTrash2 className="text-red-600" />
                          </button>
                        )}
                      </div>
                    ))}

                  {draftSignature && draftSignature.page === currentPage && (
                    <img
                      src={draftSignature.image}
                      className="absolute opacity-60"
                      style={{
                        left: draftSignature.x * viewportRef.current.scale,
                        top: draftSignature.y * viewportRef.current.scale,
                        width: `${
                          (draftSignature.size || 150) *
                          viewportRef.current.scale
                        }px`,
                      }}
                    />
                  )}
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

export default AddSignature;
