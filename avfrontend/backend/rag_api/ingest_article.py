# Initializes the ChromaDB collection and defines logic to embed and store article content for retrieval.
from chromadb.utils import embedding_functions
import chromadb

embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="sentence-transformers/all-mpnet-base-v2"
)

chroma_client = chromadb.Client(
    chromadb.config.Settings(
        persist_directory="chroma",
        is_persistent=True
    )
)

collection = chroma_client.get_collection(
    name="news_articles",
    embedding_function=embedding_function
)

def ingest_article(article: dict):
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
    ids=[str(article.get("_id"))]  # use _id from MongoDB
)

