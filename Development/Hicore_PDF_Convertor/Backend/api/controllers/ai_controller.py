from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Request
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, ValidationError, field_validator, model_validator
import mimetypes
import os
import zipfile
import shutil
import json
from typing import Optional, List, Literal

from core.logger import setup_logger
from app_manager import AppManager
from api.utils.file_utils import save_upload_file

logger = setup_logger(__name__)
router = APIRouter()

# Valid actions and their requirements
VALID_ACTIONS = ["summarize", "chat_with_pdf", "smart_classification", "smart_merge", "translate"]
VALID_SUMMARY_TYPES = ["short", "detailed", "both"]
VALID_CHAT_MODES = ["setup", "query"]
VALID_MERGE_MODES = ["analyze", "merge"]

# Supported languages for translation
SUPPORTED_LANGUAGES = {
    "en": "English",
    "es": "Spanish",
    "ta": "Tamil",
    "hi": "Hindi",
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


class AIRequestModel(BaseModel):
    """Pydantic model for AI endpoint request validation"""
    
    action: Literal["summarize", "chat_with_pdf", "smart_classification", "smart_merge", "translate"]
    summary_type: Optional[str] = "both"
    mode: Optional[str] = "setup"
    question: Optional[str] = None
    session_id: Optional[str] = None
    order: Optional[List[int]] = None  # For smart_merge
    target_lang: Optional[str] = "en"  # For translate
    source_lang: Optional[str] = None  # For translate (auto-detect if None)
    use_ai: Optional[bool] = False  # For translate (use AI vs Google Translate)
    
    @field_validator('summary_type')
    @classmethod
    def validate_summary_type(cls, v):
        if v is not None and v not in VALID_SUMMARY_TYPES:
            raise ValueError(f"Invalid summary_type: {v}. Must be one of: {VALID_SUMMARY_TYPES}")
        return v
    
    @field_validator('mode')
    @classmethod
    def validate_mode(cls, v):
        # Mode is context-dependent, so we allow any string here and validate in context
        return v
    
    @field_validator('target_lang')
    @classmethod
    def validate_target_lang(cls, v):
        if v is not None and v not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported target language: {v}. Supported: {list(SUPPORTED_LANGUAGES.keys())}")
        return v
    
    @field_validator('source_lang')
    @classmethod
    def validate_source_lang(cls, v):
        # Allow None for auto-detection, or validate against supported languages
        # First, normalize special values to None
        if v in [None, "", "string", "auto"]:
            return None
        # Then validate if it's a real language code
        if v not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported source language: {v}. Supported: {list(SUPPORTED_LANGUAGES.keys())} or leave empty for auto-detect")
        return v
    
    @field_validator('order')
    @classmethod
    def validate_order(cls, v):
        if v is not None:
            if not isinstance(v, list):
                raise ValueError("Order must be a list of integers")
            if not all(isinstance(i, int) and i >= 0 for i in v):
                raise ValueError("Order must contain only non-negative integers")
            if len(v) != len(set(v)):
                raise ValueError("Order must not contain duplicate indices")
        return v
    
    @model_validator(mode='after')
    def validate_action_requirements(self):
        """Validate requirements based on action type"""
        
        if self.action == "chat_with_pdf":
            if self.mode not in VALID_CHAT_MODES:
                raise ValueError(f"Invalid mode for chat_with_pdf: {self.mode}. Must be one of: {VALID_CHAT_MODES}")
            if self.mode == "query":
                if not self.session_id:
                    raise ValueError("session_id is required for chat_with_pdf in query mode")
                if not self.question or not self.question.strip():
                    raise ValueError("question is required for chat_with_pdf in query mode")
        
        elif self.action == "smart_merge":
            if self.mode not in VALID_MERGE_MODES:
                raise ValueError(f"Invalid mode for smart_merge: {self.mode}. Must be one of: {VALID_MERGE_MODES}")
        
        elif self.action == "translate":
            if not self.target_lang:
                raise ValueError("target_lang is required for translate action")
        
        return self


def parse_ai_request(form: dict) -> AIRequestModel:
    """
    Parse and validate AI request from form data.
    Returns validated AIRequestModel or raises HTTPException.
    """
    try:
        # Extract action
        action = form.get("action")
        if not action:
            raise HTTPException(400, "Action is required")
        
        # Parse order from JSON string if provided
        order_list = None
        order_str = form.get("order")
        # Ignore placeholder values like "string", empty string, etc.
        if order_str and order_str not in ["string", "", "null", "undefined"]:
            try:
                order_list = json.loads(order_str)
                if not isinstance(order_list, list):
                    raise ValueError("Order must be a JSON array")
            except json.JSONDecodeError:
                raise HTTPException(400, "Invalid order format. Must be a JSON array like '[0,1,2]'")
        
        # Parse use_ai from form (could be string "true"/"false" or bool)
        use_ai_val = form.get("use_ai", "false")
        if isinstance(use_ai_val, str):
            use_ai_bool = use_ai_val.lower() in ["true", "1", "yes", "on"]
        else:
            use_ai_bool = bool(use_ai_val)
        
        # Sanitize placeholder values for optional string fields
        def sanitize_optional(value):
            """Convert placeholder values to None"""
            if value in [None, "", "string", "null", "undefined"]:
                return None
            return value
        
        source_lang = sanitize_optional(form.get("source_lang"))
        session_id = sanitize_optional(form.get("session_id"))
        question = sanitize_optional(form.get("question"))
        
        # Create and validate model
        req = AIRequestModel(
            action=action,
            summary_type=form.get("summary_type", "both"),
            mode=form.get("mode", "setup"),
            question=question,
            session_id=session_id,
            order=order_list,
            target_lang=form.get("target_lang", "en"),
            source_lang=source_lang,
            use_ai=use_ai_bool
        )
        
        return req
        
    except ValidationError as ve:
        # Format Pydantic validation errors nicely
        errors = []
        for error in ve.errors():
            field = ".".join(str(loc) for loc in error["loc"])
            msg = error["msg"]
            errors.append(f"{field}: {msg}")
        raise HTTPException(422, f"Validation error(s): {'; '.join(errors)}")
    except ValueError as ve:
        raise HTTPException(400, str(ve))


def validate_files(files_list: List, action: str, mode: Optional[str] = None) -> List[str]:
    """
    Validate uploaded files based on action requirements.
    Returns list of error messages, empty if valid.
    """
    errors = []
    
    # Check file count requirements
    if action == "summarize":
        if not files_list:
            errors.append("At least one PDF file is required for summarization")
    
    elif action == "chat_with_pdf":
        if mode == "setup" and not files_list:
            errors.append("PDF file is required for chat_with_pdf setup mode")
    
    elif action == "smart_classification":
        if not files_list:
            errors.append("PDF file(s) required for smart_classification")
        # Removed single file restriction to support batch classification
    
    elif action == "smart_merge":
        if not files_list or len(files_list) < 2:
            errors.append("At least 2 PDF files are required for smart_merge")
    
    elif action == "translate":
        if not files_list:
            errors.append("PDF file is required for translation")
        elif len(files_list) > 1:
            errors.append("Translation only supports 1 file at a time")
    
    # Validate file types
    for f in files_list:
        if f is None:
            continue
        filename = getattr(f, 'filename', '') or ''
        ext = os.path.splitext(filename)[1].lower()
        if ext != ".pdf":
            errors.append(f"Invalid file type: {filename}. Only PDF files are supported.")
    
    return errors


@router.post("/ai")
async def ai(
    request: Request,
    
    # Swagger UI placeholders
    files: List[UploadFile] = File(None, description="PDF file(s) - single or multiple")
):
    """
    Handle AI operations for PDFs.
    
    - Returns: `{"status": "ready", "session_id": "xxx-xxx-xxx", ...}`
    - ⚠️ **SAVE the session_id from the response!**
    
    **Step 2: Query** (ask questions)
    - Set `action=chat_with_pdf`
    - Set `mode=query`
    - Set `session_id` = the session_id from Step 1
    - Set `question` = your question about the PDF
    - (You can leave files empty or upload any file - it won't be used)
    - Returns: `{"question": "...", "answer": "...", "confidence": 0.9, ...}`
    
    ### 3. **smart_classification** - Classify and separate mixed documents
    - Set `action=smart_classification`
    - Upload your PDF file
    - Returns: ZIP file with separated PDFs by document type
    
    ### 4. **smart_merge** - AI-powered optimal PDF merging (2-step process)
    
    **Step 1: Analyze** (get optimal merge order suggestion)
    - Set `action=smart_merge`
    - Set `mode=analyze`
    - Upload multiple PDF files
    - Returns: `{"status": "analyzed", "suggested_order": [0,2,1], "reasoning": "...", "file_info": [...]}`
    
    **Step 2: Merge** (merge in specified order)
    - Set `action=smart_merge`
    - Set `mode=merge`
    - Set `order=[0,2,1]` (indices from analyze or your custom order)
    - Upload the same PDF files in the same order
    - Returns: Merged PDF file
    
    ### 5. **translate** - Translate PDF to another language
    - Set `action=translate`
    - Set `target_lang`: Target language code (en, es, fr, de, pt, it, hi, ta, etc.)
    - Set `source_lang`: Source language code (optional, auto-detects if not provided)
    - Set `use_ai`: False (Google Translate, default) or True (Ollama AI)
    - Upload your PDF file
    - Returns: Translated PDF file with layout preserved
    
    **Supported Languages:**
    - `en` - English
    - `es` - Spanish  
    - `fr` - French
    - `de` - German
    - `pt` - Portuguese
    - `it` - Italian
    - `hi` - Hindi (HTML output)
    - `ta` - Tamil (HTML output)
    - `zh` - Chinese (HTML output)
    - `ja` - Japanese (HTML output)
    - `ko` - Korean (HTML output)
    - `ar` - Arabic (HTML output)
    - `ru` - Russian (HTML output)
    """
    
    try:
        # ⭐ Manual extraction from form (overrides Swagger inputs)
        form = await request.form()
        
        # Log received fields
        form_keys = list(form.keys())
        logger.info(f"📋 Form keys received: {form_keys}")
        
        # Debug: Log form values for translate action
        if form.get("action") == "translate":
            logger.info(f"🔍 Debug form values: action={form.get('action')}, target_lang={form.get('target_lang')}, source_lang={form.get('source_lang')}, use_ai={form.get('use_ai')}")
        
        # Validate request using Pydantic model
        req = parse_ai_request(dict(form))
        
        logger.info(f"🤖 AI request: action={req.action}")
        
        # Extract file(s) - handle both single and multiple uploads
        files_list = form.getlist("files")
        if not files_list:
            # Fallback to 'file' (singular)
            single_file = form.get("file")
            files_list = [single_file] if single_file else []
        
        # Remove None values
        files_list = [f for f in files_list if f is not None]
        
        logger.info(f"📥 Extracted {len(files_list)} file(s)")
        
        # Validate files based on action
        file_errors = validate_files(files_list, req.action, req.mode)
        if file_errors:
            raise HTTPException(422, "; ".join(file_errors))
        
        # Route to appropriate handler
        if req.action == "summarize":
            return await _handle_summarize(
                files_list,
                req.summary_type,
                req.session_id
            )
        elif req.action == "chat_with_pdf":
            return await _handle_chat(
                files_list,
                req.mode,
                req.session_id,
                req.question
            )
        elif req.action == "smart_classification":
            return await _handle_classification(
                files_list,
                req.session_id
            )
        elif req.action == "smart_merge":
            return await _handle_smart_merge(
                files_list,
                req.mode,
                req.order,
                req.session_id
            )
        elif req.action == "translate":
            return await _handle_translate(
                files_list,
                req.target_lang,
                req.source_lang,
                req.use_ai,
                req.session_id
            )
    
    except HTTPException as he:
        logger.error(f"❌ HTTPException ({he.status_code}): {he.detail}")
        raise
    except Exception as e:
        logger.error(f"❌ AI endpoint error: {e}", exc_info=True)
        raise HTTPException(500, f"AI operation failed: {str(e)}")


async def _handle_summarize(
    files_list: List,
    summary_type: str,
    session_id: Optional[str]
):
    """
    Handle summarize action
    - Returns single PDF if summary_type is 'short' or 'detailed'
    - Returns ZIP with both PDFs if summary_type is 'both'
    """
    
    logger.info(f"📥 AI Summarization: Type={summary_type}")
    
    # Save files (validation already done)
    saved_paths = []
    for f in files_list:
        saved_path = save_upload_file(f, session_id)
        saved_paths.append(saved_path)
        logger.info(f"✅ Saved: {os.path.basename(saved_path)}")
    
    if not saved_paths:
        raise HTTPException(400, "No valid PDF files provided")
    
    # Prepare input
    input_data = saved_paths[0] if len(saved_paths) == 1 else saved_paths
    
    # If 'both' - generate both short and detailed summaries
    if summary_type == "both":
        output_pdfs = []
        summaries_text = {}
        
        # Save copy of the file for second summarization
        original_file = saved_paths[0]
        temp_copy = original_file.replace(".pdf", "_temp_copy.pdf")
        shutil.copy2(original_file, temp_copy)
        
        # Generate short summary
        logger.info("📝 Generating short summary...")
        app_short = AppManager()
        result_short = app_short.ai_summarize(
            input_file=original_file,
            settings={"summary_type": "short"}
        )
        
        if result_short and result_short.get("output_file"):
            short_pdf = result_short.get("output_file")
            if os.path.exists(short_pdf):
                # Rename to include _short suffix
                short_pdf_renamed = short_pdf.replace("_summarize.pdf", "_short_summary.pdf")
                shutil.move(short_pdf, short_pdf_renamed)
                output_pdfs.append(short_pdf_renamed)
                summaries_text["short"] = result_short.get("summary_text", "")
                logger.info(f"✅ Short summary created: {os.path.basename(short_pdf_renamed)}")
        
        # Generate detailed summary using the copy
        logger.info("📝 Generating detailed summary...")
        app_detailed = AppManager()
        result_detailed = app_detailed.ai_summarize(
            input_file=temp_copy,
            settings={"summary_type": "detailed"}
        )
        
        if result_detailed and result_detailed.get("output_file"):
            detailed_pdf = result_detailed.get("output_file")
            if os.path.exists(detailed_pdf):
                # Rename to include _detailed suffix
                detailed_pdf_renamed = detailed_pdf.replace("_summarize.pdf", "_detailed_summary.pdf")
                shutil.move(detailed_pdf, detailed_pdf_renamed)
                output_pdfs.append(detailed_pdf_renamed)
                summaries_text["detailed"] = result_detailed.get("summary_text", "")
                logger.info(f"✅ Detailed summary created: {os.path.basename(detailed_pdf_renamed)}")
        
        # Clean up temp copy
        if os.path.exists(temp_copy):
            os.remove(temp_copy)
            logger.info("🧹 Cleaned up temporary file copy")
        
        if not output_pdfs:
            raise HTTPException(500, "Summarization failed - no output generated")
        
        # Create ZIP file with both summaries
        base_name = os.path.splitext(os.path.basename(saved_paths[0]))[0]
        zip_dir = os.path.dirname(output_pdfs[0])
        zip_path = os.path.join(zip_dir, f"{base_name}_summaries.zip")
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for pdf_path in output_pdfs:
                if os.path.exists(pdf_path):
                    zipf.write(pdf_path, os.path.basename(pdf_path))
            
            # Add summary texts as JSON
            summary_info = {
                "source_file": os.path.basename(saved_paths[0]),
                "generated_at": str(os.path.getmtime(output_pdfs[0]) if output_pdfs else ""),
                "summaries": {
                    "short": {
                        "filename": os.path.basename(output_pdfs[0]) if len(output_pdfs) > 0 else None,
                        "text": summaries_text.get("short", "")
                    },
                    "detailed": {
                        "filename": os.path.basename(output_pdfs[1]) if len(output_pdfs) > 1 else None,
                        "text": summaries_text.get("detailed", "")
                    }
                }
            }
            zipf.writestr("summaries.json", json.dumps(summary_info, indent=2))
        
        logger.info(f"✅ Created ZIP with both summaries: {zip_path}")
        
        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename=f"{base_name}_summaries.zip"
        )
    
    else:
        # Single summary type (short or detailed)
        app = AppManager()
        result = app.ai_summarize(
            input_file=input_data,
            settings={"summary_type": summary_type}
        )
        
        if not result:
            raise HTTPException(500, "Summarization failed - no output generated")
        
        summary_pdf = result.get("output_file", "")
        
        # Validate output
        if not os.path.exists(summary_pdf):
            raise HTTPException(500, "Summary PDF not generated")
        
        logger.info(f"✅ Summarization complete")
        
        # Return PDF file directly (like convert endpoint)
        filename = os.path.basename(summary_pdf)
        return FileResponse(
            summary_pdf,
            media_type="application/pdf",
            filename=filename
        )



async def _handle_chat(
    files_list: List,
    mode: str,
    session_id: Optional[str],
    question: Optional[str]
):
    """Handle chat_with_pdf action"""
    
    logger.info(f"💬 Chat with PDF: Mode={mode}")
    
    if mode == "setup":
        # Setup mode - create index
        file = files_list[0]
        
        # Save uploaded file
        saved_path = save_upload_file(file, session_id)
        logger.info(f"✅ Saved: {os.path.basename(saved_path)}")
        
        # Execute chat setup
        app = AppManager()
        result = app.run_action(
            category="ai",
            action_type="chat_with_pdf",
            input_data=saved_path,
            settings={"mode": "setup"}
        )
        
        if not result:
            raise HTTPException(500, "Chat setup failed")
        
        return JSONResponse(content={
            "status": "ready",
            "session_id": result.get("session_id", session_id),
            "chunk_count": result.get("chunk_count", 0),
            "message": "PDF indexed successfully. You can now ask questions using query mode."
        })
    
    else:  # query mode
        # Find session file
        output_dir = os.path.join(os.getcwd(), "output", session_id)
        if not os.path.exists(output_dir):
            raise HTTPException(404, f"Session not found: {session_id}. Run setup first.")
        
        # Find .pkl session file
        session_files = [f for f in os.listdir(output_dir) if f.endswith("_chat_session.pkl")]
        if not session_files:
            raise HTTPException(404, "Chat session not found. Run setup first.")
        
        session_file = os.path.join(output_dir, session_files[0])
        
        # Execute query directly using ChatWithPDF class (bypass AppManager to use existing session)
        from modules.ai.ai import AIFactory
        try:
            chat_op = AIFactory.GetAIOperation("chat_with_pdf")
            result = chat_op.Process(
                input_file=session_file,  # Not used for query, but required
                output_file=session_file,  # The session file path
                mode="query",
                question=question
            )
        except Exception as e:
            logger.error(f"❌ Query failed: {e}", exc_info=True)
            raise HTTPException(500, f"Query failed: {str(e)}")
        
        if not result:
            raise HTTPException(500, "Query failed")
        
        return JSONResponse(content={
            "question": result.get("question", question),
            "answer": result.get("answer", ""),
            "confidence": result.get("confidence", 0.0),
            "relevant_context": result.get("relevant_context", [])
        })


async def _handle_classification(
    files_list: List,
    session_id: Optional[str]
):
    """
    Handle smart_classification action.
    Supports Batch Classification (multiple files) -> Returns JSON report.
    """
    
    logger.info(f"🔍 Smart classification (Batch Mode)")
    
    # Save all uploaded files
    saved_paths = []
    for f in files_list:
        saved_path = save_upload_file(f, session_id)
        saved_paths.append(saved_path)
        logger.info(f"✅ Saved: {os.path.basename(saved_path)}")
    
    if not saved_paths:
         raise HTTPException(400, "No files saved")

    # Execute classification
    # Pass LIST of files to AppManager -> AIFactory -> SmartClassification
    app = AppManager()
    result = app.run_action(
        category="ai",
        action_type="smart_classification",
        input_data=saved_paths, # List of paths
        settings={}
    )
    
    if not result:
        raise HTTPException(500, "Classification failed")
    
    # Return JSON response for frontend display
    return JSONResponse(content={
        "status": "success",
        "file_count": len(saved_paths),
        "results": result.get("results", []),
        "summary": result.get("summary", ""),
        "message": "Classification complete."
    })


def _pluralize(word: str) -> str:
    """
    Simple pluralization for document type names
    invoice -> invoices, resume -> resumes, etc.
    """
    word = word.lower().strip()
    
    # Already plural
    if word.endswith('s'):
        return word
    
    # Special cases
    if word.endswith('y'):
        return word[:-1] + 'ies'
    
    # Default: add 's'
    return word + 's'


async def _handle_smart_merge(
    files_list: List,
    mode: str,
    order: Optional[List[int]],
    session_id: Optional[str]
):
    """
    Handle smart_merge action
    
    Two-step flow:
    1. analyze: Returns suggested merge order and file info
    2. merge: Merges PDFs in specified order, returns merged PDF
    """
    
    logger.info(f"🔀 Smart Merge: Mode={mode}")
    
    # Save all files (validation already done)
    saved_paths = []
    for idx, f in enumerate(files_list):
        saved_path = save_upload_file(f, session_id)
        saved_paths.append(saved_path)
        logger.info(f"✅ Saved file {idx + 1}: {os.path.basename(saved_path)}")
    
    if mode == "analyze":
        # Analyze mode - suggest optimal order
        app = AppManager()
        result = app.run_action(
            category="ai",
            action_type="smart_merge",
            input_data=saved_paths,
            settings={"mode": "analyze"}
        )
        
        if not result:
            raise HTTPException(500, "Smart merge analysis failed")
        
        return JSONResponse(content={
            "status": "analyzed",
            "file_count": result.get("file_count", len(saved_paths)),
            "total_pages": result.get("total_pages", 0),
            "suggested_order": result.get("suggested_order", list(range(len(saved_paths)))),
            "reasoning": result.get("reasoning", ""),
            "relationships": result.get("relationships", []),
            "file_info": result.get("file_info", []),
            "analysis": result.get("analysis", []),
            "message": "Analysis complete. Use 'merge' mode with your preferred order to create the merged PDF."
        })
    
    else:  # merge mode
        if order is None:
            # Default to original order if not specified
            order = list(range(len(saved_paths)))
        
        # Validate order
        if len(order) != len(saved_paths):
            raise HTTPException(
                400, 
                f"Order list length ({len(order)}) doesn't match file count ({len(saved_paths)})"
            )
        
        if not all(0 <= i < len(saved_paths) for i in order):
            raise HTTPException(400, "Invalid indices in order list")
        
        if len(set(order)) != len(order):
            raise HTTPException(400, "Duplicate indices in order list")
        
        # Execute merge
        app = AppManager()
        result = app.run_action(
            category="ai",
            action_type="smart_merge",
            input_data=saved_paths,
            settings={"mode": "merge", "order": order}
        )
        
        if not result:
            raise HTTPException(500, "Smart merge failed")
        
        output_file = result.get("output_file", "")
        
        if not output_file or not os.path.exists(output_file):
            raise HTTPException(500, "Merge failed - no output file generated")
        
        # Return merged PDF
        filename = "smart_merged.pdf"
        
        logger.info(f"✅ Smart merge complete: {result.get('total_pages', 0)} pages")
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename=filename,
            headers={
                "X-Total-Pages": str(result.get("total_pages", 0)),
                "X-Files-Merged": str(result.get("files_merged", len(saved_paths))),
                "X-Merge-Order": json.dumps(order)
            }
        )


async def _handle_translate(
    files_list: List,
    target_lang: str,
    source_lang: Optional[str],
    use_ai: bool,
    session_id: Optional[str]
):
    """
    Handle translate action
    - Translates PDF content to target language
    - Supports: English, Spanish, Tamil, Hindi (bidirectional)
    - Auto-detects source language if not provided
    - Uses Google Translate (free) by default, Ollama AI if use_ai=True
    """
    
    logger.info(f"🌐 AI Translation: target={target_lang}, source={source_lang or 'auto'}, use_ai={use_ai}")
    logger.info(f"📄 Processing translation to {SUPPORTED_LANGUAGES.get(target_lang, target_lang)}...")
    
    # Generate session_id if not provided
    if not session_id:
        import uuid
        session_id = str(uuid.uuid4())
    
    # Save uploaded PDF (validation already done)
    file = files_list[0]
    filename = file.filename if hasattr(file, 'filename') else 'document.pdf'
    logger.info(f"📥 Received file: {filename}")
    
    saved_path = save_upload_file(file, session_id)
    logger.info(f"✅ Saved: {os.path.basename(saved_path)}")
    
    # Execute translation
    app = AppManager()
    result = app.run_action(
        category="ai",
        action_type="translate",
        input_data=saved_path,
        settings={
            "target_lang": target_lang,
            "source_lang": source_lang,
            "use_ai": use_ai
        }
    )
    
    if not result:
        raise HTTPException(500, "Translation failed")
    
    # Check for skipped translation (same language)
    if result.get("status") == "skipped":
        return JSONResponse(content={
            "status": "skipped",
            "message": result.get("message", "Source and target languages are identical"),
            "source_lang": result.get("source_lang"),
            "target_lang": result.get("target_lang")
        })
    
    output_file = result.get("output_file", "")
    
    if not output_file or not os.path.exists(output_file):
        raise HTTPException(500, "Translation failed - no output file generated")
    
    # Prepare filename
    source_name = SUPPORTED_LANGUAGES.get(result.get("source_lang", "unknown"), "unknown")
    target_name = SUPPORTED_LANGUAGES.get(target_lang, target_lang)
    output_filename = f"translated_{source_name}_to_{target_name}.pdf"
    
    logger.info(f"✅ Translation complete: {source_name} → {target_name}")
    
    return FileResponse(
        output_file,
        media_type="application/pdf",
        filename=output_filename,
        headers={
            "X-Source-Language": result.get("source_lang", "unknown"),
            "X-Source-Language-Name": source_name,
            "X-Target-Language": target_lang,
            "X-Target-Language-Name": target_name,
            "X-Translation-Method": result.get("translation_method", "Google Translate"),
            "X-Original-Length": str(result.get("original_length", 0)),
            "X-Translated-Length": str(result.get("translated_length", 0)),
            "X-Pages": str(result.get("pages", 0))
        }
        )
