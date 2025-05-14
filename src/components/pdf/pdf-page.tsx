// import { useRef, useEffect } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import { TextLayerBuilder } from "pdfjs-dist/web/pdf_viewer.mjs";
// import "pdfjs-dist/web/pdf_viewer.css";

// interface PdfPageProps {
//   pdf: pdfjsLib.PDFDocumentProxy;
//   pageNumber: number;
//   scale: number;
//   rotation: number;
//   darkMode: boolean;
// }

// export const PdfPage: React.FC<PdfPageProps> = ({
//   pdf,
//   pageNumber,
//   scale,
//   rotation,
//   darkMode,
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const textLayerRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     let renderTask: pdfjsLib.RenderTask | null = null;
//     let textLayerBuilder: TextLayerBuilder | null = null;
//     let cancelled = false;

//     const renderPage = async () => {
//       const page = await pdf.getPage(pageNumber);
//       if (cancelled) return;

//       const pixelRatio = window.devicePixelRatio || 1;
//       const viewport = page.getViewport({
//         scale: scale * pixelRatio,
//         rotation,
//       });
//       const textViewport = page.getViewport({ scale: scale, rotation });

//       const cssWidth = Math.round(viewport.width / pixelRatio);
//       const cssHeight = Math.round(viewport.height / pixelRatio);

//       const container = containerRef.current!;
//       container.style.width = `${cssWidth}px`;
//       container.style.height = `${cssHeight}px`;

//       const canvas = canvasRef.current!;
//       canvas.width = Math.round(viewport.width);
//       canvas.height = Math.round(viewport.height);
//       canvas.style.width = `${cssWidth}px`;
//       canvas.style.height = `${cssHeight}px`;

//       const ctx = canvas.getContext("2d")!;
//       renderTask = page.render({ canvasContext: ctx, viewport });
//       await renderTask.promise;
//       if (cancelled) return;

//       if (darkMode) {
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const d = imageData.data;
//         for (let i = 0; i < d.length; i += 4) {
//           d[i] = 255 - d[i];
//           d[i + 1] = 255 - d[i + 1];
//           d[i + 2] = 255 - d[i + 2];
//         }
//         ctx.putImageData(imageData, 0, 0);
//       }

//       const textDiv = textLayerRef.current!;
//       textDiv.innerHTML = "";
//       textDiv.style.width = `${cssWidth}px`;
//       textDiv.style.height = `${cssHeight}px`;
//       textDiv.style.transform = "none";

//       textLayerBuilder = new TextLayerBuilder({
//         pdfPage: page,
//         enablePermissions: false,
//         onAppend: (dv: HTMLDivElement) => textDiv.appendChild(dv),
//       });
//       await textLayerBuilder.render({
//         viewport: textViewport,
//         textContentParams: {
//           disableCombineTextItems: false,
//           includeMarkedContent: false,
//         },
//       });
//     };

//     renderPage();
//     return () => {
//       cancelled = true;
//       renderTask?.cancel();
//       textLayerBuilder?.cancel();
//     };
//   }, [pdf, pageNumber, scale, rotation, darkMode]);

//   return (
//     <div
//       ref={containerRef}
//       style={{ position: "relative", display: "inline-block" }}
//     >
//       <canvas
//         ref={canvasRef}
//         className="shadow-lg"
//         style={{ background: darkMode ? "#333" : "#fff" }}
//       />
//       <div
//         ref={textLayerRef}
//         className="pdfViewer textLayer"
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           pointerEvents: "auto",
//           color: "transparent",
//         }}
//       />
//     </div>
//   );
// };