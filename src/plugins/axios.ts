import axios from "axios";
import log from "./log";

const client = axios.create();

client.interceptors.request.use((config) => {
  config.socketPath = process.env.SOCKET_PATH || "/var/run/docker.sock";
  config.baseURL = `http:/${process.env.API_VERSION || "v1.41"}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    log.error(error);
    return Promise.reject(error.response);
  }
);

export default client;

// # Container
// : https://docs.docker.com/engine/api/v1.41/#tag/Container
export const container = {
  ls: async (options: { all?: boolean; limit?: number; size?: boolean; filters?: string } = {}) => {
    return client.get("/containers/json", {
      params: {
        ...options,
      },
    });
  },
};
