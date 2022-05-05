import React from "react";

export const HelpPage = () => {
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
};
