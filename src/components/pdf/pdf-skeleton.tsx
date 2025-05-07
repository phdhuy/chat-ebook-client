export default function PDFSkeleton() {
  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-8 px-4">
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="w-full md:w-4/5 lg:w-3/4 mb-8 rounded-xl overflow-hidden bg-gradient-to-b from-gray-100 to-gray-50 shadow-md"
        >
          {/* Document header */}
          <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center">
            <div className="w-1/3 h-4 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          {/* Document content */}
          <div className="p-6 space-y-6">
            {/* Title area */}
            <div className="w-3/4 h-8 bg-gray-200 rounded-lg animate-pulse"></div>

            {/* Content lines */}
            <div className="space-y-4">
              {[...Array(12)].map((_, lineIdx) => (
                <div
                  key={lineIdx}
                  className={`h-4 bg-gray-200 rounded animate-pulse ${
                    lineIdx % 3 === 0 ? "w-full" : lineIdx % 3 === 1 ? "w-5/6" : "w-4/6"
                  }`}
                ></div>
              ))}
            </div>

            {/* Image placeholder */}
            <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse"></div>

            {/* More content lines */}
            <div className="space-y-4 pt-4">
              {[...Array(8)].map((_, lineIdx) => (
                <div
                  key={lineIdx}
                  className={`h-4 bg-gray-200 rounded animate-pulse ${
                    lineIdx % 4 === 0 ? "w-full" : lineIdx % 4 === 1 ? "w-5/6" : lineIdx % 4 === 2 ? "w-4/6" : "w-3/6"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Document footer */}
          <div className="h-12 bg-gray-50 border-t border-gray-200 px-6 flex items-center justify-between">
            <div className="w-16 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )
}