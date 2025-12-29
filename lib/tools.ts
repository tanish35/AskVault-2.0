import { tool } from "ai";
import { z } from "zod";
import axios from "axios";
import {
  retrieveContext,
  formatContextForPrompt,
} from "@/lib/services/rag-service";

export const submitContactForm = tool({
  name: "submitContactForm",
  description: "Submit a contact form with user details.",
  inputSchema: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
    message: z.string().min(1),
  }),
  async execute({ name, email, phone, message }) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/form`,
        {
          name,
          email,
          phone,
          message,
        }
      );
      if (response.status === 201) {
        return "Contact form submitted successfully.";
      } else {
        return "Failed to submit contact form.";
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return "An error occurred while submitting the contact form.";
    }
  },
  outputSchema: z.string(),
});

export const searchDocuments = tool({
  name: "searchDocuments",
  description:
    "Search through the knowledge base documents to find relevant information. Use this when you need specific information about the company, products, services, or policies.",
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant documents"),
  }),
  async execute({ query }) {
    try {
      // console.log("Searching documents with query:", query);
      const context = await retrieveContext(query);
      // console.log("Retrieved context:", context);
      const formattedContext = formatContextForPrompt(context);

      if (!formattedContext || formattedContext.trim() === "") {
        return "No relevant documents found for your query.";
      }

      return formattedContext;
    } catch (error) {
      console.error("Error searching documents:", error);
      return "An error occurred while searching the documents.";
    }
  },
  outputSchema: z.string(),
});
