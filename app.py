import streamlit as st
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from transformers import pipeline
from pathlib import Path
import time
import matplotlib.pyplot as plt

PROJECT_ROOT = Path(__file__).parent
DATA_PATH = PROJECT_ROOT / "data" / "CNN_Articels_clean.csv"
INDEX_PATH = PROJECT_ROOT / "saved_index" / "faiss_index.bin"

@st.cache_resource
def load_models_and_data():
    """
    Loads all necessary models and data.
    The @st.cache_resource decorator ensures this function only runs ONCE,
    the very first time the app starts. This is crucial for performance.
    """
    st.write("Loading models and data for the first time... This might take a moment.")
    
    # Load the model for creating vector embeddings
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Load the pipeline for summarization. We'll use BART, a great model for this.
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    
    # Load the dataset to get the article text
    df = pd.read_csv(DATA_PATH)
    
    # Load the pre-built FAISS index
    index = faiss.read_index(str(INDEX_PATH))
    
    st.write("Models and data loaded successfully!")
    return embedder, summarizer, df, index

embedder, summarizer, df, index = load_models_and_data()


# --- STREAMLIT APP UI ---
st.title("🤖 TLDR Bot")
st.write("Ever open an article and see a massive wall of text? Yeah, this bot gets it.")

# User input text box
query = st.text_input("What do you want to read about today?", "latest advancements in artificial intelligence")

# The button to trigger the search and summary
if st.button("Search & Summarize"):
    if query:
        # Show a spinner while the backend is working
        with st.spinner("Searching for the best article and summarizing..."):
            start_time = time.time()
            
            # 1. Convert the user's query to a vector
            query_vector = embedder.encode([query])
            
            # 2. Search FAISS index to find the top 5 closest matches
            distances, indices = index.search(query_vector, k=5)
            
            # --- The best match is still the first one ---
            matched_index = indices[0][0]
            
            # 3. Retrieve the article's text and headline from the dataframe
            article_text = df.iloc[matched_index]['Article text']
            article_headline = df.iloc[matched_index]['Headline']
            
            # 4. Summarize the text of the found article
            summary = summarizer(article_text, max_length=150, min_length=40, do_sample=False)
            
            end_time = time.time()
            
            # --- DISPLAY THE RESULTS ---
            st.subheader("Closest Article Found:")
            st.write(f"**{article_headline}**")
            
            st.subheader("Summary (TL;DR):")
            st.write(summary[0]['summary_text'])
            
            st.success(f"Done in {end_time - start_time:.2f} seconds.")

            # --- NEW: Display the similarity plot ---
            st.subheader("Top 5 Search Results & Similarity")

            # Get the headlines and distances for the top 5
            top_headlines = [df.iloc[i]['Headline'] for i in indices[0]]
            top_distances = distances[0]
            
            # Convert distances to a similarity score (closer to 1 is better)
            similarity_scores = [1 / (1 + d) for d in top_distances]

            # Create the plot
            fig, ax = plt.subplots(figsize=(10, 5))
            ax.barh(range(len(top_headlines)), similarity_scores, color='skyblue')
            ax.set_yticks(range(len(top_headlines)))
            ax.set_yticklabels([f"{h[:60]}..." for h in top_headlines]) # Truncate long headlines
            ax.invert_yaxis()  # Puts the best match at the top
            ax.set_xlabel('Similarity Score (closer to 1 is better)')
            ax.set_title('Search Result Similarity')
            ax.grid(axis='x', linestyle='--', alpha=0.6)

            # Display the plot in Streamlit
            st.pyplot(fig)
            
    else:
        st.warning("Please enter a search query first.")

