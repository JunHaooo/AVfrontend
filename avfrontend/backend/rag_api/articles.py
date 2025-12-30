from fastapi import APIRouter
from ingest_article import ingest_article

router = APIRouter()

@router.post("/articles")
def save_article(article: dict):
    # TODO: replace with real DB save
    # save_to_db(article)

    ingest_article(article)

    return {"status": "ok"}
