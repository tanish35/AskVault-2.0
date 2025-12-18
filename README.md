# RAG Bot

A powerful Retrieval-Augmented Generation (RAG) chatbot developed by Tanish that allows you to upload documents, search through them, and perform various AI-powered functions.

## Features

- **Document Upload**: Upload PDF, DOCX, and text documents
- **Intelligent Search**: Search and query your documents using natural language
- **AI-Powered Responses**: Get accurate answers based on your uploaded content
- **Chat Interface**: Interactive chat widget for seamless conversations
- **Vector Search**: Uses Qdrant for efficient similarity search
- **Contact Forms**: Built-in contact form functionality

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Vector Database**: Qdrant
- **AI**: Google AI SDK (Gemini)
- **Document Processing**: PDF parsing, DOCX support

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
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Navigate to the upload page to add your documents
2. Use the chat interface to ask questions about your uploaded content
3. The bot will search through your documents and provide relevant answers

## Project Structure

- `app/`: Next.js app router pages and API routes
- `lib/`: Utility functions and services
- `prisma/`: Database schema and migrations
- `components/`: Reusable React components
- `types/`: TypeScript type definitions

## Contributing

Feel free to submit issues and pull requests.

## License

This project is private and proprietary.
