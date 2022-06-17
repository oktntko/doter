import type { Widgets } from "blessed";
import React, { useEffect, useRef, useState } from "react";
import { screen } from "~/app";
import { ContainerList } from "~/pages/ContainersPage";
import dayjs from "~/plugins/dayjs";
import { api } from "~/repositories/api";

const ID_LENGTH = 12;

export const NetworksPage = () => {
  // + state
  const [network_id, setNetworkId] = useState<string>("");
  const [selected, setSelected] = useState<number>(0);
  const ref = useRef<Widgets.ListTableElement | null>(null);

  // + lifecycle
  useEffect(() => {
    refreshNetworks();
  }, []);

  // + methods
  const refreshNetworks = () => {
    api.networks.list().then(({ data }) => {
      const headers = ["NETWORK ID", "NAME", "DRIVE", "SCOPE", "CREATED"];
      const networks = data.map((network) => [
        network.Id?.substring(0, ID_LENGTH) ?? "",
        network.Name ?? "",
        network.Driver ?? "",
        network.Scope ?? "",
        network.Created ? dayjs(network.Created).format("YYYY-MM-DD HH:mm:ss") : "",
      ]);

      ref.current?.setData([headers, ...networks]);
    });
  };

  const handleSelectItem = (item: Widgets.BlessedElement, i: number) => {
    setSelected(i);
    setNetworkId(item.content.substring(0, ID_LENGTH));
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
        <ContainerList network={network_id} />
      </box>
    </>
  );
};
