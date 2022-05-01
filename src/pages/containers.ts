import type { Widgets } from "blessed";
import blessed from "blessed";
import type { Position } from "../app";
import { api } from "../plugins/axios";
import dayjs from "../plugins/dayjs";

export const attach = (screen: Widgets.Screen, position: Position) => {
  const div = blessed.box({
    parent: screen,
    ...position,
    keyable: true, // tab キーでフォーカスを切り替えるために必要
    mouse: true,
    keys: true,
  });

  const listtable = blessed.listtable({
    parent: div,
    border: { type: "line" },
    mouse: true,
    keys: true,
    tags: true,
    // @ts-ignore
    style: { header: { fg: "green" }, focus: { border: { fg: "yellow" } } },
    selectedFg: "black",
    selectedBg: "white",
    align: "left",
    pad: 2,
  });

  api.container.ls({ all: true }).then(({ data }) => {
    const headers = ["CONTAINER ID", "IMAGE", "COMMAND", "CREATED", "STATUS", "PORTS", "NAMES"];
    const container = data.map((container) => [
      container.Id.substring(0, 16),
      container.Image.substring(0, 32),
      container.Command.substring(0, 32),
      dayjs(container.Created * 1000).format("YYYY-MM-DD HH:mm:ss"),
      container.Status,
      container.Ports.map(
        (port) =>
          `${port.IP && port.PublicPort ? `${port.IP}:${port.PublicPort}->` : ""}${
            port.PrivatePort
          }/${port.Type}`
      )
        .join(" ")
        .substring(0, 24),
      container.Names.join(" "),
    ]);
    listtable.setData([headers, ...container]);
    screen.render();
  });

  div.on("focus", () => {
    listtable.focus();
  });

  return div;
};
