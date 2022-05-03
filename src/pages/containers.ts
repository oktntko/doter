import type { Widgets } from "blessed";
import blessed from "blessed";
import type { Position } from "../app";
import { api } from "../plugins/axios";

const ID_LENGTH = 12;

export const attach = (screen: Widgets.Screen, position: Position) => {
  const div = blessed.box({
    parent: screen,
    ...position,
    mouse: true,
    keys: true,
  });

  const listtable = attachListtable(screen, div);
  const { details, refresh } = attachDetails(screen, div);

  listtable.on("select item", (item: Widgets.BlessedElement) => {
    const id = item.content.substring(0, ID_LENGTH);
    refresh(id);
  });
  listtable.on("select", () => {
    if (details) details.focus();
  });

  div.on("focus", () => listtable.focus());

  return div;
};

export const attachListtable = (screen: Widgets.Screen, parent: Widgets.Node) => {
  const listtable = blessed.listtable({
    parent: parent,
    border: { type: "line" },
    keyable: true,
    mouse: true,
    keys: true,
    tags: true,
    top: 0,
    left: 0,
    height: "24%",
    width: "100%",
    // @ts-ignore
    style: { header: { fg: "green" }, focus: { border: { fg: "yellow" } } },
    selectedFg: "black",
    selectedBg: "white",
    align: "left",
  });

  api.container.list({ all: true }).then(({ data }) => {
    const headers = ["CONTAINER ID", "NAMES", "STATE", "IMAGE", "PROJECT", "WORKING_DIR"];
    const containers = data.map((container) => [
      container.Id?.substring(0, ID_LENGTH) ?? "",
      container.Names?.join(" ") ?? "",
      `${
        container.State === "running"
          ? "{green-fg}"
          : container.State === "exited"
          ? "{blue-fg}"
          : "{white-fg}"
      }${container.State ?? "unknown"}{/}`,
      container.Image?.substring(0, 32) ?? "",
      container.Labels?.["com.docker.compose.project"] ?? "",
      container.Labels?.["com.docker.compose.project.working_dir"] ?? "",
    ]);
    listtable.setData([headers, ...containers]);
    screen.render();
  });

  return listtable;
};

/**

Name
State            START / STOP  REMOVE

EXEC  /  LOG  /  CONFIG
■■■■■■■■■■■■■
■■■■■■■■■■■■
■■■■■■■■■■■■■
■■■■■■■■■■■■■■

 */
export const attachDetails = (screen: Widgets.Screen, parent: Widgets.Node) => {
  const details = blessed.box({
    parent: parent,
    border: { type: "line" },
    mouse: true,
    keys: true,
    tags: true,
    top: "24%",
    left: 0,
    height: "78%",
    width: "100%",
    style: { focus: { border: { fg: "yellow" } } },
    pad: 2,
  });

  const name = blessed.text({
    parent: details,
    mouse: true,
    keys: true,
    shrink: true,
    tags: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 1,
    top: 0,
    content: "",
  });

  const status = blessed.text({
    parent: details,
    mouse: true,
    keys: true,
    shrink: true,
    tags: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 1,
    top: 2,
    content: "",
  });

  const start = blessed.button({
    parent: details,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 16,
    top: 1,
    content: "START",
    border: { type: "line" },
    style: {
      focus: { border: { fg: "yellow" } },
    },
  });

  const stop = blessed.button({
    parent: details,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 24,
    top: 1,
    content: "STOP",
    border: { type: "line" },
    style: {
      focus: { border: { fg: "yellow" } },
    },
  });
  start.hide();
  stop.hide();

  return {
    details,
    refresh: (id: string) => {
      api.container.inspect({ id }).then(({ data }) => {
        name.setContent(`{#909399-bg} {/} {bold}${data.Name ?? "unknown"}{/}`);

        const statusText = data.State?.Status;
        if (statusText === "running") {
          status.setContent(`{green-fg}${statusText}{/}`);

          start.on("press", () => ({}));
          start.hide();

          stop.on("press", () => ({}));
          stop.show();
        } else if (statusText === "exited") {
          status.setContent(`{blue-fg}${statusText}{/}`);

          start.on("press", () => ({}));
          start.show();

          stop.on("press", () => ({}));
          stop.hide();
        } else {
          status.setContent(statusText ?? "unknown");
          start.on("press", () => ({}));
          start.hide();
          stop.on("press", () => ({}));
          stop.hide();
        }

        screen.render();
      });
    },
  };
};
