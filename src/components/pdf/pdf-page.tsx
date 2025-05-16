import { useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

interface PdfPageProps {
  pdf: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  rotation: number;
  darkMode: boolean;
}

export const PdfPage: React.FC<PdfPageProps> = ({
  pdf,
  pageNumber,
  scale,
  rotation,
  darkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderTask: pdfjsLib.RenderTask | null = null;
    let cancelled = false;

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      if (cancelled) return;

      const viewport = page.getViewport({
        scale: scale,
        rotation,
      });

      const cssWidth = Math.round(viewport.width);
      const cssHeight = Math.round(viewport.height);

      const container = containerRef.current!;
      container.style.width = `${cssWidth}px`;
      container.style.height = `${cssHeight}px`;

      const canvas = canvasRef.current!;
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      const ctx = canvas.getContext("2d")!;
      renderTask = page.render({ canvasContext: ctx, viewport });
      await renderTask.promise;
      if (cancelled) return;

      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: await page.getTextContent(),
        container: textLayerRef.current!,
        viewport: viewport,
      });
      textLayer.render();
    };

    renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdf, pageNumber, scale, rotation, darkMode]);

  return (
    <div ref={containerRef} className="page">
      <div className="canvasWrapper">
        <canvas className="canvasWrapper" ref={canvasRef}></canvas>
      </div>
      <div ref={textLayerRef} className="textLayer" />
    </div>
  );
};