"use client";

import { Loader2 } from "lucide-react";

export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 pl-3 sm:pl-11 m-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>AI is typing…</span>
    </div>
  );
}
