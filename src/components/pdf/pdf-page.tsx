import { useRef, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";

interface PdfPageProps {
  pdf: pdfjs.PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  rotation: number;
  darkMode: boolean;
}

export const PdfPage: React.FC<PdfPageProps> = ({ pdf, pageNumber, scale, rotation, darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let renderTask: pdfjs.RenderTask;
    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;

        if (darkMode) {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // R
            data[i + 1] = 255 - data[i + 1]; // G
            data[i + 2] = 255 - data[i + 2]; // B
          }
          context.putImageData(imageData, 0, 0);
        }

        // Log the rendered height for debugging
        console.log(`Page ${pageNumber} rendered height: ${viewport.height}`);
      } catch (error) {
        if (error instanceof Error && error.name !== "RenderingCancelledException") {
          console.error("Error rendering page:", error);
        }
      }
    };

    if (pdf) {
      renderPage();
    }

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdf, pageNumber, scale, rotation, darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="shadow-lg bg-white dark:bg-gray-900 max-w-full"
      style={{ margin: 0, padding: 0 }}
    />
  );
};