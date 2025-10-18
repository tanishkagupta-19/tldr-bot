const API_URL = "http://127.0.0.1:8000";

export const searchArticles = async (query) => {
  const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Search request failed');
  }
  return response.json();
};

export const getSummary = async (articleId) => {
  const response = await fetch(`${API_URL}/summarize/${articleId}`);
  if (!response.ok) {
    throw new Error('Summary request failed');
  }
  return response.json();
};

export const chatWithBot = async (message, articleId) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      article_id: articleId,
    }),
  });
  if (!response.ok) {
    throw new Error('Chat request failed');
  }
  return response.json();
};