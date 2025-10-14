import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer
from transformers import pipeline
from pathlib import Path
from langchain_huggingface import HuggingFacePipeline
from langchain.prompts import PromptTemplate

PROJECT_ROOT=Path(__file__).parent.parent
DATA_PATH=PROJECT_ROOT/"data"/"CNN_Articels_clean.csv"
INDEX_PATH=PROJECT_ROOT/"saved_index"/"faiss_index.bin"

def load_models_and_data():
    print("Loading models and data for the backend...")
    embedder=SentenceTransformer('BAAI/bge-large-en-v1.5')
    summarizer=pipeline("summarization",model="facebook/bart-large-cnn")
    llm_pipeline=pipeline("text2text-generation",model="google/flan-t5-base",max_new_tokens=256)
    llm=HuggingFacePipeline(pipeline=llm_pipeline)
    df=pd.read_csv(DATA_PATH)
    if 'Url' not in df.columns:
        df['Url']="http://example.com"
    index=faiss.read_index(str(INDEX_PATH))
    print("Backend models and data loaded successfully!")
    return embedder, summarizer, df, index, llm

def perform_search(query:str, embedder: SentenceTransformer,index:faiss.Index,k:int=10):
    query_vector=embedder.encode([query])
    distances,indices=index.search(query_vector,k=k)
    return indices[0]

def generate_summary(text: str, summarizer):
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
    template="""
    You are a helpful assistant that answers questions based ONLY on the provided context.
    If the answer is not in the context, say 'I cannot find the answer in this article. 😔'
    
    CONTEXT:
    {context}
    
    QUESTION:
    {question}
    
    ANSWER:
    """
    prompt=PromptTemplate(template=template, input_variables=["context","question"])
    llm_chain=prompt|llm
    response=llm_chain.invoke({"context":context,"question":question})
    return response

