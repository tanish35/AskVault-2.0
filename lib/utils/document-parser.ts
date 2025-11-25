import { DocumentChunk } from "@/types";
import { generateEmbeddings } from "../services/embedding-service";
import {
  storeEmbeddings,
  initializeCollection,
} from "../services/qdrant-client";

async function parseAndChunk(file: File): Promise<DocumentChunk[]> {
  console.log(
    `[parseAndChunk] Starting for file: ${file.name}, size: ${file.size}`
  );

  const text = await file.text();
  console.log(`[parseAndChunk] Read text content, length: ${text.length}`);

  const chunks: DocumentChunk[] = [];
  const maxChars = 1000;
  const paragraphs = text.split(/\n\s*\n/);

  let currentChunkText = "";

  for (const paragraph of paragraphs) {
    const cleanParagraph = paragraph.trim();
    if (!cleanParagraph) continue;
    if (
      currentChunkText.length + cleanParagraph.length > maxChars &&
      currentChunkText.length > 0
    ) {
      chunks.push({
        content: currentChunkText.trim(),
        fileName: file.name,
        pageNumber: 1,
        chunkIndex: chunks.length,
      });
      currentChunkText = "";
    }

    currentChunkText += (currentChunkText ? "\n\n" : "") + cleanParagraph;
  }
  if (currentChunkText.trim()) {
    chunks.push({
      content: currentChunkText.trim(),
      fileName: file.name,
      pageNumber: 1,
      chunkIndex: chunks.length,
    });
  }

  console.log(`[parseAndChunk] Created ${chunks.length} chunks`);
  return chunks;
}

export async function ingestDocument(
  file: File
): Promise<{ success: boolean; chunksProcessed: number }> {
  await initializeCollection();
  const chunks = await parseAndChunk(file);
  const embeddings = await generateEmbeddings(chunks.map((c) => c.content));
  await storeEmbeddings(embeddings, chunks);

  console.log(`Ingested ${file.name}: ${chunks.length} chunks`);

  return { success: true, chunksProcessed: chunks.length };
}
