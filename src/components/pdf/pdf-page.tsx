import React, { useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { useTextSelection } from "@/hooks/use-text-selection";
import { SelectionToolbar } from "@/components/selection-toolbar";

interface PdfPageProps {
  pdf: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  rotation: number;
  onTextSelected?: (text: string) => void;
}

export const PdfPage: React.FC<PdfPageProps> = ({
  pdf,
  pageNumber,
  scale,
  rotation,
  onTextSelected,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightLayerRef = useRef<HTMLDivElement>(null);

  const { handleCopy, range, clearSelection } = useTextSelection(
    containerRef,
    textLayerRef
  );

  useEffect(() => {
    let renderTask: pdfjsLib.RenderTask | null = null;
    let cancelled = false;

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      if (cancelled) return;

      const viewport = page.getViewport({ scale, rotation });
      const cssWidth = Math.round(viewport.width);
      const cssHeight = Math.round(viewport.height);

      const container = containerRef.current!;
      container.style.width = `${cssWidth}px`;
      container.style.height = `${cssHeight}px`;

      const canvas = canvasRef.current!;
      canvas.width = cssWidth;
      canvas.height = cssHeight;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      const ctx = canvas.getContext("2d")!;
      renderTask = page.render({ canvasContext: ctx, viewport });
      await renderTask.promise;
      if (cancelled) return;

      if (textLayerRef.current) {
        textLayerRef.current.innerHTML = "";
      }

      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: await page.getTextContent(),
        container: textLayerRef.current!,
        viewport,
      });
      textLayer.render();
    };

    renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdf, pageNumber, scale, rotation]);

  const onAction = (action: string) => {
    if (action === "copy") {
      handleCopy();
    } else {
      const text = range?.toString() || "";
      switch (action) {
        case "explain":
          console.log("Explain:", text);
          break;
        case "summarize":
          console.log("Summarize:", text);
          break;
        case "rewrite":
          console.log("Rewrite:", text);
          break;
        case "ask":
          onTextSelected?.(text);
          break;
        default:
          console.log("Unknown action:", action, "Text:", text);
      }
    }
    clearSelection();
  };

  return (
    <div ref={containerRef} className="page relative select-text">
      <div className="canvasWrapper">
        <canvas ref={canvasRef} />
      </div>
      <div ref={textLayerRef} className="textLayer" />
      <div
        ref={highlightLayerRef}
        className="highlightLayer"
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      />
      <SelectionToolbar range={range} onAction={onAction} />
    </div>
  );
};