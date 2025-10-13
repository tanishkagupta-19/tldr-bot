from huggingface_hub import snapshot_download
model_id="google-t5/t5-base"
snapshot_download(repo_id=model_id)