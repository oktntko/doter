import type { Widgets } from "blessed";
import blessed from "blessed";
import React, { useState } from "react";
import { render } from "react-blessed";
import { Splash } from "./components/Splash";
import { Dashboard } from "./layouts/Dashboard";

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

export type Position = {
  top?: number | string;
  left?: number | string;
  width?: number | string;
  height?: number | string;
};

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
      {!splashing && <Dashboard onError={handleError} />}

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
