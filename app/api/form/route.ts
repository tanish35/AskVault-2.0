import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendMail1, sendMail2 } from "@/lib/mail/sendMail";

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
    const subject = "New Contact Form Submission";

    const html = `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
    `;
    sendMail1(html, email, subject);
    sendMail2(html, email, subject, name);

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
