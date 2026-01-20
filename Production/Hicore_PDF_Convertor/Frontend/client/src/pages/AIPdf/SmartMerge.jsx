import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiTrash2, FiCpu, FiCheck, FiArrowDown, FiMove, FiLoader, FiDownload } from "react-icons/fi";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

import pdfIcon from "../../assets/Pannelpage/PDF.png";
import iconBack from "../../assets/Pannelpage/Back.png";


const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/* ---------- pdf.js worker ---------- */
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).toString();

const SmartMerge = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileInputRef = useRef(null);

  /* ---------- STATE ---------- */
  const initialFiles = state?.selectedFiles || [];
  const [files, setFiles] = useState(initialFiles);

  // Stages: 'upload' -> 'analyzing' -> 'review' -> 'merging' -> 'done'
  const [stage, setStage] = useState('upload');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]); // Array of original indices
  const [error, setError] = useState(null);

  /* ---------- DRAG & DROP STATE ---------- */
  const [draggedItem, setDraggedItem] = useState(null);

  /* ---------- FILE HANDLERS ---------- */
  const handleAddFile = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    setStage('upload');
    setAnalysisResult(null);
  };

  const removeFile = (indexToRemove) => {
    // If we are in upload stage, just remove by index
    if (stage === 'upload') {
      setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
      return;
    }

    // If in review stage, remove from currentOrder
    // (This is trickier, for simplicity let's reset to upload if removing files during review)
    const newFiles = files.filter((_, i) => i !== indexToRemove);
    setFiles(newFiles);
    setStage('upload');
    setAnalysisResult(null);
  };

  /* ---------- STEP 1: ANALYZE ---------- */
  const handleAnalyze = async () => {
    if (files.length < 2) return;
    setStage('analyzing');
    setError(null);

    try {
      const fd = new FormData();
      fd.append("action", "smart_merge");
      fd.append("mode", "analyze");
      files.forEach(f => fd.append("files", f));

      const res = await fetch(`${API_BASE}/api/ai`, {
        method: "POST",
        body: fd
      });

      if (!res.ok) {
        throw new Error(`Analysis failed: ${res.status}`);
      }

      const data = await res.json();
      setAnalysisResult(data);

      // data.suggested_order is array of indices [2, 0, 1]
      setCurrentOrder(data.suggested_order);
      setStage('review');

    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze documents. Please try again.");
      setStage('upload');
    }
  };

  /* ---------- STEP 2: REORDER (HTML5 DnD) ---------- */
  const onDragStart = (e, index) => {
    setDraggedItem(files[currentOrder[index]]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);

    // Store the index in the current view (0 to N-1)
    e.dataTransfer.setData("index", index);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    // Optional: Add visual indicator of drop target
  };

  const onDrop = (e, dropIndex) => {
    const dragIndex = Number(e.dataTransfer.getData("index"));

    if (dragIndex === dropIndex) return;

    const newOrder = [...currentOrder];
    // Remove dragged item
    const item = newOrder.splice(dragIndex, 1)[0];
    // Insert at new position
    newOrder.splice(dropIndex, 0, item);

    setCurrentOrder(newOrder);
  };

  /* ---------- STEP 3: MERGE ---------- */
  const handleMerge = async () => {
    setStage('merging');
    setError(null);

    try {
      const fd = new FormData();
      fd.append("action", "smart_merge");
      fd.append("mode", "merge");
      files.forEach(f => fd.append("files", f));

      // Pass valid JSON string for order
      fd.append("order", JSON.stringify(currentOrder));

      const res = await fetch(`${API_BASE}/api/ai`, {
        method: "POST",
        body: fd
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Merge API Error:", res.status, errText);
        throw new Error(`Merge failed: ${res.status} - ${errText}`);
      }

      // Download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "smart_merged_document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setStage('done');

    } catch (err) {
      console.error("Merge error details:", err);
      setError(`Failed to merge documents: ${err.message}`);
      setStage('review');
    }
  };


  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1200px] mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-center gap-10 bg-[#F7E6E9]/30 border border-[#F3D9DD] rounded-md px-4 py-6 mb-8">
          <button onClick={() => navigate("/tools/smart-merge")} className="flex gap-2 items-center text-gray-700">
            <img src={iconBack} className="w-5" /> Back
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FiCpu className="text-red-600" /> Smart PDF Merge
          </h1>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT: CONTROLS & INFO */}
          <div className="col-span-1 space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="font-semibold mb-4">How it works</h2>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  Upload multiple PDFs that belong together.
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  Our AI analyzes the content to find the best logical order.
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  Review the suggestion and merge into one file.
                </li>
              </ul>
            </div>

            {/* FILE ADDER */}
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center hover:bg-gray-50 transition-colors">
              <img src={pdfIcon} className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <button className="text-red-600 font-medium hover:underline relative">
                Add more files
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleAddFile}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </button>
              <p className="text-xs text-gray-400 mt-1">{files.length} files selected</p>
            </div>
          </div>

          {/* RIGHT: MAIN WORKSPACE */}
          <div className="col-span-2">

            {/* STAGE 1: UPLOAD LIST */}
            {stage === 'upload' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold mb-4 flex justify-between items-center">
                  Unordered Files
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">{files.length} Files</span>
                </h3>

                <div className="space-y-2 mb-6">
                  {files.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">No files uploaded yet.</div>
                  ) : (
                    files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <img src={pdfIcon} className="w-8 h-8" />
                        <span className="flex-1 text-sm truncate">{file.name}</span>
                        <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500"><FiTrash2 /></button>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={files.length < 2}
                  className={`w-full py-3 rounded-lg font-medium flex justify-center items-center gap-2 ${files.length < 2 ? 'bg-gray-200 text-gray-400' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100'
                    }`}
                >
                  <FiCpu /> Analyze & Suggest Order
                </button>
              </div>
            )}

            {/* STAGE 2: ANALYZING */}
            {stage === 'analyzing' && (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border border-gray-200">
                <FiLoader className="w-10 h-10 text-red-600 animate-spin mb-4" />
                <h3 className="font-semibold text-lg text-gray-800">Analyzing Documents...</h3>
                <p className="text-sm text-gray-500 mt-2">Reading content to determine logical flow</p>
              </div>
            )}

            {/* STAGE 3: REVIEW */}
            {(stage === 'review' || stage === 'merging' || stage === 'done') && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                  <h3 className="font-semibold text-green-800 flex items-center gap-2">
                    <FiCheck /> AI Suggested Order
                  </h3>
                  {analysisResult?.reasoning && (
                    <p className="text-sm text-green-700 mt-1 italic">"{analysisResult.reasoning}"</p>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3">Drag to Reorder</p>
                  <div className="space-y-2 mb-8">
                    {currentOrder.map((originalIndex, viewIndex) => {
                      const file = files[originalIndex];
                      return (
                        <div
                          key={originalIndex}
                          draggable
                          onDragStart={(e) => onDragStart(e, viewIndex)}
                          onDragOver={(e) => onDragOver(e, viewIndex)}
                          onDrop={(e) => onDrop(e, viewIndex)}
                          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover:border-red-200 group"
                        >
                          <div className="text-gray-300 font-bold text-lg w-6 text-center group-hover:text-red-400">{viewIndex + 1}</div>
                          <img src={pdfIcon} className="w-10 h-10 shadow-sm" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{file.name}</div>
                            <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                          </div>
                          <FiMove className="text-gray-300 group-hover:text-gray-500" />
                        </div>
                      );
                    })}
                  </div>

                  {stage === 'done' ? (
                    <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="text-green-800 font-bold text-lg mb-2">Merge Complete!</h3>
                      <p className="text-green-600 mb-4">Your document has been downloaded.</p>
                      <button onClick={() => setStage('upload')} className="text-sm font-medium underline text-green-800">Merge more files</button>
                    </div>
                  ) : (
                    <button
                      onClick={handleMerge}
                      disabled={stage === 'merging'}
                      className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg hover:bg-black transition-colors flex items-center justify-center gap-3 shadow-xl"
                    >
                      {stage === 'merging' ? <FiLoader className="animate-spin" /> : <FiDownload />}
                      {stage === 'merging' ? 'Merging...' : 'Confirm & Merge PDFs'}
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartMerge;
