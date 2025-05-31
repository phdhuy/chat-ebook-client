import { useCallback, useEffect } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  Controls,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import { useMindMapEbook } from "./hooks/use-mindmap-ebook";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[]; edges: Edge[] } => {
  dagreGraph.setGraph({ rankdir: "LR" });

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

interface MindmapPageProps {
  conversationId: string;
}

export default function MindmapPage({ conversationId }: MindmapPageProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const {
    mutate: generateMindMap,
    data: mindMapData,
    isPending,
    isError,
    error,
  } = useMindMapEbook({
    onSuccess: (response) => {
      if (response.status === "success" && response.data?.payload) {
        const { nodes: apiNodes, edges: apiEdges } = response.data.payload;
        const styledNodes = apiNodes.map((node: Node, index: number) => ({
          ...node,
          className: index === 0 ? "central-node" : "child-node",
        }));
        const styledEdges = apiEdges.map((edge: Edge) => ({
          ...edge,
          style: { stroke: "#3b82f6", strokeWidth: 2 },
        }));
        const { nodes: layoutedNodes } = getLayoutedElements(
          styledNodes,
          styledEdges
        );
        setNodes(layoutedNodes);
        setEdges(styledEdges);
      }
    },
    onError: (error) => {
      console.error("Failed to generate mind map:", error);
    },
  });

  useEffect(() => {
    if (conversationId) {
      generateMindMap({ conversationId });
    }
  }, [conversationId, generateMindMap]);

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

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading mind map...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">
          Error loading mind map: {error?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  if (!mindMapData?.data?.payload) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">No mind map data available</div>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      style={{ backgroundColor: "#ffffff" }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="#e5e7eb"
      />
      <Controls />
    </ReactFlow>
  );
}