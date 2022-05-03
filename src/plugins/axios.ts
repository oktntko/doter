import axios from "axios";
import { paths } from "./docker-engine-api-1.41";
import { access } from "./log";

const client = axios.create();

client.interceptors.request.use((config) => {
  config.socketPath = process.env.SOCKET_PATH || "/var/run/docker.sock";
  config.baseURL = `http:/${process.env.API_VERSION || "v1.41"}`;
  return config;
});

client.interceptors.response.use(
  (response) => {
    access.debug(response.data);
    return Promise.resolve(response);
  },
  (error) => {
    access.error(error);
    return Promise.reject(error.response);
  }
);

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
  },
};
