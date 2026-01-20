# Frontend Integration Examples

Complete code examples for integrating BackendPDF API in various frameworks.

---

## 🌐 Base Configuration

```javascript
const API_BASE_URL = 'http://localhost:8000'; // or your Cloudflare tunnel URL
```

---

## ⚛️ React Examples

### 1. PDF Upload & Convert

```jsx
import { useState } from 'react';

function PDFConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleConvert = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('files', file);
    formData.append('action', 'pdf_to_word');
    
    try {
      const response = await fetch('http://localhost:8000/api/convert', {
        method: 'POST',
        body: formData
      });
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.docx';
      a.click();
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? 'Converting...' : 'Convert to Word'}
      </button>
    </div>
  );
}
```

### 2. PDF Chat Interface

```jsx
import { useState, useEffect } from 'react';

function PDFChat() {
  const [file, setFile] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Setup PDF
  const setupChat = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('files', file);
    formData.append('action', 'chat_with_pdf');
    formData.append('mode', 'setup');
    
    try {
      const response = await fetch('http://localhost:8000/api/ai', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setSessionId(data.session_id);
      setMessages([{ type: 'system', text: 'PDF indexed! Ask me anything.' }]);
    } catch (error) {
      console.error('Setup failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Ask question
  const askQuestion = async () => {
    if (!question || !sessionId) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: question }]);
    setLoading(true);
    
    const formData = new FormData();
    formData.append('action', 'chat_with_pdf');
    formData.append('mode', 'query');
    formData.append('session_id', sessionId);
    formData.append('question', question);
    
    try {
      const response = await fetch('http://localhost:8000/api/ai', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: data.answer,
        confidence: data.confidence
      }]);
      
      setQuestion('');
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="pdf-chat">
      {!sessionId ? (
        <div>
          <input 
            type="file" 
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={setupChat} disabled={loading}>
            {loading ? 'Indexing...' : 'Upload & Setup'}
          </button>
        </div>
      ) : (
        <div>
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.type}`}>
                <p>{msg.text}</p>
                {msg.confidence && (
                  <small>{(msg.confidence * 100).toFixed(0)}% confident</small>
                )}
              </div>
            ))}
          </div>
          
          <div className="input-area">
            <input 
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
              placeholder="Ask a question..."
              disabled={loading}
            />
            <button onClick={askQuestion} disabled={loading}>
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 3. AI Summary Generator

```jsx
import { useState } from 'react';

function PDFSummarizer() {
  const [file, setFile] = useState(null);
  const [summaryType, setSummaryType] = useState('both');
  const [loading, setLoading] = useState(false);
  
  const generateSummary = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('files', file);
    formData.append('action', 'summarize');
    formData.append('summary_type', summaryType);
    
    try {
      const response = await fetch('http://localhost:8000/api/ai', {
        method: 'POST',
        body: formData
      });
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = summaryType === 'both' ? 'summaries.zip' : 'summary.pdf';
      a.click();
    } catch (error) {
      console.error('Summary failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      
      <select value={summaryType} onChange={(e) => setSummaryType(e.target.value)}>
        <option value="short">Short Summary</option>
        <option value="detailed">Detailed Summary</option>
        <option value="both">Both</option>
      </select>
      
      <button onClick={generateSummary} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Summary'}
      </button>
    </div>
  );
}
```

---

## 🖼️ Vue 3 Examples

### PDF Merge Component

```vue
<template>
  <div class="pdf-merger">
    <input 
      type="file" 
      multiple 
      accept=".pdf"
      @change="handleFiles"
    />
    
    <ul v-if="files.length">
      <li v-for="(file, i) in files" :key="i">{{ file.name }}</li>
    </ul>
    
    <button @click="mergePDFs" :disabled="loading || files.length < 2">
      {{ loading ? 'Merging...' : 'Merge PDFs' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const files = ref([]);
const loading = ref(false);

const handleFiles = (e) => {
  files.value = Array.from(e.target.files);
};

const mergePDFs = async () => {
  if (files.value.length < 2) return;
  
  loading.value = true;
  const formData = new FormData();
  
  files.value.forEach(file => {
    formData.append('files', file);
  });
  formData.append('action', 'merge_pdf');
  
  try {
    const response = await fetch('http://localhost:8000/api/edit', {
      method: 'POST',
      body: formData
    });
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
  } catch (error) {
    console.error('Merge failed:', error);
  } finally {
    loading.value = false;
  }
};
</script>
```

---

## 🅰️ Angular Example

### PDF Service

```typescript
// pdf.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  convertPDF(file: File, action: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('action', action);

    return this.http.post(`${this.baseUrl}/api/convert`, formData, {
      responseType: 'blob'
    });
  }

  setupChat(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('action', 'chat_with_pdf');
    formData.append('mode', 'setup');

    return this.http.post(`${this.baseUrl}/api/ai`, formData);
  }

  queryChat(sessionId: string, question: string): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'chat_with_pdf');
    formData.append('mode', 'query');
    formData.append('session_id', sessionId);
    formData.append('question', question);

    return this.http.post(`${this.baseUrl}/api/ai`, formData);
  }
}
```

### Component

```typescript
// pdf-chat.component.ts
import { Component } from '@angular/core';
import { PdfService } from './pdf.service';

@Component({
  selector: 'app-pdf-chat',
  template: `
    <div *ngIf="!sessionId">
      <input type="file" (change)="onFileSelect($event)" accept=".pdf">
      <button (click)="setupChat()" [disabled]="!file || loading">
        {{ loading ? 'Indexing...' : 'Setup Chat' }}
      </button>
    </div>

    <div *ngIf="sessionId">
      <div class="messages">
        <div *ngFor="let msg of messages" [class]="msg.type">
          {{ msg.text }}
        </div>
      </div>

      <input 
        [(ngModel)]="question" 
        (keyup.enter)="askQuestion()"
        placeholder="Ask a question..."
      >
      <button (click)="askQuestion()" [disabled]="loading">
        {{ loading ? 'Thinking...' : 'Ask' }}
      </button>
    </div>
  `
})
export class PdfChatComponent {
  file: File | null = null;
  sessionId: string | null = null;
  messages: any[] = [];
  question = '';
  loading = false;

  constructor(private pdfService: PdfService) {}

  onFileSelect(event: any) {
    this.file = event.target.files[0];
  }

  setupChat() {
    if (!this.file) return;

    this.loading = true;
    this.pdfService.setupChat(this.file).subscribe({
      next: (data) => {
        this.sessionId = data.session_id;
        this.messages.push({ type: 'system', text: 'PDF indexed!' });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  askQuestion() {
    if (!this.question || !this.sessionId) return;

    this.messages.push({ type: 'user', text: this.question });
    this.loading = true;

    this.pdfService.queryChat(this.sessionId, this.question).subscribe({
      next: (data) => {
        this.messages.push({ type: 'ai', text: data.answer });
        this.question = '';
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
```

---

## 🍦 Vanilla JavaScript

### Simple Upload & Download

```html
<!DOCTYPE html>
<html>
<head>
  <title>PDF Tools</title>
</head>
<body>
  <input type="file" id="pdfFile" accept=".pdf">
  <button onclick="convertToWord()">Convert to Word</button>
  
  <script>
    async function convertToWord() {
      const fileInput = document.getElementById('pdfFile');
      const file = fileInput.files[0];
      
      if (!file) {
        alert('Please select a PDF file');
        return;
      }
      
      const formData = new FormData();
      formData.append('files', file);
      formData.append('action', 'pdf_to_word');
      
      try {
        const response = await fetch('http://localhost:8000/api/convert', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Conversion failed');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Conversion successful!');
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  </script>
</body>
</html>
```

---

## 🎨 CSS Styling Examples

### Chat Interface Styles

```css
.pdf-chat {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.messages {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  height: 400px;
  overflow-y: auto;
  margin-bottom: 15px;
  background: #f9f9f9;
}

.message {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
}

.message.user {
  background: #007bff;
  color: white;
  margin-left: 20%;
  text-align: right;
}

.message.ai {
  background: white;
  border: 1px solid #ddd;
  margin-right: 20%;
}

.message.system {
  background: #28a745;
  color: white;
  text-align: center;
}

.input-area {
  display: flex;
  gap: 10px;
}

.input-area input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-area button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.input-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

---

## 🔧 Utility Functions

### Download Helper

```javascript
function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

### Error Handler

```javascript
async function handleAPIResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Request failed');
  }
  return response;
}

// Usage
try {
  const response = await fetch('...', { ... });
  await handleAPIResponse(response);
  // Process success
} catch (error) {
  console.error('API Error:', error.message);
  alert(error.message);
}
```

### File Validation

```javascript
function validatePDF(file) {
  if (!file) {
    throw new Error('No file selected');
  }
  
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed');
  }
  
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 50MB');
  }
  
  return true;
}
```

---

## 🚀 Production Considerations

### Environment Configuration

```javascript
// config.js
const config = {
  development: {
    apiBaseUrl: 'http://localhost:8000'
  },
  production: {
    apiBaseUrl: 'https://your-tunnel-url.trycloudflare.com'
  }
};

export const API_BASE_URL = config[process.env.NODE_ENV || 'development'].apiBaseUrl;
```

### Request Interceptor (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 60000 // 60 seconds
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      alert('Session expired or not found. Please upload the PDF again.');
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📱 Mobile/Responsive Considerations

```css
@media (max-width: 768px) {
  .pdf-chat {
    padding: 10px;
  }
  
  .messages {
    height: 300px;
  }
  
  .message.user,
  .message.ai {
    margin-left: 0;
    margin-right: 0;
  }
  
  .input-area {
    flex-direction: column;
  }
  
  .input-area button {
    width: 100%;
  }
}
```

---

## 🧪 Testing

### Jest Test Example

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PDFConverter from './PDFConverter';

global.fetch = jest.fn();

describe('PDFConverter', () => {
  it('should convert PDF to Word', async () => {
    const mockBlob = new Blob(['mock'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    fetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => mockBlob
    });
    
    render(<PDFConverter />);
    
    const file = new File(['mock'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/upload/i);
    fireEvent.change(input, { target: { files: [file] } });
    
    const button = screen.getByText(/convert/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/convert'),
        expect.any(Object)
      );
    });
  });
});
```

---

## 📝 TypeScript Types

```typescript
// types.ts
export interface ChatSetupResponse {
  status: string;
  session_id: string;
  chunk_count: number;
  message: string;
}

export interface ChatQueryResponse {
  question: string;
  answer: string;
  confidence: number;
  relevant_context: string[];
}

export interface Message {
  type: 'user' | 'ai' | 'system';
  text: string;
  confidence?: number;
}

export type SummaryType = 'short' | 'detailed' | 'both';

export type ConvertAction = 
  | 'pdf_to_word'
  | 'word_to_pdf'
  | 'pdf_to_excel'
  | 'excel_to_pdf'
  | 'pdf_to_image'
  | 'image_to_pdf';
```
