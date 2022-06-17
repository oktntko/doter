import { Widgets } from "blessed";
import React, { useEffect, useRef, useState } from "react";
import { screen } from "~/app";
import { ContainerList } from "~/pages/ContainersPage";
import dayjs from "~/plugins/dayjs";
import { api } from "~/repositories/api";

export const VolumesPage = () => {
  // + state
  const [volume_name, setVolumeName] = useState<string>("");
  const [selected, setSelected] = useState<number>(0);
  const ref = useRef<Widgets.ListTableElement | null>(null);

  // + lifecycle
  useEffect(() => {
    refreshVolumes();
  }, []);

  // + methods
  const refreshVolumes = () => {
    api.volumes.list().then(({ data }) => {
      const headers = ["NAME", "DRIVER", "MOUNTPOINT", "SCOPE", "SIZE", "REFCOUNT", "CREATEDAT"];
      const volumes = data.Volumes.map((volume) => [
        volume.Name,
        volume.Driver,
        volume.Mountpoint,
        volume.Scope,
        volume.UsageData?.Size ? String(volume.UsageData.Size) : "",
        volume.UsageData?.RefCount ? String(volume.UsageData.RefCount) : "",
        volume.CreatedAt ? dayjs(volume.CreatedAt).format("YYYY-MM-DD HH:mm:ss") : "",
      ]);

      ref.current?.setData([headers, ...volumes]);
    });
  };

  const handleSelectItem = (item: Widgets.BlessedElement, i: number) => {
    setSelected(i);
    setVolumeName(item.content.split(" ")[0]);
  };
  const handleSelect = () => {
    screen.focusNext();
  };

  return (
    <>
      <box top={0} left={0} height={"24%"} width={"100%"}>
        <listtable
          ref={ref}
          keyable
          mouse
          keys
          tags
          top={0}
          left={0}
          height={"100%"}
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
        />
      </box>

      <line orientation="vertical" top={"24%"} left={0} height={1} width={"100%"} fg="grey"></line>

      <box top={"25%"} left={0}>
        <ContainerList volume={volume_name} />
      </box>
    </>
  );
};
