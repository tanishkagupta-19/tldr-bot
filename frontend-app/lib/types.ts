// API Response Types
export interface SearchResult {
  id: number;
  headline: string;
  url?: string;
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface SummaryResponse {
  article_id: number;
  summary: string;
}

export interface ChatRequest {
  article_id: number;
  question: string;
}

export interface ChatResponse {
  article_id: number;
  question: string;
  answer: string;
}

// Error Types
export interface APIError {
  status: number;
  message: string;
  detail?: string;
}