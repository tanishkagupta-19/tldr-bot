from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engine import (
    load_models_and_data, 
    perform_search, 
    generate_summary,
    get_chat_response
)

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

    matched_indices = perform_search(query, embedder, index, k=10)
    
    results = []
    for i in matched_indices:
        article_id = int(i) 
        results.append({
            "id": article_id,
            "headline": df.iloc[article_id]['Headline'],
            "url": df.iloc[article_id]['Url']
        })
    
    return {"results": results}


@app.get("/summarize/{article_id}")
def get_summary(article_id: int):
    if article_id < 0 or article_id >= len(df):
        raise HTTPException(status_code=404, detail="Article ID not found.")

    article_text = df.iloc[article_id]['Article text']
    summary = generate_summary(article_text, summarizer)
    return {"article_id": article_id, "summary": summary}


@app.post("/chat")
def chat_with_article(request: ChatRequest):
    article_id = request.article_id
    question = request.question

    if article_id < 0 or article_id >= len(df):
        raise HTTPException(status_code=404, detail="Article ID not found.")
    
    context = df.iloc[article_id]['Article text']
    answer = get_chat_response(question, context, llm)
    
    return {"article_id": article_id, "question": question, "answer": answer}

