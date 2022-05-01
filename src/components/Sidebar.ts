import blessed, { Widgets } from "blessed";
import type { Position } from "../app";

export const attach = (screen: Widgets.Screen, position: Position) => {
  const list: Widgets.ListElement = blessed.list({
    parent: screen,
    top: position.top,
    left: position.left,
    height: position.height,
    width: position.width,
    mouse: true,
    keys: true,
    selectedFg: "black", // リストのアイテムを選択したときの文字色
    selectedBg: "white", // リストのアイテムを選択したときの背景色
    align: "left",
    border: { type: "line" },
    noCellBorders: true,
    tags: true, // 色付けする場合
    wrap: false,
    items: ["CONTAINERS", "IMAGES", "HELP", "LICENSE"],
  });
  list.on("select item", (item: Widgets.BlessedElement, index: number) => {});
  list.on("select", (item: Widgets.BoxElement, index: number) => {});

  return list;
};
