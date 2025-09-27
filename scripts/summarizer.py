from transformers import pipeline
from tqdm.auto import tqdm
model_name="google-t5/t5-base" 
summarizer = pipeline("summarization",model=model_name)
output=summarizer("""The James Webb Space Telescope (JWST) is a space telescope designed primarily to conduct infrared astronomy. 
As the largest optical telescope in space, its high resolution and sensitivity allow it to view objects too old, 
distant, or faint for the Hubble Space Telescope. This enables investigations in many fields of astronomy and 
cosmology, such as observation of the first stars and the formation of the first galaxies.""", min_length=5, max_length=20)
print(output)