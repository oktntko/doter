import type { Widgets } from "blessed";
import blessed from "blessed";
import type { Position } from "../app";

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
    content: "lisence",
  });

  return div;
};
