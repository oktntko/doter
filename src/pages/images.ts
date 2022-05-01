import blessed, { Widgets } from "blessed";
import { Position } from "../app";

export const attach = (parent: Widgets.Node, position: Position) => {
  const div = blessed.box({
    parent,
    ...position,
    mouse: true,
    keys: true,
    border: {
      type: "line",
    },
    tags: true,
    content: "images",
  });

  return div;
};
