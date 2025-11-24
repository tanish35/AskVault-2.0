import { streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import {
  retrieveContext,
  formatContextForPrompt,
} from "@/lib/services/rag-service";
import { SYSTEM_PROMPT, NO_CONTEXT_RESPONSE } from "@/lib/config/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        "Invalid message format: messages must be a non-empty array",
        { status: 400 }
      );
    }

    const uiMessages = messages as UIMessage[];

    const extractTextContent = (message: UIMessage) => {
      if ("content" in message && typeof message.content === "string") {
        return message.content;
      }

      if ("parts" in message && Array.isArray(message.parts)) {
        return message.parts
          .map((part: any) => {
            if (typeof part === "string") return part;
            if (typeof part?.text === "string") return part.text;
            if (typeof part?.content === "string") return part.content;
            return "";
          })
          .filter(Boolean)
          .join("\n");
      }

      return "";
    };

    const lastMessage = uiMessages[uiMessages.length - 1];
    const lastMessageContent = lastMessage
      ? extractTextContent(lastMessage)
      : "";

    if (!lastMessage || lastMessage.role !== "user" || !lastMessageContent) {
      return new Response("Invalid message format", { status: 400 });
    }
    const context = await retrieveContext(lastMessageContent, 5, 0.5);

    const normalizedMessages = uiMessages
      .map((message) => {
        const content = extractTextContent(message).trim();
        if (!content) {
          return null;
        }

        if (
          message.role === "user" ||
          message.role === "assistant" ||
          message.role === "system"
        ) {
          return {
            role: message.role,
            content,
          } as const;
        }

        return null;
      })
      .filter(
        (
          msg
        ): msg is { role: "user" | "assistant" | "system"; content: string } =>
          msg !== null
      );

    const buildResponse = (systemPrompt: string) =>
      streamText({
        model: google("gemini-2.5-flash"),
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...normalizedMessages,
        ],
        temperature: 0.1,
      }).toUIMessageStreamResponse();

    if (context.length === 0) {
      const fallbackPrompt = `${SYSTEM_PROMPT}

The knowledge base search returned no relevant context.
Respond exactly with the following message:
${NO_CONTEXT_RESPONSE}`;

      return buildResponse(fallbackPrompt);
    }
    const formattedContext = formatContextForPrompt(context);
    const enhancedSystemPrompt = `${SYSTEM_PROMPT}

RELEVANT CONTEXT FROM KNOWLEDGE BASE:
${formattedContext}

Use ONLY the above context to answer the user's question. If the context doesn't contain the answer, you must say you don't have that information.`;

    return buildResponse(enhancedSystemPrompt);
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
