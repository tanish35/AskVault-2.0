"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Navigation from "../components/Navigation";
import { MessageCircle, User, Send, Loader2 } from "lucide-react";

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log("Current messages:", messages);
  console.log("Current status:", status);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageContent = (message: any): string => {
    if (typeof message?.content === "string") {
      return message.content;
    }

    if (Array.isArray(message?.content)) {
      return message.content
        .map((part: any) => {
          if (typeof part === "string") return part;
          if (typeof part?.text === "string") return part.text;
          if (typeof part?.content === "string") return part.content;
          return "";
        })
        .filter(Boolean)
        .join("\n");
    }

    if (Array.isArray(message?.parts)) {
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navigation />

      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Legal Assistant Chat
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Ask questions about your uploaded legal documents
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Start a Conversation
                </h2>
                <p className="text-gray-600 mb-4">
                  Ask questions about your uploaded legal documents. The AI will
                  search through your document database and provide relevant
                  answers.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Example questions:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• What are the key terms in this contract?</li>
                    <li>• Summarize the liability clauses</li>
                    <li>• What are the termination conditions?</li>
                    <li>• Explain the confidentiality agreement</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {messages.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <MessageCircle className="h-5 w-5" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 shadow-sm border border-gray-200"
                  }`}
                >
                  <div className="prose prose-sm max-w-none leading-relaxed wrap-break-word text-current">
                    <ReactMarkdown>
                      {formatMessageContent(message) ||
                        "_Unable to display message content._"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {status === "streaming" && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="shrink-0 h-8 w-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage({ role: "user", content: input } as any);
                setInput("");
              }
            }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your legal documents..."
                disabled={status === "streaming"}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={status === "streaming" || !input.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
              >
                {status === "streaming" ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <Send className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This chatbot provides information only and does not constitute
              legal advice. Always consult with a qualified legal professional.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
