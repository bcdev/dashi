import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/app/**/*", "src/utils/**/*"],
    }),
  ],
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
