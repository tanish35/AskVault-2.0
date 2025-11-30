"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

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
        <ChatHeader onClose={onClose} />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSendMessage={(text) => sendMessage({ text })}
        />
      </Card>
    </>
  );
}
