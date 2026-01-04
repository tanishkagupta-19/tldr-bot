from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .engine import(load_models_and_data,search_and_scrape,get_content_by_id,generate_summary,get_chat_response)
app=FastAPI(title="TLDR Bot API",description="An API for semantic search, summarization, and chat with news articles.",version="2.0.0")
origins=["http://localhost","http://localhost:3000","http://localhost:5173"]
app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
embedder,summarizer,df,index,llm=load_models_and_data()
class ChatRequest(BaseModel):
    article_id:int
    question:str
@app.get("/")
def read_root():
    return{"message":"Welcome to the TLDR Bot API!"}
@app.get("/search")
def search_articles(query:str):
    if not query or not query.strip():
        raise HTTPException(status_code=400,detail="Query cannot be empty.")
    results=search_and_scrape(query,embedder,index,df)
    return{"results":results}
@app.get("/summarize/{article_id}")
def get_summary(article_id:int):
    article_text=get_content_by_id(article_id,df)
    if not article_text:
        raise HTTPException(status_code=404,detail="Article not found or content unavailable.")
    summary=generate_summary(article_text,summarizer)
    return{"article_id":article_id,"summary":summary}
@app.post("/chat")
def chat_with_article(request:ChatRequest):
    article_id=request.article_id
    question=request.question
    context=get_content_by_id(article_id,df)
    if not context:
        raise HTTPException(status_code=404,detail="Article not found or content unavailable.")
    answer=get_chat_response(question,context,llm)
    return{"article_id":article_id,"question":question,"answer":answer}
