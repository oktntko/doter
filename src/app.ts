import blessed from "blessed";
import contrib from "blessed-contrib";
import * as Sidebar from "./components/Sidebar";
import * as Splash from "./components/Splash";

export const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  fullUnicode: true,
  title: "DOTER",
});
screen.key(["escape", "q", "C-[", "C-c"], () => process.exit(0));

export const GRID = {
  rows: 256,
  cols: 256,
};

export const grid = new contrib.grid({
  rows: GRID.rows,
  cols: GRID.cols,
  screen,
});

export const main = async () => {
  await new Promise((resolve) => {
    const splash = Splash.attach(
      screen,
      grid,
      { top: 0, left: 0, height: GRID.rows, width: GRID.cols },
      (screen) => {
        screen.remove(splash);
        resolve(null);
      }
    );
    screen.render();
  });

  Sidebar.attach(screen, grid, { top: 0, left: 0, height: GRID.rows, width: GRID.cols * 0.12 });
  screen.render();
};
