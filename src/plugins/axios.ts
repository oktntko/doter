import axios from "axios";
import { access } from "./log";

export const client = axios.create();

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
