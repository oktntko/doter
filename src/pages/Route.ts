import { Widgets } from "blessed";
import type { Position } from "../app";
import * as Containers from "./containers";
import * as Help from "./help";
import * as Images from "./images";
import * as License from "./license";

export const menu = ["CONTAINERS", "IMAGES", "HELP", "LICENSE"];

export const attach = (screen: Widgets.Screen, position: Position) => {
  let child = Containers.attach(screen, position);

  return {
    ...screen,
    handleSelectItem: (item: Widgets.BlessedElement, index: number) => {
      if (child) screen.remove(child);

      switch (index) {
        case 0:
          child = Containers.attach(screen, position);
          break;
        case 1:
          child = Images.attach(screen, position);
          break;
        case 2:
          child = Help.attach(screen, position);
          break;
        case 3:
          child = License.attach(screen, position);
          break;
      }

      screen.render();
    },
    handleSelect: (item: Widgets.BlessedElement, index: number) => {
      child.focus();
      screen.render();
    },
  };
};
