"use client";

import { Bot, User, Search, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  msg: any;
}

export function MessageItem({ msg }: MessageItemProps) {
  return (
    <div
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
          "max-w-full px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm prose prose-sm break-words m-2",
          msg.role === "user"
            ? "bg-blue-600 text-white rounded-br-none prose-invert"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        )}
      >
        {/* Render all parts */}
        {msg.parts.map((part: any, idx: number) => {
          // Text parts
          if (part.type === "text") {
            return (
              <ReactMarkdown
                key={idx}
                components={{
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-4 sm:ml-5 mb-1" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-4 sm:ml-5 mb-1" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-1 sm:mb-2 last:mb-0" {...props} />
                  ),
                }}
              >
                {part.text}
              </ReactMarkdown>
            );
          }
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
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 text-xs italic text-green-700 bg-green-50 px-2 py-1 rounded mb-1"
                  >
                    <span>✓ Form submitted successfully</span>
                  </div>
                );

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
  );
}
