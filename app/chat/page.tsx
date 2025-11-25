"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageCircle, Send, User, Bot } from "lucide-react";
import Navigation from "../components/Navigation";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navigation />

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Header */}
        <Card className="mb-4 border shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              Q&A Chat
            </CardTitle>
            <p className="text-sm text-gray-600">
              Ask questions about your uploaded documents.
            </p>
          </CardHeader>
        </Card>

        {/* Message List */}
        <Card className="flex-1 flex flex-col overflow-hidden border shadow-sm">
          <ScrollArea className="flex-1 p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <MessageCircle className="mx-auto h-14 w-14 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Start a conversation
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Ask anything related to your documents.
                </p>

                <Card className="bg-blue-50 border-blue-200 text-blue-900 p-4 text-sm">
                  <p className="font-semibold mb-2">Example questions:</p>
                  <ul className="space-y-1">
                    <li>• What is the main topic of this document?</li>
                    <li>• Summarize the key points</li>
                    <li>• What are the important details?</li>
                    <li>• Explain this section in simple terms</li>
                  </ul>
                </Card>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar */}
                {msg.role === "assistant" && (
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-700" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm prose prose-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none prose-invert"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc ml-5" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal ml-5" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-2 last:mb-0" {...props} />
                      ),
                    }}
                  >
                    {msg.parts
                      .filter((p) => p.type === "text")
                      .map((p) => p.text)
                      .join("")}
                  </ReactMarkdown>
                </div>

                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-700" />
                  </div>
                )}
              </div>
            ))}

            {/* Streaming Loader */}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI is typing…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <CardContent className="border-t p-4 flex gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!input.trim()) return;
                sendMessage({ text: input });
                setInput("");
              }}
              className="flex w-full gap-2"
            >
              <Input
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
