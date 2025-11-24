// Simple document chunk with all necessary metadata
export interface DocumentChunk {
  content: string;
  fileName: string;
  pageNumber?: number;
  chunkIndex: number;
  [key: string]: unknown; // For Qdrant compatibility
}

// Search result from Qdrant
export interface SearchResult {
  content: string;
  score: number;
  fileName: string;
  pageNumber?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
