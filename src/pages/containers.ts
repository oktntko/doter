import type { Widgets } from "blessed";
import blessed from "blessed";
import { $ } from "zx";
import type { Position } from "../app";
import log from "../plugins/log";

$.verbose = false;

const container = {
  ls: async (options: { all?: boolean } = {}) => {
    const containers = await $`docker container ls ${options.all && "--all"}`;
    log.debug(containers.stdout);
  },
};

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
