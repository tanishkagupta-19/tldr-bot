const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type SearchResult = {
  id: number;
  headline: string;
  url?: string;
};

export async function searchArticles(query: string): Promise<{ results: SearchResult[] }> {
  const url = `${API_BASE}/search?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getSummary(articleId: number): Promise<{ article_id: number; summary: string }> {
  const url = `${API_BASE}/summarize/${articleId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Summary failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function chatWithArticle(articleId: number, question: string): Promise<{ answer: string }> {
  const url = `${API_BASE}/chat`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ article_id: articleId, question }),
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status} ${res.statusText}`);
  return res.json();
}
