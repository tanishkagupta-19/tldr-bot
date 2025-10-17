const API_BASE_URL = 'http://localhost:8000'; // FastAPI default port

export const searchArticles = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results; // The backend returns { results: [...] }
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
};

export const getArticleSummary = async (articleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/summarize/${articleId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { summary: data.summary }; // Return in the expected format
  } catch (error) {
    console.error('Error getting article summary:', error);
    throw error;
  }
};

export const chatWithArticle = async (articleId, question) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        article_id: articleId,
        question: question
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { message: data.answer }; // Convert to expected format
  } catch (error) {
    console.error('Error chatting with article:', error);
    throw error;
  }
};