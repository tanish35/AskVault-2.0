import { json } from "stream/consumers";
import { UnstructuredClient } from "unstructured-client";
import { PartitionResponse } from "unstructured-client/sdk/models/operations";
import { Strategy } from "unstructured-client/sdk/models/shared";

const serverURL =
  process.env.UNSTRUCTURED_SERVER_URL ||
  "https://api.unstructuredapp.io/general/v0/general";
const apiKey = process.env.UNSTRUCTURED_API_KEY;

if (!apiKey) {
  throw new Error("UNSTRUCTURED_API_KEY is required");
}

const client = new UnstructuredClient({
  serverURL,
  security: {
    apiKeyAuth: apiKey,
  },
});

export async function parseWithUnstructured(file: File): Promise<string> {
  console.log(`[parseWithUnstructured] Processing file: ${file.name}`);

  const buffer = Buffer.from(await file.arrayBuffer());

  const response = await client.general.partition({
    partitionParameters: {
      files: {
        content: buffer,
        fileName: file.name,
      },
      strategy: Strategy.HiRes,
      splitPdfPage: true,
      splitPdfAllowFailed: true,
      splitPdfConcurrencyLevel: 15,
      languages: ["eng"],
    },
  });
  const jsonElements = JSON.stringify(response);

  if (!response) {
    throw new Error("No elements returned from Unstructured");
  }
  return jsonElements;
}
