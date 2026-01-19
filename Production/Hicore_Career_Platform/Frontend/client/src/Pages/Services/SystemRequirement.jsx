import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Packer, Paragraph } from "docx";
import mammoth from "mammoth";
import DynamicContentRenderer from "./DynamicContentRenderer";

// ✅ Updated API base (from .env)
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const SystemRequirement = ({ onNext }) => {
  const { projectId } = useParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [error, setError] = useState("");

  // 🧠 Helper: Recursively flatten JSON structure into text blocks
  const parseJSONToBlocks = (data, level = 1) => {
    const blocks = [];

    if (typeof data === "string" || typeof data === "number") {
      blocks.push({ type: "paragraph", text: String(data) });
      return blocks;
    }

    if (Array.isArray(data)) {
      blocks.push({
        type: "list",
        items: data.map((item) =>
          typeof item === "object" ? JSON.stringify(item) : String(item)
        ),
      });
      return blocks;
    }

    if (typeof data === "object" && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        // Create a heading for each object key
        blocks.push({
          type: "heading",
          level: Math.min(level, 3), // limit heading levels
          text:
            key.charAt(0).toUpperCase() +
            key.slice(1).replace(/_/g, " "),
        });

        if (
          typeof value === "string" ||
          typeof value === "number" ||
          Array.isArray(value)
        ) {
          blocks.push(...parseJSONToBlocks(value, level + 1));
        } else if (typeof value === "object") {
          blocks.push(...parseJSONToBlocks(value, level + 1));
        }
      }
    }

    return blocks;
  };

  // 🔄 Fetch backend data
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/projects/mini_projects/${projectId}/files/system_requirement`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log("✅ Dynamic API Data:", data);

        const structuredContent = parseJSONToBlocks(data);

        setContent(
          structuredContent.length
            ? structuredContent
            : [
                { type: "heading", level: 1, text: "System Requirements" },
                { type: "paragraph", text: "No requirements available." },
              ]
        );
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setContent([
          { type: "heading", level: 1, text: "System Requirements" },
          {
            type: "paragraph",
            text: "Details for this project will be updated soon.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, [projectId]);

  // ✏️ Editable Block Handler
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

  // 💾 Download as .docx
  const handleDownload = async () => {
    try {
      const paragraphs = content.map((block) => {
        if (block.type === "heading") {
          return new Paragraph({
            text: block.text,
            heading:
              block.level === 1
                ? "Heading1"
                : block.level === 2
                ? "Heading2"
                : "Heading3",
          });
        }
        if (block.type === "paragraph") {
          return new Paragraph(block.text);
        }
        if (block.type === "list") {
          return block.items.map(
            (item) => new Paragraph({ text: item, bullet: { level: 0 } })
          );
        }
        return null;
      });

      const flatParagraphs = paragraphs.flat().filter(Boolean);

      const doc = new Document({
        sections: [{ children: flatParagraphs }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectId || "Project"}_System_Requirements.docx`;
      a.click();
      URL.revokeObjectURL(url);

      setHasDownloaded(true);
      setError("");
    } catch (err) {
      console.error("❌ DOCX error:", err);
      alert("Failed to download document.");
    }
  };

  // 📤 Upload .docx and parse
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
          if (block.type === "list") {
            if (merged.length && merged[merged.length - 1].type === "list") {
              merged[merged.length - 1].items.push(...block.items);
            } else {
              merged.push(block);
            }
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
      alert("Failed to parse uploaded document.");
    }
  };

  // ➡️ Confirm & Proceed
  const handleNext = () => {
    if (!hasDownloaded) {
      setError("⚠️ Please download the document before proceeding.");
    } else {
      onNext();
    }
  };

  // 🖥️ Render
  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 px-4 sm:px-16 py-6 sm:py-10 bg-white border border-[#C0BFD5] rounded-lg shadow-sm w-full">
      {loading ? (
        <div className="text-[#343079] text-base font-medium">
          ⏳ Loading system requirements...
        </div>
      ) : (
        <>
          {/* Note */}
          <div className="w-full text-sm text-[#B54708] bg-[#FEF3C7] border border-[#FACC15] rounded p-3">
            ⚠️ <strong>Note:</strong> You can edit the content below. Do not
            modify section numbers like <code>1</code>, <code>1.1</code>, etc.
          </div>

          {/* Editor */}
          <div className="w-full max-h-[500px] overflow-auto border border-[#E5E7EB] bg-[#FAFAFF] shadow-inner rounded-lg p-4 sm:p-6 text-sm sm:text-base">
            <DynamicContentRenderer
              content={content}
              editable={true}
              onEdit={handleBlockEdit}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="w-full text-red-600 text-sm font-medium -mt-2">
              {error}
            </div>
          )}

          {/* Buttons */}
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
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-2 rounded-lg border border-[#403B93] bg-[#282655] text-white hover:bg-[#343079] transition"
            >
              Confirm and Proceed to SRS
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemRequirement;
