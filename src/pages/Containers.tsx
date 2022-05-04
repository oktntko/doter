import type { Widgets } from "blessed";
import blessed from "blessed";
import { useEffect, useRef, useState } from "react";
import { screen } from "../app";
import { api } from "../repositories/api";

const ID_LENGTH = 12;

// vue2 のコンポーネント-インスタンス-オプション順序-推奨 を真似る
// https://jp.vuejs.org/v2/style-guide/#%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88-%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9-%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3%E9%A0%86%E5%BA%8F-%E6%8E%A8%E5%A5%A8
export const ContainersPage = ({ onError }: { onError: (message: string) => void }) => {
  // + state
  const [container_id, setContainerId] = useState<string>("");
  // container_id が変わるたびに描画されるので、 selected を保持する必要がある (これは素のblessedより厄介)
  const [selected, setSelected] = useState<number>(0);
  // useState と dataProps を使うやり方だと、
  // データセット時に on("select item") が呼ばれなかったため、 ref から直接操作する
  /**
   * const [containers, setContainers] = useState<string[][]>([]);
   * data={containers}
   */
  const ref = useRef<Widgets.ListTableElement | null>(null);

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

      <line orientation="vertical" top={"24%"} left={0} height={1} width={"100%"}></line>

      {/* 豆知識 height, widthの指定を省略すると、「残りすべて」になる */}
      <box top={"25%"} left={0}>
        <ContainerDetails
          container_id={container_id}
          onContainerUpdated={refreshContainers}
          onError={onError}
        />
      </box>
    </>
  );
};

export const ContainerDetails = ({
  container_id,
  onContainerUpdated,
  onError,
}: {
  container_id: string;
  onContainerUpdated: () => void;
  onError: (message: string) => void;
}) => {
  // + state
  const [name, setName] = useState<string>("");
  const [status, setSatus] = useState<string>("");

  const [configJson, setConfigJson] = useState<string>("");
  const [networkJson, setNetworkJson] = useState<string>("");
  const [mountsJson, setMountsJson] = useState<string>("");
  const [showJson, setShowJson] = useState<string>("");

  const [visibility, setVisibility] = useState<"LOGS" | "INSPECT" | "STATS">("LOGS");

  const ref = useRef<Widgets.Log | null>(null);

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

    ref.current?.setContent(""); // ログは初期化
    api.containers.logs({ id }, { follow: true, stdout: true, stderr: true, since: 0 }, (data) => {
      ref.current?.log(data);
    });
  };

  const handleMenuSelected = (content: string, key?: Widgets.Events.IKeyEventArg) => {
    if (key && key.full !== "enter") return;

    if (~content.indexOf("LOGS")) {
      setVisibility("LOGS");
    } else if (["CONFIG", "NETWORK", "MOUNTS"].some((label) => ~content.indexOf(label))) {
      setVisibility("INSPECT");
      if (~content.indexOf("CONFIG")) {
        setShowJson(configJson);
      } else if (~content.indexOf("NETWORK")) {
        setShowJson(networkJson);
      } else if (~content.indexOf("MOUNTS")) {
        setShowJson(mountsJson);
      }
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
        onError(error.data.message);
      });
  };

  // + template
  return (
    <>
      <text shrink tags top={0} left={1} content={name} />
      <text
        shrink
        tags
        top={2}
        left={1}
        content={`${status === "running" ? "{green-bg}" : "{blue-bg}"} {/} ${status}`}
      />

      {["  LOGS  ", " CONFIG ", "NETWORK ", " MOUNTS "].map((content, i, array) => {
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
        onKeypress={(_, key) => handleStartStopButton(key)}
      />

      <box top={3} left={0}>
        <log
          ref={ref}
          hidden={visibility !== "LOGS"}
          keyable
          mouse
          keys
          border={{ type: "line" }}
          // @ts-ignore
          style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
        />
        <log
          hidden={visibility !== "INSPECT"}
          keyable
          mouse
          keys
          border={{ type: "line" }}
          // @ts-ignore
          style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
          content={showJson}
        />
      </box>
    </>
  );
};

/**

Name
State            START / STOP  REMOVE

LOG  /  CONFIG  /  EXEC
■■■■■■■■■■■■■
■■■■■■■■■■■■
■■■■■■■■■■■■■
■■■■■■■■■■■■■■

 */
export const attachDetails = (
  screen: Widgets.Screen,
  parent: Widgets.Node,
  refreshList: () => void
) => {
  const details = blessed.box({
    parent: parent,
    top: "24%",
    left: 0,
    height: "76%",
    width: "100%",
  });

  blessed.text({
    parent: details,
    left: 1,
    top: 0,
    tags: true,
    content: "{green-bg} {/} {green-fg}DETAILS{/} {green-bg} {/}",
  });

  const header = blessed.box({
    parent: details,
    left: 0,
    top: 1,
    height: "16%",
  });

  const name = blessed.text({
    parent: header,
    shrink: true,
    tags: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 0,
    top: 1,
    content: "",
  });

  const status = blessed.text({
    parent: header,
    shrink: true,
    tags: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 32,
    top: 1,
    content: "",
  });

  const startButton = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 48,
    top: 0,
    content: "START",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const stopButton = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 56,
    top: 0,
    content: " STOP ",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });
  startButton.hide();
  stopButton.hide();

  const logButton = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 0,
    top: 3,
    content: " LOG  ",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const configButton = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 9,
    top: 3,
    content: "CONFIG",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const networkButton = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 18,
    top: 3,
    content: "NETWORK",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const mountsButton = blessed.button({
    parent: header,
    keyable: true,
    mouse: true,
    keys: true,
    shrink: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
    left: 28,
    top: 3,
    content: "MOUNTS",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const main = blessed.box({
    parent: details,
    mouse: true,
    keys: true,
    left: 0,
    top: "16%",
    height: "86%",
    width: "100%",
  });

  const logBlessed = blessed.log({
    parent: main,
    focusable: true,
    keyable: true,
    mouse: true,
    keys: true,
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const configBlessed = blessed.log({
    parent: main,
    focusable: true,
    keyable: true,
    mouse: true,
    keys: true,
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const networkBlessed = blessed.log({
    parent: main,
    focusable: true,
    keyable: true,
    mouse: true,
    keys: true,
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const mountsBlessed = blessed.log({
    parent: main,
    focusable: true,
    keyable: true,
    mouse: true,
    keys: true,
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    border: { type: "line" },
    style: { focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } },
  });

  const onEnter =
    (params: { log?: boolean; config?: boolean; network?: boolean; mounts?: boolean }) => () => {
      params.log ? logBlessed.show() : logBlessed.hide();
      params.config ? configBlessed.show() : configBlessed.hide();
      params.network ? networkBlessed.show() : networkBlessed.hide();
      params.mounts ? mountsBlessed.show() : mountsBlessed.hide();
      screen.render();
    };

  logButton.on("press", onEnter({ log: true }));
  logButton.on("click", onEnter({ log: true }));
  configButton.on("press", onEnter({ config: true }));
  configButton.on("click", onEnter({ config: true }));
  networkButton.on("press", onEnter({ network: true }));
  networkButton.on("click", onEnter({ network: true }));
  mountsButton.on("press", onEnter({ mounts: true }));
  mountsButton.on("click", onEnter({ mounts: true }));

  onEnter({ log: true })();

  const start = (id: string) => () => {
    api.containers
      .start({ id })
      .then(() => {
        refresh(id);
        refreshList();
      })
      .catch((error) => {
        const message = blessed.message({
          parent: parent,
          top: "45%",
          left: "40%",
          height: "10%",
          width: "20%",
          mouse: true,
          keys: true,
          tags: true,
          align: "center",
          border: "line",
          style: { border: { type: "line", fg: "red" } },
        });
        message.display(error.data.message, 3, () => ({}));
        screen.render();
      });
  };

  const stop = (id: string) => () => {
    api.containers
      .stop({ id })
      .then(() => {
        refresh(id);
        refreshList();
      })
      .catch((error) => {
        const message = blessed.message({
          parent: parent,
          top: "45%",
          left: "40%",
          height: "10%",
          width: "20%",
          mouse: true,
          keys: true,
          tags: true,
          align: "center",
          border: "line",
          style: { border: { type: "line", fg: "red" } },
        });
        message.display(error.data.message, 3, () => ({}));
        refreshList();
        screen.render();
      });
  };

  let onPressStartListener: null | ReturnType<typeof start> = null;
  let onPressStopListener: null | ReturnType<typeof stop> = null;

  const refresh = (id: string) => {
    api.containers.inspect({ id }).then(({ data }) => {
      name.setContent(`{bold}${data.Name ?? "unknown"}{/}`);

      if (onPressStartListener) {
        startButton.removeListener("press", onPressStartListener);
        onPressStartListener = null;
      }
      if (onPressStopListener) {
        stopButton.removeListener("press", onPressStopListener);
        onPressStopListener = null;
      }

      const statusText = data.State?.Status;
      if (statusText === "running") {
        status.setContent(`{green-fg}${statusText}{/}`);

        startButton.hide();

        onPressStopListener = stop(id);
        stopButton.on("press", onPressStopListener);
        stopButton.show();
      } else if (statusText === "exited") {
        status.setContent(`{blue-fg}${statusText}{/}`);

        onPressStartListener = start(id);
        startButton.on("press", onPressStartListener);
        startButton.show();

        stopButton.hide();
      } else {
        status.setContent(statusText ?? "unknown");
        startButton.hide();
        stopButton.hide();
      }

      configBlessed.setContent(JSON.stringify(data.Config, null, 3));
      networkBlessed.setContent(JSON.stringify(data.NetworkSettings, null, 3));
      mountsBlessed.setContent(JSON.stringify(data.Mounts, null, 3));

      screen.render();
    });

    logBlessed.setContent("");
    api.containers.logs(
      { id },
      { follow: true, stdout: true, stderr: true, since: 0 },
      (data: string) => {
        logBlessed.log(data);
        screen.render();
      }
    );
  };

  return {
    details,
    refresh,
  };
};
