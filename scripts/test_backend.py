import requests
import time
import sys

BASE_URL = "http://localhost:8000"

def test_search():
    print("Testing /search...")
    try:
        response = requests.get(f"{BASE_URL}/search", params={"query": "technology"})
        if response.status_code == 200:
            print("Search successful!")
            results = response.json().get("results", [])
            print(f"Found {len(results)} results.")
            for res in results[:3]:
                print(f" - [{res['id']}] {res['headline']}")
            return results
        else:
            print(f"Search failed: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        print(f"Connection failed: {e}")
        return []

def test_summarize(article_id):
    print(f"\nTesting /summarize/{article_id}...")
    try:
        response = requests.get(f"{BASE_URL}/summarize/{article_id}")
        if response.status_code == 200:
            print("Summarization successful!")
            print(f"Summary: {response.json().get('summary')[:100]}...")
        else:
            print(f"Summarization failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}")

def test_chat(article_id):
    print(f"\nTesting /chat with article {article_id}...")
    payload = {"article_id": article_id, "question": "What is the main topic?"}
    try:
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        if response.status_code == 200:
            print("Chat successful!")
            print(f"Answer: {response.json().get('answer')}")
        else:
            print(f"Chat failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    print("Starting backend tests...")
    results = test_search()
    if results:
        # Test with the first result (likely a scraped TOI article if available, or a dataset article)
        first_id = results[0]['id']
        test_summarize(first_id)
        test_chat(first_id)
    else:
        print("Skipping further tests as search returned no results.")
