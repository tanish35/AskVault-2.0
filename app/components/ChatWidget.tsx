"use client";

import { useState } from "react";
import ChatPopup from "./ChatPopup";

export default function ChatWidget() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 flex items-center justify-center ring-4 ring-blue-600/20 hover:ring-blue-600/40"
        aria-label="Quick Chat"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      <ChatPopup open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
