"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle } from "lucide-react";
import { MessageItem } from "./MessageItem";
import { LoadingIndicator } from "./LoadingIndicator";

interface ChatMessagesProps {
  messages: any[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessages({
  messages,
  isLoading,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
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
        messages.map((msg) => <MessageItem key={msg.id} msg={msg} />)
      )}

      {isLoading && <LoadingIndicator />}

      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}
