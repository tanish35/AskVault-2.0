import { QdrantClient } from '@qdrant/js-client-rest';
import { DocumentChunk, SearchResult } from '@/types';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || 'legal_documents';
const VECTOR_SIZE = 768; // Gemini text-embedding-004

let client: QdrantClient | null = null;

function getQdrantClient(): QdrantClient {
  if (!client) {
    client = new QdrantClient({ url: QDRANT_URL, apiKey: QDRANT_API_KEY });
  }
  return client;
}

export async function initializeCollection(): Promise<void> {
  const client = getQdrantClient();
  const collections = await client.getCollections();
  const exists = collections.collections.some((col) => col.name === COLLECTION_NAME);

  if (!exists) {
    await client.createCollection(COLLECTION_NAME, {
      vectors: { size: VECTOR_SIZE, distance: 'Cosine' },
    });
    console.log(`Collection '${COLLECTION_NAME}' created`);
  }
}

export async function storeEmbeddings(
  embeddings: number[][],
  chunks: DocumentChunk[]
): Promise<void> {
  const client = getQdrantClient();
  const points = embeddings.map((embedding, index) => ({
    id: Date.now() + index,
    vector: embedding,
    payload: chunks[index],
  }));

  await client.upsert(COLLECTION_NAME, { wait: true, points });
}

export async function searchSimilarDocuments(
  queryEmbedding: number[],
  limit: number = 5
): Promise<SearchResult[]> {
  const client = getQdrantClient();
  const results = await client.search(COLLECTION_NAME, {
    vector: queryEmbedding,
    limit,
    with_payload: true,
  });

  return results.map((r) => ({
    content: r.payload?.content as string,
    score: r.score,
    fileName: r.payload?.fileName as string,
    pageNumber: r.payload?.pageNumber as number | undefined,
  }));
}
