import { NextResponse } from "next/server";
import { clearCollection } from "@/lib/services/qdrant-client";

export async function DELETE() {
  try {
    await clearCollection();
    return NextResponse.json(
      { message: "Collection cleared successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing collection:", error);
    return NextResponse.json(
      { message: "Failed to clear collection." },
      { status: 500 }
    );
  }
}
