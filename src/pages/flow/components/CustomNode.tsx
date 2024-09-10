"use client";
import React from "react";
import { Handle, Position } from "@xyflow/react";
import { NodeData } from "../types";
import { getColorByType } from "../utils/colorUtils";

export const CustomNode = React.memo(({ data }: { data: NodeData }) => {
  const canAddChild =
    data.level < 3 || (data.level === 3 && data.type === "model_selection");
  const nodeColor = getColorByType(data.type);

  return (
    <div
      style={{
        padding: "10px",
        border: `2px solid ${nodeColor}`,
        borderRadius: "4px",
        background: `${nodeColor}33`,
        color: "#000000",
        position: "relative",
      }}
    >
      {data.label}
      {canAddChild && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: nodeColor,
            border: `2px solid ${nodeColor}`,
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            right: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            +
          </div>
        </Handle>
      )}
      <Handle
        type="target"
        position={Position.Left}
        style={{ visibility: "hidden" }}
      />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
