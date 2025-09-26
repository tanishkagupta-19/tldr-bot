# TLDR Bot
Ever open an article and see a massive wall of text? Yeah, this bot gets it.

It uses AI to intelligently find the article you're looking for and then gives you the sparknotes version, so you can actually keep up.

(TLDR stands for **"Too Long; Didn't Read"** — the problem this bot was built to solve.)

---
> Check out the live demo

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://your-live-app-url.streamlit.app/)

---

### What it does

* **A Smarter Search:** It's smart enough to figure out what you *mean*, not just what you type. It just gets you.

* **Instant Summaries:** It reads the whole thing so you don't have to, and generates a new summary that's actually good.

* **Clean UI:** The interface is built with Streamlit. No clutter, just a clean vibe.

---

### The Tech Stack 

* **Python** (obviously)
* **Hugging Face Transformers**
* **FAISS** (for the vector search)
* **Streamlit** (for the UI)

---

### How to Run it Locally

1.  **Clone this repository:**
    ```bash
    git clone [https://github.com/your-username/tldr-bot.git](https://github.com/your-username/tldr-bot.git)
    cd tldr-bot
    ```

2.  **Install the required libraries:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the app:**
    ```bash
    streamlit run app.py
    ```

---
*built with an unhealthy amount of coffee.*
