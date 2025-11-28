import { generateEmbedding } from "./embedding-service";
import { searchSimilarDocuments } from "./qdrant-client";
import { SearchResult } from "@/types";

export async function retrieveContext(
  query: string
  // topK: number = 5,
  // minScore: number = 0.5
): Promise<SearchResult[]> {
  const topK = 10;
  const minScore = 0.4;
  // console.log(query, topK, minScore);
  const queryEmbedding = await generateEmbedding(query);
  // console.log("Query Embedding:", queryEmbedding);

  const results = await searchSimilarDocuments(queryEmbedding, topK);
  // console.log("Search Results:", results);
  return results.filter((r) => r.score >= minScore);
}

export function formatContextForPrompt(results: SearchResult[]): string {
  if (results.length === 0) {
    return "No relevant information found.";
  }

  return results
    .map((r, i) => {
      const page = r.pageNumber ? ` (Page ${r.pageNumber})` : "";
      return `[${i + 1}] ${r.fileName}${page} (${(r.score * 100).toFixed(
        0
      )}%)\n${r.content}`;
    })
    .join("\n\n---\n\n");
}
