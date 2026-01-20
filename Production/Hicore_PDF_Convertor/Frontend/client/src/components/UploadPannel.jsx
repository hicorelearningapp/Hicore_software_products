// src/components/UploadPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileAlt,
  FaCheckCircle,
  FaRegClock,
} from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

import iconMonitor from "../assets/Pannelpage/Desktop.png";
import iconGrid from "../assets/Pannelpage/Dropbox.png";
import iconTriangle from "../assets/Pannelpage/googleDrive.png";
import iconCloud from "../assets/Pannelpage/Onedrive.png";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.js`;

const API_BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const humanFileSize = (size) => {
  if (!size && size !== 0) return "";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${
    ["B", "KB", "MB", "GB"][i]
  }`;
};

const UploadPanel = ({ onBack, selectedFiles, setSelectedFiles, config }) => {
  const { toolId } = useParams();
  const [filesWithPreview, setFilesWithPreview] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const pdfDocRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const actionMap = {
    "pdf-word": "pdf_to_word",
    "word-pdf": "word_to_pdf",
    "pdf-excel": "pdf_to_excel",
    "excel-pdf": "excel_to_pdf",
    "pdf-powerpoint": "pdf_to_powerpoint",
    "powerpoint-pdf": "powerpoint_to_pdf",
    "pdf-image": "pdf_to_image",
    "image-pdf": "image_to_pdf",
    merge: "merge_pdf",
  };
  const formattedAction = actionMap[toolId];

  useEffect(() => {
    const list = (selectedFiles || []).map((f) => {
      if (f.preview) return f;
      if (f instanceof File)
        return Object.assign(f, { preview: URL.createObjectURL(f) });
      return f;
    });
    setFilesWithPreview(list);
    setActiveIndex((prev) =>
      list.length === 0 ? 0 : Math.max(0, Math.min(prev, list.length - 1))
    );
  }, [selectedFiles]);

  const renderPdfPage = async (pageNumber) => {
    if (!pdfDocRef.current || !canvasRef.current || !canvasWrapperRef.current)
      return;
    try {
      const page = await pdfDocRef.current.getPage(pageNumber);
      const containerWidth = canvasWrapperRef.current.clientWidth - 40; // Padding offset
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
    if (!file || !isPdfFile(file)) return;
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
    const activeFile = filesWithPreview[activeIndex];
    if (activeFile && isPdfFile(activeFile)) {
      loadPdfDocument(activeFile);
    }
  }, [activeIndex, filesWithPreview]);

  const handleFileChange = (e) => {
    const incoming = Array.from(e.target.files || []);
    if (!incoming.length) return;
    const incomingWithPreview = incoming.map((f) =>
      Object.assign(f, { preview: URL.createObjectURL(f) })
    );
    setSelectedFiles((prev) => [...prev, ...incomingWithPreview]);
    setDownloadLinks([]);
  };

  const removeFile = (index) => {
    const next = filesWithPreview.filter((_, i) => i !== index);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((i) =>
      i === index && next.length > 0
        ? Math.max(0, index - 1)
        : i > index
        ? i - 1
        : Math.min(i, Math.max(0, next.length - 1))
    );
  };

  const isPdfFile = (file) =>
    file?.type === "application/pdf" ||
    file?.name?.toLowerCase().endsWith(".pdf");

  const getOutputExtension = () => {
    if (formattedAction === "pdf_to_image") return "zip";
    const map = {
      pdf_to_word: "docx",
      pdf_to_excel: "xlsx",
      pdf_to_powerpoint: "pptx",
    };
    return map[formattedAction] || "pdf";
  };

  const handleConvert = async () => {
    if (!selectedFiles.length || !formattedAction) return;
    setIsLoading(true);
    try {
      const dispatchRes = await axios.post(`${API_BASE_URL}/api/tool-action`, {
        tool: "convert",
        action: formattedAction,
      });
      const { redirect_to, action } = dispatchRes.data;
      const uploadUrl = `${API_BASE_URL}${
        redirect_to.startsWith("/api") ? "" : "/api"
      }${redirect_to}`;
      const formData = new FormData();
      selectedFiles.forEach((f) => formData.append("file", f));
      formData.append("tool", "convert");
      formData.append("action", action);
      formData.append(
        "settings",
        JSON.stringify({
          output_format: getOutputExtension(),
          embed_fonts: true,
        })
      );
      const convertRes = await axios.post(uploadUrl, formData, {
        responseType: "blob",
      });
      setDownloadLinks([URL.createObjectURL(new Blob([convertRes.data]))]);
    } catch (err) {
      alert("Conversion failed.");
    } finally {
      setIsLoading(false);
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
                  onClick={onBack}
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
                    onChange={handleFileChange}
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

          {/* Right Action Panel */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-rose-100 rounded-md p-6 flex flex-col justify-between shadow-sm">
            <div className="text-center py-4">
              <h3 className="text-sm font-bold mb-6 border-b pb-5 text-center border-red-800 text-red-800 uppercase tracking-wider">
                Task Status
              </h3>

              {downloadLinks.length > 0 ? (
                <div className="flex flex-col items-center animate-fadeIn">
                  <FaCheckCircle className="text-green-500 text-5xl mb-3" />
                  <p className="text-md font-semibold text-gray-800">
                    Converted Successfully!
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    Your file is ready for download
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mb-3"></div>
                  ) : (
                    <FaRegClock className="text-5xl mb-3 opacity-20" />
                  )}
                  <p className="text-sm px-4 text-center leading-relaxed">
                    {isLoading
                      ? "Processing your request..."
                      : "Click the button to start conversion"}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={
                downloadLinks.length > 0
                  ? () => {
                      const a = document.createElement("a");
                      a.href = downloadLinks[0];
                      a.download = `converted.${getOutputExtension()}`;
                      a.click();
                    }
                  : handleConvert
              }
              disabled={isLoading}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md w-full transition-all shadow-md active:scale-[0.98]"
            >
              {isLoading
                ? "Converting..."
                : downloadLinks.length > 0
                ? "Download Now"
                : config?.convertAction || "Convert"}
            </button>
          </aside>

          {/* Left Sidebar: Selected Files */}
          <div className="col-span-3">
            <aside className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm h-full">
              <h2 className="text-md font-bold mb-4 text-gray-700">
                Selected files
              </h2>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {filesWithPreview.map((f, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-all ${
                      i === activeIndex
                        ? "bg-red-50 border-red-300 shadow-sm"
                        : "bg-white border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <div className="text-red-600 text-3xl flex-shrink-0">
                      {f.name?.toLowerCase().endsWith(".pdf") ? (
                        <FaFilePdf />
                      ) : (
                        <FaFileAlt />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate text-gray-800 max-w-[140px]"
                        title={f.name}
                      >
                        {f.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
                          {humanFileSize(f.size)}
                        </span>
                        {/* Centered Icon and Text */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(i);
                          }}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-[14px] font-bold"
                        >
                          <FiTrash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {/* Center Main Preview */}
          <main className="col-span-6 bg-white border border-[#E7B0B9] rounded-lg p-4 flex flex-col shadow-sm">
            {filesWithPreview[activeIndex] ? (
              isPdfFile(filesWithPreview[activeIndex]) ? (
                <div className="flex flex-col h-[75vh]">
                  {/* Enabled Scrollable View */}
                  <div
                    ref={canvasWrapperRef}
                    className="flex-1 overflow-y-auto hide-scrollbar bg-gray-100 rounded flex justify-center items-start shadow-inner p-4"
                  >
                    <canvas
                      ref={canvasRef}
                      className="bg-white shadow-lg mb-4"
                    />
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
                    <span className="text-xs font-bold text-gray-600">
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
                  <FaFileAlt className="text-6xl mb-4 text-red-100" />
                  <p className="font-medium">
                    Preview not available for this format
                  </p>
                </div>
              )
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

export default UploadPanel;
