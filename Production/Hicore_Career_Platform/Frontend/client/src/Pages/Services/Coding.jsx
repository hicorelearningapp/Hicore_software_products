import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Packer, Paragraph } from 'docx';
import mammoth from 'mammoth';
import DynamicContentRenderer from './DynamicContentRenderer';

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const Coding = ({ onNext }) => {
  const { projectId } = useParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoding = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/projects/mini_projects/${projectId}/files/coding`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          }
        );

        const data = await response.json();
        console.log('✅ CODING API response:', data);

        const generatedBlocks = [];

        if (data?.project) {
          generatedBlocks.push({ type: 'heading', level: 1, text: data.project.name || 'Project Title' });
          generatedBlocks.push({
            type: 'paragraph',
            text: `Version: ${data.project.version || '1.0'}`,
          });
          generatedBlocks.push({
            type: 'paragraph',
            text: data.project.description || '',
          });

          generatedBlocks.push({ type: 'heading', level: 2, text: 'Architecture' });
          generatedBlocks.push({
            type: 'paragraph',
            text: data.project.architecture || '',
          });

          generatedBlocks.push({ type: 'heading', level: 2, text: 'Tech Stack' });

          const techItems = [];
          Object.entries(data.project.tech_stack || {}).forEach(([key, val]) => {
            if (Array.isArray(val)) techItems.push(`${key}: ${val.join(', ')}`);
            else if (typeof val === 'string') techItems.push(`${key}: ${val}`);
          });
          generatedBlocks.push({ type: 'list', items: techItems });
        }

        if (data?.backend_structure) {
          generatedBlocks.push({ type: 'heading', level: 1, text: 'Backend Structure' });
          generatedBlocks.push({ type: 'heading', level: 2, text: 'Root Folders' });
          generatedBlocks.push({ type: 'list', items: data.backend_structure.root_folders || [] });
          generatedBlocks.push({ type: 'heading', level: 2, text: 'Main Files' });
          generatedBlocks.push({ type: 'list', items: data.backend_structure.main_files || [] });

          generatedBlocks.push({ type: 'heading', level: 2, text: 'Modules Overview' });
          (data.backend_structure.module_overview || []).forEach((mod) => {
            generatedBlocks.push({ type: 'heading', level: 3, text: mod.name });
            generatedBlocks.push({
              type: 'paragraph',
              text: mod.description || '',
            });
            generatedBlocks.push({
              type: 'list',
              items: mod.files || [],
            });
          });
        }

        if (data?.api_routes) {
          generatedBlocks.push({ type: 'heading', level: 1, text: 'API Routes' });
          Object.entries(data.api_routes).forEach(([route, endpoints]) => {
            generatedBlocks.push({ type: 'heading', level: 2, text: route });
            const routeList = endpoints.map(
              (ep) => `${ep.method} ${ep.endpoint} → ${ep.function}`
            );
            generatedBlocks.push({ type: 'list', items: routeList });
          });
        }

        if (data?.database_schema) {
          generatedBlocks.push({ type: 'heading', level: 1, text: 'Database Schema' });
          Object.entries(data.database_schema).forEach(([table, fields]) => {
            generatedBlocks.push({ type: 'heading', level: 2, text: table });
            const fieldList = Object.entries(fields).map(([key, val]) => `${key}: ${val}`);
            generatedBlocks.push({ type: 'list', items: fieldList });
          });
        }

        if (data?.class_design) {
          generatedBlocks.push({ type: 'heading', level: 1, text: 'Class Design' });
          Object.entries(data.class_design).forEach(([className, def]) => {
            generatedBlocks.push({ type: 'heading', level: 2, text: className });
            generatedBlocks.push({ type: 'paragraph', text: 'Fields:' });
            generatedBlocks.push({ type: 'list', items: def.fields || [] });
            generatedBlocks.push({ type: 'paragraph', text: 'Methods:' });
            generatedBlocks.push({ type: 'list', items: def.methods || [] });
          });
        }

        if (data?.ai_pipeline) {
          generatedBlocks.push({ type: 'heading', level: 1, text: 'AI Pipeline' });
          (data.ai_pipeline.steps || []).forEach((step, i) => {
            generatedBlocks.push({ type: 'heading', level: 2, text: `${i + 1}. ${step.name}` });
            generatedBlocks.push({
              type: 'paragraph',
              text: `Tools: ${(step.tools || []).join(', ')}`,
            });
            generatedBlocks.push({
              type: 'paragraph',
              text: `Output: ${step.output || ''}`,
            });
          });
        }

        if (data?.security) {
          generatedBlocks.push({ type: 'heading', level: 1, text: 'Security' });
          Object.entries(data.security).forEach(([key, val]) => {
            generatedBlocks.push({ type: 'paragraph', text: `${key}: ${val}` });
          });
        }

        if (data?.devops_pipeline) {
          generatedBlocks.push({ type: 'heading', level: 1, text: 'DevOps Pipeline' });
          generatedBlocks.push({
            type: 'list',
            items: data.devops_pipeline.stages || [],
          });
        }

        setContent(generatedBlocks);
      } catch (err) {
        console.error('❌ Failed to fetch coding content:', err);
        setContent([
          { type: 'heading', level: 1, text: '1. Coding Content Not Available' },
          { type: 'paragraph', text: 'Details for this project’s coding step will be updated soon.' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoding();
  }, [projectId]);

  const handleBlockEdit = (index, newText, subIndex = null) => {
    const updated = [...content];
    if (updated[index].type === 'list' && subIndex !== null) {
      updated[index].items[subIndex] = newText;
    } else {
      updated[index].text = newText;
    }
    setContent(updated);
    setHasDownloaded(false);
    setError('');
  };

  const handleDownload = async () => {
    try {
      const paragraphs = content.map((block) => {
        if (block.type === 'heading') {
          return new Paragraph({
            text: block.text,
            heading: block.level === 1 ? 'Heading1' : 'Heading2',
          });
        }
        if (block.type === 'paragraph') {
          return new Paragraph(block.text);
        }
        if (block.type === 'list') {
          return block.items.map(
            (item) =>
              new Paragraph({
                text: item,
                bullet: { level: 0 },
              })
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

      const link = document.createElement('a');
      link.href = url;
      link.download = `${projectId || 'Project'}_Coding.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setHasDownloaded(true);
      setError('');
    } catch (error) {
      console.error('❌ Download error:', error);
      alert('Failed to generate DOCX.');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.docx')) {
      alert('Please upload a valid .docx file');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
        const lines = result.value.split('\n').filter((line) => line.trim() !== '');

        const newBlocks = lines.map((line) => {
          if (line.startsWith('•')) {
            return { type: 'list', items: [line.replace(/^•\s*/, '')] };
          } else if (/^\d+(\.\d+)*\s/.test(line)) {
            return { type: 'heading', level: 2, text: line };
          } else {
            return { type: 'paragraph', text: line };
          }
        });

        const merged = [];
        for (const block of newBlocks) {
          if (block.type === 'list') {
            if (merged.length && merged[merged.length - 1].type === 'list') {
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
        setError('');
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert('Failed to parse uploaded document.');
    }
  };

  const handleNext = () => {
    if (!hasDownloaded) {
      setError('⚠️ Please download the document before proceeding.');
    } else {
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 sm:px-16 sm:py-10 bg-white border border-[#C0BFD5] rounded-lg shadow-sm w-full">
      {loading ? (
        <div className="text-[#343079] text-base font-medium">⏳ Loading coding content...</div>
      ) : (
        <>
          <div className="w-full text-sm text-[#2563EB] bg-[#EFF6FF] border border-[#93C5FD] rounded p-3">
            📘 <strong>Note:</strong> You can edit the content below. Don’t modify section numbers like <code>1</code>, <code>1.1</code>, etc.
          </div>

          <div className="w-full max-h-[500px] overflow-auto border border-[#E5E7EB] bg-[#FAFAFF] shadow-inner rounded-lg p-4 sm:p-6 text-sm">
            <DynamicContentRenderer content={content} editable={true} onEdit={handleBlockEdit} />
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
                <input type="file" accept=".docx" onChange={handleUpload} className="hidden" />
              </label>
            </div>

            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg border border-[#403B93] bg-[#282655] text-white hover:bg-[#343079] transition"
            >
              Confirm and Proceed to Testing
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Coding;
