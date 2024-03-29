import blessed from "blessed";
import { useState } from "react";
import { render } from "react-blessed";
import { Splash } from "~/components/Splash";
import { Dashboard } from "~/layouts/Dashboard";

export const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  fullUnicode: true,
  dockBorders: true,
});

export const processExit = () => process.exit(0);
export const focusNext = () => screen.focusNext();
screen.key(["escape", "q", "C-[", "C-c"], processExit);
screen.key("tab", focusNext);
screen.key("S-tab", () => screen.focusPrevious());

export type Position = {
  top?: number | string;
  left?: number | string;
  width?: number | string;
  height?: number | string;
};

export const displayMessage = (message: string, options?: { time?: number; color?: string }) => {
  const MessageDialog = blessed.message({
    parent: screen,
    top: "center",
    left: "center",
    height: "16%",
    width: "32%",
    tags: true,
    // @ts-ignore
    border: { type: "line", fg: options?.color || "red" },
  });

  MessageDialog.on("press", () => screen.remove(MessageDialog));
  MessageDialog.on("click", () => screen.remove(MessageDialog));
  MessageDialog.focus();
  MessageDialog.display(message, options?.time || 0, () => screen.remove(MessageDialog));

  screen.render();
};

const App = () => {
  const [splashing, setSplashing] = useState(true);

  const handleEnter = () => {
    setSplashing(false);
    screen.focusNext();
  };

  return (
    <>
      {splashing && <Splash onEnter={handleEnter} />}
      {!splashing && <Dashboard />}
    </>
  );
};

const main = () => {
  render(<App />, screen);
};

main();

export const viteNodeApp = main;
