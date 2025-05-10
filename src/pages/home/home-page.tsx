import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="w-full flex flex-col items-center gap-10 relative z-10">
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Chat with any{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-3 py-1 rounded-lg">
                Ebook
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-violet-600 blur-sm"></span>
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Upload your PDF and ask questions about its content. Our AI will analyze the document and provide accurate
            answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center hover:shadow-xl hover:scale-105 transition-all duration-300 group">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-full mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300">
              <Upload className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Upload New PDF</h2>
            <p className="text-gray-500 dark:text-gray-300 mb-4">Upload a new Ebook document to chat with it</p>
            <Link to="/upload">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30">
                Upload Ebook
              </Button>
            </Link>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center hover:shadow-xl hover:scale-105 transition-all duration-300 group">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-full mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Recent Documents</h2>
            <p className="text-gray-500 dark:text-gray-300 mb-4">Continue chatting with your recent documents</p>
            <Button
              variant="outline"
              className="border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 font-medium px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              View Recent
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-100 dark:border-gray-700">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Powered by AI and RAG technology</p>
          </div>
        </div>
      </div>
    </div>
  )
}