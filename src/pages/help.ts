import type { Widgets } from "blessed";
import blessed from "blessed";
import { Position } from "../app";

export const attach = (screen: Widgets.Screen, position: Position) => {
  const div = blessed.box({
    parent: screen,
    ...position,
    border: { type: "line" },
    keyable: true,
    mouse: true,
    keys: true,
    tags: true,
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
    content: "help",
  });

  return div;
};
