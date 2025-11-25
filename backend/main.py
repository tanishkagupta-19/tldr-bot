from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine import (
    load_models_and_data, 
    perform_search, 
    generate_summary,
    get_chat_response
)

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from crawler.scraper import scrape_times_of_india, scrape_article_content

# --- APPLICATION SETUP ---
app = FastAPI(
    title="TLDR Bot API",
    description="An API for semantic search, summarization, and chat with news articles.",
    version="2.0.0"
)

# --- CORS MIDDLEWARE ---
# This new section allows your frontend to talk to your backend.
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # The default port for Vite React apps
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LOAD MODELS ON STARTUP ---
embedder, summarizer, df, index, llm = load_models_and_data()

# Global cache for scraped articles
SCRAPED_ARTICLES_CACHE = {}

# --- DATA MODELS FOR REQUESTS ---
class ChatRequest(BaseModel):
    article_id: int
    question: str

# --- API ENDPOINTS ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the TLDR Bot API!"}


@app.get("/search")
def search_articles(query: str):
    if not query or not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # 1. Local Semantic Search
    matched_indices = perform_search(query, embedder, index, k=10)
    
    results = []
    for i in matched_indices:
        article_id = int(i) 
        results.append({
            "id": article_id,
            "headline": df.iloc[article_id]['Headline'],
            "url": df.iloc[article_id]['Url']
        })
    
    # 2. Scrape Times of India
    try:
        toi_articles = scrape_times_of_india()
        # Prepend scraped articles to results
        # Use IDs starting from 1,000,000 to distinguish from local dataset
        for idx, article in enumerate(toi_articles):
            fake_id = 1000000 + idx
            SCRAPED_ARTICLES_CACHE[fake_id] = article
            results.insert(0, {
                "id": fake_id,
                "headline": f"[TOI] {article['title']}",
                "url": article['link']
            })
    except Exception as e:
        print(f"Scraping failed: {e}")
        # Continue with just local results if scraping fails
    
    return {"results": results}


@app.get("/summarize/{article_id}")
def get_summary(article_id: int):
    # Handle Scraped Articles
    if article_id >= 1000000:
        if article_id in SCRAPED_ARTICLES_CACHE:
            article = SCRAPED_ARTICLES_CACHE[article_id]
            article_text = scrape_article_content(article['link'])
            if not article_text:
                return {"article_id": article_id, "summary": "Could not fetch article content."}
            summary = generate_summary(article_text, summarizer)
            return {"article_id": article_id, "summary": summary}
        else:
            raise HTTPException(status_code=404, detail="Scraped article not found in cache. Please search again.")

    # Handle Local Articles
    if article_id < 0 or article_id >= len(df):
        raise HTTPException(status_code=404, detail="Article ID not found.")

    article_text = df.iloc[article_id]['Article text']
    summary = generate_summary(article_text, summarizer)
    return {"article_id": article_id, "summary": summary}


@app.post("/chat")
def chat_with_article(request: ChatRequest):
    article_id = request.article_id
    question = request.question

    # Handle Scraped Articles
    if article_id >= 1000000:
        if article_id in SCRAPED_ARTICLES_CACHE:
            article = SCRAPED_ARTICLES_CACHE[article_id]
            context = scrape_article_content(article['link'])
            if not context:
                 return {"article_id": article_id, "question": question, "answer": "Could not fetch article content."}
            answer = get_chat_response(question, context, llm)
            return {"article_id": article_id, "question": question, "answer": answer}
        else:
             raise HTTPException(status_code=404, detail="Scraped article not found in cache. Please search again.")

    # Handle Local Articles
    if article_id < 0 or article_id >= len(df):
        raise HTTPException(status_code=404, detail="Article ID not found.")
    
    context = df.iloc[article_id]['Article text']
    answer = get_chat_response(question, context, llm)
    
    return {"article_id": article_id, "question": question, "answer": answer}

