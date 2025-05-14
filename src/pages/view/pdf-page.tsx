import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { selectionModePlugin } from "@react-pdf-viewer/selection-mode";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/selection-mode/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import { useParams } from "react-router-dom";
import { useConversationDetail } from "@/hooks/use-conversation-detail";
import PDFSkeleton from "@/components/pdf/pdf-skeleton";

interface ToolbarProps {
  onBookmark: () => void;
}

const Toolbar = ({ onBookmark }: ToolbarProps) => (
  <div
    style={{
      position: "absolute",
      background: "white",
      border: "1px solid black",
      padding: "5px",
      zIndex: 100,
    }}
  >
    <button onClick={onBookmark}>Bookmark</button>
  </div>
);

export const PdfPage: React.FC = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const selectionPluginInstance = selectionModePlugin();
  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget: (props) => {
      const { selectionRegion, selectedText, cancel } = props;
      return (
        <div
          style={{
            position: "absolute",
            top: `${selectionRegion.top}px`,
            left: `${selectionRegion.left}px`,
          }}
        >
          <Toolbar
            onBookmark={() => {
              console.log("Bookmarked:", selectedText);
              cancel();
            }}
          />
        </div>
      );
    },
  });

  const params = useParams<{ id?: string }>();
  const conversationId = params.id;

  const {
    data: conversation,
    isLoading,
    error,
  } = useConversationDetail(conversationId || "");

  if (!conversationId) {
    return <div>No conversation ID provided</div>;
  }

  if (error) {
    return <div>Error loading PDF: {error.message}</div>;
  }

  const pdfUrl = conversation?.data?.file?.secure_url || "";

  if (!pdfUrl) {
    return <PDFSkeleton />;
  }

  return isLoading ? (
    <PDFSkeleton />
  ) : (
    <div style={{ height: "100vh" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfUrl}
          defaultScale={1.0}
          plugins={[
            defaultLayoutPluginInstance,
            selectionPluginInstance,
            highlightPluginInstance,
          ]}
        />
      </Worker>
    </div>
  );
};
