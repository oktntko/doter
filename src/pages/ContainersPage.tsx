import type { Widgets } from "blessed";
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { displayMessage, screen } from "~/app";
import { api } from "~/repositories/api";

const ID_LENGTH = 12;

export const ContainersPage = () => {
  const [container_id, setContainerId] = useState<string>("");
  const ref = useRef<{ refreshContainers: () => void } | null>(null);

  const handleContainerUpdated = () => {
    ref.current?.refreshContainers();
  };

  return (
    <>
      <box top={0} left={0} height={"24%"} width={"100%"}>
        <ContainerList ref={ref} setContainerId={setContainerId} />
      </box>

      <line orientation="vertical" top={"24%"} left={0} height={1} width={"100%"} fg="grey"></line>

      {/* 豆知識 height, widthの指定を省略すると、「残りすべて」になる */}
      <box top={"25%"} left={0}>
        <ContainerDetails container_id={container_id} onContainerUpdated={handleContainerUpdated} />
      </box>
    </>
  );
};

// vue2 のコンポーネント-インスタンス-オプション順序-推奨 を真似る
// https://jp.vuejs.org/v2/style-guide/#%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88-%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9-%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3%E9%A0%86%E5%BA%8F-%E6%8E%A8%E5%A5%A8
const ContainerListFunction: ForwardRefRenderFunction<
  { refreshContainers: () => void },
  { setContainerId: React.Dispatch<React.SetStateAction<string>> }
> = ({ setContainerId }, injectref) => {
  // + state
  // container_id が変わるたびに描画されるので、 selected を保持する必要がある (これは素のblessedより厄介)
  // しかし、 start/stop すると refresh のせいか selected もリセットされちゃう
  const [selected, setSelected] = useState<number>(0);
  // useState と dataProps を使うやり方だと、
  // データセット時に on("select item") が呼ばれなかったため、 ref から直接操作する
  /**
   * const [containers, setContainers] = useState<string[][]>([]);
   * data={containers}
   */
  const ref = useRef<Widgets.ListTableElement | null>(null);

  useImperativeHandle(injectref, () => ({
    refreshContainers,
  }));

  // + lifecycle
  useEffect(() => {
    refreshContainers();
  }, []);

  // + methods
  const refreshContainers = () => {
    api.containers.list({ all: true }).then(({ data }) => {
      const headers = [
        "CONTAINER ID",
        "NAMES",
        "STATE",
        "PORTS",
        "IMAGE",
        "PROJECT",
        "WORKING_DIR",
      ];
      const containers = data.map((container) => [
        container.Id?.substring(0, ID_LENGTH) ?? "",
        container.Names?.join(" ") ?? "",
        `${
          container.State === "running"
            ? "{green-fg}"
            : container.State === "exited"
            ? "{blue-fg}"
            : "{white-fg}"
        }${container.State ?? "unknown"}{/}`,
        container.Ports?.map(
          (port) =>
            `${port.IP && port.PublicPort ? `${port.IP}:${port.PublicPort}->` : ""}${
              port.PrivatePort
            }/${port.Type}`
        )
          .join(" ")
          .substring(0, 24) || "",
        container.Image?.substring(0, 32) ?? "",
        container.Labels?.["com.docker.compose.project"] ?? "",
        container.Labels?.["com.docker.compose.project.working_dir"] ?? "",
      ]);

      ref.current?.setData([headers, ...containers]);
    });
  };

  const handleSelectItem = (item: Widgets.BlessedElement, i: number) => {
    setSelected(i);
    setContainerId(item.content.substring(0, ID_LENGTH));
  };
  const handleSelect = () => {
    screen.focusNext();
  };

  // + template
  return (
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
  );
};
const ContainerList = forwardRef(ContainerListFunction);

const ContainerDetails = ({
  container_id,
  onContainerUpdated,
}: {
  container_id: string;
  onContainerUpdated: () => void;
}) => {
  // + state
  const [name, setName] = useState<string>("");
  const [status, setSatus] = useState<string>("");

  const [configJson, setConfigJson] = useState<string>("");
  const [networkJson, setNetworkJson] = useState<string>("");
  const [mountsJson, setMountsJson] = useState<string>("");
  const [inspectContent, setInspectContent] = useState<string>("");

  const [visibility, setVisibility] = useState<"LOGS" | "INSPECT" | "STATS">("LOGS");

  // vue でいう watch とか props っぽい
  useEffect(() => {
    refreshContainer(container_id);
  }, [container_id]);

  // + lifecycle

  // + methods
  const refreshContainer = (id: string) => {
    if (!id) return;

    api.containers.inspect({ id }).then(({ data }) => {
      setName(data.Name ?? "unknown");
      setSatus(data.State?.Status ?? "unknown");

      setConfigJson(JSON.stringify(data.Config, null, 3));
      setNetworkJson(JSON.stringify(data.NetworkSettings, null, 3));
      setMountsJson(JSON.stringify(data.Mounts, null, 3));
    });
  };

  const handleMenuSelected = (content: string, key?: Widgets.Events.IKeyEventArg) => {
    if (key && key.full !== "enter") return;

    if (~content.indexOf("LOGS")) {
      setVisibility("LOGS");
    } else if (["CONFIG", "NETWORK", "MOUNTS"].some((label) => ~content.indexOf(label))) {
      setVisibility("INSPECT");
      if (~content.indexOf("CONFIG")) {
        setInspectContent(configJson);
      } else if (~content.indexOf("NETWORK")) {
        setInspectContent(networkJson);
      } else if (~content.indexOf("MOUNTS")) {
        setInspectContent(mountsJson);
      }
    } else if (~content.indexOf("STATS")) {
      setVisibility("STATS");
    }
  };

  const handleStartStopButton = (key?: Widgets.Events.IKeyEventArg) => {
    if (key && key.full !== "enter") return;

    const client =
      status === "running"
        ? api.containers.stop({ id: container_id })
        : api.containers.start({ id: container_id });

    client
      .then(() => {
        refreshContainer(container_id);
        onContainerUpdated();
      })
      .catch((error) => {
        displayMessage(error.data.message);
      });
  };

  // + template
  return (
    <>
      <text
        shrink
        tags
        top={0}
        left={1}
        content={`${status === "running" ? "{green-fg}" : "{blue-fg}"}${name}{/}`}
      />
      <text
        shrink
        tags
        top={2}
        left={1}
        content={`${status === "running" ? "{green-bg}" : "{blue-bg}"} {/} ${status}`}
      />

      {["  LOGS  ", " CONFIG ", "NETWORK ", " MOUNTS ", " STATS  "].map((content, i, array) => {
        return (
          <button
            key={content}
            keyable
            mouse
            keys
            shrink
            top={1}
            right={(array.length - i) * 11 + 2}
            padding={{ left: 1, right: 1, top: 0, bottom: 0 }}
            border={{ type: "line" }}
            // @ts-ignore
            style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
            content={content}
            onClick={() => handleMenuSelected(content)}
            // eslint-disable-next-line react/no-unknown-property
            onKeypress={(_, key) => handleMenuSelected(content, key)}
          />
        );
      })}

      <button
        keyable
        mouse
        keys
        shrink
        top={1}
        right={0}
        padding={{ left: 1, right: 1, top: 0, bottom: 0 }}
        border={{ type: "line" }}
        // @ts-ignore
        style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
        content={status === "running" ? "  STOP  " : " START  "}
        onClick={() => handleStartStopButton()}
        // eslint-disable-next-line react/no-unknown-property
        onKeypress={(_, key) => handleStartStopButton(key)}
      />

      <box top={3} left={0}>
        {visibility === "LOGS" && <LogsBox container_id={container_id} />}
        {visibility === "INSPECT" && <InspectBox content={inspectContent} />}
        {visibility === "STATS" && <StatsBox container_id={container_id} />}
      </box>
    </>
  );
};

const LogsBox = ({ container_id }: { container_id: string }) => {
  const ref = useRef<Widgets.Log | null>(null);

  useEffect(() => {
    ref.current?.setContent(""); // ログは初期化
    const command = api.containers.logs(
      { id: container_id },
      { follow: true, stdout: true, stderr: true, since: 0 },
      (data) => {
        ref.current?.log(data);
      }
    );

    return () => {
      command.kill(); // kill しないとリークする
    };
  }, [container_id]);

  return (
    <log
      ref={ref}
      keyable
      mouse
      keys
      border={{ type: "line" }}
      // @ts-ignore
      style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
    />
  );
};

const InspectBox = ({ content }: { content: string }) => {
  return (
    <log
      keyable
      mouse
      keys
      border={{ type: "line" }}
      // @ts-ignore
      style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
      content={content}
    />
  );
};

const StatsBox = ({ container_id }: { container_id: string }) => {
  const [stats, setStats] = useState<{
    CPUPerc: string;
    MemUsage: string;
    BlockIO: string;
    NetIO: string;
  }>({
    CPUPerc: "",
    MemUsage: "",
    BlockIO: "",
    NetIO: "",
  });

  // create 時 stream を取得する
  // destory 時 stream を破棄する
  useEffect(() => {
    const command = api.containers.stats({ id: container_id }, (data) => {
      setStats(data);
    });

    return () => {
      command.kill(); // kill しないとリークする
    };
  }, [container_id]);

  return (
    <>
      <box
        align="center"
        valign="middle"
        border={{ type: "line" }}
        label={"CPU USAGE"}
        top={0}
        left={0}
        height={"50%"}
        width={"50%"}
        content={stats.CPUPerc}
      />
      <box
        align="center"
        valign="middle"
        border={{ type: "line" }}
        label={"MEMORY USAGE"}
        top={0}
        left={"50%"}
        height={"50%"}
        // width={"50%"} 右側なので幅は残りすべて
        content={stats.MemUsage}
      />
      <box
        align="center"
        valign="middle"
        border={{ type: "line" }}
        label={"DISK READ/WRITE"}
        top={"50%"}
        left={0}
        // height={"50%"} // 下側なので高さは残りすべて
        width={"50%"}
        content={stats.BlockIO}
      />
      <box
        align="center"
        valign="middle"
        border={{ type: "line" }}
        label={"NETWORK I/O"}
        top={"50%"}
        left={"50%"}
        // height={"50%"} // 下側なので高さは残りすべて
        // width={"50%"} 右側なので幅は残りすべて
        content={stats.NetIO}
      />
    </>
  );
};
