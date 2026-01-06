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

## Frontend–Backend Communication

The application uses **Next.js API routes as an orchestration layer** between the client UI, external services, and a **Python FastAPI backend** responsible for retrieval-augmented generation (RAG) and vector ingestion. 

### Client → Next.js API Routes

All client-side interactions (article upload, preview, and chat) are routed through **Next.js API endpoints** under `app/api/*`. 

---

### Article Extraction & Preview (`POST /api/extract`)

When a user submits a public article URL:

1. The client calls `POST /api/extract`
2. The API route uses **ScrapingBee** to fetch and render the page
3. Article metadata and content are extracted server-side
4. A structured preview (title, snippet, image, full text) is returned to the client

This step allows users to validate content before ingestion.

---

### Article Persistence (`POST /api/articles`)

After user confirmation:

1. The client sends article data to `POST /api/articles`
2. The API route stores or updates article metadata in **MongoDB**
3. Articles are upserted by URL to prevent duplication

MongoDB is used for **metadata storage and management**, separate from the vector database.

---

### FastAPI Ingestion & Vector Storage (`POST /articles`)

For embedding generation and vector persistence:

1. Article data is forwarded to the FastAPI backend
2. FastAPI inserts the article into MongoDB
3. The article content is ingested into **ChromaDB** via the ingestion pipeline
4. Embeddings are stored for semantic retrieval

All embedding logic and vector storage are handled by the Python backend.

---

### Chat & Retrieval (`POST /api/chat` → `POST /chat`)

For question answering:

1. The client sends conversation history to `POST /api/chat`
2. The API route extracts the latest user query
3. The query is forwarded to `POST /chat` on the FastAPI service
4. FastAPI executes the RAG pipeline:
   - retrieves relevant documents from ChromaDB
   - generates a response using the retrieved context
5. The answer and optional source metadata are returned to the client

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
