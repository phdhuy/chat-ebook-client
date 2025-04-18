import { useRef, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";

interface PdfPageProps {
  pdf: pdfjs.PDFDocumentProxy;
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

  useEffect(() => {
    let renderTask: pdfjs.RenderTask;

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);

      const baseViewport = page.getViewport({ scale: 1, rotation });
      const targetWidth = Math.round(baseViewport.width * scale);
      const targetHeight = Math.round(baseViewport.height * scale);

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.style.width = `${targetWidth}px`;
      canvas.style.height = `${targetHeight}px`;

      const viewport = page.getViewport({ scale, rotation });
      renderTask = page.render({ canvasContext: ctx, viewport });
      await renderTask.promise;

      if (darkMode) {
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          d[i] = 255 - d[i];
          d[i + 1] = 255 - d[i + 1];
          d[i + 2] = 255 - d[i + 2];
        }
        ctx.putImageData(imageData, 0, 0);
      }
    };

    renderPage();

    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pdf, pageNumber, scale, rotation, darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="shadow-lg bg-white dark:bg-gray-900 block"
      style={{ margin: 0, padding: 0 }}
    />
  );
};