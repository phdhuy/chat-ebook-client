import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePdf } from "@/hooks/use-pdf";
import { useFullscreen } from "@/pages/ebook-view/hooks/use-fullscreen";
import { PdfSidebar } from "@/components/pdf/pdf-sidebar";
import { PdfPage } from "@/components/pdf/pdf-page";
import { FixedSizeList } from "react-window";
import { useConversationDetail } from "@/hooks/use-conversation-detail";
import { useParams } from "react-router-dom";
import PDFSkeleton from "@/components/pdf/pdf-skeleton";
import PdfHeader from "@/components/pdf/pdf-header";
import { useSelectedTextStore } from "@/stores/use-selected-text-store";
import { useReferencePageStore } from "@/stores/use-reference-page-store";
import { Helmet } from "react-helmet";

const GAP = 20;

export default function EbookViewPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const { data: conversation } = useConversationDetail(conversationId as string);
  const pageTitle = conversation?.data?.name ? `${conversation.data.name} | ChatEbook` : "ChatEbook";
  const pdfUrl = conversation?.data?.file?.secure_url || "";
  const { pdf, numPages, outline, isLoading, pageDimensions } = usePdf(pdfUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [fitMode, setFitMode] = useState<"none" | "width">("none");
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<FixedSizeList>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const [listHeight, setListHeight] = useState(600);
  const [containerWidth, setContainerWidth] = useState(0);
  const { setSelectedText } = useSelectedTextStore();
  const { page, clearReferencePage } = useReferencePageStore();

  useEffect(() => {
    setScale(1);
    setRotation(0);
    setCurrentPage(1);
    setFitMode("none");
  }, [conversationId]);

  useEffect(() => {
    if (page >= 1 && page <= numPages && listRef.current) {
      listRef.current.scrollToItem(page - 1, "center");
      setCurrentPage(page);
      clearReferencePage();
    }
  }, [page, numPages, clearReferencePage]);

  const handleTextSelected = useCallback(
    (text: string) => {
      setSelectedText(text);
    },
    [setSelectedText]
  );

  const calculateFitWidthScale = useCallback(() => {
    if (!pageDimensions || !mainContentRef.current) {
      return 1;
    }

    const containerRect = mainContentRef.current.getBoundingClientRect();
    const availableWidth = containerRect.width - 40;

    const { width: pageWidth, height: pageHeight } = pageDimensions;
    const isRotated = rotation % 180 !== 0;
    const actualPageWidth = isRotated ? pageHeight : pageWidth;

    const fitWidthScale = availableWidth / actualPageWidth;

    return Math.max(0.1, Math.min(3, fitWidthScale));
  }, [pageDimensions, rotation]);

  useEffect(() => {
    if (fitMode === "none") return;

    const fitWidthScale = calculateFitWidthScale();

    if (fitMode === "width") {
      setScale(fitWidthScale);
    }
  }, [fitMode, calculateFitWidthScale, pageDimensions, rotation, containerWidth]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (mainContentRef.current) {
        const newHeight = mainContentRef.current.clientHeight;
        const newWidth = mainContentRef.current.clientWidth;
        setListHeight(newHeight);
        setContainerWidth(newWidth);
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const getItemSize = useCallback(() => {
    if (!pageDimensions) return 800 * scale;
    const { width, height } = pageDimensions;
    const isRotated = rotation % 180 !== 0;
    const baseHeight = isRotated ? width : height;
    return baseHeight * scale + GAP;
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

  const handleScaleChange = (newScale: number | ((prev: number) => number)) => {
    setScale(newScale);
    setFitMode("none");
  };

  const handleFitWidth = () => {
    setFitMode("width");
  };

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div style={{ ...style }} className="w-full">
        {pdf && (
          <div className="flex justify-center" style={{ paddingBottom: `${GAP}px` }}>
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
      <Helmet>
        <title>{`${pageTitle}`}</title>
      </Helmet>

      <PdfHeader
        showToc={showToc}
        setShowToc={setShowToc}
        currentPage={currentPage}
        numPages={numPages}
        goToPage={goToPage}
        scale={scale}
        setScale={handleScaleChange}
        rotation={rotation}
        setRotation={setRotation}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        fitToWidth={handleFitWidth}
      />

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
          <main
            ref={mainContentRef}
            className="flex-1 flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-gray-900"
          >
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
                className="pdf-list pdfViewer custom-scrollbar"
                style={{ "--scale-factor": scale } as React.CSSProperties}
              >
                {Row}
              </FixedSizeList>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}