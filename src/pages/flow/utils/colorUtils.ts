import { NodeData } from '../types';

export const getColorByType = (type: NodeData["type"]): string => {
  switch (type) {
    case "project":
      return "#FFABA6";
    case "original_data":
      return "#41CA57";
    case "visualization":
      return "#4BB3E0";
    case "model_selection":
      return "#E47AD9";
    case "model_result":
      return "#80A7FF";
    default:
      return "#ffffff";
  }
};
