import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.startup import startup_event


# ------------------------------------------------
# FASTAPI APPLICATION INSTANCE
# ------------------------------------------------
app = FastAPI(
    title="AI Career Platform API",
    version="1.0.0",
    description="Backend API for AI Career Platform"
)


# ------------------------------------------------
# CORS CONFIGURATION
# ------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------
# FIXED STARTUP EVENT — NO CIRCULAR IMPORT
# ------------------------------------------------
@app.on_event("startup")
async def startup():
    """
    Correct startup. Pass app instance to startup_event.
    (startup_event should NOT import app.main — that caused circular import)
    """
    await startup_event(app)


# ------------------------------------------------
# STATIC UPLOAD DIRECTORY
# ------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent  # project root
UPLOAD_DIR = BASE_DIR / "app" / "uploads"

# Ensure folder exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Mount static route
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


# ------------------------------------------------
# ROOT ENDPOINT
# ------------------------------------------------
@app.get("/")
async def root():
    return {
        "message": "AI Career Platform API is running",
        "profile_upload_path": str(UPLOAD_DIR),
        "root_upload_path": str(UPLOAD_DIR),
    }


#
# import requests
# from bs4 import BeautifulSoup
# from duckduckgo_search import DDGS
# import chromadb
# from sentence_transformers import SentenceTransformer
#
# # ---- CONFIG ----
# MODEL = SentenceTransformer("all-MiniLM-L6-v2")
# chroma = chromadb.Client()
# collection = chroma.get_or_create_collection("web_rag_demo")
#
# def fetch_text(url):
#     try:
#         html = requests.get(url, timeout=10).text
#         soup = BeautifulSoup(html, "html.parser")
#
#         for t in soup(["script", "style", "nav", "footer", "header"]):
#             t.decompose()
#
#         text = soup.get_text("\n")
#         return "\n".join(x.strip() for x in text.splitlines() if x.strip())
#     except:
#         return ""
#
# def chunk(text, size=700, overlap=120):
#     chunks = []
#     i = 0
#     while i < len(text):
#         chunks.append(text[i:i+size])
#         i += size - overlap
#     return chunks
#
#
# # -------------------------------
# # 1️⃣ TOPIC INPUT (build once)
# # -------------------------------
# topic = input("What topic do you want to search? ")
#
# print("\nSearching...")
# results = list(DDGS().text(topic, max_results=5))
#
# docs = []
# for r in results:
#     url = r["href"]
#     text = fetch_text(url)
#     if text:
#         docs.extend(chunk(text))
#
# ids = [f"doc_{i}" for i in range(len(docs))]
# embs = MODEL.encode(docs).tolist()
#
# collection.upsert(ids=ids, documents=docs, embeddings=embs)
#
# print(f"Indexed {len(docs)} chunks")
#
# # -------------------------------
# # 2️⃣ QUESTION LOOP (ask many)
# # -------------------------------
# print("\nVector DB ready. Ask questions about this topic.")
# print("Type 'exit' to quit.\n")
#
# while True:
#     question = input("Ask: ")
#     if question.lower() in ["exit", "quit", "q"]:
#         break
#
#     q_emb = MODEL.encode(question).tolist()
#
#     hits = collection.query(
#         query_embeddings=[q_emb],
#         n_results=4
#     )
#
#     print("\nANSWER CONTEXT:\n")
#     for d in hits["documents"][0]:
#         print("-", d[:200], "...\n")
