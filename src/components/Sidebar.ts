import blessed, { Widgets } from "blessed";
import contrib from "blessed-contrib";

export const attach = (
  screen: Widgets.Screen,
  grid: contrib.grid,
  position: { top: number; left: number; height: number; width: number }
) => {
  const list: Widgets.ListElement = grid.set(
    position.top,
    position.left,
    position.height,
    position.width,
    blessed.list,
    {
      parent: screen,
      keys: true, // キー入力
      label: "EXAMPLE-LIST", // 表示する名称
      selectedFg: "black", // リストのアイテムを選択したときの文字色
      selectedBg: "white", // リストのアイテムを選択したときの背景色
      align: "left",
      border: { type: "line" },
      style: {
        fg: "white", // 通常時の文字色
        bg: 234, // 通常時の背景色
        border: {
          fg: "cyan",
          bg: 234,
        },
        label: {
          bg: 234,
        },
      },
      noCellBorders: true,
      tags: true, // 色付けする場合
      wrap: false,
    }
  );
  list.on("select item", (item: Widgets.BlessedElement, index: number) => {
    // thisを使うのでfunction
    // リストで選択されているアイテムのindexを出力
  });
  list.on("select", (item: Widgets.BoxElement, index: number) => {
    // 'select item'と同じでthis.selectedに選択中のアイテムのindexがある
    // 後は実行したい処理
  });
  list.addItem("04:20 - EXAMPLE_1"); // リストに追加
  list.addItem("09:45 - EXAMPLE_2");
  list.addItem("09:45 - EXAMPLE_2");
  list.addItem("09:45 - EXAMPLE_2");
  list.addItem("09:45 - EXAMPLE_2");
  list.addItem("09:45 - EXAMPLE_2");

  return list;
};
