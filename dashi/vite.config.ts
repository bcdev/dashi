import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/demo/**/*", "src/utils/**/*"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  publicDir: false,
  build: {
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into the library
      external: [
        `${__dirname}/src/demo`,
        "@emotion/react",
        "@emotion/styled",
        "@fontsource/roboto",
        "@mui/material",
        "plotly.js",
        "react",
        "react-dom",
        "react-plotly.js",
        "zustand",
      ],
    },
  },
  test: {
    environment: "jsdom",
    onConsoleLog: (/*_log: string, _type: "stdout" | "stderr"*/):
      | false
      | void => {
      const logLevel = process.env.VITE_LOG_LEVEL;
      if (!logLevel || logLevel === "OFF") {
        return false;
      }
    },
  },
});
