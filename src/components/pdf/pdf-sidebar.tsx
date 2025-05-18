import type React from "react"
import type { PdfOutlineItem } from "@/types/pdf"
import type { PDFDocumentProxy } from "pdfjs-dist"

interface PdfSidebarProps {
  show: boolean
  outline: PdfOutlineItem[]
  pdf: PDFDocumentProxy | null
  onClose: () => void
  onGoToPage: (page: number) => void
}

export const PdfSidebar: React.FC<PdfSidebarProps> = ({
  show,
  outline,
  pdf,
  onClose,
  onGoToPage,
}) => {
  const handleOutlineClick = async (item: PdfOutlineItem) => {
    if (!item.dest || !pdf) return
    if (typeof item.dest === "number") {
      onGoToPage(item.dest)
    } else if (Array.isArray(item.dest)) {
      const pageRef = item.dest[0]
      const index = await pdf.getPageIndex(pageRef)
      onGoToPage(index + 1)
    }
  }

  if (!show) return null

  return (
    <aside className="h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold">Table of Contents</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close sidebar"
        >
        </button>
      </div>

      <div className="flex flex-col h-full">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">OUTLINE</h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {outline.length > 0 ? (
            <ul className="py-2">
              {outline.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleOutlineClick(item)}
                    className="w-full text-left py-1.5 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    {item.title}
                  </button>
                  {item.items && item.items.length > 0 && (
                    <ul className="pl-4">
                      {item.items.map((subItem, subIndex) => (
                        <li key={`${index}-${subIndex}`}>
                          <button
                            onClick={() => handleOutlineClick(subItem)}
                            className="w-full text-left py-1 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                          >
                            {subItem.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400 italic">No outline available</p>
          )}
        </div>
      </div>
    </aside>
  )
}

