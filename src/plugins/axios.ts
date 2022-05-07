import axios from "axios";

export const client = axios.create();

client.interceptors.request.use((config) => {
  config.socketPath = process.env.SOCKET_PATH || "/var/run/docker.sock";
  config.baseURL = `http:/${process.env.API_VERSION || "v1.41"}`;
  return config;
});
