export const HelpPage = () => {
  return (
    <box
      keyable
      mouse
      keys
      tags
      top={0}
      left={0}
      width={"100%"}
      height={"100%"}
      border={{ type: "line" }}
      // @ts-ignore
      style={{ focus: { border: { fg: "yellow" } }, hover: { border: { fg: "blue" } } }}
      content={`{green-bg} {/} 基本的な操作
  - TABキーで移動できます。フォーカス中の要素は黄色い枠になります。
  - マウスでも操作できます。
`}
    />
  );
};
