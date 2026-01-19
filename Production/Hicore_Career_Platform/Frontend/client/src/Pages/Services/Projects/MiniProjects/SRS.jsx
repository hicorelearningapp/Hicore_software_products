import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Packer, Paragraph } from "docx";
import mammoth from "mammoth";
import DynamicContentRenderer from "./DynamicContentRenderer";

const SRS = ({ onNext }) => {
  const { projectId } = useParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [error, setError] = useState("");

  // ✅ Use API base from environment variable
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  useEffect(() => {
    const fetchSRS = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/projects/mini_projects/${projectId}/files/srs`
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        console.log("✅ SRS API response:", data);

        const srsData = data.SRS || data.srs;
        if (!srsData || typeof srsData !== "object") {
          throw new Error("Invalid SRS data format");
        }

        // ✅ Recursive function to convert any JSON into structured editable blocks
        const convertToBlocks = (obj, parentKey = "") => {
          const blocks = [];

          for (const [key, value] of Object.entries(obj)) {
            const displayKey = parentKey ? `${parentKey} → ${key}` : key;

            if (typeof value === "string") {
              blocks.push({ type: "paragraph", text: `${displayKey}: ${value}` });
            } else if (Array.isArray(value)) {
              const items = value.map((v) =>
                typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)
              );
              blocks.push({ type: "list", items });
            } else if (typeof value === "object" && value !== null) {
              blocks.push({
                type: "heading",
                level: 2,
                text: `${displayKey}`,
              });
              blocks.push(...convertToBlocks(value, ""));
            } else {
              blocks.push({ type: "paragraph", text: `${displayKey}: ${String(value)}` });
            }
          }

          return blocks;
        };

        const converted = convertToBlocks(srsData);
        setContent(converted);
      } catch (err) {
        console.error("❌ Failed to fetch SRS:", err);
        setContent([
          { type: "heading", level: 1, text: "1. SRS Not Available" },
          {
            type: "paragraph",
            text: "Details for this project’s SRS will be updated soon.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSRS();
  }, [projectId, API_BASE]);

  const handleBlockEdit = (index, newText, subIndex = null) => {
    const updated = [...content];
    if (updated[index].type === "list" && subIndex !== null) {
      updated[index].items[subIndex] = newText;
    } else {
      updated[index].text = newText;
    }
    setContent(updated);
    setHasDownloaded(false);
    setError("");
  };

  const handleDownload = async () => {
    try {
      const paragraphs = content.map((block) => {
        if (block.type === "heading") {
          return new Paragraph({
            text: block.text,
            heading: block.level === 1 ? "Heading1" : "Heading2",
          });
        }
        if (block.type === "paragraph") return new Paragraph(block.text);
        if (block.type === "list")
          return block.items.map(
            (item) => new Paragraph({ text: item, bullet: { level: 0 } })
          );
        return null;
      });

      const flatParagraphs = paragraphs.flat().filter(Boolean);
      const doc = new Document({ sections: [{ children: flatParagraphs }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectId || "Project"}_SRS.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setHasDownloaded(true);
      setError("");
    } catch (error) {
      console.error("❌ Download error:", error);
      alert("Failed to generate DOCX.");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".docx")) {
      alert("Please upload a valid .docx file");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = await mammoth.extractRawText({
          arrayBuffer: event.target.result,
        });
        const lines = result.value.split("\n").filter((line) => line.trim() !== "");

        const newBlocks = lines.map((line) => {
          if (line.startsWith("•")) {
            return { type: "list", items: [line.replace(/^•\s*/, "")] };
          } else if (/^\d+(\.\d+)*\s/.test(line)) {
            return { type: "heading", level: 2, text: line };
          } else {
            return { type: "paragraph", text: line };
          }
        });

        // Merge consecutive lists
        const merged = [];
        for (const block of newBlocks) {
          if (block.type === "list" && merged.length && merged[merged.length - 1].type === "list") {
            merged[merged.length - 1].items.push(...block.items);
          } else {
            merged.push(block);
          }
        }

        setContent(merged);
        setHasDownloaded(false);
        setError("");
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Failed to read the document.");
    }
  };

  const handleNextClick = () => {
    if (!hasDownloaded) {
      setError("⚠️ Please download the document before proceeding to the next step.");
    } else {
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 px-4 sm:px-16 py-6 sm:py-10 bg-white border border-[#C0BFD5] rounded-lg shadow-sm w-full">
      {loading ? (
        <div className="text-[#343079] text-base font-medium">
          ⏳ Loading SRS content...
        </div>
      ) : (
        <>
          <div className="w-full text-sm text-[#B54708] bg-[#FEF3C7] border border-[#FACC15] rounded p-3">
            ⚠️ <strong>Note:</strong> You can modify the content below. Avoid editing section numbers like <code>1</code>, <code>1.1</code>, etc.
          </div>

          <div className="w-full max-h-[500px] overflow-auto border border-[#E5E7EB] bg-[#FAFAFF] shadow-inner rounded-lg p-4 sm:p-6 text-sm sm:text-base">
            <DynamicContentRenderer
              content={content}
              editable={true}
              onEdit={handleBlockEdit}
            />
          </div>

          {error && (
            <div className="w-full text-red-600 text-sm font-medium -mt-2">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row w-full justify-between items-stretch sm:items-center gap-4 mt-2">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-6 py-2 rounded-lg border border-[#343079] text-[#343079] hover:bg-[#F4F4FF] transition"
              >
                Download Document
              </button>

              <label className="w-full sm:w-auto px-6 py-2 rounded-lg border border-[#343079] text-[#343079] cursor-pointer hover:bg-[#F4F4FF] transition text-center">
                Upload Document
                <input
                  type="file"
                  accept=".docx"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={handleNextClick}
              className="w-full sm:w-auto px-6 py-2 rounded-lg border border-[#403B93] bg-[#282655] text-white hover:bg-[#343079] transition"
            >
              Confirm and Proceed to Design
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SRS;
