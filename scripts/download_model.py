from huggingface_hub import snapshot_download

model_id = "google-t5/t5-base"

print(f"Starting an explicit download for the model: {model_id}")
print("You will see progress bars for the files below.")

# This command downloads all the necessary files for a model and is built
# to always show progress. It will save them to the central cache.
snapshot_download(repo_id=model_id)

print(f"\n--- SUCCESS ---")
print(f"Model '{model_id}' is now fully downloaded and saved on your computer.")
print("You can now run your summarizer.py script, and it should load instantly.")