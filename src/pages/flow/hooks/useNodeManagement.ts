"use client";
import { useCallback } from 'react';
import { Node, Edge, Connection, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges, addEdge, MarkerType } from '@xyflow/react';
import { NodeData } from '../types';
import { getColorByType } from '../utils/colorUtils';

export const useNodeManagement = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) => {
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds) as Node<NodeData>[]),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const generateUniqueId = useCallback(
    (prefix: string) => {
      const existingIds = new Set([
        ...nodes.map((node) => node.id),
        ...edges.map((edge) => edge.id),
      ]);
      let newId = "";
      let counter = 1;
      do {
        newId = `${prefix}${counter}`;
        counter++;
      } while (existingIds.has(newId));
      return newId;
    },
    [nodes, edges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, clickedNode: Node<NodeData>) => {
      const childNodes = nodes.filter((node) =>
        edges.some(
          (edge) => edge.source === clickedNode.id && edge.target === node.id
        )
      );

      if (clickedNode.data.level >= 4) return; // 第四層節點不能再添加子節點

      let newNodeType: NodeData["type"];
      let newNodeLabel: string;
      let xOffset = 150; // 減小水平間距
      let yOffset = clickedNode.data.level === 1 ? 200 : 80;

      switch (clickedNode.data.level) {
        case 1:
          newNodeType = "original_data";
          newNodeLabel = "原始資料";
          break;
        case 2:
          if (childNodes.length >= 2) return; // 原始資料最多只能有兩個子節點
          newNodeType = childNodes.some(
            (node) => node.data.type === "visualization"
          )
            ? "model_selection"
            : "visualization";
          newNodeLabel =
            newNodeType === "visualization" ? "資料視覺化" : "選擇模型";
          break;
        case 3:
          if (
            clickedNode.data.type === "model_selection" &&
            childNodes.length === 0
          ) {
            newNodeType = "model_result";
            newNodeLabel = "模型結果";
          } else {
            return; // 不允許添加其他類型的子節點
          }
          break;
        default:
          return;
      }

      // 檢查新節點位置是否與現有節點重疊
      const isOverlapping = (x: number, y: number) => {
        return nodes.some(
          (node) =>
            Math.abs(node.position.x - x) < 120 && // 調整重疊檢測的閾值
            Math.abs(node.position.y - y) < 50
        );
      };

      let newX = clickedNode.position.x + xOffset;
      let newY = clickedNode.position.y + childNodes.length * yOffset;

      // 如果新位置重疊，嘗試調整位置
      while (isOverlapping(newX, newY)) {
        newY += 20; // 小幅度向下調整
      }

      const newNodeId = generateUniqueId("n");
      const newEdgeId = generateUniqueId("e");

      const newNode: Node<NodeData> = {
        id: newNodeId,
        type: "custom",
        position: { x: newX, y: newY },
        data: {
          label: newNodeLabel,
          type: newNodeType,
          level: clickedNode.data.level + 1,
        },
      };

      const newEdge: Edge = {
        id: newEdgeId,
        source: clickedNode.id,
        target: newNodeId,
        type: "step",
        style: { stroke: getColorByType(newNodeType) },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: getColorByType(newNodeType),
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(newEdge));
    },
    [nodes, edges, generateUniqueId, setNodes, setEdges]
  );

  return { onNodesChange, onEdgesChange, onConnect, onNodeClick };
};
