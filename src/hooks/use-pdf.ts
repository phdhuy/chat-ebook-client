import { useState, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { PDFMetadataInfo, PdfOutlineItem } from "../types/pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export const usePdf = (pdfUrl: string) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [documentTitle, setDocumentTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [outline, setOutline] = useState<PdfOutlineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageDimensions, setPageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdfDocument = await loadingTask.promise;
        setPdf(pdfDocument);
        setNumPages(pdfDocument.numPages);

        const metadata = await pdfDocument.getMetadata();
        const info = metadata.info as PDFMetadataInfo;
        setDocumentTitle(info.Title || "Untitled PDF");
        setAuthor(info.Author || "");

        if (pdfDocument.numPages > 0) {
          const firstPage = await pdfDocument.getPage(1);
          const viewport = firstPage.getViewport({ scale: 1 });
          setPageDimensions({ width: viewport.width, height: viewport.height });
        }

        try {
          const pdfOutline = await pdfDocument.getOutline();
          setOutline(pdfOutline || []);
        } catch {
          console.log("No outline available");
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPdf();
  }, [pdfUrl]);

  return { pdf, numPages, documentTitle, author, outline, isLoading, pageDimensions };
};
