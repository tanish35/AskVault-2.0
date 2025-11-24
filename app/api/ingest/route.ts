import { NextResponse } from "next/server";
import { ingestDocument } from "@/lib/utils/document-parser";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [".pdf", ".txt", ".md", ".json"];
    const fileExt = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedTypes.includes(fileExt)) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed: ${allowedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await ingestDocument(file);

    return NextResponse.json({
      success: true,
      message: `Processed ${file.name}`,
      chunksProcessed: result.chunksProcessed,
    });
  } catch (error) {
    console.error("Ingest error:", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 }
    );
  }
}
