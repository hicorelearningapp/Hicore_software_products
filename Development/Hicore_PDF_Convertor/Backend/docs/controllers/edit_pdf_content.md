# Edit PDF Content - Frontend Integration Guide

## Endpoint: `/api/edit`

**Action:** `edit_pdf_content`

This is a **backend-heavy** feature. The backend handles all PDF text extraction, manipulation, and image insertion. The frontend only needs to collect user edits and send them to the backend.

---

## 🎯 Three Operations

### 1. Extract Text (Get Editable Content)
### 2. Edit Text (Add/Edit/Delete Text)
### 3. Insert Images (Add Images to PDF)

---

## 📖 Operation 1: Extract Text

**Purpose:** Get all text from PDF with positions, fonts, sizes - so frontend can display it as editable.

### Request

**Method:** `POST`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | File | ✅ Yes | PDF file to extract text from |
| `action` | String | ✅ Yes | Must be `"edit_pdf_content"` |
| `operation` | String | ✅ Yes | Must be `"extract_text"` |

### Response

**Content-Type:** `application/json`

```json
{
  "pages": [
    {
      "page_number": 1,
      "width": 612,
      "height": 792,
      "text_blocks": [
        {
          "text": "Hello World",
          "bbox": [100, 100, 200, 120],
          "font": "Helvetica",
          "size": 12,
          "color": 0,
          "flags": 0
        },
        ...
      ]
    }
  ],
  "total_pages": 1
}
```

**Response Fields:**
- `bbox`: `[x0, y0, x1, y1]` - Position of text (coordinates from bottom-left)
- `font`: Font name
- `size`: Font size in points
- `color`: Color code (0 = black)
- `flags`: Font style flags (bold, italic, etc.)

### JavaScript Example

```javascript
async function extractTextFromPDF(pdfFile) {
  const formData = new FormData();
  formData.append('files', pdfFile);
  formData.append('action', 'edit_pdf_content');
  formData.append('operation', 'extract_text');
  
  const response = await fetch('http://localhost:8000/api/edit', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  
  // Display text blocks as editable elements
  data.pages.forEach(page => {
    page.text_blocks.forEach(block => {
      // Create editable text element at position bbox
      console.log(`Text: "${block.text}" at [${block.bbox}]`);
    });
  });
  
  return data;
}
```

---

## ✏️ Operation 2: Edit Text

**Purpose:** Add new text, edit existing text, or delete text from PDF.

### Request

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | File | ✅ Yes | PDF file to edit |
| `action` | String | ✅ Yes | Must be `"edit_pdf_content"` |
| `operation` | String | ✅ Yes | Must be `"edit_text"` |
| `edits` | JSON String | ✅ Yes | Array of edit operations (see below) |

### Edits Format

Send as JSON string in the `edits` parameter:

```javascript
[
  {
    "page": 1,                           // Page number (1-indexed)
    "action": "add",                     // "add" | "edit" | "delete"
    "new_text": "Hello World",           // Text to add/edit
    "position": [100, 100],              // [x, y] coordinates
    "font": "helv",                      // Font name
    "size": 12,                          // Font size
    "color": [0, 0, 0]                   // RGB (0-1 scale)
  }
]
```

**Actions:**

#### 1. Add New Text
```json
{
  "page": 1,
  "action": "add",
  "new_text": "New text to add",
  "position": [100, 200],
  "font": "helv",
  "size": 14,
  "color": [1, 0, 0]  // Red
}
```

#### 2. Edit Existing Text
```json
{
  "page": 1,
  "action": "edit",
  "bbox": [100, 100, 200, 120],  // Old text location (from extract)
  "new_text": "Updated text",
  "position": [100, 100],        // Optional: new position
  "font": "helv",
  "size": 12,
  "color": [0, 0, 0]
}
```

#### 3. Delete Text
```json
{
  "page": 1,
  "action": "delete",
  "bbox": [100, 100, 200, 120]  // Text location to delete
}
```

### Response

Returns the edited PDF file.

### JavaScript Example

```javascript
async function editPDFText(pdfFile, edits) {
  const formData = new FormData();
  formData.append('files', pdfFile);
  formData.append('action', 'edit_pdf_content');
  formData.append('operation', 'edit_text');
  formData.append('edits', JSON.stringify(edits));
  
  const response = await fetch('http://localhost:8000/api/edit', {
    method: 'POST',
    body: formData
  });
  
  const blob = await response.blob();
  
  // Download edited PDF
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'edited.pdf';
  a.click();
}

// Usage example
const edits = [
  {
    page: 1,
    action: "add",
    new_text: "DRAFT",
    position: [250, 700],
    font: "helv",
    size: 48,
    color: [1, 0, 0]  // Red
  },
  {
    page: 1,
    action: "edit",
    bbox: [100, 100, 200, 120],
    new_text: "Updated content",
    position: [100, 100],
    font: "helv",
    size: 12,
    color: [0, 0, 0]
  }
];

await editPDFText(myPdfFile, edits);
```

---

## 🖼️ Operation 3: Insert Images

**Purpose:** Add images to PDF at specific positions.

### Request

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | File(s) | ✅ Yes | PDF file (first) + image files |
| `action` | String | ✅ Yes | Must be `"edit_pdf_content"` |
| `operation` | String | ✅ Yes | Must be `"insert_images"` |
| `images` | JSON String | ✅ Yes | Array of image operations (see below) |

### Images Format

```javascript
[
  {
    "page": 1,                          // Page number
    "image_path": "temp_image.png",     // Filename of uploaded image
    "rect": [100, 100, 300, 300],       // [x0, y0, x1, y1] position & size
    "rotate": 0,                        // Rotation in degrees
    "overlay": true                     // true = on top, false = behind
  }
]
```

### Response

Returns the PDF with images inserted.

### JavaScript Example

```javascript
async function insertImagesIntoPDF(pdfFile, imageFile, imageConfig) {
  const formData = new FormData();
  formData.append('files', pdfFile);
  formData.append('files', imageFile);  // Upload image
  
  formData.append('action', 'edit_pdf_content');
  formData.append('operation', 'insert_images');
  
  // Backend will save image with its original filename
  const images = [{
    page: imageConfig.page,
    image_path: imageFile.name,  // Use uploaded filename
    rect: imageConfig.rect,
    rotate: imageConfig.rotate || 0,
    overlay: imageConfig.overlay !== false
  }];
  
  formData.append('images', JSON.stringify(images));
  
  const response = await fetch('http://localhost:8000/api/edit', {
    method: 'POST',
    body: formData
  });
  
  const blob = await response.blob();
  
  // Download PDF with image
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'with_image.pdf';
  a.click();
}

// Usage
await insertImagesIntoPDF(
  myPdfFile,
  logoImage,
  {
    page: 1,
    rect: [50, 700, 150, 750],  // Top-left corner, 100x50px
    rotate: 0,
    overlay: true
  }
);
```

---

## 🎨 Frontend Implementation Guide

### Backend-Heavy Approach (Recommended)

**What Backend Does:**
- ✅ Extracts all text with positions
- ✅ Edits/adds/deletes text in PDF
- ✅ Inserts images into PDF
- ✅ Handles all PDF manipulation

**What Frontend Does:**
- Display PDF pages (use `PDF.js` or `<iframe>`)
- Overlay transparent editing layer on PDF
- Let user click to edit text or add images
- Collect all edits in an array
- Send edits to backend when "Apply" clicked

### Step-by-Step Frontend Flow

#### Step 1: Display PDF + Extract Text

```javascript
// 1. Display PDF
<iframe src={pdfUrl} width="100%" height="600px" />

// 2. Extract text for editing
const textData = await extractTextFromPDF(pdfFile);

// 3. Overlay editable text boxes at positions from textData
textData.pages[0].text_blocks.forEach(block => {
  const [x0, y0, x1, y1] = block.bbox;
  // Create contentEditable div at position (x0, y0)
  // with text = block.text
});
```

#### Step 2: Track User Edits

```javascript
const userEdits = [];

function onTextEdit(blockIndex, newText, bbox) {
  userEdits.push({
    page: 1,
    action: "edit",
    bbox: bbox,
    new_text: newText,
    position: [bbox[0], bbox[1]],
    font: "helv",
    size: 12,
    color: [0, 0, 0]
  });
}

function onTextAdd(x, y, text) {
  userEdits.push({
    page: 1,
    action: "add",
    new_text: text,
    position: [x, y],
    font: "helv",
    size: 12,
    color: [0, 0, 0]
  });
}

function onTextDelete(bbox) {
  userEdits.push({
    page: 1,
    action: "delete",
    bbox: bbox
  });
}
```

#### Step 3: Apply Edits

```javascript
async function applyEdits() {
  if (userEdits.length === 0) {
    alert("No edits to apply");
    return;
  }
  
  const editedPDF = await editPDFText(originalPdfFile, userEdits);
  
  // Show success message
  alert("PDF updated successfully!");
  
  // Clear edits
  userEdits = [];
}
```

---

## 📐 Coordinate System

**Important:** PDF coordinates start from **bottom-left** corner!

```
PDF Coordinate System:
┌─────────────────────┐ (612, 792) - Top Right
│                     │
│   (100, 500)        │
│      ▪               │
│                     │
│                     │
└─────────────────────┘
(0, 0) - Bottom Left
```

**For standard US Letter:**
- Width: 612 points
- Height: 792 points
- 1 point = 1/72 inch

**Conversion for canvas/DOM coordinates:**
```javascript
// If your canvas uses top-left origin, convert:
function toCanvasY(pdfY, pageHeight) {
  return pageHeight - pdfY;
}

function toPDFY(canvasY, pageHeight) {
  return pageHeight - canvasY;
}
```

---

## 🎯 Complete Example: PDF Text Editor

```javascript
class PDFTextEditor {
  constructor(pdfFile) {
    this.pdfFile = pdfFile;
    this.extractedText = null;
    this.edits = [];
  }
  
  async loadPDF() {
    // Extract text from PDF
    this.extractedText = await extractTextFromPDF(this.pdfFile);
    return this.extractedText;
  }
  
  addTextEdit(page, action, options) {
    this.edits.push({
      page,
      action,
      ...options
    });
  }
  
  async applyEdits() {
    const formData = new FormData();
    formData.append('files', this.pdfFile);
    formData.append('action', 'edit_pdf_content');
    formData.append('operation', 'edit_text');
    formData.append('edits', JSON.stringify(this.edits));
    
    const response = await fetch('http://localhost:8000/api/edit', {
      method: 'POST',
      body: formData
    });
    
    return await response.blob();
  }
}

// Usage
const editor = new PDFTextEditor(myPdfFile);

// Load and display
const textData = await editor.loadPDF();
console.log(`Loaded ${textData.total_pages} pages`);

// User makes edits
editor.addTextEdit(1, "add", {
  new_text: "Confidential",
  position: [300, 750],
  font: "helv",
  size: 18,
  color: [1, 0, 0]
});

editor.addTextEdit(1, "edit", {
  bbox: [100, 100, 200, 120],
  new_text: "Updated text",
  font: "helv",
  size: 12,
  color: [0, 0, 0]
});

// Apply all edits
const editedPDF = await editor.applyEdits();

// Download
const url = URL.createObjectURL(editedPDF);
const a = document.createElement('a');
a.href = url;
a.download = 'edited.pdf';
a.click();
```

---

## 🔧 Font Names Reference

Use these font names in the `font` parameter:

| Font Name | Description |
|-----------|-------------|
| `"helv"` | Helvetica (default) |
| `"times"` | Times Roman |
| `"courier"` | Courier |
| `"helv-bold"` | Helvetica Bold |
| `"times-bold"` | Times Bold |
| `"courier-bold"` | Courier Bold |

---

## 🎨 Color Format

Colors use RGB values from **0 to 1** (not 0-255):

```javascript
// Examples
[0, 0, 0]        // Black
[1, 1, 1]        // White
[1, 0, 0]        // Red
[0, 1, 0]        // Green
[0, 0, 1]        // Blue
[0.5, 0.5, 0.5]  // Gray
[1, 0.5, 0]      // Orange

// Convert from 0-255 to 0-1
function rgbToColor(r, g, b) {
  return [r/255, g/255, b/255];
}
```

---

## ⚠️ Important Notes

1. **File Upload for Images:**
   - Upload PDF first, then image files
   - Use image filename in `image_path` parameter
   - Backend will find uploaded image by filename

2. **Coordinate System:**
   - PDF uses bottom-left origin
   - Convert if your canvas uses top-left

3. **Text Editing Limitation:**
   - Editing replaces old text with white box + new text
   - Not true "in-place" editing
   - Best for adding/replacing small text blocks

4. **Performance:**
   - Extract text once, cache the result
   - Batch all edits, apply once
   - Don't extract text for every edit

5. **Session Management:**
   - Each edit operation is independent
   - No session tracking needed
   - Each request returns a new PDF

---

## 🧪 Testing

### Test Extract Text
```javascript
const data = await extractTextFromPDF(testPDF);
console.log(`Pages: ${data.total_pages}`);
console.log(`First block: ${data.pages[0].text_blocks[0].text}`);
```

### Test Edit Text
```javascript
const edits = [{
  page: 1,
  action: "add",
  new_text: "TEST",
  position: [100, 100],
  font: "helv",
  size: 24,
  color: [1, 0, 0]
}];
await editPDFText(testPDF, edits);
```

### Test Insert Image
```javascript
await insertImagesIntoPDF(
  testPDF,
  logoImage,
  { page: 1, rect: [50, 50, 150, 150] }
);
```

---

## 🆘 Common Issues

**Issue:** Text appears in wrong position
- **Solution:** Check coordinate conversion (bottom-left vs top-left)

**Issue:** Image not found
- **Solution:** Ensure image is uploaded with PDF, use correct filename

**Issue:** Font looks different
- **Solution:** PDF has limited fonts, stick to `helv`, `times`, `courier`

**Issue:** Color not working
- **Solution:** Use 0-1 scale, not 0-255

---

## 📝 Summary

**Backend handles:**
- ✅ All PDF parsing and manipulation
- ✅ Text extraction with positions
- ✅ Text editing (add/edit/delete)
- ✅ Image insertion

**Frontend handles:**
- 📱 Display PDF to user
- 🖱️ Collect user edits (clicks, drags, typing)
- 📤 Send edits to backend
- 📥 Receive and display edited PDF

This is a **backend-heavy** architecture - the frontend is just a UI for collecting edit operations!
