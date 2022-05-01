import axios from "axios";
import log from "./log";

const client = axios.create();

client.interceptors.request.use((config) => {
  config.socketPath = process.env.SOCKET_PATH || "/var/run/docker.sock";
  config.baseURL = `http:/${process.env.API_VERSION || "v1.41"}`;
  return config;
});

client.interceptors.response.use(
  (response) => {
    log.debug(response.data);
    return Promise.resolve(response);
  },
  (error) => {
    log.error(error);
    return Promise.reject(error.response);
  }
);

export default client;

export type Port = {
  IP?: string;
  PrivatePort: number;
  PublicPort?: number;
  Type: "tcp" | "udp" | "sctp";
};

export type Labels = Record<string, string>;

export type HostConfig = {
  NetworkMode: string;
};

export type EndpointSettings = unknown;

export type Networks = Record<string, EndpointSettings>;

export type NetworkSettings = {
  Networks: Networks;
};

export type MountPoint = {
  Type: "bind" | "volume" | "tmpfs" | "npipe";
  Name: string;
  Source: string;
  Destination: string;
  Driver: string;
  Mode: string;
  RW: boolean;
  Propagation: string;
};

export type ListContainers = {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  Ports: Port[];
  SizeRw: number;
  SizeRootFs: number;
  Labels: Labels;
  State: string; // The state of this container (e.g. Exited)
  Status: string; // Additional human-readable status of this container (e.g. Exit 0)
  HostConfig: HostConfig;
  NetworkSettings: NetworkSettings;
  Mounts: MountPoint[];
};

export const api = {
  // # Container
  // : https://docs.docker.com/engine/api/v1.41/#tag/Container
  container: {
    ls: async (
      options: { all?: boolean; limit?: number; size?: boolean; filters?: string } = {}
    ) => {
      return client.get<ListContainers[]>("/containers/json", {
        params: {
          ...options,
        },
      });
    },
  },
};
