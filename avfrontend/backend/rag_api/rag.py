import os
from dotenv import load_dotenv
from openai import OpenAI
import chromadb
from chromadb.utils import embedding_functions

load_dotenv()

client = OpenAI(
    api_key=os.environ["DEEPSEEK_API_KEY"],
    base_url="https://api.deepseek.com"
)

embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="sentence-transformers/all-mpnet-base-v2"
)

chroma_client = chromadb.Client(
    chromadb.config.Settings(
        persist_directory="chroma",
        is_persistent=True
    )
)

collections = [c.name for c in chroma_client.list_collections()]
if "news_articles" not in collections:
    raise RuntimeError("Collection 'news_articles' not found. Run ingestion first.")

collection = chroma_client.get_collection(
    name="news_articles",
    embedding_function=embedding_function
)

def answer_question(query_text: str):
    results = collection.query(
        query_texts=[query_text],
        n_results=6
    )

    docs = results["documents"][0]
    metas = results["metadatas"][0]

    if not docs:
        return "I don't have enough information to answer that.", []

    context_text = "\n\n---\n\n".join(docs)

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "Answer ONLY using the provided context."},
            {
                "role": "user",
                "content": f"Context:\n{context_text}\n\nQuestion:\n{query_text}"
            }
        ]
    )

    sources = list(set(m.get("source_domain", "unknown") for m in metas))

    return response.choices[0].message.content, sources
