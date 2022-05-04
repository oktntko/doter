import type { Widgets } from "blessed";
import blessed from "blessed";
import React from "react";
import { render } from "react-blessed";

export const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  fullUnicode: true,
  dockBorders: true,
  log: "logs/screen.log",
});

screen.key(["escape", "q", "C-[", "C-c"], () => process.exit(0));
screen.on("keypress", (_: string, key: Widgets.Events.IKeyEventArg) => {
  if (key.full === "tab") {
    screen.focusNext();
  } else if (key.full === "S-tab") {
    screen.focusPrevious();
  }
});

// Rendering a simple centered box
const App = () => {
  return (
    <>
      <box
        mouse
        keyable
        keys
        clickable
        top="0"
        left="center"
        width="50%"
        height="50%"
        border={{ type: "line" }}
        // @ts-ignore
        style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
        onClick={() => console.log("onClick")}
        content={"hoge"}
      >
        Hello World!
      </box>
      <list
        mouse
        keyable
        keys
        clickable
        top="50%"
        left="center"
        width="50%"
        height="50%"
        border={{ type: "line" }}
        // @ts-ignore
        style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
        items={["a", "a", "a", "a"]}
        selectedFg={"black"}
        selectedBg={"white"}
        onSelect={(item: Widgets.BlessedElement, index: number) => console.log(index)}
        onSelectItem={(item: Widgets.BlessedElement, index: number) => console.log(index)}
      ></list>
    </>
  );
};

export const main = () => {
  render(<App />, screen);
};
