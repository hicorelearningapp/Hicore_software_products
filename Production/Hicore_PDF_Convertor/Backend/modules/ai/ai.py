import os
import logging
import time
import pdfplumber
import fitz
import pytesseract
# import faiss # Moved to lazy load
import numpy as np
import pickle
import requests
import json
from abc import ABC, abstractmethod
from PIL import Image
# from sentence_transformers import SentenceTransformer # Moved to lazy load
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_JUSTIFY
from PyPDF2 import PdfReader, PdfWriter


# ============================================================
# 1️⃣ Base AI Operation Interface
# ============================================================
class AIOperationBase(ABC):
    """Base class for all AI operations (like ConverterBase)"""
    
    @abstractmethod
    def Process(self, input_file: str, output_file: str, **kwargs) -> dict:
        """
        Process AI operation on input file(s).
        
        Args:
            input_file: Path to input file (can be str or list)
            output_file: Path to output file
            **kwargs: Operation-specific parameters
            
        Returns:
            dict with operation results
        """
        pass


# ============================================================
# 2️⃣ Ollama Configuration
# ============================================================
class OllamaConfig:
    """Centralized Ollama configuration"""
    OLLAMA_URL = "http://localhost:11434/api/generate"  # Use generate endpoint (faster)
    OLLAMA_CHAT_URL = "http://localhost:11434/api/chat"
    OLLAMA_MODEL = "llama3.2:1b"  # Temporarily using smaller model (~2GB RAM)
    OLLAMA_FAST_MODEL = "llama3.2:1b"  # Fast model for classification
    TIMEOUT = 60  # 60 seconds per request for summarization
    RETRIES = 1
    CLASSIFICATION_TEMPERATURE = 0.0


# ============================================================
# 3️⃣ Shared Utilities
# ============================================================
class PDFTextExtractor:
    """Extracts text from PDF using pdfplumber + OCR fallback"""
    
    @staticmethod
    def extract_text(file_path: str) -> str:
        """Extract text from PDF with OCR fallback for scanned pages"""
        text_parts = []
        
        try:
            # Try pdfplumber first (fast)
            with pdfplumber.open(file_path) as pdf:
                for page_number, page in enumerate(pdf.pages):
                    txt = page.extract_text()
                    
                    if txt and txt.strip():
                        text_parts.append(txt.strip())
                    else:
                        # Fallback to OCR for scanned pages
                        logging.info(f"📷 Page {page_number + 1} appears scanned, using OCR...")
                        try:
                            doc = fitz.open(file_path)
                            pix = doc[page_number].get_pixmap()
                            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                            ocr_text = pytesseract.image_to_string(img)
                            text_parts.append(ocr_text.strip())
                            doc.close()
                        except pytesseract.TesseractNotFoundError:
                            logging.warning("⚠️ Tesseract not found. Skipping OCR for this page.")
                            # Continue without this page's text
                        except Exception as ocr_err:
                            logging.error(f"❌ OCR failed for page {page_number}: {ocr_err}")
                            # Continue without this page's text
            
            full_text = "\n\n".join(text_parts)
            if not full_text.strip():
                 raise ValueError("Could not extract any text from the PDF. It might be scanned and Tesseract is missing.")
                 
            logging.info(f"✅ Extracted {len(full_text)} characters from PDF")
            return full_text
            
        except Exception as e:
            logging.error(f"❌ PDF text extraction failed: {e}")
            raise
    
    @staticmethod
    def chunk_text(text: str, chunk_size: int = 2000) -> list:
        """Split text into chunks for processing"""
        if not text:
            return []
        chunks = []
        for i in range(0, len(text), chunk_size):
            chunks.append(text[i:i+chunk_size])
        return chunks


class OllamaClient:
    """Shared Ollama client for local LLM inference"""
    
    def __init__(self):
        self.url = OllamaConfig.OLLAMA_URL
        self.chat_url = OllamaConfig.OLLAMA_CHAT_URL
        self.model = OllamaConfig.OLLAMA_MODEL
        self.fast_model = OllamaConfig.OLLAMA_FAST_MODEL
        self.timeout = OllamaConfig.TIMEOUT
        self.retries = OllamaConfig.RETRIES
        logging.info(f"✅ Ollama client initialized (Model: {self.model}, Fast: {self.fast_model})")
    
    def call_ollama_fast(self, prompt: str, temperature: float = 0.0) -> str:
        """
        Fast Ollama call using /api/generate endpoint with FAST model.
        Best for simple classification tasks.
        """
        try:
            response = requests.post(
                self.url,
                json={
                    "model": self.fast_model,  # Use fast model
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": 30,  # Very short output
                    }
                },
                timeout=self.timeout
            )
            
            if response.status_code != 200:
                logging.error(f"❌ Ollama status {response.status_code}")
                return ""
            
            data = response.json()
            return data.get("response", "").strip()
            
        except Exception as e:
            logging.error(f"❌ Ollama fast call failed: {e}")
            return ""
    
    def call_ollama(self, system_prompt: str, user_prompt: str, temperature: float = 0.7) -> str:
        """Call Ollama with system and user prompts, handling NDJSON streaming"""
        for attempt in range(1, self.retries + 1):
            try:
                response = requests.post(
                    self.chat_url,
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "options": {
                            "temperature": temperature,
                            "num_ctx": 2048  # Reduce context window to save ~900MB RAM
                        }
                    },
                    stream=True,
                    timeout=self.timeout
                )
                
                if response.status_code != 200:
                    logging.error(f"❌ Ollama status {response.status_code}: {response.text}")
                    continue
                
                collected = []
                
                # Ollama returns NDJSON - read line by line
                for line in response.iter_lines(decode_unicode=True):
                    if not line:
                        continue
                    try:
                        data = json.loads(line)
                    except:
                        continue
                    
                    # Extract content from various response formats
                    if "message" in data and "content" in data["message"]:
                        collected.append(data["message"]["content"])
                    elif "content" in data:
                        collected.append(data["content"])
                    elif "choices" in data:
                        for c in data["choices"]:
                            if "message" in c and "content" in c["message"]:
                                collected.append(c["message"]["content"])
                            elif "text" in c:
                                collected.append(c["text"])
                
                final_text = "".join(collected).strip()
                return final_text
                
            except Exception as e:
                logging.error(f"❌ Ollama attempt {attempt} failed: {e}")
                if attempt < self.retries:
                    logging.info(f"🔄 Retrying... ({attempt}/{self.retries})")
                continue
        
        return "⚠️ Failed to generate response after retries."


# ============================================================
# 4️⃣ AI Operation 1: PDF Summarization
# ============================================================
class PDFSummarizer(AIOperationBase):
    """Summarize PDF documents using Ollama"""
    
    def __init__(self):
        self.ollama_client = OllamaClient()
        self.extractor = PDFTextExtractor()
    
    def Process(self, input_file: str, output_file: str, **kwargs) -> dict:
        """
        Summarize single or multiple PDFs
        
        Args:
            input_file: PDF path or list of PDF paths
            output_file: Path to output summary PDF
            summary_type: "short" or "detailed" (default: "short")
        
        Returns:
            dict: {"text": summary_text, "pdf": output_pdf_path, "individual_summaries": [...] if multiple}
        """
        summary_type = kwargs.get("summary_type", "short")
        
        # Handle multiple PDFs
        if isinstance(input_file, list):
            return self._summarize_multiple(input_file, output_file, summary_type)
        else:
            return self._summarize_single(input_file, output_file, summary_type)
    
    def _summarize_single(self, input_file: str, output_file: str, summary_type: str) -> dict:
        """Summarize a single PDF"""
        try:
            logging.info(f"🚀 Starting {summary_type} summarization for {input_file}")
            
            # Extract text
            extracted_text = self.extractor.extract_text(input_file)
            
            if not extracted_text or len(extracted_text) < 50:
                raise ValueError("⚠️ Insufficient text extracted from PDF")
            
            # Generate summary
            if summary_type == "short":
                system_prompt = "You are a professional document summarizer. Provide concise, accurate summaries."
                user_prompt = f"""Summarize the following document in 3-5 clear sentences. Focus on the main points and key takeaways:

{extracted_text[:8000]}"""
            else:  # detailed
                system_prompt = "You are an expert document analyst. Provide comprehensive, detailed summaries."
                user_prompt = f"""Provide a comprehensive detailed summary of the following document. Include all major sections, key concepts, important details, and conclusions:

{extracted_text[:8000]}"""
            
            logging.info(f"🤖 Generating {summary_type} summary via Ollama...")
            summary_text = self.ollama_client.call_ollama(system_prompt, user_prompt)
            
            # Create summary PDF
            self._create_summary_pdf(summary_text, output_file, os.path.basename(input_file))
            
            result = {
                "text": summary_text,
                "pdf": output_file
            }
            
            logging.info(f"✅ Summarization complete!")
            return result
            
        except Exception as e:
            logging.error(f"❌ Summarization failed: {e}", exc_info=True)
            raise
    
    def _summarize_multiple(self, input_files: list, output_file: str, summary_type: str) -> dict:
        """Summarize multiple PDFs into one combined summary"""
        try:
            logging.info(f"📚 Starting batch summarization of {len(input_files)} PDFs")
            
            individual_summaries = []
            all_texts = []
            
            # Process each PDF
            for idx, pdf_file in enumerate(input_files, 1):
                logging.info(f"📄 Processing PDF {idx}/{len(input_files)}: {os.path.basename(pdf_file)}")
                
                text = self.extractor.extract_text(pdf_file)
                all_texts.append(f"=== Document {idx}: {os.path.basename(pdf_file)} ===\n\n{text}")
                
                # Individual summary
                temp_output = output_file.replace(".pdf", f"_temp_{idx}.pdf")
                result = self._summarize_single(pdf_file, temp_output, summary_type)
                
                individual_summaries.append({
                    "filename": os.path.basename(pdf_file),
                    "summary": result["text"]
                })
                
                # Cleanup temp file
                if os.path.exists(temp_output):
                    os.remove(temp_output)
            
            # Combined summary
            combined_text = "\n\n".join(all_texts)
            
            if summary_type == "short":
                system_prompt = "You are a document analyst expert at synthesizing information from multiple sources."
                user_prompt = f"""Provide a brief overview summarizing the key points from these {len(input_files)} documents:

{combined_text[:10000]}

Create a concise 5-7 sentence summary highlighting the main themes across all documents."""
            else:
                system_prompt = "You are an expert document analyst skilled at comprehensive multi-document analysis."
                user_prompt = f"""Provide a comprehensive summary of these {len(input_files)} documents:

{combined_text[:10000]}

Structure your response with:
1. Individual document summaries
2. Common themes
3. Overall conclusions"""
            
            logging.info("🤖 Generating combined summary...")
            combined_summary = self.ollama_client.call_ollama(system_prompt, user_prompt)
            
            # Create combined PDF
            self._create_combined_pdf(combined_summary, individual_summaries, output_file)
            
            result = {
                "text": combined_summary,
                "pdf": output_file,
                "individual_summaries": individual_summaries
            }
            
            logging.info(f"✅ Batch summarization complete!")
            return result
            
        except Exception as e:
            logging.error(f"❌ Batch summarization failed: {e}", exc_info=True)
            raise
    
    def _create_summary_pdf(self, summary_text: str, output_file: str, original_filename: str):
        """Create a formatted PDF from summary text"""
        try:
            doc = SimpleDocTemplate(
                output_file,
                pagesize=letter,
                rightMargin=0.75*inch,
                leftMargin=0.75*inch,
                topMargin=1*inch,
                bottomMargin=0.75*inch
            )
            
            styles = getSampleStyleSheet()
            
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=18,
                textColor='#2C3E50',
                spaceAfter=12,
                alignment=1
            )
            
            subtitle_style = ParagraphStyle(
                'CustomSubtitle',
                parent=styles['Normal'],
                fontSize=10,
                textColor='#7F8C8D',
                spaceAfter=20,
                alignment=1
            )
            
            body_style = ParagraphStyle(
                'CustomBody',
                parent=styles['Normal'],
                fontSize=11,
                leading=16,
                alignment=TA_JUSTIFY,
                spaceAfter=12
            )
            
            story = []
            story.append(Paragraph("📄 Document Summary", title_style))
            story.append(Paragraph(f"Source: {original_filename}", subtitle_style))
            story.append(Spacer(1, 0.2*inch))
            
            paragraphs = summary_text.split("\n\n")
            for para in paragraphs:
                if para.strip():
                    story.append(Paragraph(para.strip(), body_style))
                    story.append(Spacer(1, 0.1*inch))
            
            doc.build(story)
            logging.info(f"✅ Summary PDF created: {output_file}")
            
        except Exception as e:
            logging.error(f"❌ Failed to create summary PDF: {e}")
            raise
    
    def _create_combined_pdf(self, combined_summary: str, individual_summaries: list, output_file: str):
        """Create PDF with combined summary and individual summaries"""
        try:
            doc = SimpleDocTemplate(output_file, pagesize=letter, 
                                   rightMargin=0.75*inch, leftMargin=0.75*inch,
                                   topMargin=1*inch, bottomMargin=0.75*inch)
            
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle('Title', parent=styles['Heading1'], 
                                        fontSize=18, textColor='#2C3E50', spaceAfter=20, alignment=1)
            heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], 
                                          fontSize=14, textColor='#34495E', spaceAfter=12)
            body_style = ParagraphStyle('Body', parent=styles['Normal'], 
                                       fontSize=11, leading=16, alignment=TA_JUSTIFY, spaceAfter=12)
            
            story = []
            story.append(Paragraph("📚 Multi-Document Summary", title_style))
            story.append(Spacer(1, 0.3*inch))
            
            story.append(Paragraph("🔍 Overall Summary", heading_style))
            for para in combined_summary.split("\n\n"):
                if para.strip():
                    story.append(Paragraph(para.strip(), body_style))
            story.append(PageBreak())
            
            story.append(Paragraph("📄 Individual Document Summaries", heading_style))
            story.append(Spacer(1, 0.2*inch))
            
            for idx, item in enumerate(individual_summaries, 1):
                story.append(Paragraph(f"{idx}. {item['filename']}", heading_style))
                for para in item['summary'].split("\n\n"):
                    if para.strip():
                        story.append(Paragraph(para.strip(), body_style))
                story.append(Spacer(1, 0.2*inch))
            
            doc.build(story)
            logging.info(f"✅ Combined summary PDF created: {output_file}")
            
        except Exception as e:
            logging.error(f"❌ Failed to create combined PDF: {e}")
            raise


# ============================================================
# 5️⃣ AI Operation 2: Chat With PDF
# ============================================================
class ChatWithPDF(AIOperationBase):
    """Interactive Q&A with PDF using FAISS vector search + Ollama"""
    
    def __init__(self):
        self.ollama_client = OllamaClient()
        self.extractor = PDFTextExtractor()
        # Lazy load heavy dependencies
        try:
            from sentence_transformers import SentenceTransformer
            import faiss
            self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
            self.faiss_module = faiss
        except ImportError as e:
            logging.error(f"❌ Failed to load AI libraries: {e}")
            raise
        self.faiss_index = None
        self.text_chunks = []
    
    def Process(self, input_file: str, output_file: str, **kwargs) -> dict:
        """
        Setup or query PDF for chat
        
        Args:
            input_file: Path to PDF
            output_file: Path to save session data (pickle)
            mode: "setup" or "query"
            question: User question (for query mode)
        
        Returns:
            dict: {"status": "ready"} for setup, {"answer": text, "context": chunks} for query
        """
        mode = kwargs.get("mode", "setup")
        
        if mode == "setup":
            return self._setup_pdf(input_file, output_file)
        elif mode == "query":
            question = kwargs.get("question", "")
            return self._query_pdf(input_file, output_file, question)
        else:
            raise ValueError(f"Invalid mode: {mode}. Use 'setup' or 'query'")
    
    def _setup_pdf(self, input_file: str, session_file: str) -> dict:
        """Setup PDF for chat by creating FAISS index"""
        try:
            logging.info(f"🔍 Setting up chat for PDF: {input_file}")
            
            # Extract and chunk text
            text = self.extractor.extract_text(input_file)
            self.text_chunks = self.extractor.chunk_text(text, chunk_size=1500)
            
            if not self.text_chunks:
                raise ValueError("No text extracted from PDF")
            
            # Create FAISS index
            logging.info(f"🧠 Creating embeddings for {len(self.text_chunks)} chunks...")
            embeddings = []
            for i in range(0, len(self.text_chunks), 50):
                batch = self.text_chunks[i:i+50]
                emb = self.embedding_model.encode(batch, batch_size=16, show_progress_bar=False)
                embeddings.append(emb)
            
            embeddings = np.vstack(embeddings).astype('float32')
            
            self.faiss_index = self.faiss_module.IndexFlatL2(embeddings.shape[1])
            self.faiss_index.add(embeddings)
            
            # Save session (with empty chat history)
            session_data = {
                "text_chunks": self.text_chunks,
                "pdf_path": input_file,
                "chat_history": []  # Store conversation history
            }
            
            with open(session_file, "wb") as f:
                pickle.dump(session_data, f)
            
            # Save FAISS index separately
            faiss_path = session_file.replace(".pkl", "_faiss.index")
            self.faiss_module.write_index(self.faiss_index, faiss_path)
            
            logging.info(f"✅ Chat setup complete! Session saved to {session_file}")
            
            return {
                "status": "ready",
                "chunk_count": len(self.text_chunks),
                "session_file": session_file
            }
            
        except Exception as e:
            logging.error(f"❌ Chat setup failed: {e}", exc_info=True)
            raise
    
    def _query_pdf(self, input_file: str, session_file: str, question: str) -> dict:
        """Query the PDF using semantic search + Ollama with conversation memory"""
        try:
            logging.info(f"❓ Query: {question}")
            
            # Load session
            if not os.path.exists(session_file):
                raise FileNotFoundError(f"Session not found: {session_file}. Run setup first.")
            
            with open(session_file, "rb") as f:
                session_data = pickle.load(f)
            
            self.text_chunks = session_data["text_chunks"]
            chat_history = session_data.get("chat_history", [])
            
            # Load FAISS index
            faiss_path = session_file.replace(".pkl", "_faiss.index")
            self.faiss_index = self.faiss_module.read_index(faiss_path)
            
            # Semantic search for relevant chunks
            question_embedding = self.embedding_model.encode([question]).astype('float32')
            distances, indices = self.faiss_index.search(question_embedding, k=3)
            
            relevant_chunks = [self.text_chunks[idx] for idx in indices[0]]
            context = "\n\n".join(relevant_chunks)
            
            # Build conversation history string (last 5 exchanges max)
            history_str = ""
            if chat_history:
                recent_history = chat_history[-5:]  # Keep last 5 Q&A pairs
                history_parts = []
                for h in recent_history:
                    history_parts.append(f"User: {h['question']}\nAssistant: {h['answer']}")
                history_str = "\n\n".join(history_parts)
            
            # Generate answer with Ollama
            system_prompt = "You are a helpful assistant that answers questions based on provided PDF context. Give detailed, informative answers using specific information from the context. Use the conversation history to understand context and pronouns (like 'he', 'she', 'they', 'it'). If the answer is not in the context, say you cannot find the information."
            
            if history_str:
                user_prompt = f"""Context from PDF:
{context}

Previous conversation:
{history_str}

Current question: {question}

Provide a detailed, informative answer based on the PDF context and conversation history. Include specific details like names, dates, roles, skills, or any relevant information."""
            else:
                user_prompt = f"""Context from PDF:
{context}

Question: {question}

Provide a detailed, informative answer based on the context above. Include specific details like names, dates, roles, skills, or any relevant information from the context."""
            
            logging.info("🤖 Generating answer with Ollama...")
            answer = self.ollama_client.call_ollama(system_prompt, user_prompt)
            
            # Save Q&A to chat history
            chat_history.append({
                "question": question,
                "answer": answer
            })
            
            # Update session with new history
            session_data["chat_history"] = chat_history
            with open(session_file, "wb") as f:
                pickle.dump(session_data, f)
            
            result = {
                "question": question,
                "answer": answer,
                "relevant_context": relevant_chunks,
                "confidence": float(1.0 / (1.0 + distances[0][0]))  # Distance to confidence score
            }
            
            logging.info(f"✅ Answer generated!")
            return result
            return result
            
        except Exception as e:
            logging.error(f"❌ Query failed: {e}", exc_info=True)
            raise


# ============================================================
# 6️⃣ AI Operation 3: Smart Classification (TODO)
# ============================================================
class SmartClassification(AIOperationBase):
    """
    AI-powered document classification.
    Supports both batch classification (multiple files) and single-file splitting (future).
    """
    
    def __init__(self):
        self.ollama_client = OllamaClient()
        self.extractor = PDFTextExtractor()
    
    def Process(self, input_file, output_file: str, **kwargs) -> dict:
        """
        Classify PDF documents.
        
        Args:
            input_file: Path to input PDF (str) OR List of paths (list)
            output_file: Not used for batch classification, but required by interface
            
        Returns:
            dict with classification results
        """
        try:
            # Handle batch classification (List of files)
            if isinstance(input_file, list):
                return self._classify_batch(input_file)
            
            # Handle single file (treat as batch of 1 for now, or implement split later)
            return self._classify_batch([input_file])
            
        except Exception as e:
            logging.error(f"❌ Smart classification failed: {e}", exc_info=True)
            raise

    def _classify_batch(self, file_paths: list) -> dict:
        """Classify a list of PDF files"""
        classification_results = []
        
        logging.info(f"🔍 Starting batch classification for {len(file_paths)} files...")
        
        for idx, file_path in enumerate(file_paths):
            try:
                filename = os.path.basename(file_path)
                logging.info(f"📄 Classifying file {idx+1}/{len(file_paths)}: {filename}")
                
                # Extract text from first page only (sufficient for classification)
                # We use a custom efficient extraction for just page 1
                text_preview = self._extract_first_page_text(file_path)
                
                if not text_preview or len(text_preview) < 50:
                    doc_type = "Unknown/Empty"
                    confidence = 0.0
                    reasoning = "Not enough text to classify."
                else:
                    # Ask AI to classify
                    doc_type, confidence, reasoning = self._ask_ai_to_classify(text_preview)
                
                classification_results.append({
                    "filename": filename,
                    "file_path": file_path,
                    "document_type": doc_type,
                    "confidence": confidence,
                    "reasoning": reasoning
                })
                
            except Exception as e:
                logging.error(f"⚠️ Failed to classify {file_path}: {e}")
                classification_results.append({
                    "filename": os.path.basename(file_path),
                    "document_type": "Error",
                    "confidence": 0.0,
                    "reasoning": str(e)
                })
        
        # summary string for simple display
        summary_lines = []
        for res in classification_results:
            summary_lines.append(f"• {res['filename']} appears to be a **{res['document_type']}**")
            
        return {
            "status": "classified",
            "mode": "batch",
            "file_count": len(file_paths),
            "results": classification_results,
            "summary": "\n".join(summary_lines)
        }

    def _extract_first_page_text(self, file_path: str) -> str:
        """Efficiently extract text from just the first page"""
        try:
            with pdfplumber.open(file_path) as pdf:
                if len(pdf.pages) > 0:
                    text = pdf.pages[0].extract_text()
                    if text:
                        print(f"DEBUG: Extracted Text preview: {text[:200]}...", flush=True)
                        return text[:2000] # Limit to 2000 chars
            print("DEBUG: No text extracted using pdfplumber", flush=True)
            return ""
        except Exception as e:
            print(f"DEBUG: Extraction error: {e}", flush=True)
            return ""

    def _ask_ai_to_classify(self, text: str) -> tuple:
        """Query Ollama to determine document type"""
        prompt = f"""Analyze the provided document text and identify what type of document this is.

Read the content carefully and determine the document's purpose and nature. Be specific and descriptive.

Examples of document types you might identify:
- Business documents: Invoice, Receipt, Purchase Order, Contract, Agreement, Proposal, etc.
- Personal documents: Resume, CV, Cover Letter, ID Card, Passport, etc.
- Financial: Bank Statement, Tax Form, Financial Report, Balance Sheet, etc.
- Medical: Medical Report, Prescription, Lab Results, Health Record, etc.
- Educational: Textbook, Study Guide, Cheat Sheet, Assignment, Research Paper, Thesis, etc.
- Legal: Legal Notice, Court Document, License, Permit, etc.
- Or ANY other type - be creative and accurate based on the actual content!

Text content:
{text[:1500]}...

INSTRUCTIONS:
1. Identify the ACTUAL document type based on content, not from a limited list
2. Be specific (e.g., "Zoho Study Guide" instead of just "Document")
3. Return ONLY a valid JSON object
4. Do not include markdown code fences or formatting
5. JSON format: {{"type": "Document Type Name", "confidence": 0.9, "reasoning": "Brief explanation"}}

Respond with JSON only:"""
        
        try:
            print(f"DEBUG: Sending prompt to Ollama...", flush=True)
            response = self.ollama_client.call_ollama(
                system_prompt="You are a document classifier API. You only output valid JSON.",
                user_prompt=prompt
            )
            
            print(f"DEBUG: RAW Classify Response: {response}", flush=True)
            logging.info(f"🤖 RAW Classify Response: {response}")
            
            # Simple JSON cleanup and parsing
            import re
            # Try to find JSON object
            json_match = re.search(r'\{[\s\S]*?\}', response)
            if json_match:
                try:
                    data = json.loads(json_match.group())
                    doc_type = data.get("type", "Other")
                    # Fix: If AI vaguely returns "Category" from the example, fallback to Other
                    if doc_type == "Category": 
                        doc_type = "Other"
                        
                    return doc_type, data.get("confidence", 0.5), data.get("reasoning", "")
                except json.JSONDecodeError:
                     logging.error(f"❌ JSON Decode Error on: {json_match.group()}")
                     return "Unknown", 0.0, "Invalid JSON from AI"
            else:
                return "Unknown", 0.0, f"Could not parse AI response: {response[:100]}..."
                
        except Exception as e:
            logging.error(f"AI Classification Error: {e}")
            return "Unknown", 0.0, "AI Error"


# ============================================================
# 7️⃣ AI Operation 4: Smart Merge
# ============================================================
class SmartMerge(AIOperationBase):
    """
    AI-powered smart PDF merging.
    
    Features:
    - Analyzes content of multiple PDFs
    - Suggests optimal merge order based on content relationships
    - Allows user to rearrange/approve before final merge
    - Maintains consistent formatting
    
    Two-step flow:
    1. analyze: Analyzes PDFs and suggests optimal order
    2. merge: Merges PDFs in specified order
    """
    
    def __init__(self):
        self.ollama_client = OllamaClient()
        self.extractor = PDFTextExtractor()
    
    def Process(self, input_file, output_file: str, **kwargs) -> dict:
        """
        Smart merge operation
        
        Args:
            input_file: List of PDF paths
            output_file: Path for merged output PDF
            mode: "analyze" or "merge"
            order: List of indices for merge order (for merge mode)
        
        Returns:
            For analyze: {"suggested_order": [...], "analysis": [...], "file_info": [...]}
            For merge: {"output_file": path, "page_count": int}
        """
        mode = kwargs.get("mode", "analyze")
        
        if mode == "analyze":
            return self._analyze_pdfs(input_file, output_file)
        elif mode == "merge":
            order = kwargs.get("order", [])
            return self._merge_pdfs(input_file, output_file, order)
        else:
            raise ValueError(f"Invalid mode: {mode}. Use 'analyze' or 'merge'")
    
    def _analyze_pdfs(self, input_files: list, output_file: str) -> dict:
        """Analyze PDFs and suggest optimal merge order"""
        try:
            if not isinstance(input_files, list) or len(input_files) < 2:
                raise ValueError("At least 2 PDF files required for smart merge")
            
            logging.info(f"🔍 Analyzing {len(input_files)} PDFs for smart merge...")
            
            file_info = []
            all_summaries = []
            
            # Extract info from each PDF
            for idx, pdf_path in enumerate(input_files):
                logging.info(f"📄 Analyzing PDF {idx + 1}/{len(input_files)}: {os.path.basename(pdf_path)}")
                
                # Get page count
                doc = fitz.open(pdf_path)
                page_count = len(doc)
                
                # Extract text (first 2000 chars for analysis)
                text = self.extractor.extract_text(pdf_path)
                preview_text = text[:2000] if text else ""
                
                # Get file size
                file_size = os.path.getsize(pdf_path)
                
                doc.close()
                
                info = {
                    "index": idx,
                    "filename": os.path.basename(pdf_path),
                    "path": pdf_path,
                    "page_count": page_count,
                    "file_size": file_size,
                    "file_size_mb": round(file_size / (1024 * 1024), 2),
                    "preview": preview_text[:500] + "..." if len(preview_text) > 500 else preview_text
                }
                file_info.append(info)
                all_summaries.append(f"Document {idx + 1} ({info['filename']}): {preview_text[:1000]}")
            
            # Use AI to suggest optimal order
            combined_summaries = "\n\n---\n\n".join(all_summaries)
            
            system_prompt = """You are a document organization expert. Analyze the provided documents and suggest the optimal order for merging them into a single coherent document.

Consider:
1. Logical flow (introduction → body → conclusion)
2. Topic relationships and dependencies
3. Chronological order if dates are present
4. Document type hierarchy (cover page → content → appendix)

Respond with ONLY a JSON object in this exact format:
{
    "suggested_order": [0, 1, 2],
    "reasoning": "Brief explanation of why this order makes sense",
    "relationships": [
        {"from": 0, "to": 1, "relation": "introduces"},
        {"from": 1, "to": 2, "relation": "leads to"}
    ]
}

Use 0-based indices matching the document numbers minus 1."""
            
            user_prompt = f"""Analyze these {len(input_files)} documents and suggest the best order for merging:

{combined_summaries}

IMPORTANT: Your suggested_order array MUST include ALL {len(input_files)} documents using indices 0 to {len(input_files)-1}.

Suggest the optimal merge order as a JSON object."""
            
            logging.info("🤖 Asking AI for optimal merge order...")
            ai_response = self.ollama_client.call_ollama(system_prompt, user_prompt, temperature=0.3)
            
            # Parse AI response
            suggested_order = list(range(len(input_files)))  # Default: original order
            reasoning = "Default order (AI analysis unavailable)"
            relationships = []
            
            try:
                # Try to extract JSON from response
                import re
                
                # Find first complete JSON object (non-greedy to avoid capturing multiple objects)
                json_match = re.search(r'\{[^\{]*?"suggested_order"[\s\S]*?\}', ai_response)
                if not json_match:
                    # Fallback: try any JSON-like structure
                    json_match = re.search(r'\{[\s\S]*?\}', ai_response)
                
                if json_match:
                    json_str = json_match.group()
                    
                    # Clean up common JSON issues
                    json_str = json_str.strip()
                    
                    # Try to parse
                    try:
                        ai_result = json.loads(json_str)
                    except json.JSONDecodeError:
                        # If still fails, try to extract just the first object before any trailing data
                        brace_count = 0
                        end_pos = 0
                        for i, char in enumerate(json_str):
                            if char == '{':
                                brace_count += 1
                            elif char == '}':
                                brace_count -= 1
                                if brace_count == 0:
                                    end_pos = i + 1
                                    break
                        if end_pos > 0:
                            ai_result = json.loads(json_str[:end_pos])
                        else:
                            raise
                    
                    # Handle suggested_order - might be string "[0, 1]" or actual list
                    raw_order = ai_result.get("suggested_order", suggested_order)
                    if isinstance(raw_order, str):
                        # Parse string like "[0, 1, 2]" into actual list
                        try:
                            raw_order = json.loads(raw_order)
                        except:
                            raw_order = suggested_order
                    suggested_order = raw_order if isinstance(raw_order, list) else suggested_order
                    
                    reasoning = ai_result.get("reasoning", reasoning)
                    relationships = ai_result.get("relationships", [])
                    logging.info(f"✅ AI suggested order: {suggested_order}")
            except Exception as parse_err:
                logging.warning(f"⚠️ Could not parse AI response, using default order: {parse_err}")
                # Log the raw response for debugging
                logging.debug(f"Raw AI response: {ai_response[:500]}")
            
            # Ensure suggested_order contains integers
            try:
                suggested_order = [int(i) for i in suggested_order]
            except (TypeError, ValueError):
                logging.warning("⚠️ Could not convert order to integers, using default")
                suggested_order = list(range(len(input_files)))
            
            # Validate suggested order
            if not all(0 <= i < len(input_files) for i in suggested_order):
                logging.warning("⚠️ Invalid indices in suggested order, using default")
                suggested_order = list(range(len(input_files)))
            
            if len(set(suggested_order)) != len(input_files):
                logging.warning("⚠️ Duplicate indices in suggested order, using default")
                suggested_order = list(range(len(input_files)))
            
            # Build analysis result
            analysis = []
            for idx in suggested_order:
                info = file_info[idx]
                analysis.append({
                    "position": suggested_order.index(idx) + 1,
                    "original_index": idx,
                    "filename": info["filename"],
                    "page_count": info["page_count"],
                    "preview": info["preview"]
                })
            
            result = {
                "status": "analyzed",
                "file_count": len(input_files),
                "total_pages": sum(f["page_count"] for f in file_info),
                "suggested_order": suggested_order,
                "reasoning": reasoning,
                "relationships": relationships,
                "file_info": file_info,
                "analysis": analysis
            }
            
            logging.info(f"✅ Analysis complete. Suggested order: {suggested_order}")
            return result
            
        except Exception as e:
            logging.error(f"❌ Smart merge analysis failed: {e}", exc_info=True)
            raise
    
    def _merge_pdfs(self, input_files: list, output_file: str, order: list) -> dict:
        """Merge PDFs in specified order"""
        try:
            if not isinstance(input_files, list) or len(input_files) < 2:
                raise ValueError("At least 2 PDF files required for merge")
            
            # Validate order
            if not order:
                order = list(range(len(input_files)))
            
            if len(order) != len(input_files):
                raise ValueError(f"Order list length ({len(order)}) doesn't match file count ({len(input_files)})")
            
            if not all(0 <= i < len(input_files) for i in order):
                raise ValueError("Invalid indices in order list")
            
            logging.info(f"📑 Merging {len(input_files)} PDFs in order: {order}")
            
            # Create merged PDF
            merged_doc = fitz.open()
            total_pages = 0
            merge_details = []
            
            for position, idx in enumerate(order):
                pdf_path = input_files[idx]
                logging.info(f"📄 Adding PDF {position + 1}: {os.path.basename(pdf_path)}")
                
                src_doc = fitz.open(pdf_path)
                page_count = len(src_doc)
                
                # Insert all pages from this document
                merged_doc.insert_pdf(src_doc)
                
                merge_details.append({
                    "position": position + 1,
                    "original_index": idx,
                    "filename": os.path.basename(pdf_path),
                    "pages_added": page_count,
                    "start_page": total_pages + 1,
                    "end_page": total_pages + page_count
                })
                
                total_pages += page_count
                src_doc.close()
            
            # Save merged PDF
            merged_doc.save(output_file)
            merged_doc.close()
            
            # Get output file size
            output_size = os.path.getsize(output_file)
            
            result = {
                "status": "merged",
                "output_file": output_file,
                "total_pages": total_pages,
                "files_merged": len(input_files),
                "merge_order": order,
                "output_size_mb": round(output_size / (1024 * 1024), 2),
                "merge_details": merge_details
            }
            
            logging.info(f"✅ Merge complete! {total_pages} pages → {output_file}")
            return result
            
        except Exception as e:
            logging.error(f"❌ Smart merge failed: {e}", exc_info=True)
            raise


# ============================================================
# 7️⃣ PDF Translation with AI (Ollama)
# ============================================================
class PDFTranslator(AIOperationBase):
    """
    Translate PDF content using Ollama AI with auto language detection.
    Supports: English ↔ Spanish ↔ Tamil ↔ Hindi (bidirectional)
    100% FREE - uses local Ollama, no API costs!
    """
    
    # Language mappings
    SUPPORTED_LANGUAGES = {
        "en": "English",
        "es": "Spanish", 
        "ta": "Tamil",
        "hi": "Hindi",
        # Expandable to more languages
        "fr": "French",
        "de": "German",
        "zh": "Chinese",
        "ja": "Japanese",
        "ar": "Arabic",
        "ru": "Russian",
        "pt": "Portuguese",
        "it": "Italian",
        "ko": "Korean"
    }
    
    # Languages that require complex script rendering (Indic, Arabic, CJK)
    COMPLEX_SCRIPT_LANGUAGES = ['ta', 'hi', 'ar', 'zh', 'ja', 'ko', 'ru']

    def __init__(self):
        self.ollama_url = OllamaConfig.OLLAMA_URL
        self.model = "llama3.2:1b"  # Default lightweight model
        
    def Process(self, input_file: str, output_file: str, **kwargs) -> dict:
        """
        Translate PDF content to target language
        
        Args:
            input_file: Path to input PDF
            output_file: Path to translated PDF output
            **kwargs:
                - target_lang: Target language code (e.g., "hi", "es", "ta", "en")
                - source_lang: Source language (auto-detect if not provided)
                - use_ai: Use Ollama AI instead of Google Translate (default: False)
                - chunk_size: Text chunk size for translation (default: 1500)
        
        Returns:
            dict with translation results
        """
        try:
            target_lang = kwargs.get("target_lang", "en")
            source_lang = kwargs.get("source_lang", None)  # Auto-detect if None
            use_ai = kwargs.get("use_ai", False)  # Use Google Translate by default (faster & free)
            chunk_size = kwargs.get("chunk_size", 1500)
            
            if target_lang not in self.SUPPORTED_LANGUAGES:
                raise ValueError(f"Unsupported target language: {target_lang}. Supported: {list(self.SUPPORTED_LANGUAGES.keys())}")
            
            logging.info(f"🌐 Starting translation to {self.SUPPORTED_LANGUAGES[target_lang]}")
            
            # Extract text from PDF
            text_content, metadata = self._extract_text_with_structure(input_file)
            
            if not text_content.strip():
                raise ValueError("No text content found in PDF")
            
            # Detect source language if not provided
            if not source_lang:
                source_lang = self._detect_language(text_content)
                logging.info(f"🔍 Detected source language: {self.SUPPORTED_LANGUAGES.get(source_lang, source_lang)}")
            
            if source_lang == target_lang:
                logging.warning(f"⚠️ Source and target languages are the same: {source_lang}")
                return {
                    "status": "skipped",
                    "message": "Source and target languages are identical",
                    "source_lang": source_lang,
                    "target_lang": target_lang
                }
            
            # Translate text - Google Translate (free) or Ollama AI (local)
            if use_ai:
                translated_text = self._translate_with_ai(text_content, source_lang, target_lang, chunk_size)
                method = "AI (Ollama)"
            else:
                translated_text = self._translate_with_google(text_content, source_lang, target_lang)
                method = "Google Translate (Free)"
            
            # Generate translated output (PDF or HTML based on language complexity)
            metadata["source_lang"] = self.SUPPORTED_LANGUAGES.get(source_lang, source_lang)
            metadata["target_lang"] = self.SUPPORTED_LANGUAGES[target_lang]
            metadata["target_lang_code"] = target_lang
            
            # Use layout-preserving translation for standard scripts if possible
            if target_lang not in self.COMPLEX_SCRIPT_LANGUAGES:
                logging.info(f"📄 Using layout-preserving translation for {target_lang}")
                self._translate_preserving_layout(input_file, output_file, source_lang, target_lang)
                final_output = output_file
            else:
                # Fallback to HTML for complex scripts
                self._create_formatted_output(translated_text, output_file, metadata)
                final_output = output_file.replace('.pdf', '.html')
            
            result = {
                "status": "success",
                "source_lang": source_lang,
                "source_lang_name": self.SUPPORTED_LANGUAGES.get(source_lang, source_lang),
                "target_lang": target_lang,
                "target_lang_name": self.SUPPORTED_LANGUAGES[target_lang],
                "output_file": final_output,
                "original_length": len(text_content),
                "translated_length": len(translated_text),
                "translation_method": method,
                "pages": metadata["page_count"],
                "file_size_mb": round(os.path.getsize(final_output) / (1024 * 1024), 2) if os.path.exists(final_output) else 0
            }
            
            logging.info(f"✅ Translation complete: {source_lang} → {target_lang}")
            return result
            
        except Exception as e:
            logging.error(f"❌ Translation failed: {e}", exc_info=True)
            raise

    def _translate_preserving_layout(self, input_file: str, output_file: str, source_lang: str, target_lang: str):
        """
        Translate PDF while preserving layout using PyMuPDF (fitz).
        Processes LINE BY LINE to preserve exact positioning.
        """
        try:
            from deep_translator import GoogleTranslator
            
            # Sanitize source_lang - convert invalid values to 'auto' for auto-detection
            if source_lang in [None, "", "string", "auto"]:
                source_lang = "auto"
            
            doc = fitz.open(input_file)
            translator = GoogleTranslator(source=source_lang, target=target_lang)
            
            logging.info(f"🎨 Starting layout-preserving translation for {len(doc)} pages...")
            
            for page_num, page in enumerate(doc):
                logging.info(f"📄 Processing page {page_num + 1}...")
                
                # Get text blocks with detailed info (dict) to extract font sizes
                try:
                    blocks = page.get_text("dict")["blocks"]
                except Exception as e:
                    logging.warning(f"⚠️ Could not extract text dict from page {page_num + 1}: {e}")
                    continue
                
                # Collect all lines with their properties first
                lines_to_process = []
                
                for block in blocks:
                    # Skip image blocks (type 1)
                    if block["type"] != 0:
                        continue
                    
                    for line in block["lines"]:
                        line_bbox = fitz.Rect(line["bbox"])
                        
                        # Reconstruct line text and get font properties
                        line_text = ""
                        font_sizes = []
                        font_flags = []
                        
                        for span in line["spans"]:
                            line_text += span["text"]
                            font_sizes.append(span["size"])
                            font_flags.append(span["flags"])
                        
                        line_text = line_text.strip()
                        if not line_text or len(line_text) < 1:
                            continue
                        
                        # Check if this is a standalone bullet (no actual content)
                        is_orphan_bullet = line_text in ['•', '●', '▪', '-', '*', '·']
                        
                        # Determine font size (use average for this line)
                        avg_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else 11
                        
                        # Determine if bold
                        is_bold = False
                        if font_flags:
                            bold_count = sum(1 for f in font_flags if f & 16)  # Flag 16 is bold
                            if bold_count > len(font_flags) / 2:
                                is_bold = True
                        
                        lines_to_process.append({
                            "bbox": line_bbox,
                            "text": line_text,
                            "font_size": avg_font_size,
                            "is_bold": is_bold,
                            "is_orphan_bullet": is_orphan_bullet
                        })
                
                # Now redact all original text areas first (in batch)
                for line_info in lines_to_process:
                    page.add_redact_annot(line_info["bbox"], fill=(1, 1, 1))
                
                page.apply_redactions()
                
                # Get page dimensions for boundary checking
                page_width = page.rect.width
                right_margin = 30  # Minimum right margin
                max_x1 = page_width - right_margin
                
                # FIRST PASS: Translate all lines and calculate global scale factor
                translated_lines = []
                max_expansion_ratio = 1.0
                
                for line_info in lines_to_process:
                    try:
                        # Skip orphan bullets
                        if line_info.get("is_orphan_bullet", False):
                            translated_lines.append(None)
                            continue
                        
                        original_text = line_info["text"]
                        
                        # Translate text
                        translated_text = translator.translate(original_text)
                        if not translated_text:
                            translated_lines.append(None)
                            continue
                        
                        # Sanitize translated text for PDF compatibility
                        translated_text = translated_text.replace('•', '-').replace('●', '-').replace('▪', '-')
                        
                        # Calculate expansion ratio for this line
                        len_ratio = len(translated_text) / max(len(original_text), 1)
                        
                        # Track the maximum expansion ratio (for lines that would overflow)
                        bbox = line_info["bbox"]
                        available_width = max_x1 - bbox.x0
                        original_width = bbox.x1 - bbox.x0
                        
                        # Only consider lines that might overflow
                        if original_width > 100 and len_ratio > 1.0:
                            max_expansion_ratio = max(max_expansion_ratio, len_ratio)
                        
                        translated_lines.append(translated_text)
                        
                    except Exception as e:
                        logging.warning(f"⚠️ Failed to translate line on page {page_num + 1}: {e}")
                        translated_lines.append(None)
                        continue
                
                # Calculate a GLOBAL scale factor to apply uniformly
                # This ensures all text has the same relative size
                if max_expansion_ratio > 1.1:
                    global_scale = 1.0 / max_expansion_ratio
                    global_scale = max(global_scale, 0.75)  # Don't go below 75%
                else:
                    global_scale = 0.95  # Slight reduction for safety
                
                logging.info(f"📐 Global font scale factor: {global_scale:.2f} (max expansion: {max_expansion_ratio:.2f})")
                
                # SECOND PASS: Insert all translated text with consistent scaling
                for i, line_info in enumerate(lines_to_process):
                    try:
                        translated_text = translated_lines[i]
                        if translated_text is None:
                            continue
                        
                        bbox = line_info["bbox"]
                        avg_font_size = line_info["font_size"]
                        is_bold = line_info["is_bold"]
                        
                        # Select font based on style
                        font_name = "helv"  # Default Helvetica
                        if is_bold:
                            font_name = "hebo"  # Helvetica-Bold
                        
                        # Apply global scale to maintain uniform text size
                        safe_font_size = max(6, avg_font_size * global_scale)
                        
                        # Insert text at the line position
                        text_point = fitz.Point(bbox.x0, bbox.y0 + safe_font_size)
                        
                        page.insert_text(
                            text_point,
                            translated_text,
                            fontsize=safe_font_size,
                            fontname=font_name,
                            color=(0, 0, 0)
                        )
                        
                    except Exception as e:
                        logging.warning(f"⚠️ Failed to insert translated line on page {page_num + 1}: {e}")
                        continue
                
                # Small delay to avoid rate limiting
                time.sleep(0.5)
            
            doc.save(output_file)
            doc.close()
            
            # Verify output content
            self._verify_output_content(output_file)
            
            logging.info(f"✅ Layout-preserving PDF created: {output_file}")
            
        except Exception as e:
            logging.error(f"❌ Layout preservation failed: {e}", exc_info=True)
            # Fallback to standard generation if this fails
            raise

    def _verify_output_content(self, output_file: str):
        """Verify that the output PDF is not empty and contains text"""
        try:
            doc = fitz.open(output_file)
            if len(doc) == 0:
                logging.warning("⚠️ Output PDF has 0 pages!")
                return
            
            text = doc[0].get_text()
            if not text.strip():
                logging.warning("⚠️ Output PDF page 1 appears empty!")
            else:
                logging.info(f"✅ Verification: Output PDF contains {len(text)} characters on page 1.")
                logging.info(f"📝 Sample text: {text[:100]}...")
            
            doc.close()
        except Exception as e:
            logging.warning(f"⚠️ Could not verify output content: {e}")
    
    def _extract_text_with_structure(self, pdf_path: str) -> tuple:
        """Extract text while preserving document structure"""
        try:
            doc = fitz.open(pdf_path)
            full_text = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                if text.strip():
                    full_text.append(text)
            
            metadata = {
                "page_count": len(doc),
                "title": doc.metadata.get("title", "Translated Document"),
                "author": doc.metadata.get("author", "")
            }
            
            doc.close()
            
            combined_text = "\n\n".join(full_text)
            return combined_text, metadata
            
        except Exception as e:
            logging.error(f"❌ Text extraction failed: {e}")
            raise
    
    def _detect_language(self, text: str) -> str:
        """Detect language using langdetect library"""
        try:
            from langdetect import detect, DetectorFactory
            
            # Set seed for consistent results
            DetectorFactory.seed = 0
            
            # Use first 1000 chars for faster and more accurate detection
            sample = text[:1000] if len(text) > 1000 else text
            detected = detect(sample)
            
            # Map langdetect codes to our supported codes
            lang_map = {
                "zh-cn": "zh",
                "zh-tw": "zh",
            }
            
            mapped_lang = lang_map.get(detected, detected)
            
            # If detected language not in our supported list, default to English
            if mapped_lang not in self.SUPPORTED_LANGUAGES:
                logging.warning(f"⚠️ Detected language '{mapped_lang}' not in supported list, defaulting to English")
                return "en"
            
            return mapped_lang
            
        except Exception as e:
            return "en"
    
    def _translate_with_google(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translate using deep-translator (FREE & STABLE Google Translate wrapper)"""
        try:
            from deep_translator import GoogleTranslator
            
            # Split large text into chunks (Google Translate has 5000 char limit per request)
            max_chunk_size = 4500
            chunks = []
            
            # Split by paragraphs first to maintain context
            paragraphs = text.split('\n\n')
            current_chunk = []
            current_length = 0
            
            for para in paragraphs:
                para_length = len(para)
                if current_length + para_length > max_chunk_size and current_chunk:
                    chunks.append('\n\n'.join(current_chunk))
                    current_chunk = [para]
                    current_length = para_length
                else:
                    current_chunk.append(para)
                    current_length += para_length
            
            if current_chunk:
                chunks.append('\n\n'.join(current_chunk))
            
            translated_chunks = []
            total_chunks = len(chunks)
            
            logging.info(f"🌍 Translating {total_chunks} chunks using Google Translate (FREE)...")
            
            # Create translator instance
            translator = GoogleTranslator(source=source_lang, target=target_lang)
            
            for idx, chunk in enumerate(chunks, 1):
                if not chunk.strip():
                    translated_chunks.append("")
                    continue
                
                try:
                    # Translate chunk
                    translated = translator.translate(chunk)
                    translated_chunks.append(translated)
                    
                    if idx % 10 == 0 or idx == total_chunks:
                        logging.info(f"🌍 Progress: {idx}/{total_chunks} chunks")
                    
                    # Small delay to avoid rate limiting
                    time.sleep(0.3)
                    
                except Exception as chunk_error:
                    logging.warning(f"⚠️ Chunk {idx} failed: {chunk_error}, retrying...")
                    time.sleep(1)
                    try:
                        # Retry with new translator instance
                        translator = GoogleTranslator(source=source_lang, target=target_lang)
                        translated = translator.translate(chunk)
                        translated_chunks.append(translated)
                    except Exception as retry_error:
                        logging.error(f"❌ Chunk {idx} retry failed: {retry_error}")
                        # Keep original text for failed chunks
                        translated_chunks.append(chunk)
            
            final_translation = "\n\n".join(translated_chunks)
            logging.info(f"✅ Google Translate completed: {len(text)} → {len(final_translation)} characters")
            
            return final_translation
            
        except Exception as e:
            logging.error(f"❌ Google Translate failed: {e}")
            logging.info("🔄 Falling back to Ollama AI translation...")
            # Fallback to AI translation
            return self._translate_with_ai(text, source_lang, target_lang, 1500)
    
    def _translate_with_ai(self, text: str, source_lang: str, target_lang: str, chunk_size: int) -> str:
        """Translate using Ollama AI - 100% FREE, runs locally!"""
        try:
            source_name = self.SUPPORTED_LANGUAGES.get(source_lang, source_lang)
            target_name = self.SUPPORTED_LANGUAGES[target_lang]
            
            # Split into manageable chunks for AI processing
            chunks = []
            current_chunk = []
            current_length = 0
            
            # Split by paragraphs to preserve context
            paragraphs = text.split('\n\n')
            
            for para in paragraphs:
                para_length = len(para)
                if current_length + para_length > chunk_size and current_chunk:
                    chunks.append('\n\n'.join(current_chunk))
                    current_chunk = [para]
                    current_length = para_length
                else:
                    current_chunk.append(para)
                    current_length += para_length
            
            if current_chunk:
                chunks.append('\n\n'.join(current_chunk))
            
            translated_chunks = []
            total_chunks = len(chunks)
            
            logging.info(f"🤖 AI translating {total_chunks} chunks ({source_name} → {target_name})...")
            
            for idx, chunk in enumerate(chunks, 1):
                if not chunk.strip():
                    translated_chunks.append("")
                    continue
                
                prompt = f"""You are a professional translator. Translate the following text from {source_name} to {target_name}.

IMPORTANT RULES:
1. Translate ONLY the text content - do not add explanations or comments
2. Preserve the original meaning, tone, and style
3. Keep paragraph breaks and formatting
4. For technical terms, use commonly accepted translations
5. Maintain cultural context appropriately

Text to translate:
{chunk}

Translation in {target_name}:"""
                
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.3,  # Lower temperature for consistent translation
                        "num_predict": 2000,
                        "top_p": 0.9
                    }
                }
                
                try:
                    response = requests.post(self.ollama_url, json=payload, timeout=180)
                    
                    if response.status_code == 200:
                        result = response.json()
                        translation = result.get("response", "").strip()
                        
                        # Clean up any unwanted prefixes/suffixes
                        translation = self._clean_translation(translation)
                        translated_chunks.append(translation)
                        
                        if idx % 5 == 0 or idx == total_chunks:
                            logging.info(f"🤖 Progress: {idx}/{total_chunks} chunks translated")
                    else:
                        raise Exception(f"Ollama API error: {response.status_code} - {response.text}")
                    
                except requests.Timeout:
                    logging.warning(f"⚠️ Chunk {idx} timed out, retrying...")
                    # Retry once
                    response = requests.post(self.ollama_url, json=payload, timeout=240)
                    if response.status_code == 200:
                        result = response.json()
                        translation = result.get("response", "").strip()
                        translation = self._clean_translation(translation)
                        translated_chunks.append(translation)
                    else:
                        raise Exception(f"Retry failed: {response.status_code}")
                
                time.sleep(0.3)  # Small delay between requests to avoid overwhelming Ollama
            
            final_translation = "\n\n".join(translated_chunks)
            logging.info(f"✅ AI translation completed: {len(text)} → {len(final_translation)} characters")
            
            return final_translation
            
        except Exception as e:
            logging.error(f"❌ AI translation failed: {e}")
            raise
    
    def _clean_translation(self, text: str) -> str:
        """Clean up translation output from AI"""
        # Remove common AI prefixes/suffixes
        prefixes_to_remove = [
            "Translation:",
            "Here is the translation:",
            "Here's the translation:",
            f"Translation in",
        ]
        
        for prefix in prefixes_to_remove:
            if text.lower().startswith(prefix.lower()):
                text = text[len(prefix):].strip()
                if text.startswith(':'):
                    text = text[1:].strip()
        
        return text
    
    def _create_formatted_output(self, text: str, output_file: str, metadata: dict):
        """
        Create formatted output based on target language complexity.
        - Simple scripts (English, Spanish, French, etc.) -> Native PDF
        - Complex scripts (Tamil, Hindi, Chinese, etc.) -> HTML (for better rendering)
        """
        target_lang = metadata.get("target_lang_code", "en")
        
        if target_lang in self.COMPLEX_SCRIPT_LANGUAGES:
            logging.info(f"🔤 Complex script detected ({target_lang}). Generating HTML output for best rendering.")
            self._create_html_output(text, output_file, metadata)
        else:
            logging.info(f"🔤 Standard script detected ({target_lang}). Generating native PDF output.")
            self._create_pdf_output(text, output_file, metadata)

    def _create_pdf_output(self, text: str, output_file: str, metadata: dict):
        """Create a formatted PDF from translated text using ReportLab"""
        try:
            # Create PDF document
            doc = SimpleDocTemplate(
                output_file,
                pagesize=letter,
                rightMargin=0.75*inch,
                leftMargin=0.75*inch,
                topMargin=1*inch,
                bottomMargin=0.75*inch
            )
            
            styles = getSampleStyleSheet()
            
            # Define styles
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=18,
                textColor='#2C3E50',
                spaceAfter=20,
                alignment=1  # Center
            )
            
            heading_style = ParagraphStyle(
                'CustomHeading',
                parent=styles['Heading2'],
                fontSize=14,
                textColor='#34495E',
                spaceAfter=12,
                spaceBefore=12
            )
            
            body_style = ParagraphStyle(
                'CustomBody',
                parent=styles['Normal'],
                fontSize=11,
                leading=16,
                alignment=TA_JUSTIFY,
                spaceAfter=12
            )
            
            story = []
            
            # Add Title
            title_text = metadata.get('title', 'Translated Document')
            story.append(Paragraph(title_text, title_style))
            
            # Add Metadata
            meta_text = f"<b>Translation:</b> {metadata.get('source_lang', 'Auto')} -> {metadata.get('target_lang', 'Target')}"
            story.append(Paragraph(meta_text, body_style))
            story.append(Spacer(1, 0.2*inch))
            
            # Process text content
            paragraphs = text.split('\n\n')
            for para in paragraphs:
                if not para.strip():
                    continue
                
                # Check if it looks like a heading (short, uppercase, or ends with colon)
                is_heading = False
                if len(para) < 60:
                    if para.isupper() or para.strip().endswith(':'):
                        is_heading = True
                
                # Sanitize text for ReportLab (replace <, >, &)
                clean_para = para.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('\n', '<br/>')
                
                if is_heading:
                    story.append(Paragraph(clean_para, heading_style))
                else:
                    story.append(Paragraph(clean_para, body_style))
            
            # Build PDF
            doc.build(story)
            logging.info(f"✅ Translated PDF created: {output_file}")
            
        except Exception as e:
            logging.error(f"❌ Failed to create PDF: {e}", exc_info=True)
            raise

    def _create_html_output(self, text: str, output_file: str, metadata: dict):
        """Create HTML output (primary) with styled translation - PDF font rendering has limitations"""
        try:
            import os
            
            # Create beautiful HTML file with proper rendering
            html_output_file = output_file.replace('.pdf', '.html')
            
            html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{metadata.get('title', 'Translated Document')}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
    <style>
        @media print {{
            @page {{ size: letter; margin: 1in; }}
        }}
        body {{
            font-family: 'Noto Sans Tamil', 'Noto Sans', 'Arial Unicode MS', sans-serif;
            font-size: 11pt;
            line-height: 1.7;
            color: #1a1a1a;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
            background: #fff;
        }}
        h1 {{
            font-size: 18pt;
            font-weight: 700;
            margin-bottom: 20pt;
            color: #000;
            border-bottom: 2px solid #333;
            padding-bottom: 8pt;
        }}
        h2 {{
            font-size: 13pt;
            font-weight: 700;
            margin-top: 16pt;
            margin-bottom: 10pt;
            color: #2c3e50;
        }}
        p {{
            margin: 0 0 12pt 0;
        }}
        .metadata {{
            color: #666;
            font-size: 9pt;
            margin-bottom: 20pt;
            padding: 10pt;
            background: #f8f9fa;
            border-radius: 4px;
        }}
    </style>
</head>
<body>
    <h1>{metadata.get('title', 'Translated Document')}</h1>
    <div class="metadata">
        <strong>Translation:</strong> {metadata.get('source_lang', 'Auto')} → {metadata.get('target_lang', 'Target')} | <strong>Method:</strong> Google Translate (FREE)
    </div>
"""
            
            # Parse translated text into paragraphs
            paragraphs = text.split('\n\n')
            
            for para in paragraphs:
                if not para.strip():
                    continue
                
                # Escape HTML special characters
                para_html = (para.replace('&', '&amp;')
                               .replace('<', '&lt;')
                               .replace('>', '&gt;')
                               .replace('\n', '<br/>'))
                
                # Check if it's a heading (short, uppercase)
                if len(para) < 50 and para.isupper():
                    html_content += f'    <h2>{para_html}</h2>\n'
                else:
                    html_content += f'    <p>{para_html}</p>\n'
            
            html_content += """
    <script>
        // Enable print-to-PDF functionality
        window.print = function() {
            window.print();
        };
    </script>
</body>
</html>
"""
            
            # Save HTML file
            with open(html_output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            logging.info(f"✅ Translated HTML created with perfect rendering: {html_output_file}")
            logging.info(f"💡 Open the HTML file in a browser to view text, then use 'Print to PDF' for PDF output")
            
            # Also create a simple PDF placeholder explaining to use the HTML
            try:
                from xhtml2pdf import pisa
                
                note_html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="font-family: Arial; padding: 40px;">
    <h1>Translation Complete!</h1>
    <p>Your document has been translated from {metadata.get('source_lang', 'Auto')} to {metadata.get('target_lang', 'Target')}.</p>
    <p><strong>To view the translation:</strong></p>
    <ol>
        <li>Open the HTML file: <code>{os.path.basename(html_output_file)}</code></li>
        <li>The HTML file renders complex scripts perfectly in any modern browser</li>
        <li>To create a PDF: Open the HTML in Chrome/Edge and use "Print → Save as PDF"</li>
    </ol>
    <p style="color: #666; margin-top: 30px;">
        <em>Note: Due to font limitations in PDF libraries for this language, the HTML format provides 
        the best rendering. Browser-based "Print to PDF" preserves all characters.</em>
    </p>
</body></html>"""
                
                with open(output_file, 'w+b') as pdf_file:
                    pisa.CreatePDF(note_html.encode('utf-8'), dest=pdf_file, encoding='utf-8')
                
                logging.info(f"✅ Info PDF created: {output_file}")
            except:
                pass  # If PDF creation fails, HTML is still the primary output
            
        except Exception as e:
            logging.error(f"❌ Output file creation failed: {e}", exc_info=True)
            raise


# ============================================================
# 8️⃣ AI Factory (like ConverterFactory)
# ============================================================
class AIFactory:
    """Factory to get appropriate AI operation (matches ConverterFactory pattern)"""
    
    @staticmethod
    def GetAIOperation(operation_type: str) -> AIOperationBase:
        """
        Get AI operation handler based on type
        
        Args:
            operation_type: One of:
                - "summarize"
                - "chat_with_pdf"
                - "smart_classification"
                - "smart_merge"
                - "translate"
        
        Returns:
            AIOperationBase implementation
        """
        mapping = {
            "summarize": PDFSummarizer,
            "chat_with_pdf": ChatWithPDF,
            "smart_classification": SmartClassification,
            "smart_merge": SmartMerge,
            "translate": PDFTranslator,
        }
        
        operation_class = mapping.get(operation_type.lower())
        
        if not operation_class:
            raise ValueError(f"Unsupported AI operation type: {operation_type}")
        
        logging.info(f"🏭 AIFactory creating: {operation_class.__name__}")
        return operation_class()
            
