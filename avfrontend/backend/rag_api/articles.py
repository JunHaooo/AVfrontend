from fastapi import APIRouter
from ingest_article import ingest_article
from pymongo import MongoClient
import os

router = APIRouter()

# Load MongoDB connection from environment
MONGODB_URI = os.environ.get("MONGODB_URI")
if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI not set in environment")

client = MongoClient(MONGODB_URI)
db = client["AVnews"]
collection = db["articles"]

@router.post("/articles")
def save_article(article: dict):
    """
    Save a new article to MongoDB and ingest into ChromaDB.
    """
    # Insert into MongoDB
    result = collection.insert_one(article)
    article["_id"] = str(result.inserted_id)  # convert ObjectId to str

    # Ingest into ChromaDB
    ingest_article(article)

    return {"status": "ok", "id": article["_id"]}
