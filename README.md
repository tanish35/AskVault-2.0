# RAG Bot

A powerful Retrieval-Augmented Generation (RAG) chatbot developed by Tanish that allows you to upload documents, search through them, perform various AI-powered functions, and interact via voice using Twilio and local Whisper API, with Redis for memory management.

## Features

- **Document Upload**: Upload PDF, DOCX, and text documents
- **Intelligent Search**: Search and query your documents using natural language
- **AI-Powered Responses**: Get accurate answers based on your uploaded content
- **Chat Interface**: Interactive chat widget for seamless conversations
- **Vector Search**: Uses Qdrant for efficient similarity search
- **Contact Forms**: Built-in contact form functionality
- **Voice Agent**: Supports voice interactions using Twilio and local Whisper API for speech-to-text
- **Memory Management**: Uses Redis for session memory and caching

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Vector Database**: Qdrant
- **AI**: Google AI SDK (Gemini)
- **Document Processing**: PDF parsing, DOCX support
- **Voice Processing**: Twilio, Fast Whisper (local)
- **Memory**: Redis

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables (create a `.env.local` file):

```env
DATABASE_URL="your_postgresql_connection_string"
QDRANT_URL="your_qdrant_url"
QDRANT_API_KEY="your_qdrant_api_key"
GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key"
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
WHISPER_URL="http://localhost:8000"  # URL for local Whisper API
UPSTASH_REDIS_REST_URL="your_upstash_redis_rest_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_rest_token"
```

4. Set up the local Whisper API (run in a separate terminal):

Ensure ffmpeg is installed (e.g., `brew install ffmpeg` on macOS).

```bash
cd whisper
pip install -e .
uvicorn main:app --host 0.0.0.0 --port 8000
```

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Navigate to the upload page to add your documents
2. Use the chat interface to ask questions about your uploaded content
3. The bot will search through your documents and provide relevant answers
4. For voice interactions, use the voice agent feature integrated with Twilio and local Whisper API

## Project Structure

- `app/`: Next.js app router pages and API routes
- `lib/`: Utility functions and services
- `prisma/`: Database schema and migrations
- `components/`: Reusable React components
- `types/`: TypeScript type definitions
- `whisper/`: Local Whisper API for speech-to-text processing
- `voice/`: Voice processing utilities and session memory

## Contributing

Feel free to submit issues and pull requests.
