import { convertToModelMessages, streamText, UIMessage, tool } from "ai";
import { azure } from "@ai-sdk/azure";
import { SYSTEM_PROMPT } from "@/lib/config/prompts";
import { submitContactForm, searchDocuments } from "@/lib/tools";

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
      model: azure("gpt-4o-mini"),
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
