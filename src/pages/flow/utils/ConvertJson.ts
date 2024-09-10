import { MarkerType } from '@xyflow/react';
import { Node, Edge } from '@xyflow/react';
import { NodeData } from '../types';

export function convertBackendDataToReactFlow(data: any) {
  const { nodes: backendNodes, edges: backendEdges } = data;
  
  const calculateNodePosition = (node: any, index: number) => {
    const level = node.data.level;
    const x = (level - 1) * 250; // 水平間距
    
    let y = 0;
    switch (node.data.type) {
      case 'project':
        y = 150; // 專案名稱置中
        break;
      case 'original_data':
        y = node.data.index * 300; // 原始資料垂直分散
        break;
      case 'visualization':
        y = node.data.parentIndex * 300 - 75; // 視覺化在上
        break;
      case 'model_selection':
        y = node.data.parentIndex * 300 + 75; // 選擇模型在下
        break;
      case 'model_result':
        y = node.data.parentIndex * 300; // 模型結果對齊原始資料
        break;
    }
    
    return { x, y };
  };

  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  // 添加所有節點
  backendNodes.forEach((node, index) => {
    const position = calculateNodePosition(node, index);
    nodes.push({
      id: node.id,
      type: 'custom',
      position,
      data: {
        ...node.data,
        label: node.data.label,
        type: node.data.type,
        level: node.data.level,
      },
    });
  });

  // 添加所有邊
  backendEdges.forEach(edge => {
    edges.push({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: true,
      style: { stroke: getColorByType(nodes.find(n => n.id === edge.target)?.data.type) },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: getColorByType(nodes.find(n => n.id === edge.target)?.data.type),
      },
    });
  });

  return { nodes, edges };
}

function getColorByType(type?: string) {
  // ... (保持不變)
}

