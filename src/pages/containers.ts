import type { Widgets } from "blessed";
import blessed from "blessed";
import type { Position } from "../app";
import { container } from "../plugins/axios";

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
    content: "containers",
  });

  container.ls({ all: true });

  return div;
};
