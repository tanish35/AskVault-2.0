'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold hover:text-blue-100 transition">
            Legal Assistant Bot
          </Link>

          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md transition ${
                isActive('/')
                  ? 'bg-blue-700 font-semibold'
                  : 'hover:bg-blue-500'
              }`}
            >
              Home
            </Link>
            <Link
              href="/upload"
              className={`px-4 py-2 rounded-md transition ${
                isActive('/upload')
                  ? 'bg-blue-700 font-semibold'
                  : 'hover:bg-blue-500'
              }`}
            >
              Upload Documents
            </Link>
            <Link
              href="/chat"
              className={`px-4 py-2 rounded-md transition ${
                isActive('/chat')
                  ? 'bg-blue-700 font-semibold'
                  : 'hover:bg-blue-500'
              }`}
            >
              Chat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
