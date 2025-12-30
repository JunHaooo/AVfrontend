# AVFrontend

AVFrontend is a full-stack web application featuring a **Next.js frontend** and a **Python-based Retrieval-Augmented Generation (RAG) backend** powered by **ChromaDB**. The project focuses on ingesting online articles, embedding their content, and enabling retrieval-based interactions through a chat interface.

---

## Architecture Overview

### Frontend
- Next.js (TypeScript)
- Client-side UI with API route integration
- Article upload, preview, and chat interfaces

### Backend
- **Express.js API** for local development and prototyping
- **Python FastAPI service** for RAG and embedding workflows
- **MongoDB (local instance)** for article metadata storage
- **ChromaDB** for persistent vector storage

> ⚠️ The backend is intended for **local development and prototyping only** and is not production-ready.

---

## Features

- Next.js frontend with serverless API routes
- Upload and extract articles via public URLs
- Article preview prior to ingestion
- Persistent vector storage using ChromaDB
- Article ingestion and semantic querying
- Chat interface powered by a RAG pipeline
- Modular Python backend using FastAPI

---

## Article Upload by URL

The application supports uploading and ingesting articles directly from public URLs.

### Workflow
1. A user submits an article URL  
2. The backend extracts metadata and content  
3. A preview is displayed (title, snippet, image, publication date, source)  
4. The article is stored for retrieval and semantic search  

### Extracted Fields
- Title  
- Snippet / summary  
- Source domain  
- Publication date (when available)  
- Preview image (if available)  

---

## Known Limitations

- Article extraction depends on the structure of the target website
- Some websites may block metadata or preview images
- No authentication or rate limiting implemented
- Not all articles provide publication dates or images
- `articles.py` and `ingest_article.py` are not triggered automatically when new articles are added to the database

---

## Next Steps

- Extend the MongoDB schema to store full article text
- Enable automatic embedding generation when new articles are added
- Improve backend orchestration between database updates and ingestion
- Add authentication and access controls
- Prepare the system for production deployment
