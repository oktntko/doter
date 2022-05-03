import type { Widgets } from "blessed";
import type { Position } from "../app";
import * as Containers from "./containers";
import * as Help from "./help";
import * as Images from "./images";
import * as License from "./license";

export const menu = ["CONTAINERS", "IMAGES", "HELP", "LICENSE"];

export const attach = (screen: Widgets.Screen, position: Position) => {
  let page: Widgets.BoxElement = Containers.attach(screen, position);

  return {
    ...screen,
    handleSelectItem: (item: Widgets.BlessedElement, index: number) => {
      if (page) screen.remove(page);

      switch (index) {
        case 0:
          page = Containers.attach(screen, position);
          break;
        case 1:
          page = Images.attach(screen, position);
          break;
        case 2:
          page = Help.attach(screen, position);
          break;
        case 3:
          page = License.attach(screen, position);
          break;
      }

      screen.render();
    },
    handleSelect: () => {
      screen.focusNext();
      screen.render();
    },
  };
};
