import type { Widgets } from "blessed";
import blessed from "blessed";
import dayjs from "dayjs";
import type { Position } from "../app";
import log from "../plugins/log";
import { api } from "../repositories/api";

const ID_LENGTH = 12;

export const attach = (screen: Widgets.Screen, position: Position) => {
  const div = blessed.box({
    parent: screen,
    ...position,
    mouse: true,
    keys: true,
  });

  const { listtable, refresh: refreshList } = attachListtable(screen, div);
  const { details: _, refresh } = attachDetails(screen, div, refreshList);

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

  const refresh = () => {
    api.images.list({ all: true }).then(({ data }) => {
      const headers = ["IMAGE ID", "REPOSITORY TAG", "CREATED", "SIZE"];
      const images = data.map((image) => [
        image.Id.replace("sha256:", "").substring(0, ID_LENGTH),
        image.RepoTags.join(" "),
        dayjs(image.Created * 1000).format("YYYY-MM-DD HH:mm:ss"),
        `${(image.Size / (1000 * 1000)).toLocaleString()}MB`,
      ]);
      listtable.setData([headers, ...images]);
      screen.render();
    });
  };

  refresh();

  return { listtable, refresh };
};
export const attachDetails = (
  screen: Widgets.Screen,
  parent: Widgets.Node,
  refreshList: () => void
) => {
  const details = blessed.box({
    parent: parent,
    top: "24%",
    left: 0,
    height: "76%",
    width: "100%",
  });

  const refresh = (id: string) => {
    log.debug(id);
  };

  return {
    details,
    refresh,
  };
};
