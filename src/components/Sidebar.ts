import blessed, { Widgets } from "blessed";
import type { Position } from "../app";

export const attach = (
  screen: Widgets.Screen,
  position: Position,
  menu: string[],
  onSelectItem: (item: Widgets.BlessedElement, index: number) => void,
  onSelect: (item: Widgets.BlessedElement, index: number) => void
) => {
  const list = blessed.list({
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
    items: menu,
  });

  list.on("select item", onSelectItem);
  list.on("select", onSelect);

  return list;
};
