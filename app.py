import streamlit as st
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from transformers import pipeline
from pathlib import Path
import time

# --- Use pathlib for robust path handling ---
PROJECT_ROOT = Path(__file__).parent
DATA_PATH = PROJECT_ROOT / "data" / "CNN_Articels_clean.csv"
INDEX_PATH = PROJECT_ROOT / "saved_index" / "faiss_index.bin"

# --- LOADING MODELS AND DATA (with Streamlit's caching) ---
@st.cache_resource
def load_models_and_data():
    """
    Loads all necessary models and data.
    The @st.cache_resource decorator ensures this function only runs ONCE.
    """
    st.write("Loading models and data for the first time... This might take a moment.")
    
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    
    df = pd.read_csv(DATA_PATH)
    if 'Url' not in df.columns:
        st.error("Dataset is missing the required 'Url' column.")
        df['Url'] = "http://example.com"
        
    index = faiss.read_index(str(INDEX_PATH))
    
    st.write("Models and data loaded successfully!")
    return embedder, summarizer, df, index

embedder, summarizer, df, index = load_models_and_data()


# --- STREAMLIT APP UI ---
st.title("🤖 TLDR Bot")
st.write("Ever open an article and see a massive wall of text? Yeah, this bot gets it.")

query = st.text_input("What do you want to read about today?", "latest advancements in artificial intelligence")

if st.button("Search & Summarize Top 10"):
    if query:
        with st.spinner("Finding the top 10 articles and summarizing them... This will take a few minutes!"):
            start_time = time.time()
            
            query_vector = embedder.encode([query])
            distances, indices = index.search(query_vector, k=10)
            
            end_time = time.time()
            st.success(f"Search completed in {end_time - start_time:.2f} seconds. Now generating summaries...")

            st.header("Top 10 Most Relevant Articles")

            for i, article_index in enumerate(indices[0]):
                headline = df.iloc[article_index]['Headline']
                original_text = df.iloc[article_index]['Article text']
                article_url = df.iloc[article_index]['Url']
                
                st.subheader(f"{i + 1}. {headline}")
                st.write(f"[Read Original Article]({article_url})")
                
                # --- THIS IS THE FINAL, ROBUST FIX ---
                # We will wrap the summarization in a try-except block.
                try:
                    # First, we still do a basic check on the input text
                    if original_text and isinstance(original_text, str) and len(original_text.split()) > 50:
                        # Only summarize if the article has a reasonable length (e.g., > 50 words)
                        summary_result = summarizer(original_text, max_length=150, min_length=40, do_sample=False)
                        
                        # Also check if the summarizer returned a valid result
                        if summary_result and summary_result[0]['summary_text']:
                            with st.expander("Show Summary (TL;DR)"):
                                st.write(summary_result[0]['summary_text'])
                        else:
                            raise ValueError("Summarizer returned an empty result.")
                    else:
                        with st.expander("Show Summary (TL;DR)"):
                            st.warning("Article is too short to summarize.")

                except Exception as e:
                    # If ANY error occurs during summarization, we catch it here.
                    with st.expander("Show Summary (TL;DR)"):
                        st.error(f"Could not generate summary for this article. Error: {e}")

                with st.expander("Show Full Original Text"):
                    st.write(original_text if isinstance(original_text, str) else "No text available.")
                
                st.divider()
            
    else:
        st.warning("Please enter a search query first.")

