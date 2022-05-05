import type { Widgets } from "blessed";
import { useEffect, useRef, useState } from "react";
import { screen } from "../app";
import dayjs from "../plugins/dayjs";
import { api } from "../repositories/api";

const ID_LENGTH = 12;

export const ImagesPage = () => {
  // + state
  const [image_id, setImageId] = useState<string>("");
  const [selected, setSelected] = useState<number>(0);
  const ref = useRef<Widgets.ListTableElement | null>(null);

  // + lifecycle
  useEffect(() => {
    refreshImages();
  }, []);

  // + methods
  const refreshImages = () => {
    api.images.list({ all: true }).then(({ data }) => {
      const headers = ["IMAGE ID", "REPOSITORY TAG", "CREATED", "SIZE"];
      const images = data.map((image) => [
        image.Id.replace("sha256:", "").substring(0, ID_LENGTH),
        image.RepoTags.join(" "),
        dayjs(image.Created * 1000).format("YYYY-MM-DD HH:mm:ss"),
        `${(image.Size / (1000 * 1000)).toLocaleString()}MB`,
      ]);

      ref.current?.setData([headers, ...images]);
    });
  };

  const handleSelectItem = (item: Widgets.BlessedElement, i: number) => {
    setSelected(i);
    setImageId(item.content.substring(0, ID_LENGTH));
  };
  const handleSelect = () => {
    screen.focusNext();
  };

  // + template
  return (
    <>
      <listtable
        ref={ref}
        keyable
        mouse
        keys
        tags
        top={0}
        left={0}
        height={"24%"}
        width={"100%"}
        border={{ type: "line" }}
        style={{
          header: { fg: "green" },
          // @ts-ignore
          focus: { border: { fg: "yellow" } },
          // @ts-ignore
          hover: { border: { fg: "blue" } },
        }}
        selectedFg={"black"}
        selectedBg={"white"}
        align={"left"}
        selected={selected}
        onSelectItem={handleSelectItem}
        onSelect={handleSelect}
      ></listtable>

      <line orientation="vertical" top={"24%"} left={0} height={1} width={"100%"} fg="grey"></line>

      {/* 豆知識 height, widthの指定を省略すると、「残りすべて」になる */}
      <box top={"25%"} left={0} border={{ type: "line" }}></box>
    </>
  );
};
