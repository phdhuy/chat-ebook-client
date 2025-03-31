import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full flex flex-col items-center gap-8">
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Chat with any{" "}
            <span className="bg-purple-600 text-white px-2 rounded">Ebook</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload your PDF and ask questions about its content. Our AI will
            analyze the document and provide accurate answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Upload New PDF
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Upload a new Ebook document to chat with it
            </p>
            <Link to="/upload">
              <Button>Upload Ebook</Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Recent Documents
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Continue chatting with your recent documents
            </p>
            <Button variant="outline">View Recent</Button>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by AI and RAG technology</p>
        </div>
      </div>
    </div>
  );
}