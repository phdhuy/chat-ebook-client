import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, Moon, Sun, Maximize, Minimize, Settings, X } from "lucide-react";
import { usePdf } from "@/hooks/use-pdf";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { PdfToolbar } from "@/components/pdf/pdf-toolbar";
import { PdfSidebar } from "@/components/pdf/pdf-sidebar";
import { PdfSettings } from "@/components/pdf/pdf-setting";
import { PdfPage } from "@/components/pdf/pdf-page";
import type { Bookmark } from "@/types/pdf";
import { FixedSizeList } from "react-window";
import { useConversationDetail } from "@/hooks/use-conversation-detail";
import { useParams } from "react-router-dom";


export default function EbookViewPage() {
  const params = useParams()

  const conversationId = params.id as string
  const { data: conversation } = useConversationDetail(conversationId as string);

  const pdfUrl = conversation?.data?.file?.secure_url || "";
  const {
    pdf,
    numPages,
    documentTitle,
    author,
    outline,
    isLoading,
    pageDimensions,
  } = usePdf(pdfUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<FixedSizeList>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const [listHeight, setListHeight] = useState(600);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      if (containerRef.current) {
        const newHeight = containerRef.current.clientHeight - 120;
        setListHeight(newHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("pdf-bookmarks");
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, []);

  useEffect(() => {
    localStorage.setItem("pdf-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const getItemSize = useCallback(() => {
    if (!pageDimensions) {
      return 800 * scale;
    }
    const { width, height } = pageDimensions;
    const isRotated = rotation % 180 !== 0;
    const baseHeight = isRotated ? width : height;
    return baseHeight * scale;
  }, [pageDimensions, scale, rotation]);

  const handleScroll = useCallback(
    ({ scrollOffset }: { scrollOffset: number }) => {
      if (!pdf || !numPages) return;
      const itemHeight = getItemSize();
      const pageIndex = Math.floor(scrollOffset / itemHeight) + 1;
      setCurrentPage(Math.min(Math.max(1, pageIndex), numPages));
    },
    [pdf, numPages, getItemSize]
  );

  const toggleBookmark = () => {
    const exists = bookmarks.some((b) => b.pageNumber === currentPage);
    if (exists) {
      setBookmarks(bookmarks.filter((b) => b.pageNumber !== currentPage));
    } else {
      setBookmarks([
        ...bookmarks,
        {
          pageNumber: currentPage,
          title: `Page ${currentPage}`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages && listRef.current) {
      listRef.current.scrollToItem(page - 1, "center");
      setCurrentPage(page);
    }
  };

  const isBookmarked = bookmarks.some((b) => b.pageNumber === currentPage);

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
            <PdfPage
              pdf={pdf}
              pageNumber={index + 1}
              scale={scale}
              rotation={rotation}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>
    ),
    [pdf, scale, rotation, darkMode]
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowToc(!showToc)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle table of contents"
          >
            {showToc ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-semibold truncate max-w-[300px] md:max-w-md">
            {documentTitle || "Loading..."}
          </h1>
          {author && (
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
              by {author}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <PdfToolbar
        currentPage={currentPage}
        numPages={numPages}
        scale={scale}
        isBookmarked={isBookmarked}
        onPageChange={goToPage}
        onZoomIn={() => setScale((prev) => Math.min(3, prev + 0.2))}
        onZoomOut={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
        onResetZoom={() => setScale(1.2)}
        onRotate={() => setRotation((prev) => (prev + 90) % 360)}
        onToggleBookmark={toggleBookmark}
      />

      <div className="flex flex-1 overflow-hidden">
        {showToc && (
          <div className="fixed top-[7.5rem] left-66 w-72 h-[calc(100vh-7.5rem)] z-20">
            <PdfSidebar
              show={showToc}
              outline={outline}
              bookmarks={bookmarks}
              pdf={pdf}
              onClose={() => setShowToc(false)}
              onGoToPage={goToPage}
              onRemoveBookmark={(index) =>
                setBookmarks(bookmarks.filter((_, i) => i !== index))
              }
            />
          </div>
        )}

        {/* Settings Panel - Fixed position with z-index */}
        {showSettings && (
          <div className="fixed top-[7.5rem] right-0 w-72 h-[calc(100vh-7.5rem)] z-20">
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

        {/* Main Content */}
        <main
          className={`flex-1 flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900 ${
            showToc ? "pl-72" : ""
          } ${showSettings ? "pr-72" : ""} transition-all duration-300`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-600 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading PDF...</p>
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
                scrollbarColor: darkMode
                  ? "#4B5563 #1F2937"
                  : "#D1D5DB #F3F4F6",
              }}
            >
              {Row}
            </FixedSizeList>
          )}
        </main>
      </div>

      {/* Reading Progress */}
      <div className="h-1 bg-gray-200 dark:bg-gray-700 fixed bottom-0 left-0 right-0 z-30">
        <div
          className="h-full bg-purple-600 dark:bg-purple-500 transition-all duration-300"
          style={{ width: `${(currentPage / (numPages || 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}