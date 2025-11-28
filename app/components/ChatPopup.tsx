"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  MessageCircle,
  Send,
  User,
  Bot,
  X,
  Search,
} from "lucide-react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface ChatPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatPopup({ open, onClose }: ChatPopupProps) {
  const { messages, sendMessage, status, addToolOutput } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
    },
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  const isLoading = status === "submitted" || status === "streaming";

  if (!open) return null;

  return (
    <>
      <Card className="fixed bottom-6 right-6 w-96 h-[70vh] max-h-[600px] max-w-md flex flex-col z-50 shadow-2xl border-0 rounded-3xl animate-in slide-in-from-bottom-8 fade-in duration-200 sm:bottom-8 sm:right-8 p-0">
        <CardHeader className="flex flex-row items-center justify-between gap-2 p-4 sm:p-6 border-b rounded-t-3xl bg-linear-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-lg font-semibold text-gray-900">
              Quick Chat
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <ScrollArea className="flex-1 p-0 sm:p-0 space-y-0 min-h-0 overflow-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-8">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">
                Start chatting
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 max-w-[80%]">
                Ask about your documents here.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex m-2",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-blue-700" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-full px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm prose prose-sm wrap-break-word overflow-wrap-break-word m-2",
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none prose-invert"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  )}
                >
                  {/* Render all parts */}
                  {msg.parts.map((part, idx) => {
                    // Text parts
                    if (part.type === "text") {
                      return (
                        <ReactMarkdown
                          key={idx}
                          components={{
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc ml-4 sm:ml-5 mb-1"
                                {...props}
                              />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal ml-4 sm:ml-5 mb-1"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="mb-1" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-semibold" {...props} />
                            ),
                            p: ({ node, ...props }) => (
                              <p
                                className="mb-1 sm:mb-2 last:mb-0"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      );
                    }

                    // Handle searchDocuments tool
                    if (part.type === "tool-searchDocuments") {
                      switch (part.state) {
                        case "input-streaming":
                        case "input-available":
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-xs italic text-blue-700 bg-blue-50 px-2 py-1 rounded mb-1"
                            >
                              <Search className="w-3 h-3 animate-pulse" />
                              <span>Searching documents</span>
                            </div>
                          );
                        case "output-available":
                          return (
                            <div
                              key={idx}
                              className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded mb-1"
                            >
                              ✓ Found relevant information
                            </div>
                          );
                        case "output-error":
                          return (
                            <div
                              key={idx}
                              className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded mb-1"
                            >
                              ⚠ Error searching: {part.errorText}
                            </div>
                          );
                      }
                    }

                    // Handle submitContactForm tool
                    if (part.type === "tool-submitContactForm") {
                      switch (part.state) {
                        case "input-streaming":
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-xs italic text-purple-700 bg-purple-50 px-2 py-1 rounded mb-1"
                            >
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Preparing form submission...</span>
                            </div>
                          );
                        case "input-available":
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-xs italic text-purple-700 bg-purple-50 px-2 py-1 rounded mb-1"
                            >
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Submitting contact form...</span>
                            </div>
                          );
                        case "output-available":
                          if (part.type.startsWith("tool-")) {
                            const output = part.output as {
                              status: string;
                              message: string;
                            };

                            return (
                              <div className="tool-output">
                                <strong>{output.status}</strong>:{" "}
                                {output.message}
                              </div>
                            );
                          }
                        case "output-error":
                          return (
                            <div
                              key={idx}
                              className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded mb-1"
                            >
                              ⚠ Error: {part.errorText}
                            </div>
                          );
                      }
                    }

                    return null;
                  })}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-gray-700" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 pl-3 sm:pl-11 m-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI is typing…</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-3 sm:p-4 border-t flex items-center gap-2">
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
              className="h-10 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !input.trim()}
              className="h-10 aspect-square p-0 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </>
  );
}
