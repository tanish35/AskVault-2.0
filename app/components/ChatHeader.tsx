"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-2 p-4 sm:p-6 border-b rounded-t-3xl bg-linear-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-600 shrink-0" />
        <div className="text-lg font-semibold text-gray-900">Quick Chat</div>
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
    </div>
  );
}
