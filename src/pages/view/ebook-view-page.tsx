import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Menu, Moon, Sun, Maximize, Minimize, Settings, X, ChevronUp, ChevronDown } from "lucide-react"
import { usePdf } from "@/hooks/use-pdf"
import { useFullscreen } from "@/hooks/use-fullscreen"
import { PdfSidebar } from "@/components/pdf/pdf-sidebar"
import { PdfSettings } from "@/components/pdf/pdf-setting"
import { PdfPage } from "@/components/pdf/pdf-page"
import type { Bookmark } from "@/types/pdf"
import { FixedSizeList } from "react-window"
import { useConversationDetail } from "@/hooks/use-conversation-detail"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function EbookViewPage() {
  const params = useParams()
  const conversationId = params.id as string
  const { data: conversation } = useConversationDetail(conversationId as string)

  const pdfUrl = conversation?.data?.file?.secure_url || ""
  const { pdf, numPages, documentTitle, author, outline, isLoading, pageDimensions } = usePdf(pdfUrl)

  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.2)
  const [rotation, setRotation] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [showToc, setShowToc] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<FixedSizeList>(null)
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef)
  const [listHeight, setListHeight] = useState(600)

  useEffect(() => {
    if (!containerRef.current) return

    const updateHeight = () => {
      if (containerRef.current) {
        const headerHeight = showControls ? 80 : 0
        const newHeight = containerRef.current.clientHeight - headerHeight
        setListHeight(newHeight)
      }
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [showControls])

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("pdf-bookmarks")
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks))
  }, [])

  useEffect(() => {
    localStorage.setItem("pdf-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const getItemSize = useCallback(() => {
    if (!pageDimensions) {
      return 800 * scale
    }
    const { width, height } = pageDimensions
    const isRotated = rotation % 180 !== 0
    const baseHeight = isRotated ? width : height
    return baseHeight * scale
  }, [pageDimensions, scale, rotation])

  const handleScroll = useCallback(
    ({ scrollOffset }: { scrollOffset: number }) => {
      if (!pdf || !numPages) return
      const itemHeight = getItemSize()
      const pageIndex = Math.floor(scrollOffset / itemHeight) + 1
      setCurrentPage(Math.min(Math.max(1, pageIndex), numPages))
    },
    [pdf, numPages, getItemSize],
  )

  const toggleBookmark = () => {
    const exists = bookmarks.some((b) => b.pageNumber === currentPage)
    if (exists) {
      setBookmarks(bookmarks.filter((b) => b.pageNumber !== currentPage))
    } else {
      setBookmarks([
        ...bookmarks,
        {
          pageNumber: currentPage,
          title: `Page ${currentPage}`,
          timestamp: new Date(),
        },
      ])
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages && listRef.current) {
      listRef.current.scrollToItem(page - 1, "center")
      setCurrentPage(page)
    }
  }

  const isBookmarked = bookmarks.some((b) => b.pageNumber === currentPage)

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div
        style={{
          ...style,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="w-full"
      >
        {pdf && (
          <div className="flex justify-center">
            <PdfPage pdf={pdf} pageNumber={index + 1} scale={scale} rotation={rotation} darkMode={darkMode} />
          </div>
        )}
      </div>
    ),
    [pdf, scale, rotation, darkMode],
  )

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Toggle Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-2 right-2 z-40 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={showControls ? "Hide controls" : "Show controls"}
      >
        {showControls ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Minimal Header - Only shown when controls are visible */}
      {showControls && (
        <header className="h-12 flex items-center justify-between px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowToc(!showToc)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle table of contents"
            >
              {showToc ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="text-sm font-medium truncate max-w-[200px] md:max-w-md">{documentTitle || "Loading..."}</h1>
            {author && <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">by {author}</span>}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs mr-2">
              {currentPage} / {numPages}
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>
      )}

      {/* Minimal Toolbar - Only shown when controls are visible */}
      {showControls && (
        <div className="h-10 flex items-center justify-center gap-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30">
          <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
              className="px-2"
            >
              -
            </Button>
            <span className="text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScale((prev) => Math.min(3, prev + 0.2))}
              className="px-2"
            >
              +
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= numPages}
          >
            Next
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="hidden sm:flex"
          >
            Rotate
          </Button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Full height on the left side */}
        {showToc && (
          <div className="w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0">
            <PdfSidebar
              show={showToc}
              outline={outline}
              bookmarks={bookmarks}
              pdf={pdf}
              onClose={() => setShowToc(false)}
              onGoToPage={goToPage}
              onRemoveBookmark={(index) => setBookmarks(bookmarks.filter((_, i) => i !== index))}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Settings Panel - Fixed position on the right */}
          {showSettings && (
            <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-20 overflow-auto">
              <PdfSettings
                show={showSettings}
                scale={scale}
                rotation={rotation}
                darkMode={darkMode}
                onClose={() => setShowSettings(false)}
                onScaleChange={setScale}
                onRotationChange={setRotation}
                onDarkModeChange={setDarkMode}
              />
            </div>
          )}

          {/* PDF Content */}
          <main className="flex-1 flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-8 h-8 border-3 border-gray-300 dark:border-gray-600 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Loading PDF...</p>
              </div>
            ) : (
              <FixedSizeList
                ref={listRef}
                height={listHeight}
                width="100%"
                itemCount={numPages}
                itemSize={getItemSize()}
                onScroll={handleScroll}
                className="pdf-list"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: darkMode ? "#4B5563 #1F2937" : "#D1D5DB #F3F4F6",
                }}
              >
                {Row}
              </FixedSizeList>
            )}
          </main>
        </div>
      </div>

      {/* Floating Bookmark Button - Always visible */}
      <button
        onClick={toggleBookmark}
        className={`absolute bottom-4 right-4 z-40 p-2 rounded-full shadow-md transition-colors ${
          isBookmarked
            ? "bg-purple-500 text-white hover:bg-purple-600"
            : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        {isBookmarked ? "★" : "☆"}
      </button>

      {/* Floating Page Navigation - Only visible when controls are hidden */}
      {!showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md flex items-center px-3 py-1.5 backdrop-blur-sm">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 disabled:opacity-50"
            aria-label="Previous page"
          >
            ←
          </button>
          <span className="text-xs px-2 min-w-[60px] text-center">
            {currentPage} / {numPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= numPages}
            className="p-1.5 disabled:opacity-50"
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}