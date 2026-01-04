import requests
import time
import sys
BASE_URL="http://localhost:8000"
def test_search():
    try:
        response=requests.get(f"{BASE_URL}/search",params={"query":"technology"})
        if response.status_code==200:
            results=response.json().get("results",[])
            return results
        else:
            return[]
    except Exception:
        return[]
def test_summarize(article_id):
    try:
        response=requests.get(f"{BASE_URL}/summarize/{article_id}")
    except Exception:
        pass
def test_chat(article_id):
    payload={"article_id":article_id,"question":"What is the main topic?"}
    try:
        response=requests.post(f"{BASE_URL}/chat",json=payload)
    except Exception:
        pass
if __name__=="__main__":
    results=test_search()
    if results:
        first_id=results[0]['id']
        test_summarize(first_id)
        test_chat(first_id)
