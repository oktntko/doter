import type { Widgets } from "blessed";
import blessed from "blessed";
import type { Position } from "../app";
import { api } from "../repositories/api";

const ID_LENGTH = 12;

export const attach = (screen: Widgets.Screen, position: Position) => {
  const div = blessed.box({
    parent: screen,
    ...position,
    mouse: true,
    keys: true,
  });

  const listtable = attachListtable(screen, div);
  const { details: _, refresh } = attachDetails(screen, div);

  listtable.on("select item", (item: Widgets.BlessedElement) => {
    const id = item.content.substring(0, ID_LENGTH);
    refresh(id);
  });
  listtable.on("select", () => screen.focusNext());

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

LOG  /  CONFIG  /  EXEC
■■■■■■■■■■■■■
■■■■■■■■■■■■
■■■■■■■■■■■■■
■■■■■■■■■■■■■■

 */
export const attachDetails = (screen: Widgets.Screen, parent: Widgets.Node) => {
  const details = blessed.box({
    parent: parent,
    top: "24%",
    left: 0,
    height: "78%",
    width: "100%",
  });

  blessed.text({
    parent: details,
    left: 1,
    top: 0,
    tags: true,
    content: "{green-bg} {/} {green-fg}DETAILS{/} {green-bg} {/}",
  });

  const header = blessed.box({
    parent: details,
    left: 0,
    top: 1,
    height: "16%",
  });

  const name = blessed.text({
    parent: header,
    shrink: true,
    tags: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 0,
    top: 1,
    content: "",
  });

  const status = blessed.text({
    parent: header,
    shrink: true,
    tags: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 32,
    top: 1,
    content: "",
  });

  const start = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 48,
    top: 0,
    content: "START",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const stop = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 56,
    top: 0,
    content: " STOP ",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });
  start.hide();
  stop.hide();

  const logButton = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 0,
    top: 3,
    content: " LOG  ",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const configButton = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 9,
    top: 3,
    content: "CONFIG",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const networkButton = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 18,
    top: 3,
    content: "NETWORK",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const mountsButton = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 28,
    top: 3,
    content: "MOUNTS",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const main = blessed.box({
    parent: details,
    mouse: true,
    keys: true,
    left: 0,
    top: "16%",
    height: "86%",
    width: "100%",
  });

  const logBlessed = blessed.log({
    parent: main,
    focusable: true,
    keyable: true,
    mouse: true,
    keys: true,
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const configBlessed = blessed.log({
    parent: main,
    focusable: true,
    keyable: true,
    mouse: true,
    keys: true,
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const networkBlessed = blessed.log({
    parent: main,
    focusable: true,
    keyable: true,
    mouse: true,
    keys: true,
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const mountsBlessed = blessed.log({
    parent: main,
    focusable: true,
    keyable: true,
    mouse: true,
    keys: true,
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const onEnter =
    (params: { log?: boolean; config?: boolean; network?: boolean; mounts?: boolean }) => () => {
      params.log ? logBlessed.show() : logBlessed.hide();
      params.config ? configBlessed.show() : configBlessed.hide();
      params.network ? networkBlessed.show() : networkBlessed.hide();
      params.mounts ? mountsBlessed.show() : mountsBlessed.hide();
      screen.render();
    };

  logButton.on("press", onEnter({ log: true }));
  logButton.on("click", onEnter({ log: true }));
  configButton.on("press", onEnter({ config: true }));
  configButton.on("click", onEnter({ config: true }));
  networkButton.on("press", onEnter({ network: true }));
  networkButton.on("click", onEnter({ network: true }));
  mountsButton.on("press", onEnter({ mounts: true }));
  mountsButton.on("click", onEnter({ mounts: true }));

  onEnter({ log: true })();

  return {
    details,
    refresh: (id: string) => {
      api.container.inspect({ id }).then(({ data }) => {
        name.setContent(`{bold}${data.Name ?? "unknown"}{/}`);

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

        configBlessed.setContent(JSON.stringify(data.Config, null, 3));
        networkBlessed.setContent(JSON.stringify(data.NetworkSettings, null, 3));
        mountsBlessed.setContent(JSON.stringify(data.Mounts, null, 3));

        screen.render();
      });

      logBlessed.setContent("");
      api.container.logs(
        { id },
        { follow: true, stdout: true, stderr: true, since: 0 },
        (data: string) => {
          logBlessed.log(data);
          screen.render();
        }
      );
    },
  };
};
