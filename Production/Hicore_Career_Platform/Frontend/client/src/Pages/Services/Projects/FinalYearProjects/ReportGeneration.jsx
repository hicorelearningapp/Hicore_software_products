import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Packer, Paragraph } from 'docx';
import mammoth from 'mammoth';
import DynamicContentRenderer from './DynamicContentRenderer';

const ReportGeneration = ({ onNext }) => {
  const { projectId } = useParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [error, setError] = useState('');

  // ✅ Use API base from .env
  const API_BASE = import.meta.env.VITE_API_BASE || '/api';

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);

        // ✅ Use dynamic API base instead of hardcoded URL
        const response = await fetch(
          `${API_BASE}/projects/mini_projects/${projectId}/files/report`,
          { method: 'GET', headers: { accept: 'application/json' } }
        );

        const data = await response.json();
        console.log('✅ REPORT API raw response:', data);

        const newContent = [];

        if (data.meta) {
          newContent.push({ type: 'heading', level: 1, text: data.meta.title || 'Project Report' });
          newContent.push({
            type: 'paragraph',
            text: `Version: ${data.meta.version || ''} | Date: ${data.meta.date || ''} | Prepared by: ${data.meta.prepared_by || ''}`,
          });
        }

        if (data.project_overview) {
          newContent.push({ type: 'heading', level: 2, text: 'Project Overview' });
          newContent.push({ type: 'paragraph', text: data.project_overview.description || '' });
          if (data.project_overview.objectives) {
            newContent.push({ type: 'list', items: data.project_overview.objectives });
          }
          if (data.project_overview.stakeholders) {
            newContent.push({
              type: 'heading',
              level: 3,
              text: 'Stakeholders',
            });
            newContent.push({ type: 'list', items: data.project_overview.stakeholders });
          }
        }

        if (data.problem_statement) {
          newContent.push({ type: 'heading', level: 2, text: 'Problem Statement' });
          newContent.push({ type: 'paragraph', text: data.problem_statement.background || '' });
          if (data.problem_statement.identified_issues) {
            newContent.push({
              type: 'list',
              items: data.problem_statement.identified_issues,
            });
          }
          if (data.problem_statement.proposed_solution) {
            newContent.push({
              type: 'paragraph',
              text: `Proposed Solution: ${data.problem_statement.proposed_solution}`,
            });
          }
        }

        if (data.system_features) {
          newContent.push({ type: 'heading', level: 2, text: 'System Features' });
          if (data.system_features.core_features)
            newContent.push({
              type: 'list',
              items: data.system_features.core_features,
            });
          if (data.system_features.optional_features)
            newContent.push({
              type: 'list',
              items: data.system_features.optional_features,
            });
        }

        if (data.architecture_summary) {
          newContent.push({ type: 'heading', level: 2, text: 'Architecture Summary' });
          Object.entries(data.architecture_summary).forEach(([section, details]) => {
            newContent.push({ type: 'heading', level: 3, text: section.toUpperCase() });
            if (details.features)
              newContent.push({ type: 'list', items: details.features });
            else if (details.models_used)
              newContent.push({ type: 'list', items: details.models_used });
            else if (details.tables)
              newContent.push({ type: 'list', items: details.tables });
          });
        }

        if (data.implementation_summary) {
          newContent.push({ type: 'heading', level: 2, text: 'Implementation Summary' });
          if (data.implementation_summary.modules)
            newContent.push({ type: 'list', items: data.implementation_summary.modules });
          if (data.implementation_summary.development_tools) {
            Object.entries(data.implementation_summary.development_tools).forEach(([key, value]) => {
              if (Array.isArray(value))
                newContent.push({ type: 'list', items: value });
            });
          }
        }

        if (data.testing_summary) {
          newContent.push({ type: 'heading', level: 2, text: 'Testing Summary' });
          if (data.testing_summary.testing_types)
            newContent.push({ type: 'list', items: data.testing_summary.testing_types });
          if (data.testing_summary.tools)
            newContent.push({ type: 'list', items: data.testing_summary.tools });
          if (data.testing_summary.performance_metrics) {
            newContent.push({
              type: 'paragraph',
              text: `Performance Metrics: ${JSON.stringify(data.testing_summary.performance_metrics)}`,
            });
          }
        }

        if (data.results_and_analysis) {
          newContent.push({ type: 'heading', level: 2, text: 'Results and Analysis' });
          if (data.results_and_analysis.key_findings)
            newContent.push({ type: 'list', items: data.results_and_analysis.key_findings });
          if (data.results_and_analysis.limitations)
            newContent.push({ type: 'list', items: data.results_and_analysis.limitations });
        }

        if (data.future_scope) {
          newContent.push({ type: 'heading', level: 2, text: 'Future Scope' });
          if (data.future_scope.enhancements)
            newContent.push({ type: 'list', items: data.future_scope.enhancements });
        }

        if (data.conclusion) {
          newContent.push({ type: 'heading', level: 2, text: 'Conclusion' });
          newContent.push({ type: 'paragraph', text: data.conclusion.summary || '' });
        }

        if (data.references) {
          newContent.push({ type: 'heading', level: 2, text: 'References' });
          newContent.push({ type: 'list', items: data.references });
        }

        setContent(newContent);
      } catch (err) {
        console.error('❌ Failed to fetch report:', err);
        setContent([
          { type: 'heading', level: 1, text: 'Project Report Not Available' },
          { type: 'paragraph', text: 'The final report for this project will be available soon.' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [projectId, API_BASE]);

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
        if (block.type === 'paragraph') return new Paragraph(block.text);
        if (block.type === 'list')
          return block.items.map((item) =>
            new Paragraph({ text: item, bullet: { level: 0 } })
          );
        return null;
      });

      const flat = paragraphs.flat().filter(Boolean);
      const doc = new Document({ sections: [{ children: flat }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${projectId || 'Project'}_Final_Report.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setHasDownloaded(true);
      setError('');
    } catch (err) {
      console.error('❌ Download error:', err);
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
        const lines = result.value.split('\n').filter((l) => l.trim() !== '');
        const newBlocks = lines.map((line) => {
          if (line.startsWith('•')) return { type: 'list', items: [line.replace(/^•\s*/, '')] };
          else if (/^\d+(\.\d+)*\s/.test(line)) return { type: 'heading', level: 2, text: line };
          else return { type: 'paragraph', text: line };
        });
        const merged = [];
        for (const b of newBlocks) {
          if (b.type === 'list' && merged.length && merged.at(-1).type === 'list')
            merged.at(-1).items.push(...b.items);
          else merged.push(b);
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
    if (!hasDownloaded)
      setError('⚠️ Please download the document before claiming your certificate.');
    else onNext();
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 sm:px-16 sm:py-10 bg-white border border-[#C0BFD5] rounded-lg shadow-sm w-full">
      {loading ? (
        <div className="text-[#343079] text-base font-medium">
          ⏳ Loading final project report...
        </div>
      ) : (
        <>
          <div className="w-full text-sm text-[#B54708] bg-[#FEF3C7] border border-[#FACC15] rounded p-3">
            ⚠️ <strong>Note:</strong> You must download your final project report before claiming your
            certificate.
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
                Download Project Report
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
              Claim your Certificate
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportGeneration;
