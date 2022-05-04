import type { Widgets } from "blessed";
import React, { useState } from "react";
import { Position, screen } from "../app";
import { ContainersPage } from "../pages/Containers";

const menu = ["CONTAINERS", "IMAGES", "HELP", "LICENSE"] as const;

export const Dashboard = ({ onError }: { onError: (message: string) => void }) => {
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
      <RouterView top={0} left={"12%"} path={path} onError={onError}></RouterView>
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

const RouterView = (
  props: Position & { path: typeof menu[number]; onError: (message: string) => void }
) => {
  const route = (path: typeof menu[number]) => {
    switch (path) {
      case "CONTAINERS":
        return <ContainersPage onError={props.onError} />;
      case "IMAGES":
        return (
          <box
            keyable
            mouse
            keys
            top={0}
            left={0}
            width={"100%"}
            height={"100%"}
            border={{ type: "line" }}
            // @ts-ignore
            style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
          >
            {"IMAGES"}
          </box>
        );
      case "HELP":
        return (
          <box
            keyable
            mouse
            keys
            top={0}
            left={0}
            width={"100%"}
            height={"100%"}
            border={{ type: "line" }}
            // @ts-ignore
            style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
          >
            {"HELP"}
          </box>
        );
      case "LICENSE":
        return (
          <box
            keyable
            mouse
            keys
            top={0}
            left={0}
            width={"100%"}
            height={"100%"}
            border={{ type: "line" }}
            // @ts-ignore
            style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
          >
            {"LICENSE"}
          </box>
        );
    }
  };

  return (
    <box top={props.top} left={props.left} width={props.width} height={props.height}>
      {route(props.path)}
    </box>
  );
};
