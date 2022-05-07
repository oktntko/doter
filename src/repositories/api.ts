import { spawn } from "child_process";
import { client } from "~/plugins/axios";
import { paths } from "~/repositories/docker-engine-api-1.41";

export const api = {
  // # Container
  // : https://docs.docker.com/engine/api/v1.41/#tag/Container
  containers: {
    list: async (params: paths["/containers/json"]["get"]["parameters"]["query"] = {}) => {
      return client.get<paths["/containers/json"]["get"]["responses"]["200"]["schema"]>(
        "/containers/json",
        { params }
      );
    },
    inspect: async (
      path: paths["/containers/{id}/json"]["get"]["parameters"]["path"],
      params: paths["/containers/{id}/json"]["get"]["parameters"]["query"] = {}
    ) => {
      return client.get<paths["/containers/{id}/json"]["get"]["responses"]["200"]["schema"]>(
        `/containers/${path.id}/json`,
        { params }
      );
    },
    logs: (
      path: paths["/containers/{id}/logs"]["get"]["parameters"]["path"],
      params: paths["/containers/{id}/logs"]["get"]["parameters"]["query"] = {},
      callback: (data: string) => void
    ) => {
      // {responseType: "stream"} の使い方がわからない

      const args = ["logs"];
      if (params.follow) args.push("--follow");
      if (params.since) args.push(`--since=${params.since}`);
      if (params.tail) args.push(`--tail=${params.tail}`);
      if (params.timestamps) args.push(`--timestamps`);
      args.push(path.id);

      const command = spawn("docker", args);
      command.stdout.setEncoding("utf8");
      command.stderr.setEncoding("utf8");

      if (params.stdout) command.stdout.on("data", (chunk: string) => callback(chunk.toString()));
      if (params.stderr) command.stderr.on("data", (chunk: string) => callback(chunk.toString()));

      return command;
    },
    stats: (
      path: paths["/containers/{id}/stats"]["get"]["parameters"]["path"],
      callback: (data: {
        CPUPerc: string;
        MemUsage: string;
        BlockIO: string;
        NetIO: string;
      }) => void
    ) => {
      // yaml に型定義がないためコマンドでやる

      const args = ["stats"];
      // たまに先頭に別の文字列がくっつくので頭にパイプラインを入れる(streamの何か？)
      // 普通にコマンドから実行するとダブルクォーテーションが必要だけど、 child_process は不要らしい
      // 例) `docker stats --format="|{{.CPUPerc}}|{{.MemUsage}}|{{.BlockIO}}|{{.NetIO}}"`
      args.push("--format=|{{.CPUPerc}}|{{.MemUsage}}|{{.BlockIO}}|{{.NetIO}}");
      args.push(path.id);

      const command = spawn("docker", args);
      command.stdout.setEncoding("utf8");

      command.stdout.addListener("data", (chunk: string) => {
        const line = chunk.toString().trim();
        if ((line.match(/\|/g) || []).length === 4) {
          const [_, CPUPerc, MemUsage, BlockIO, NetIO] = line.split("|");
          callback({ CPUPerc, MemUsage, BlockIO, NetIO });
        }
      });

      return command;
    },
    start: async (path: paths["/containers/{id}/start"]["post"]["parameters"]["path"]) => {
      return client.post<paths["/containers/{id}/start"]["post"]["responses"]["204"]>(
        `/containers/${path.id}/start`
      );
    },
    stop: async (path: paths["/containers/{id}/stop"]["post"]["parameters"]["path"]) => {
      return client.post<paths["/containers/{id}/stop"]["post"]["responses"]["204"]>(
        `/containers/${path.id}/stop`
      );
    },
  },

  images: {
    list: async (params: paths["/images/json"]["get"]["parameters"]["query"] = {}) => {
      return client.get<paths["/images/json"]["get"]["responses"]["200"]["schema"]>(
        "/images/json",
        { params }
      );
    },
    history: async (path: paths["/images/{name}/history"]["get"]["parameters"]["path"]) => {
      return client.get<paths["/images/{name}/history"]["get"]["responses"]["200"]["schema"]>(
        `/images/${path.name}/history`
      );
    },
    inspect: async (path: paths["/images/{name}/json"]["get"]["parameters"]["path"]) => {
      return client.get<paths["/images/{name}/json"]["get"]["responses"]["200"]["schema"]>(
        `/images/${path.name}/json`
      );
    },
  },
};
