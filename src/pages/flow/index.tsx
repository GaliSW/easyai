"use client";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowData } from "./hooks/useFlowData";
import { useNodeManagement } from "./hooks/useNodeManagement";
import { nodeTypes, edgeTypes } from "./config/flowConfig";

function Flow() {
  const { nodes, edges, setNodes, setEdges } = useFlowData();
  const { onNodesChange, onEdgesChange, onConnect, onNodeClick } =
    useNodeManagement(nodes, edges, setNodes, setEdges);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
export default Flow;
