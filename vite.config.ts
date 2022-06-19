import path from "path";
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: { alias: { "~": path.resolve(__dirname, "src") } },
  plugins: [
    react(),
    ...VitePluginNode({
      adapter: "express",
      appPath: "./src/app.tsx",
      exportName: "viteNodeApp",
      tsCompiler: "swc",
    }),
  ],
});
