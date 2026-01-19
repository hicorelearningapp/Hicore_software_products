import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Packer, Paragraph } from "docx";
import mammoth from "mammoth";
import DynamicContentRenderer from "./DynamicContentRenderer";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const Design = ({ onNext }) => {
  const { projectId } = useParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/projects/mini_projects/${projectId}/files/design`,
          { method: "GET", headers: { Accept: "application/json" } }
        );

        const data = await response.json();
        console.log("✅ DESIGN API Response:", data);

        if (!data.system_design) throw new Error("Invalid design data");

        const designBlocks = [];
        const s = data.system_design;

        if (s.project_title) {
          designBlocks.push({ type: "heading", level: 1, text: s.project_title });
        }
        if (s.version || s.date) {
          designBlocks.push({
            type: "paragraph",
            text: `Version: ${s.version || ""} | Date: ${s.date || ""}`,
          });
        }
        if (s.description) {
          designBlocks.push({ type: "paragraph", text: s.description });
        }

        // 🔁 Automatically handle all other keys dynamically
        Object.entries(s).forEach(([key, value]) => {
          if (["project_title", "version", "date", "description"].includes(key))
            return;

          const sectionTitle = key.replace(/_/g, " ").replace(/\d+\.\s*/, "");
          designBlocks.push({
            type: "heading",
            level: 2,
            text: sectionTitle,
          });

          const parseValue = (obj, depth = 3) => {
            if (!obj) return;
            if (typeof obj === "string") {
              designBlocks.push({ type: "paragraph", text: obj });
            } else if (Array.isArray(obj)) {
              designBlocks.push({
                type: "list",
                items: obj.map((item) =>
                  typeof item === "string" ? item : JSON.stringify(item, null, 2)
                ),
              });
            } else if (typeof obj === "object") {
              Object.entries(obj).forEach(([subKey, subVal]) => {
                const cleanKey = subKey.replace(/_/g, " ");
                designBlocks.push({
                  type: "heading",
                  level: depth,
                  text: cleanKey,
                });
                parseValue(subVal, depth + 1);
              });
            }
          };

          parseValue(value, 3);
        });

        setContent(designBlocks);
      } catch (err) {
        console.error("❌ Failed to fetch design:", err);
        setContent([
          { type: "heading", level: 1, text: "Design Document Not Available" },
          {
            type: "paragraph",
            text: "Details for this project’s Design will be updated soon.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [projectId]);

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
      const doc = new Document({ sections: [{ children: flatParagraphs }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectId || "Project"}_Design.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setHasDownloaded(true);
      setError("");
    } catch (error) {
      console.error("❌ Download error:", error);
      alert("Failed to generate DOCX file.");
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
        const lines = result.value.split("\n").filter((l) => l.trim() !== "");
        const newBlocks = lines.map((line) =>
          line.startsWith("•")
            ? { type: "list", items: [line.replace(/^•\s*/, "")] }
            : /^\d+(\.\d+)*\s/.test(line)
            ? { type: "heading", level: 2, text: line }
            : { type: "paragraph", text: line }
        );

        const merged = [];
        for (const b of newBlocks) {
          if (b.type === "list") {
            if (merged.length && merged[merged.length - 1].type === "list") {
              merged[merged.length - 1].items.push(...b.items);
            } else merged.push(b);
          } else merged.push(b);
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

  const handleNext = () => {
    if (!hasDownloaded) {
      setError("⚠️ Please download the document before proceeding.");
    } else {
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 sm:px-16 sm:py-10 bg-white border border-[#C0BFD5] rounded-lg shadow-sm w-full">
      {loading ? (
        <div className="text-[#343079] text-base font-medium">
          ⏳ Loading Design content...
        </div>
      ) : (
        <>
          <div className="w-full text-sm text-[#B54708] bg-[#FEF3C7] border border-[#FACC15] rounded p-3">
            ⚠️ <strong>Note:</strong> You can modify the content below. Avoid
            editing section numbers like <code>1</code>, <code>1.1</code>, etc.
          </div>

          <div className="w-full max-h-[500px] overflow-auto border border-[#E5E7EB] bg-[#FAFAFF] shadow-inner rounded-lg p-4 sm:p-6 text-sm">
            <DynamicContentRenderer
              content={content}
              editable={true}
              onEdit={handleBlockEdit}
            />
          </div>

          {error && <div className="w-full text-sm text-red-600 -mt-2">{error}</div>}

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-between mt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg border border-[#343079] text-[#343079] hover:bg-[#F4F4FF] transition"
              >
                Download Document
              </button>

              <label className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg border border-[#343079] text-[#343079] text-center cursor-pointer hover:bg-[#F4F4FF] transition">
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
              className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg border border-[#403B93] bg-[#282655] text-white hover:bg-[#343079] transition"
            >
              Confirm and Proceed to Coding
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Design;
