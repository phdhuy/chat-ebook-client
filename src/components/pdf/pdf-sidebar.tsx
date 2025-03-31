"use client"

import type React from "react"

import type { Bookmark, PdfOutlineItem } from "@/types/pdf"
import { X } from "lucide-react"
import type { PDFDocumentProxy } from "pdfjs-dist"

interface PdfSidebarProps {
  show: boolean
  outline: PdfOutlineItem[]
  bookmarks: Bookmark[]
  pdf: PDFDocumentProxy | null
  onClose: () => void
  onGoToPage: (page: number) => void
  onRemoveBookmark: (index: number) => void
}

export const PdfSidebar: React.FC<PdfSidebarProps> = ({
  show,
  outline,
  bookmarks,
  pdf,
  onClose,
  onGoToPage,
  onRemoveBookmark,
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
          <X size={18} />
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

        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              BOOKMARKS
            </h3>
          </div>
          <div className="p-4 overflow-y-auto max-h-48">
            {bookmarks.length > 0 ? (
              <ul className="space-y-1">
                {bookmarks.map((bookmark, index) => (
                  <li key={index} className="flex items-center">
                    <button
                      onClick={() => onGoToPage(bookmark.pageNumber)}
                      className="flex-1 text-left py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      {bookmark.title}
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(index)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label="Remove bookmark"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No bookmarks added</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

