import type { Widgets } from "blessed";
import blessed from "blessed";
import React, { useState } from "react";
import { render } from "react-blessed";
import { Splash } from "./components/Splash";

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
  const [splashing, setSplashing] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEnter = () => {
    setSplashing(false);
    screen.focusNext();
  };
  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  return (
    <>
      {splashing && <Splash onEnter={handleEnter} onError={handleError} />}
      {!splashing && (
        <list
          keyable
          clickable
          mouse
          keys
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
      )}

      <message
        hidden={!errorMessage}
        content={errorMessage}
        top="center"
        left="center"
        width="20%"
        height="20%"
        // @ts-ignore
        border={{ type: "line", fg: "red" }}
      ></message>
    </>
  );
};

export const main = () => {
  render(<App />, screen);
};
