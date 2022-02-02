/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {},
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          gzipSize: true,
          brotliSize: true,
        }),
      ],
      output: {
        manualChunks: {
          unified: [
            "rehype",
            "rehype-raw",
            "rehype-react",
            "rehype-sanitize",
            "remark",
            "remark-gfm",
            "remark-rehype",
            "unified",
            "unist-util-inspect",
          ],
        },
      },
    },
  },
});
