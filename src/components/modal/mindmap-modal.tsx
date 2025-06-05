import { useState, useCallback, useEffect } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  Controls,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Download,
  Maximize2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import "./css/mindmap-styles.css";
import { useMindMapEbook } from "@/pages/mindmap/hooks/use-mindmap-ebook";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 60;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[]; edges: Edge[] } => {
  dagreGraph.setGraph({ rankdir: "LR", ranksep: 120, nodesep: 80 });

  nodes.forEach((node: Node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: Edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node: Node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode: Node = {
      ...node,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

interface MindmapModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

export default function MindmapModal({
  isOpen,
  onOpenChange,
  conversationId,
}: MindmapModalProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    mutate: generateMindMap,
    data: mindMapData,
    isPending,
    isError,
    error,
    reset,
  } = useMindMapEbook({
    onSuccess: (response) => {
      if (response.status === "success" && response.data?.payload) {
        const { nodes: apiNodes, edges: apiEdges } = response.data.payload;

        const styledNodes = apiNodes.map((node: Node, index: number) => {
          const isRoot = index === 0;
          const connectedEdges = apiEdges.filter(
            (edge: Edge) => edge.source === node.id || edge.target === node.id
          );
          const isLeaf =
            connectedEdges.length === 1 && connectedEdges[0].target === node.id;

          const nodeClass = isRoot
            ? "mindmap-node-root"
            : isLeaf
            ? "mindmap-node-leaf"
            : "mindmap-node-branch";

          return {
            ...node,
            className: nodeClass,
            data: {
              ...node.data,
              isRoot,
              isLeaf,
            },
          };
        });

        const styledEdges = apiEdges.map((edge: Edge, index: number) => {
          const sourceNode = styledNodes.find(
            (n: Node) => n.id === edge.source
          );
          const isFromRoot = sourceNode?.data?.isRoot;

          return {
            ...edge,
            id: `edge-${index}`,
            type: "smoothstep",
            animated: isFromRoot,
            className: isFromRoot
              ? "mindmap-edge-primary"
              : "mindmap-edge-secondary",
            style: {
              strokeWidth: isFromRoot ? 3 : 2,
              stroke: isFromRoot
                ? "url(#gradient-primary)"
                : "url(#gradient-secondary)",
            },
          };
        });

        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(styledNodes, styledEdges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
    },
    onError: (error) => {
      console.error("Failed to generate mind map:", error);
    },
  });

  useEffect(() => {
    if (isOpen && conversationId) {
      generateMindMap({ conversationId });
    }
  }, [isOpen, conversationId, generateMindMap]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    [setEdges]
  );

  const handleDownload = () => {
    const svgElement = document.querySelector(
      ".react-flow__renderer svg"
    ) as SVGElement;
    if (!svgElement) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const link = document.createElement("a");
      link.download = `mindmap-${conversationId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(data)}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleRetry = () => {
    reset();
    generateMindMap({ conversationId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={`p-6 rounded-xl shadow-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? "max-w-[100vw] w-[100vw] h-[100vh] rounded-none"
            : "max-w-7xl h-[90vh]"
        }`}
      >
        <DialogHeader className="px-8 py-6 border-b border-blue-200/50 bg-white/50 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Mind Map Visualization
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 border-blue-200 hover:bg-blue-100/50 hover:text-blue-700"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 border-blue-200 hover:bg-blue-100/50 hover:text-blue-700"
                onClick={toggleFullscreen}
              >
                <Maximize2 className="h-4 w-4" />
                <span className="sr-only">Toggle fullscreen</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-blue-700/70 mt-1">
            Explore the connections between concepts in your conversation
          </p>
        </DialogHeader>

        <div className="flex-1 bg-white/30 backdrop-blur-sm p-0 relative">
          {isPending ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
              <div className="animate-spin text-blue-600 mb-4">
                <Loader2 size={40} />
              </div>
              <p className="text-lg font-medium text-blue-800">
                Generating your mind map...
              </p>
              <p className="text-sm text-blue-600/80 mt-2">
                This may take a few moments
              </p>
            </div>
          ) : isError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
              <div className="text-red-500 mb-4">
                <AlertCircle size={40} />
              </div>
              <p className="text-lg font-medium text-red-800">
                Failed to generate mind map
              </p>
              <p className="text-sm text-red-600/80 mt-2 mb-4">
                {error?.message || "An unknown error occurred"}
              </p>
              <Button onClick={handleRetry} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : !mindMapData?.data?.payload ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
              <p className="text-lg font-medium text-blue-800">
                No mind map data available
              </p>
              <p className="text-sm text-blue-600/80 mt-2">
                Try with a different conversation
              </p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              connectionLineType={ConnectionLineType.SmoothStep}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              className="mindmap-flow"
              minZoom={0.2}
              maxZoom={1.5}
              defaultEdgeOptions={{
                type: "smoothstep",
                style: { strokeWidth: 2 },
              }}
            >
              {/* SVG Gradients for edges */}
              <svg style={{ position: "absolute", width: 0, height: 0 }}>
                <defs>
                  <linearGradient
                    id="gradient-primary"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient
                    id="gradient-secondary"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>

              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color="#c7d2fe"
                className="bg-white/70"
              />
              <Controls className="mindmap-controls" showInteractive={false} />
            </ReactFlow>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
