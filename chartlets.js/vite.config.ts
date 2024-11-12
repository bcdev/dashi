import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { globSync } from "glob";

import manifest from "./package.json";

function findFiles(root: string, pattern: string): string[] {
  return globSync(`${resolve(__dirname, root)}/${pattern}`).map((path) =>
    resolve(__dirname, path),
  );
}

const externalModules = [
  ...Object.keys(manifest.peerDependencies || {}),
  ...Object.keys(manifest.dependencies || {}),
];

const externalFiles = [
  ...findFiles("src", "**/*.test.*"),
  ...findFiles("src/demo", "**/*"),
];

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src/lib/**/*.ts", "src/lib/**/*.tsx"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  publicDir: false,
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "Chartlets",
      // the proper extensions will be added
      fileName: "chartlets",
    },
    rollupOptions: {
      // externalize deps that shouldn't be bundled into the library
      external: [/^@emotion/, /^@mui/, ...externalModules, ...externalFiles],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          "@emotion/styled": "emStyled",
          "@emotion/react": "emReact",
          microdiff: "diff",
          react: "React",
          "react-dom": "ReactDOM",
          "react-vega": "ReactVega",
          zustand: "zustand",
        },
      },
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
