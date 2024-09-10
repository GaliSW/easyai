

export type NodeData = {
  label: string;
  type: "project" | "original_data" | "visualization" | "model_selection" | "model_result";
  level: number;
};

export type NodeTypes = {
  custom: React.ComponentType<{ data: NodeData }>;
};

export type EdgeTypes = {};
