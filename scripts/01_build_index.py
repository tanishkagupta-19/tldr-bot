import pandas as pd
from sentence_transformers import SentenceTransformer
import numpy as np
import os
import faiss
from pathlib import Path

DATA_PATH=Path("data")/"CNN_Articels_clean.csv"
EMBEDDING_PATH=Path("saved_index")/"article_embeddings.npy"
INDEX_PATH=Path("saved_index")/"faiss_index.bin"
embeddings=None
article_texts=[]
try:
    df=pd.read_csv(DATA_PATH)
    df.dropna(subset=['Article text'],inplace=True)
    article_texts=df['Article text'].tolist()
except FileNotFoundError:
    print(f"Error:File not found at {DATA_PATH}. Cannot proceed.")
if article_texts:
    model=SentenceTransformer('BAAI/bge-large-en-v1.5')
    embeddings=model.encode(article_texts,show_progress_bar=True)
    os.makedirs(EMBEDDING_PATH.parent,exist_ok=True)
    np.save(EMBEDDING_PATH,embeddings)

    if embeddings is not None:
        embedding_dimension=embeddings.shape[1]
        index=faiss.IndexFlatL2(embedding_dimension)
        index.add(embeddings)
        faiss.write_index(index,str(INDEX_PATH))
        print(f"Index built successfully with {index.ntotal} vectors.")
else:
    print("Skipping AI processing because no articles were loaded.")