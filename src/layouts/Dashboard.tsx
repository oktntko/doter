import type { Widgets } from "blessed";
import React, { useState } from "react";
import { Position, screen } from "~/app";
import { ContainersPage } from "~/pages/ContainersPage";
import { HelpPage } from "~/pages/HelpPage";
import { ImagesPage } from "~/pages/ImagesPage";
import { LicensePage } from "~/pages/LicensePage";

const menu = ["CONTAINERS", "IMAGES", "HELP", "LICENSE"] as const;

export const Dashboard = () => {
  const [path, setPath] = useState<typeof menu[number]>("CONTAINERS");
  const handleSelectItem = (item: Widgets.BlessedElement) => {
    setPath(item.content as typeof menu[number]);
  };
  const handleSelect = () => {
    screen.focusNext();
  };

  return (
    <>
      <Sidebar
        top={0}
        left={0}
        width={"12%"}
        height={"100%"}
        onSelectItem={handleSelectItem}
        onSelect={handleSelect}
      />
      <RouterView top={0} left={"12%"} path={path}></RouterView>
    </>
  );
};

const Sidebar = (
  props: Position & {
    onSelectItem: (item: Widgets.BlessedElement, index: number) => void;
    onSelect: (item: Widgets.BlessedElement, index: number) => void;
  }
) => {
  return (
    <list
      keyable
      mouse
      keys
      top={props.top}
      left={props.left}
      width={props.width}
      height={props.height}
      noCellBorders
      border={{ type: "line" }}
      // @ts-ignore
      style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
      selectedFg={"black"}
      selectedBg={"white"}
      // @ts-ignore
      items={menu}
      onSelect={props.onSelect}
      onSelectItem={props.onSelectItem}
    ></list>
  );
};

const RouterView = (props: Position & { path: typeof menu[number] }) => {
  const route = (path: typeof menu[number]) => {
    switch (path) {
      case "CONTAINERS":
        return <ContainersPage />;
      case "IMAGES":
        return <ImagesPage />;
      case "HELP":
        return <HelpPage />;
      case "LICENSE":
        return <LicensePage />;
    }
  };

  return (
    <box top={props.top} left={props.left} width={props.width} height={props.height}>
      {route(props.path)}
    </box>
  );
};
