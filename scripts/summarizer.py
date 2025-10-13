from transformers import pipeline
model_name = "facebook/bart-large-cnn"
print(f"Loading model: {model_name}...")
summarizer=pipeline("summarization", model=model_name)
print("Model loaded.")

long_text = """
The James Webb Space Telescope (JWST) is a space telescope designed primarily to conduct infrared astronomy. 
As the largest optical telescope in space, its high resolution and sensitivity allow it to view objects too old, 
distant, or fainta for the Hubble Space Telescope. This enables investigations in many fields of astronomy and 
cosmology, such as observation of the first stars and the formation of the first galaxies, and detailed 
atmospheric characterization of potentially habitable exoplanets. JWST was launched from Kourou, French Guiana, 
in December 2021 on an Ariane 5 rocket, and entered orbit around the Sun–Earth L2 Lagrange point in January 2022.
"""
summary_output = summarizer(long_text, max_length=60, min_length=30, do_sample=False)

print(summary_output[0]['summary_text'])
