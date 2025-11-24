"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadHistory, setUploadHistory] = useState<
    Array<{
      name: string;
      status: "success" | "error";
      message: string;
      timestamp: Date;
    }>
  >([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus("Uploading and processing document...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const successMessage = `Successfully processed ${result.chunksProcessed} chunks`;
        setUploadStatus(successMessage);
        setUploadHistory((prev) => [
          {
            name: file.name,
            status: "success",
            message: successMessage,
            timestamp: new Date(),
          },
          ...prev,
        ]);
      } else {
        const errorMessage = result.error || "Upload failed";
        setUploadStatus(`Error: ${errorMessage}`);
        setUploadHistory((prev) => [
          {
            name: file.name,
            status: "error",
            message: errorMessage,
            timestamp: new Date(),
          },
          ...prev,
        ]);
      }
    } catch (error) {
      const errorMessage = "Failed to upload document";
      setUploadStatus(errorMessage);
      setUploadHistory((prev) => [
        {
          name: file.name,
          status: "error",
          message: errorMessage,
          timestamp: new Date(),
        },
        ...prev,
      ]);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
      setTimeout(() => setUploadStatus(""), 5000);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = document.createElement("input");
      input.type = "file";
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      handleFileUpload({ target: input } as any);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />

      <main className="flex-1 max-w-4xl mx-auto w-full p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Legal Documents
          </h1>
          <p className="text-gray-600">
            Upload your legal documents in .txt. Documents will be processed and
            embedded for querying.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors"
          >
            <div className="space-y-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Click to upload
                </label>
                <span className="text-gray-600"> or drag and drop</span>
              </div>
              <p className="text-sm text-gray-500">Supported formats: TXT</p>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.txt,.md,.json"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </div>
          </div>

          {uploadStatus && (
            <div
              className={`mt-4 p-4 rounded-md ${
                uploadStatus.startsWith("Error") ||
                uploadStatus.startsWith("Failed")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : uploadStatus.startsWith("Success")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              <p className="text-sm font-medium">{uploadStatus}</p>
            </div>
          )}
        </div>

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload History
            </h2>
            <div className="space-y-3">
              {uploadHistory.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start justify-between p-4 rounded-md border ${
                    item.status === "success"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p
                      className={`text-sm ${
                        item.status === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {item.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    {item.status === "success" ? (
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How it works
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Upload your legal document in one of the supported formats</li>
            <li>The document is automatically split into chunks</li>
            <li>
              Each chunk is embedded using AI and stored in the vector database
            </li>
            <li>You can then query the documents using the Chat interface</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
