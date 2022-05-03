import { client } from "../plugins/axios";
import { access } from "../plugins/log";
import { paths } from "./docker-engine-api-1.41";
import { spawn } from "child_process";

export const api = {
  // # Container
  // : https://docs.docker.com/engine/api/v1.41/#tag/Container
  container: {
    list: async (params: paths["/containers/json"]["get"]["parameters"]["query"] = {}) => {
      access.debug("/containers/json");
      return client.get<paths["/containers/json"]["get"]["responses"]["200"]["schema"]>(
        "/containers/json",
        { params }
      );
    },
    inspect: async (
      path: paths["/containers/{id}/json"]["get"]["parameters"]["path"],
      params: paths["/containers/{id}/json"]["get"]["parameters"]["query"] = {}
    ) => {
      access.debug(`/containers/${path.id}/json`);
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
      access.debug(`/containers/${path.id}/logs`);

      const args = ["logs"];
      if (params.follow) args.push("--follow");
      if (params.since) args.push(`--since=${params.since}`);
      if (params.tail) args.push(`--tail=${params.tail}`);
      if (params.timestamps) args.push(`--timestamps`);
      args.push(path.id);

      const command = spawn("docker", args);
      command.stdout.setEncoding("utf8");

      if (params.stdout) command.stdout.on("data", (chunk: string) => callback(chunk.toString()));
      if (params.stderr) command.stderr.on("data", (chunk: string) => callback(chunk.toString()));

      return command;
    },
  },
};
