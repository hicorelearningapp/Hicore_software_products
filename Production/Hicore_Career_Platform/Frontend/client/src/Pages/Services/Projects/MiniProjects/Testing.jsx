import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Packer, Paragraph } from "docx";
import mammoth from "mammoth";
import DynamicContentRenderer from "./DynamicContentRenderer";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const Testing = ({ onNext }) => {
  const { projectId } = useParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTesting = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE}/projects/mini_projects/${projectId}/files/testing`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch testing data");
        const data = await response.json();
        console.log("✅ TESTING API response:", data);

        const blocks = [];

        // ---- Meta Section ----
        if (data.meta) {
          blocks.push({
            type: "heading",
            level: 1,
            text: data.meta.title || "Testing Document",
          });
          if (data.meta.description)
            blocks.push({ type: "paragraph", text: data.meta.description });
        }

        // ---- Testing Strategy ----
        if (data.testing_strategy) {
          blocks.push({
            type: "heading",
            level: 2,
            text: "1. Testing Strategy",
          });

          if (Array.isArray(data.testing_strategy.objectives)) {
            blocks.push({ type: "heading", level: 3, text: "1.1 Objectives" });
            blocks.push({ type: "list", items: data.testing_strategy.objectives });
          }

          if (Array.isArray(data.testing_strategy.types)) {
            blocks.push({
              type: "heading",
              level: 3,
              text: "1.2 Types of Testing",
            });
            blocks.push({ type: "list", items: data.testing_strategy.types });
          }
        }

        // ---- Test Environment ----
        if (data.test_environment) {
          blocks.push({
            type: "heading",
            level: 2,
            text: "2. Test Environment",
          });
          Object.entries(data.test_environment).forEach(([key, value]) => {
            if (typeof value === "string") {
              blocks.push({
                type: "paragraph",
                text: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
              });
            } else if (typeof value === "object") {
              blocks.push({
                type: "heading",
                level: 3,
                text: key.charAt(0).toUpperCase() + key.slice(1),
              });

              Object.entries(value).forEach(([toolCategory, tools]) => {
                if (Array.isArray(tools)) {
                  blocks.push({
                    type: "list",
                    items: tools.map((t) => `${toolCategory}: ${t}`),
                  });
                }
              });
            }
          });
        }

        // ---- Test Cases ----
        if (data.test_cases) {
          blocks.push({
            type: "heading",
            level: 2,
            text: "3. Test Cases",
          });

          for (const [section, tests] of Object.entries(data.test_cases)) {
            if (Array.isArray(tests) && tests.length > 0) {
              blocks.push({
                type: "heading",
                level: 3,
                text:
                  section
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Tests",
              });

              tests.forEach((test, i) => {
                blocks.push({
                  type: "heading",
                  level: 4,
                  text: `${i + 1}. ${test.id || "Test Case"}`,
                });
                Object.entries(test).forEach(([key, value]) => {
                  if (Array.isArray(value)) {
                    blocks.push({
                      type: "list",
                      items: value.map((v) => `${key}: ${v}`),
                    });
                  } else if (typeof value === "object") {
                    blocks.push({
                      type: "paragraph",
                      text: `${key}: ${JSON.stringify(value)}`,
                    });
                  } else {
                    blocks.push({
                      type: "paragraph",
                      text: `${key}: ${value}`,
                    });
                  }
                });
              });
            }
          }
        }

        // ---- Reporting ----
        if (data.reporting) {
          blocks.push({
            type: "heading",
            level: 2,
            text: "4. Reporting",
          });

          Object.entries(data.reporting).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              blocks.push({
                type: "list",
                items: value.map((item) => `${key}: ${item}`),
              });
            } else {
              blocks.push({
                type: "paragraph",
                text: `${key}: ${value}`,
              });
            }
          });
        }

        if (blocks.length === 0) {
          throw new Error("Invalid testing data structure");
        }

        setContent(blocks);
      } catch (err) {
        console.error("❌ Failed to fetch testing content:", err);
        setContent([
          {
            type: "heading",
            level: 1,
            text: "1. Testing Content Not Available",
          },
          {
            type: "paragraph",
            text: "Details for this project’s testing step will be updated soon.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTesting();
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
          return block.items.map((item) =>
            new Paragraph({ text: item, bullet: { level: 0 } })
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

      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectId || "Project"}_Testing.docx`;
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
        const lines = result.value
          .split("\n")
          .filter((line) => line.trim() !== "");

        const newBlocks = lines.map((line) => {
          if (line.startsWith("•")) {
            return { type: "list", items: [line.replace(/^•\s*/, "")] };
          } else if (/^\d+(\.\d+)*\s/.test(line)) {
            return { type: "heading", level: 2, text: line };
          } else {
            return { type: "paragraph", text: line };
          }
        });

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
          ⏳ Loading testing content...
        </div>
      ) : (
        <>
          <div className="w-full text-sm text-[#B54708] bg-[#FEF3C7] border border-[#FACC15] rounded p-3">
            ⚠️ <strong>Note:</strong> You can edit the content below. Don’t
            modify section numbers like <code>1</code>, <code>1.1</code>, etc.
          </div>

          <div className="w-full max-h-[500px] overflow-auto border border-[#E5E7EB] bg-[#FAFAFF] shadow-inner rounded-lg p-4 sm:p-6 text-sm">
            <DynamicContentRenderer
              content={content}
              editable={true}
              onEdit={handleBlockEdit}
            />
          </div>

          {error && <div className="w-full text-sm text-red-600 -mt-2">{error}</div>}

          <div className="flex flex-col sm:flex-row w-full justify-between gap-4 mt-4">
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
              Confirm and Proceed to Report Generation
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Testing;
