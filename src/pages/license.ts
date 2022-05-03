import type { Widgets } from "blessed";
import blessed from "blessed";
import fs from "fs";
import type { Position } from "../app";
import log from "../plugins/log";

export const attach = (screen: Widgets.Screen, position: Position) => {
  const div = blessed.log({
    parent: screen,
    ...position,
    border: { type: "line" },
    keyable: true,
    mouse: true,
    keys: true,
    tags: true,
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  fs.readFile("LICENSE", { encoding: "utf8" }, (err, data) => {
    if (err) {
      log.error(err);
    } else {
      div.setContent(data);
    }
  });

  return div;
};
