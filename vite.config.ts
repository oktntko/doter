import path from "path";
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
  resolve: { alias: { "~": path.resolve(__dirname, "src") } },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./src/app.tsx",
      exportName: "viteNodeApp",
      tsCompiler: "swc",
    }),
  ],
});
