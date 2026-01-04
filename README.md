# TLDR Bot

Let's be real: sometimes you just don't have the time (or patience) to read a 5,000-word article. TLDR Bot is here to fix that.

It uses advanced AI to intelligently find the articles you're looking for and generates concise summaries, so you can get the info you need and get on with your day.

(TLDR stands for **"Too Long; Didn't Read"** — the core philosophy of this project.)

---

## What It Does

*   **Real-time News Integration:** Includes a custom crawler for *Times of India*, ensuring you get the latest updates, not just historical data.
*   **Interactive Chat:** Don't just read the news—talk to it. Ask specific questions about an article and get instant, context-aware answers.
*   **High-Performance Backend:** Built with **FastAPI** for a significantly faster and more robust API experience.
*   **Semantic Search:** The bot understands context, so you don't need to be a keyword wizard to find what you're looking for.

---

## The Tech Stack

Built with a modern stack because legacy code is not the vibe:

*   **Python:** The powerhouse behind the logic.
*   **FastAPI:** For a lightning-fast backend.
*   **Hugging Face Transformers:** Powering the summarization and chat capabilities.
*   **LangChain:** Orchestrating the AI workflows.
*   **FAISS:** Enabling efficient vector similarity search.
*   **BeautifulSoup:** Handling the web scraping heavy lifting.

---

## How to Run it Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tldr-bot.git
    cd tldr-bot
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Build the Search Index:**
    ```bash
    python scripts/01_build_index.py
    ```
    *Note: This processes the dataset to create embeddings. It might take a moment.*

4.  **Start the Server:**
    ```bash
    python app.py
    ```

5.  **Explore the API:**
    Navigate to `http://localhost:8000/docs` to interact with the endpoints.

---
*Built by a solo dev running on caffeine.*
