"use client";
import { useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { convertBackendDataToReactFlow } from '../utils/ConvertJson';
import backendData from '../data.json';
import { NodeData } from '../types';

export const useFlowData = () => {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const fetchDataFromBackend = async () => {
      try {
        const data = backendData;
        if (Object.keys(data).length > 0) {
          const { nodes: backendNodes, edges: backendEdges } = convertBackendDataToReactFlow(data);
          setNodes(backendNodes);
          setEdges(backendEdges);
        } else {
          const initialNode: Node<NodeData> = {
            id: "1",
            type: "custom",
            position: { x: 0, y: 0 },
            data: { label: "專案名稱", type: "project", level: 1 },
          };
          setNodes([initialNode]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        const initialNode: Node<NodeData> = {
          id: "1",
          type: "custom",
          position: { x: 0, y: 0 },
          data: { label: "專案名稱", type: "project", level: 1 },
        };
        setNodes([initialNode]);
      }
    };

    fetchDataFromBackend();
  }, []);

  return { nodes, edges, setNodes, setEdges };
};
