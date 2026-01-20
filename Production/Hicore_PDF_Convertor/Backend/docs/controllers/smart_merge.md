# Smart Merge - Frontend Integration Guide

## Endpoint: `/api/ai`

**Action:** `smart_merge`

AI-powered PDF merging that analyzes document content and suggests optimal merge order.

---

## 🎯 Overview

Smart Merge is a **2-step process**:

1. **Analyze** → AI reads all PDFs and suggests the best order
2. **Merge** → Combine PDFs in your chosen order (AI-suggested or custom)

---

## 📋 Step 1: Analyze (Get AI Suggestion)

### Request

**Method:** `POST`  
**Content-Type:** `multipart/form-data`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | File[] | ✅ Yes | Multiple PDF files (minimum 2) |
| `action` | String | ✅ Yes | Must be `"smart_merge"` |
| `mode` | String | ✅ Yes | Must be `"analyze"` |

### Response

**Content-Type:** `application/json`

```json
{
  "status": "analyzed",
  "file_count": 4,
  "total_pages": 9,
  "suggested_order": [0, 2, 1, 3],
  "reasoning": "Executive Summary introduces the report, Market Research provides context, Technical Analysis details implementation, Financial Projections concludes with forward-looking statements.",
  "relationships": [
    {"from": 0, "to": 2, "relation": "introduces"},
    {"from": 2, "to": 1, "relation": "provides context for"},
    {"from": 1, "to": 3, "relation": "leads to"}
  ],
  "file_info": [
    {
      "index": 0,
      "filename": "A_Executive_Summary.pdf",
      "page_count": 2,
      "file_size_mb": 0.05,
      "preview": "EXECUTIVE SUMMARY Q4 2024 Business Performance Report..."
    },
    {
      "index": 1,
      "filename": "B_Technical_Analysis.pdf",
      "page_count": 3,
      "file_size_mb": 0.06,
      "preview": "TECHNICAL ANALYSIS System Architecture & Performance..."
    },
    {
      "index": 2,
      "filename": "C_Market_Research.pdf",
      "page_count": 2,
      "file_size_mb": 0.04,
      "preview": "MARKET RESEARCH REPORT Industry Trends & Competitive..."
    },
    {
      "index": 3,
      "filename": "D_Financial_Projections.pdf",
      "page_count": 2,
      "file_size_mb": 0.04,
      "preview": "FINANCIAL PROJECTIONS 2025 Fiscal Year Forecast..."
    }
  ],
  "analysis": [
    {
      "position": 1,
      "original_index": 0,
      "filename": "A_Executive_Summary.pdf",
      "page_count": 2,
      "preview": "..."
    }
  ],
  "message": "Analysis complete. Use 'merge' mode with your preferred order to create the merged PDF."
}
```

### JavaScript Example

```javascript
async function analyzeForSmartMerge(pdfFiles) {
  const formData = new FormData();
  
  // Add all PDF files
  pdfFiles.forEach(file => {
    formData.append('files', file);
  });
  
  formData.append('action', 'smart_merge');
  formData.append('mode', 'analyze');
  
  const response = await fetch('http://localhost:8000/api/ai', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  
  console.log('Suggested order:', data.suggested_order);
  console.log('Reasoning:', data.reasoning);
  console.log('Files:', data.file_info);
  
  return data;
}
```

---

## 📑 Step 2: Merge (Create Final PDF)

### Request

**Method:** `POST`  
**Content-Type:** `multipart/form-data`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | File[] | ✅ Yes | Same PDF files as analyze step |
| `action` | String | ✅ Yes | Must be `"smart_merge"` |
| `mode` | String | ✅ Yes | Must be `"merge"` |
| `order` | String | ⚠️ Optional | JSON array of indices e.g. `"[0, 2, 1, 3]"` |

**Note:** If `order` is not provided, files merge in upload order `[0, 1, 2, ...]`

### Response

Returns the merged PDF file as binary download.

**Headers:**
- `Content-Type: application/pdf`
- `X-Total-Pages: 9`
- `X-Files-Merged: 4`
- `X-Merge-Order: [0, 2, 1, 3]`

### JavaScript Example

```javascript
async function smartMergePDFs(pdfFiles, order) {
  const formData = new FormData();
  
  // Add all PDF files (same as analyze step)
  pdfFiles.forEach(file => {
    formData.append('files', file);
  });
  
  formData.append('action', 'smart_merge');
  formData.append('mode', 'merge');
  formData.append('order', JSON.stringify(order)); // e.g. [0, 2, 1, 3]
  
  const response = await fetch('http://localhost:8000/api/ai', {
    method: 'POST',
    body: formData
  });
  
  const blob = await response.blob();
  
  // Download the merged PDF
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'smart_merged.pdf';
  a.click();
  
  // Get merge info from headers
  const totalPages = response.headers.get('X-Total-Pages');
  const filesMerged = response.headers.get('X-Files-Merged');
  
  console.log(`Merged ${filesMerged} files into ${totalPages} pages`);
}
```

---

## 🎨 Complete Frontend Implementation

### React Component Example

```jsx
import React, { useState } from 'react';

const SmartMergePage = () => {
  const [files, setFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Review, 3: Download

  // Step 1: Handle file upload
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
  };

  // Step 2: Analyze files
  const handleAnalyze = async () => {
    if (files.length < 2) {
      alert('Please upload at least 2 PDF files');
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('action', 'smart_merge');
    formData.append('mode', 'analyze');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setAnalysis(data);
      setOrder(data.suggested_order);
      setStep(2);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reorder files (drag and drop)
  const moveFile = (fromIndex, toIndex) => {
    const newOrder = [...order];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    setOrder(newOrder);
  };

  // Step 4: Merge files
  const handleMerge = async () => {
    setLoading(true);

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('action', 'smart_merge');
    formData.append('mode', 'merge');
    formData.append('order', JSON.stringify(order));

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: formData
      });

      const blob = await response.blob();
      
      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smart_merged.pdf';
      a.click();
      
      setStep(3);
    } catch (error) {
      console.error('Merge failed:', error);
      alert('Merge failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="smart-merge-container">
      <h1>Smart Merge PDF</h1>
      
      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="upload-section">
          <h2>Step 1: Upload Your PDFs</h2>
          <input 
            type="file" 
            accept=".pdf" 
            multiple 
            onChange={handleFileUpload}
          />
          <p>{files.length} files selected</p>
          <button onClick={handleAnalyze} disabled={files.length < 2 || loading}>
            {loading ? 'Analyzing...' : 'Analyze Files'}
          </button>
        </div>
      )}

      {/* Step 2: Review & Reorder */}
      {step === 2 && analysis && (
        <div className="review-section">
          <h2>Step 2: AI Analyzes Files</h2>
          
          <div className="ai-reasoning">
            <h3>🤖 AI Suggestion</h3>
            <p>{analysis.reasoning}</p>
          </div>

          <h2>Step 3: Rearrange/Approve</h2>
          <p>Drag to reorder, or use AI's suggested order:</p>
          
          <div className="file-list">
            {order.map((fileIndex, position) => {
              const fileInfo = analysis.file_info[fileIndex];
              return (
                <div key={fileIndex} className="file-item" draggable>
                  <span className="position">{position + 1}</span>
                  <div className="file-info">
                    <strong>{fileInfo.filename}</strong>
                    <span>{fileInfo.page_count} pages</span>
                  </div>
                  <div className="preview">{fileInfo.preview.substring(0, 100)}...</div>
                </div>
              );
            })}
          </div>

          <div className="actions">
            <button onClick={() => setOrder(analysis.suggested_order)}>
              Use AI Order
            </button>
            <button onClick={() => setOrder([...Array(files.length).keys()])}>
              Use Original Order
            </button>
            <button onClick={handleMerge} disabled={loading}>
              {loading ? 'Merging...' : 'Merge PDFs'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Download */}
      {step === 3 && (
        <div className="download-section">
          <h2>✅ Merge Complete!</h2>
          <p>Your merged PDF has been downloaded.</p>
          <button onClick={() => { setStep(1); setFiles([]); setAnalysis(null); }}>
            Merge More Files
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartMergePage;
```

---

## 📊 Understanding the Response

### `suggested_order` Array

The AI suggests the best order using 0-based indices:

```
Files uploaded: [A.pdf, B.pdf, C.pdf, D.pdf]
Indices:        [  0  ,   1  ,   2  ,   3  ]

suggested_order: [0, 2, 1, 3]
Means: A.pdf → C.pdf → B.pdf → D.pdf
```

### `file_info` Array

Contains details about each uploaded file:

| Field | Description |
|-------|-------------|
| `index` | Original upload position (0-based) |
| `filename` | Original filename |
| `page_count` | Number of pages in PDF |
| `file_size_mb` | File size in megabytes |
| `preview` | First 500 characters of extracted text |

### `relationships` Array

Shows how AI sees document connections:

```json
{
  "from": 0,      // Source document index
  "to": 1,        // Target document index
  "relation": "introduces"  // Relationship type
}
```

Common relations: `"introduces"`, `"leads to"`, `"provides context for"`, `"concludes"`

---

## 🔄 User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SMART MERGE FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Upload PDFs                                            │
│  ┌──────────────────────────────────────────────┐               │
│  │  📄 file1.pdf                                │               │
│  │  📄 file2.pdf                                │               │
│  │  📄 file3.pdf                                │               │
│  │  [Upload Your PDF to Smart Merge]            │               │
│  └──────────────────────────────────────────────┘               │
│                          │                                       │
│                          ▼                                       │
│  Step 2: AI Analyzes Files                                      │
│  ┌──────────────────────────────────────────────┐               │
│  │  🤖 "Analyzing content and relationships..." │               │
│  │  POST /api/ai  mode=analyze                  │               │
│  └──────────────────────────────────────────────┘               │
│                          │                                       │
│                          ▼                                       │
│  Step 3: Review & Rearrange                                     │
│  ┌──────────────────────────────────────────────┐               │
│  │  AI suggests: [0, 2, 1]                      │               │
│  │  "File 1 introduces, File 3 provides         │               │
│  │   context, File 2 concludes"                 │               │
│  │                                              │               │
│  │  [1] 📄 file1.pdf  ↕ drag to reorder        │               │
│  │  [2] 📄 file3.pdf  ↕                        │               │
│  │  [3] 📄 file2.pdf  ↕                        │               │
│  │                                              │               │
│  │  [Use AI Order] [Custom Order] [Merge]       │               │
│  └──────────────────────────────────────────────┘               │
│                          │                                       │
│                          ▼                                       │
│  Step 4: Merge Process                                          │
│  ┌──────────────────────────────────────────────┐               │
│  │  POST /api/ai  mode=merge  order=[0,2,1]    │               │
│  │  🔄 Merging documents...                     │               │
│  └──────────────────────────────────────────────┘               │
│                          │                                       │
│                          ▼                                       │
│  Step 5: Download                                               │
│  ┌──────────────────────────────────────────────┐               │
│  │  ✅ smart_merged.pdf                         │               │
│  │  📥 Download (9 pages)                       │               │
│  └──────────────────────────────────────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Important Notes

### File Order Matters

When calling `merge`, upload files in the **same order** as `analyze`:

```javascript
// ✅ Correct - same order
analyze: [A.pdf, B.pdf, C.pdf]
merge:   [A.pdf, B.pdf, C.pdf]  order: [2, 0, 1]

// ❌ Wrong - different order  
analyze: [A.pdf, B.pdf, C.pdf]
merge:   [C.pdf, A.pdf, B.pdf]  // Order indices won't match!
```

### Minimum Files

- Minimum: 2 PDF files
- Maximum: No hard limit (but consider file size)

### Order Parameter Format

Send as JSON string, not array:

```javascript
// ✅ Correct
formData.append('order', JSON.stringify([0, 2, 1, 3]));
formData.append('order', '[0, 2, 1, 3]');

// ❌ Wrong
formData.append('order', [0, 2, 1, 3]);
```

### Error Handling

```javascript
try {
  const response = await fetch('/api/ai', { ... });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Request failed');
  }
  
  // Handle success
} catch (error) {
  console.error('Smart merge error:', error.message);
}
```

---

## 🧪 Testing

### Test with Swagger UI

1. Go to `http://localhost:8000/docs`
2. Find `POST /api/ai`
3. **Analyze:**
   - action: `smart_merge`
   - mode: `analyze`
   - files: Upload 2+ PDFs
4. **Merge:**
   - action: `smart_merge`
   - mode: `merge`
   - order: `[0, 1, 2]` (from suggested_order)
   - files: Same PDFs

### Test Files Available

Pre-made test PDFs in `test_files/`:
- `A_Executive_Summary.pdf` (2 pages)
- `B_Technical_Analysis.pdf` (3 pages)
- `C_Market_Research.pdf` (2 pages)
- `D_Financial_Projections.pdf` (2 pages)

---

## 📝 Summary

| Step | Mode | What Happens | Returns |
|------|------|--------------|---------|
| 1 | `analyze` | AI reads content, suggests order | JSON with suggestions |
| 2 | `merge` | Combines PDFs in specified order | Merged PDF file |

**Frontend responsibilities:**
- Upload UI for multiple PDFs
- Display AI suggestion and reasoning
- Drag-and-drop reordering interface
- Trigger merge and handle download

**Backend handles:**
- Content extraction and analysis
- AI-powered order suggestion
- PDF merging with consistent formatting
