from chromadb.utils import embedding_functions
import chromadb

# Initialize embedding function
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="sentence-transformers/all-mpnet-base-v2"
)

# Initialize ChromaDB client
chroma_client = chromadb.Client(
    chromadb.config.Settings(
        persist_directory="chroma",
        is_persistent=True
    )
)

# Get or create collection
collection = chroma_client.get_collection(
    name="news_articles",
    embedding_function=embedding_function
)

def ingest_article(article: dict):
    """
    Embed and store article in ChromaDB.
    """
    text = f"""
Title: {article.get('title')}

Snippet: {article.get('snippet')}

Source: {article.get('source_domain')}
URL: {article.get('url')}
"""

    collection.upsert(
        documents=[text],
        metadatas=[{
            "source_domain": article.get("source_domain"),
            "url": article.get("url"),
            "published_date": article.get("published_date"),
            "category": article.get("category"),
        }],
        ids=[str(article.get("_id"))]  # use the MongoDB ID
    )

    print(f"[ChromaDB] Ingested article with ID: {article.get('_id')} and title: {article.get('title')}")
