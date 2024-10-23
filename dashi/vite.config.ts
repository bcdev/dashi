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
      // Alias 'plotly.js' to use the minified dist version instead of the source code.
      "plotly.js": resolve(
        __dirname,
        "node_modules/plotly.js/dist/plotly.min.js",
      ),
    },
  },
  publicDir: false,
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "Dashi",
      // the proper extensions will be added
      fileName: "dashi",
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
          "react-plotly.js": "Plot",
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
