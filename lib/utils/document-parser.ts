import { DocumentChunk } from "@/types";
import { generateEmbeddings } from "../services/embedding-service";
import {
  storeEmbeddings,
  initializeCollection,
} from "../services/qdrant-client";
import { parseWithUnstructured } from "../services/unstructured";

async function parseAndChunk(file: File): Promise<DocumentChunk[]> {
  console.log(
    `[parseAndChunk] Starting for file: ${file.name}, size: ${file.size}`
  );

  const jsonElements = await parseWithUnstructured(file);
  const elements = JSON.parse(jsonElements);

  const substantialTypes = ["NarrativeText", "Title", "UncategorizedText"];
  const chunks: DocumentChunk[] = [];

  elements.forEach((el: any, idx: number) => {
    if (
      substantialTypes.includes(el.type) &&
      el.text &&
      el.text.trim().length > 50 &&
      el.metadata
    ) {
      chunks.push({
        content: el.text.trim(),
        fileName: el.metadata.filename || el.metadata.file_name || file.name,
        pageNumber: el.metadata.page_number || 1,
        chunkIndex: chunks.length,
      });
    }
  });

  console.log(
    `[parseAndChunk] Created ${chunks.length} substantial chunks from ${elements.length} elements`
  );

  if (chunks.length === 0) {
    console.log(
      "[parseAndChunk] No substantial elements, falling back to text chunking"
    );
    const text = await file.text();
    const fallbackChunks = chunkText(text, file.name);
    chunks.push(...fallbackChunks);
  }

  return chunks;
}

function chunkText(text: string, fileName: string): DocumentChunk[] {
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
        fileName,
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
      fileName,
      pageNumber: 1,
      chunkIndex: chunks.length,
    });
  }

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
