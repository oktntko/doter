import blessed from "blessed";
import * as Sidebar from "./components/Sidebar";
import * as Splash from "./components/Splash";

export const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  fullUnicode: true,
  title: "DOTER",
});
screen.key(["escape", "q", "C-[", "C-c"], () => process.exit(0));

export type Position = {
  top: number | string;
  left: number | string;
  height: number | string;
  width: number | string;
};

export const main = async () => {
  await new Promise((resolve) => {
    const splash = Splash.attach(
      screen,
      { top: 0, left: 0, height: "100%", width: "100%" },
      (screen) => {
        screen.remove(splash);
        resolve(null);
      }
    );
    screen.render();
  });

  Sidebar.attach(screen, { top: 0, left: 0, height: "100%", width: "12%" });
  screen.render();
};
