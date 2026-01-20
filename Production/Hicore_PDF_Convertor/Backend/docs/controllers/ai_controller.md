# AI Controller Documentation

## Endpoint: `/api/ai`

AI-powered PDF operations using Ollama language models.

---

## 🤖 Available Actions

### 1. Summarize
### 2. Chat with PDF (Q&A)
### 3. Smart Classification (TODO)

---

## 📝 Action 1: Summarize

Generate AI summaries of PDF documents.

### Request

**Method:** `POST`

**Content-Type:** `multipart/form-data`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | File | ✅ Yes | PDF file(s) to summarize |
| `action` | String | ✅ Yes | Must be `"summarize"` |
| `summary_type` | String | ❌ No | `"short"`, `"detailed"`, or `"both"` (default: `"both"`) |

### Response

**Single Summary Type:**
- Content-Type: `application/pdf`
- Returns: PDF file with summary

**Both Summary Types:**
- Content-Type: `application/zip`
- Returns: ZIP containing both PDFs

### JavaScript Example

```javascript
async function summarizePDF(file, summaryType = 'both') {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('action', 'summarize');
  formData.append('summary_type', summaryType);
  
  const response = await fetch('http://localhost:8000/api/ai', {
    method: 'POST',
    body: formData
  });
  
  if (summaryType === 'both') {
    const blob = await response.blob();
    // Download ZIP file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summaries.zip';
    a.click();
  } else {
    const blob = await response.blob();
    // Download single PDF
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.pdf';
    a.click();
  }
}
```

---

## 💬 Action 2: Chat with PDF

Interactive Q&A system with semantic search and conversation memory.

### 🔹 Step 1: Setup (Index the PDF)

**Must be called FIRST** to prepare the PDF for querying.

#### Request

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | File | ✅ Yes | PDF file to chat with |
| `action` | String | ✅ Yes | Must be `"chat_with_pdf"` |
| `mode` | String | ✅ Yes | Must be `"setup"` |

#### Response

```json
{
  "status": "ready",
  "session_id": "17c352d0-1bb6-434a-947d-e8f666ca3d3a",
  "chunk_count": 42,
  "message": "PDF indexed successfully. You can now ask questions using query mode."
}
```

**⚠️ IMPORTANT:** Save the `session_id` - you'll need it for queries!

#### JavaScript Example

```javascript
async function setupChatPDF(file) {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('action', 'chat_with_pdf');
  formData.append('mode', 'setup');
  
  const response = await fetch('http://localhost:8000/api/ai', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log('Session ID:', data.session_id);
  
  // Store session_id for later queries
  return data.session_id;
}
```

---

### 🔹 Step 2: Query (Ask Questions)

**Must call setup first!** Uses the session_id from setup.

#### Request

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | File | ❌ No | Not used (can upload any file or leave empty) |
| `action` | String | ✅ Yes | Must be `"chat_with_pdf"` |
| `mode` | String | ✅ Yes | Must be `"query"` |
| `session_id` | String | ✅ Yes | Session ID from setup response |
| `question` | String | ✅ Yes | Your question about the PDF |

#### Response

```json
{
  "question": "Who is Yogeshwar Raja?",
  "answer": "Yogeshwar Raja is an AI-Driven Data Analyst and Data Scientist based in Bengaluru. He currently works at Mu Sigma as a Decision Scientist (July 2024 - August 2025), where he manages and analyzes large-scale healthcare datasets...",
  "confidence": 0.8567,
  "relevant_context": [
    "Text chunk 1 from PDF...",
    "Text chunk 2 from PDF...",
    "Text chunk 3 from PDF..."
  ]
}
```

**Response Fields:**
- `question`: Echo of your question
- `answer`: **Main response** - display this to the user
- `confidence`: Confidence score (0-1) - higher is better
- `relevant_context`: Source text chunks used (optional - for showing sources)

#### JavaScript Example

```javascript
async function queryPDF(sessionId, question) {
  const formData = new FormData();
  formData.append('action', 'chat_with_pdf');
  formData.append('mode', 'query');
  formData.append('session_id', sessionId);
  formData.append('question', question);
  
  const response = await fetch('http://localhost:8000/api/ai', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  
  // Display answer to user
  console.log('Answer:', data.answer);
  console.log('Confidence:', (data.confidence * 100).toFixed(0) + '%');
  
  return data;
}
```

---

### 🗣️ Conversation Memory

The chat system **remembers previous questions** in the same session!

#### Example Conversation Flow:

```javascript
// Setup
const sessionId = await setupChatPDF(resumeFile);

// First question
const q1 = await queryPDF(sessionId, "Who is this person?");
// Answer: "This is Yogeshwar Raja, a Data Scientist..."

// Follow-up question (uses "his" - remembers context!)
const q2 = await queryPDF(sessionId, "What are his skills?");
// Answer: "Yogeshwar Raja's skills include Python, SQL, SAS..."

// Another follow-up
const q3 = await queryPDF(sessionId, "What job roles can he apply for?");
// Answer: "Based on Yogeshwar Raja's experience..."
```

**Memory Details:**
- Stores last **5 Q&A pairs**
- Understands pronouns (he, she, it, they)
- Maintains context across questions
- Memory persists until session expires (30 minutes)

---

### 🎯 Complete Chat Integration Example

```javascript
class PDFChatClient {
  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    this.sessionId = null;
  }
  
  async setupChat(pdfFile) {
    const formData = new FormData();
    formData.append('files', pdfFile);
    formData.append('action', 'chat_with_pdf');
    formData.append('mode', 'setup');
    
    const response = await fetch(`${this.baseUrl}/api/ai`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    this.sessionId = data.session_id;
    return data;
  }
  
  async askQuestion(question) {
    if (!this.sessionId) {
      throw new Error('Must call setupChat() first!');
    }
    
    const formData = new FormData();
    formData.append('action', 'chat_with_pdf');
    formData.append('mode', 'query');
    formData.append('session_id', this.sessionId);
    formData.append('question', question);
    
    const response = await fetch(`${this.baseUrl}/api/ai`, {
      method: 'POST',
      body: formData
    });
    
    return await response.json();
  }
}

// Usage
const chat = new PDFChatClient();
await chat.setupChat(myPDFFile);

const answer1 = await chat.askQuestion("What is this document about?");
console.log(answer1.answer);

const answer2 = await chat.askQuestion("Can you summarize the key points?");
console.log(answer2.answer);
```

---

## 🏷️ Action 3: Smart Classification

**Status:** ⚠️ **Placeholder only** - not fully implemented.

Classify and separate mixed document types (invoices, resumes, contracts, etc.).

### Request

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | File | ✅ Yes | PDF containing mixed documents |
| `action` | String | ✅ Yes | Must be `"smart_classification"` |

### Response (When Implemented)

- Content-Type: `application/zip`
- Returns: ZIP with separated PDFs by document type
  - `invoices.pdf`
  - `resumes.pdf`
  - `contracts.pdf`
  - etc.

---

## ⚙️ AI Configuration

### Models Used

| Purpose | Model | Size | Speed | Quality |
|---------|-------|------|-------|---------|
| Main (Summarize, Chat) | `gemma3:4b` | 3.3 GB | Medium | High |
| Fast (Classification) | `llama3.2:1b` | 1.3 GB | Fast | Medium |

### Requirements

**Ollama must be running:**
```powershell
ollama serve
```

**Models must be pulled:**
```powershell
ollama pull gemma3:4b
ollama pull llama3.2:1b
```

### Timeout Settings
- Summary: 60 seconds per request
- Chat query: 60 seconds per request
- Session expiry: 30 minutes

---

## 🔍 Technical Details

### Chat Implementation
- **Embeddings:** `all-MiniLM-L6-v2` (SentenceTransformer)
- **Vector Search:** FAISS (IndexFlatL2)
- **Chunk Size:** 1500 characters
- **Retrieved Chunks:** Top 3 most relevant
- **Conversation History:** Last 5 Q&A pairs

### File Storage
```
output/{session_id}/
  ├── filename_chat_session.pkl      (session data + history)
  └── filename_chat_session_faiss.index  (vector index)
```

---

## 🚨 Error Handling

### Common Errors

**400 Bad Request**
```json
{
  "detail": "session_id required for query mode"
}
```
→ You forgot to include session_id in query

**404 Not Found**
```json
{
  "detail": "Session not found: abc123. Run setup first."
}
```
→ Invalid session_id or session expired

**500 Internal Server Error**
```json
{
  "detail": "Query failed: memory layout cannot be allocated"
}
```
→ Ollama model out of memory (switch to smaller model)

---

## 💡 Best Practices

1. **Always call setup before query**
2. **Store session_id securely** (not in URL)
3. **Handle session expiry** (30 min timeout)
4. **Show loading states** (queries can take 5-15 seconds)
5. **Display confidence scores** to users
6. **Optionally show sources** (relevant_context)
7. **Implement retry logic** for network errors

---

## 📱 UI/UX Recommendations

### For Chat Interface:
- Show "Indexing PDF..." during setup
- Display typing indicator during query
- Show confidence as stars or percentage
- Allow users to see source chunks (expandable)
- Implement chat history UI (past Q&A)
- Add "Clear conversation" button (starts new session)

### Example UI Elements:
```
┌─────────────────────────────────────┐
│ PDF Chat - resume.pdf               │
├─────────────────────────────────────┤
│ You: Who is this person?            │
│                                     │
│ AI: Yogeshwar Raja is a Data        │
│     Scientist working at Mu Sigma...│
│     ⭐⭐⭐⭐☆ (85% confident)        │
│     [View Sources]                  │
├─────────────────────────────────────┤
│ You: What are his skills?           │
│                                     │
│ AI: [Typing...]                     │
└─────────────────────────────────────┘
```

---

## 🧪 Testing

### Test Setup
```javascript
const testFile = new File(['...'], 'test.pdf', { type: 'application/pdf' });
const sessionId = await setupChatPDF(testFile);
console.assert(sessionId, 'Should return session_id');
```

### Test Query
```javascript
const result = await queryPDF(sessionId, 'Test question?');
console.assert(result.answer, 'Should return answer');
console.assert(result.confidence >= 0 && result.confidence <= 1, 'Valid confidence');
```

### Test Conversation Memory
```javascript
await queryPDF(sessionId, "Who is John?");
const result = await queryPDF(sessionId, "What is his email?");
// Should understand "his" refers to John
```
