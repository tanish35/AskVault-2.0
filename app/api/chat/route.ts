import { convertToModelMessages, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import {
  retrieveContext,
  formatContextForPrompt,
} from "@/lib/services/rag-service";
import { SYSTEM_PROMPT } from "@/lib/config/prompts";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    // console.log("Received messages:", messages);
    const modelMessages = convertToModelMessages(messages);
    const lastMessageContent =
      //@ts-ignore
      modelMessages[modelMessages.length - 1].content[0].text;
    const context = await retrieveContext(lastMessageContent, 5, 0.5);
    const SYSTEM_PROMPT_WITH_CONTEXT = `
        ${SYSTEM_PROMPT}

        ## CONTEXT:
        ${formatContextForPrompt(context)}
    `;
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: SYSTEM_PROMPT_WITH_CONTEXT,
      messages: modelMessages,
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
