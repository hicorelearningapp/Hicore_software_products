# BackendPDF API Documentation

## 📌 Overview

BackendPDF is a comprehensive FastAPI-based PDF manipulation service with AI capabilities. This document provides complete integration details for frontend developers.

---

## 🌐 Base URL

### Local Development
```
http://localhost:8000
```

### Production (via Cloudflare Tunnel)
```
https://selective-critical-alter-structure.trycloudflare.com
```
> ⚠️ **Note**: The Cloudflare tunnel URL changes each time cloudflared restarts. Use the URL provided in the cloudflared terminal output.

---

## 📚 Interactive Documentation

### Swagger UI
```
{BASE_URL}/docs
```
Interactive API documentation with "Try it out" functionality.

### ReDoc
```
{BASE_URL}/redoc
```
Alternative documentation interface.

---

## 🎯 API Endpoints

### 1. **Convert** - `/api/convert`
Convert PDFs to/from various formats.

**Supported Actions:**
- `pdf_to_word` - Convert PDF to DOCX
- `word_to_pdf` - Convert DOCX to PDF
- `pdf_to_excel` - Convert PDF to XLSX
- `excel_to_pdf` - Convert XLSX to PDF
- `pdf_to_image` - Convert PDF to JPG
- `image_to_pdf` - Convert JPG to PDF
- `pdf_to_powerpoint` - Convert PDF to PPTX
- `powerpoint_to_pdf` - Convert PPTX to PDF

### 2. **Edit** - `/api/edit`
Modify PDF documents.

**Supported Actions:**
- `merge_pdf` - Merge multiple PDFs
- `split_pdf` - Split PDF by page ranges
- `rotate_pdf` - Rotate pages
- `add_watermark` - Add text/image watermark
- `compress_pdf` - Reduce file size
- `crop_pdf` - Crop pages
- `delete_pages` - Remove specific pages
- `reorder_pdf` - Rearrange pages
- `extract_pdf` - Extract specific pages
- `add_number_pages` - Add page numbers
- `remove_duplicate_pages` - Remove duplicate pages
- `annotate_pdf` - Add text annotations

### 3. **Organize** - `/api/organize`
Batch operations on multiple PDFs.

**Supported Actions:**
- `batch_convert` - Convert multiple files
- `batch_compress` - Compress multiple PDFs
- `batch_watermark` - Add watermarks to multiple PDFs

### 4. **Password** - `/api/password`
PDF encryption and security.

**Supported Actions:**
- `add_password` - Encrypt PDF with password
- `remove_password` - Decrypt PDF

### 5. **Signature** - `/api/signature`
Digital signatures.

**Supported Actions:**
- `add_signature` - Add signature to PDF

### 6. **AI** - `/api/ai`
AI-powered PDF operations.

**Supported Actions:**
- `summarize` - Generate PDF summaries
- `chat_with_pdf` - Interactive Q&A with PDFs
- `smart_classification` - Classify and separate mixed documents

---

## 🔧 Request Format

All endpoints use **`multipart/form-data`** for file uploads.

### Common Request Structure

```javascript
const formData = new FormData();
formData.append('files', pdfFile);           // File(s)
formData.append('action', 'action_name');    // Action type
// Add action-specific parameters
```

### Response Format

**Success (File Response):**
- Content-Type: `application/pdf` or `application/zip`
- Binary file data

**Success (JSON Response):**
```json
{
  "status": "success",
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "detail": "Error message"
}
```

---

## 📖 Detailed Endpoint Documentation

See individual controller documentation:
- [Convert Controller](./controllers/convert_controller.md)
- [Edit Controller](./controllers/edit_controller.md)
- [Organize Controller](./controllers/organizer_controller.md)
- [Password Controller](./controllers/password_controller.md)
- [Signature Controller](./controllers/signature_controller.md)
- [AI Controller](./controllers/ai_controller.md)

---

## 🔐 CORS Configuration

**Allowed Origins:**
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:4200`
- Custom origins (configurable in `main.py`)

**Allowed Methods:**
- `GET`, `POST`, `PUT`, `DELETE`

**Allowed Headers:**
- All headers (`*`)

---

## ⚙️ Environment Setup

### Prerequisites
- Python 3.8+
- Ollama (for AI features)
  - `ollama pull gemma3:4b`
  - `ollama pull llama3.2:1b`

### Running the Server

```powershell
# Activate virtual environment
.venv\Scripts\Activate.ps1

# Start server
python main.py
```

Server runs on: `http://localhost:8000`

### Creating Public Tunnel (Optional)

```powershell
.\cloudflared-windows-386.exe tunnel --url http://localhost:8000
```

---

## 📊 Session Management

### Session IDs
- Automatically generated for each request
- Used to organize files in `uploads/` and `output/` folders
- Files are auto-cleaned after 5 minutes (300 seconds)

### File Locations
```
uploads/{session_id}/     - Input files
output/{session_id}/      - Output files
temp_uploads/{session_id}/ - Temporary uploads
```

---

## 🧪 Testing Examples

See [FRONTEND_EXAMPLES.md](./FRONTEND_EXAMPLES.md) for complete integration examples in:
- React
- Vue
- Angular
- Vanilla JavaScript

---

## 🚨 Error Handling

### Common Error Codes

| Code | Meaning | Cause |
|------|---------|-------|
| 400 | Bad Request | Missing/invalid parameters |
| 404 | Not Found | Session/file not found |
| 422 | Unprocessable Entity | Invalid file type |
| 500 | Internal Server Error | Server-side error |

### Error Response Example
```json
{
  "detail": "Invalid file type: test.txt. Only PDF supported."
}
```

---

## 📝 Notes

1. **File Size Limits**: Check server configuration for max upload size
2. **Timeout**: Long operations (AI summarization) may take 30-60 seconds
3. **Concurrent Requests**: Supported via async FastAPI
4. **Rate Limiting**: Not implemented (add if needed)

---

## 🆘 Support

For issues or questions:
- Check server logs in `logs.txt`
- Review Swagger UI documentation at `/docs`
- Ensure all dependencies are installed from `requirements.txt`
