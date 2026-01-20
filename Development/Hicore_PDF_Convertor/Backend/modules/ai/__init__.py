"""
AI Module for PDFinity
Provides AI-powered document processing capabilities:
- PDF Summarization (short/detailed)
- Chat with PDF (Q&A using semantic search)
- Smart Classification (separate mixed PDFs by document type)
"""

from modules.ai.ai import (
    AIOperationBase,
    AIFactory,
    PDFSummarizer,
    ChatWithPDF,
    SmartClassification,
    OllamaConfig,
    PDFTextExtractor,
    OllamaClient,
)

__all__ = [
    "AIOperationBase",
    "AIFactory",
    "PDFSummarizer",
    "ChatWithPDF",
    "SmartClassification",
    "AzureConfig",
    "PDFTextExtractor",
    "AzureGPTClient"
]
