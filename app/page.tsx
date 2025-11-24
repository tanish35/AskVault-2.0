import Link from 'next/link';
import Navigation from './components/Navigation';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Legal Assistant
              <span className="block text-blue-600 mt-2">Powered by AI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Upload your legal documents and get instant answers using advanced
              Retrieval-Augmented Generation (RAG) technology with Gemini AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Upload Documents
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Chatting
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Upload</h3>
              <p className="text-gray-600">
                Simply drag and drop your legal documents in PDF, TXT, MD, or JSON format.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Search</h3>
              <p className="text-gray-600">
                Advanced RAG technology finds the most relevant information from your documents.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Answers</h3>
              <p className="text-gray-600">
                Ask questions in natural language and get accurate, contextual responses.
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Upload</h4>
                <p className="text-sm text-gray-600">
                  Upload your legal documents to the platform
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Process</h4>
                <p className="text-sm text-gray-600">
                  Documents are chunked and embedded into vector database
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Query</h4>
                <p className="text-sm text-gray-600">
                  Ask questions about your documents in the chat
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Get Answers</h4>
                <p className="text-sm text-gray-600">
                  Receive accurate, contextual answers powered by AI
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 max-w-3xl mx-auto">
              This chatbot provides information only and does not constitute legal advice.
              Always consult with a qualified legal professional for specific legal matters.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            Powered by RAG, Qdrant Vector Database, and Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}
