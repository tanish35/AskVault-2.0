import { convertToModelMessages, streamText, UIMessage, tool } from "ai";
import { google } from "@ai-sdk/google";
import {
  retrieveContext,
  formatContextForPrompt,
} from "@/lib/services/rag-service";
import { SYSTEM_PROMPT } from "@/lib/config/prompts";
import { z } from "zod";
import axios from "axios";

const submitContactForm = tool({
  name: "submitContactForm",
  description: "Submit a contact form with user details.",
  inputSchema: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
    message: z.string().min(1),
  }),
  async execute({ name, email, phone, message }) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/form`,
        {
          name,
          email,
          phone,
          message,
        }
      );
      if (response.status === 201) {
        return "Contact form submitted successfully.";
      } else {
        return "Failed to submit contact form.";
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return "An error occurred while submitting the contact form.";
    }
  },
  outputSchema: z.string(),
});

const searchDocuments = tool({
  name: "searchDocuments",
  description:
    "Search through the knowledge base documents to find relevant information. Use this when you need specific information about the company, products, services, or policies.",
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant documents"),
  }),
  async execute({ query }) {
    try {
      // console.log("Searching documents with query:", query);
      const context = await retrieveContext(query);
      // console.log("Retrieved context:", context);
      const formattedContext = formatContextForPrompt(context);

      if (!formattedContext || formattedContext.trim() === "") {
        return "No relevant documents found for your query.";
      }

      return formattedContext;
    } catch (error) {
      console.error("Error searching documents:", error);
      return "An error occurred while searching the documents.";
    }
  },
  outputSchema: z.string(),
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const modelMessages = convertToModelMessages(messages);

    const SYSTEM_PROMPT_WITH_INSTRUCTIONS = `
        ${SYSTEM_PROMPT}
        
        You are an assistant that can help users with information and form submissions.
        
        ## Available Tools:
        1. searchDocuments - Use this to find information from the knowledge base when users ask questions
        2. submitContactForm - Use this to submit contact forms when users provide their details
        
        ## Guidelines:
        - When users ask questions about the company, products, or services, use searchDocuments first
        - You can call searchDocuments multiple times with different queries if needed
        - Before submitting a contact form, ALWAYS confirm: "Should I submit this now?"
        - After searching documents, provide a natural response based on the information found
    `;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: SYSTEM_PROMPT_WITH_INSTRUCTIONS,
      messages: modelMessages,
      tools: {
        submitContactForm,
        searchDocuments,
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
