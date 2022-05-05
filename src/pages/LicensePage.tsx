import fs from "fs";
import React, { useEffect, useState } from "react";
import { displayMessage } from "~/app";

export const LicensePage = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fs.readFile("LICENSE", { encoding: "utf8" }, (err, data) => {
      if (err) {
        displayMessage(err.message);
      } else {
        setContent(data);
      }
    });
  }, []);

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
      content={content}
    />
  );
};
