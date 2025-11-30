import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, message } = body;
  try {
    const newContact = await prisma.contactForm.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });
    return NextResponse.json(
      { success: true, data: newContact },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact form data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save contact form data." },
      { status: 500 }
    );
  }
}
