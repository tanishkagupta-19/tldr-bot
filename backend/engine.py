import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer
from transformers import pipeline
from pathlib import Path
from langchain_huggingface import HuggingFacePipeline
from langchain_core.prompts import PromptTemplate
import sys
import os
current_dir=os.path.dirname(os.path.abspath(__file__))
parent_dir=os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)
try:
    from crawler.scraper import scrape_times_of_india,scrape_article_content
except ImportError as e:
    raise e
PROJECT_ROOT=Path(__file__).parent.parent
DATA_PATH=PROJECT_ROOT/"data"/"CNN_Articels_clean.csv"
INDEX_PATH=PROJECT_ROOT/"saved_index"/"faiss_index.bin"
SCRAPED_ARTICLES_CACHE={}
def load_models_and_data():
    embedder=SentenceTransformer('BAAI/bge-large-en-v1.5')
    summarizer=pipeline("summarization",model="facebook/bart-large-cnn")
    llm_pipeline=pipeline("text2text-generation",model="google/flan-t5-base",max_new_tokens=256)
    llm=HuggingFacePipeline(pipeline=llm_pipeline)
    df=pd.read_csv(DATA_PATH)
    if 'Url' not in df.columns:
        df['Url']="http://example.com"
    index=faiss.read_index(str(INDEX_PATH))
    return embedder,summarizer,df,index,llm
def perform_search(query:str,embedder:SentenceTransformer,index:faiss.Index,k:int=10):
    query_vector=embedder.encode([query])
    distances,indices=index.search(query_vector,k=k)
    return indices[0]
def search_and_scrape(query,embedder,index,df,k=10):
    matched_indices=perform_search(query,embedder,index,k)
    results=[]
    for i in matched_indices:
        article_id=int(i)
        results.append({"id":article_id,"headline":df.iloc[article_id]['Headline'],"url":df.iloc[article_id]['Url']})
    try:
        toi_articles=scrape_times_of_india()
        for idx,article in enumerate(toi_articles):
            fake_id=1000000+idx
            SCRAPED_ARTICLES_CACHE[fake_id]=article
            results.insert(0,{"id":fake_id,"headline":f"[TOI] {article['title']}","url":article['link']})
    except Exception:
        pass
    return results
def get_content_by_id(article_id,df):
    if article_id>=1000000:
        if article_id in SCRAPED_ARTICLES_CACHE:
            article=SCRAPED_ARTICLES_CACHE[article_id]
            return scrape_article_content(article['link'])
        else:
            return None
    if article_id<0 or article_id>=len(df):
        return None
    return df.iloc[article_id]['Article text']
def generate_summary(text:str,summarizer):
    try:
        if text and isinstance(text,str) and len(text.split())>40:
            summary_result=summarizer(text,max_length=250,min_length=100,do_sample=False)
            if summary_result and summary_result[0]['summary_text']:
                return summary_result[0]['summary_text']
            else:
                return "Warning: Summarizer returned an empty result."
        else:
            return "Warning: Article is too short to summarize."
    except Exception as e:
        return f"Error: Could not generate summary. ({e})"
def get_chat_response(question:str,context:str,llm):
    template="""You are a helpful assistant that answers questions based ONLY on the provided context. If the answer is not in the context, say 'I cannot find the answer in this article. 😔' CONTEXT: {context} QUESTION: {question} ANSWER:"""
    prompt=PromptTemplate(template=template,input_variables=["context","question"])
    llm_chain=prompt|llm
    response=llm_chain.invoke({"context":context,"question":question})
    return response
