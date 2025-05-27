import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { usePdf } from "@/hooks/use-pdf";
import { useFullscreen } from "@/pages/view/hooks/use-fullscreen";
import { PdfSidebar } from "@/components/pdf/pdf-sidebar";
import { PdfSettings } from "@/components/pdf/pdf-setting";
import { PdfPage } from "@/components/pdf/pdf-page";
import { FixedSizeList } from "react-window";
import { useConversationDetail } from "@/hooks/use-conversation-detail";
import { useParams } from "react-router-dom";
import PDFSkeleton from "@/components/pdf/pdf-skeleton";
import PdfHeader from "@/components/pdf/pdf-header";
import { useSelectedTextStore } from "@/stores/use-selected-text-store";

export default function EbookViewPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const { data: conversation } = useConversationDetail(
    conversationId as string
  );

  const pdfUrl = conversation?.data?.file?.secure_url || "";
  const { pdf, numPages, outline, isLoading, pageDimensions } = usePdf(pdfUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<FixedSizeList>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const [listHeight, setListHeight] = useState(600);
  const { setSelectedText } = useSelectedTextStore();

  const handleTextSelected = useCallback(
    (text: string) => {
      setSelectedText(text);
    },
    [setSelectedText]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      if (containerRef.current) {
        const headerHeight = showControls ? 80 : 0;
        const newHeight = containerRef.current.clientHeight - headerHeight;
        setListHeight(newHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [showControls]);

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

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages && listRef.current) {
      listRef.current.scrollToItem(page - 1, "center");
      setCurrentPage(page);
    }
  };

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div
        style={{
          ...style,
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
              onTextSelected={handleTextSelected}
            />
          </div>
        )}
      </div>
    ),
    [pdf, scale, rotation, handleTextSelected]
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-2 right-2 z-40 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={showControls ? "Hide controls" : "Show controls"}
      >
        {showControls ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {showControls && (
        <PdfHeader
          showToc={showToc}
          setShowToc={setShowToc}
          currentPage={currentPage}
          numPages={numPages}
          goToPage={goToPage}
          scale={scale}
          setScale={setScale}
          rotation={rotation}
          setRotation={setRotation}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {showToc && (
          <div className="w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0">
            <PdfSidebar
              show={showToc}
              outline={outline}
              pdf={pdf}
              onClose={() => setShowToc(false)}
              onGoToPage={goToPage}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col relative">
          {showSettings && (
            <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-20 overflow-auto">
              <PdfSettings
                show={showSettings}
                scale={scale}
                rotation={rotation}
                onClose={() => setShowSettings(false)}
                onScaleChange={setScale}
                onRotationChange={setRotation}
              />
            </div>
          )}

          <main className="flex-1 flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900">
            {isLoading ? (
              <PDFSkeleton />
            ) : (
              <FixedSizeList
                ref={listRef}
                height={listHeight}
                width="100%"
                itemCount={numPages}
                itemSize={getItemSize()}
                onScroll={handleScroll}
                className="pdf-list pdfViewer"
                style={{ "--scale-factor": scale } as React.CSSProperties}
              >
                {Row}
              </FixedSizeList>
            )}
          </main>
        </div>
      </div>

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
  );
}
