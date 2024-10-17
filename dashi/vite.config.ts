import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { globSync } from "glob";

function findFiles(root: string, pattern: string): string[] {
  return globSync(`${resolve(__dirname, root)}/${pattern}`).map((path) =>
    resolve(__dirname, path),
  );
}
const excludedTestFiles = findFiles("src", "**/*.test.*");
const excludedDemoFiles = findFiles("src/demo", "**/*");
// console.log("excluded test files:", excludedTestFiles);
// console.log("excluded demo files:", excludedDemoFiles);

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
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
      name: "Dashi",
      // the proper extensions will be added
      fileName: "dashi",
    },
    rollupOptions: {
      // externalize deps that shouldn't be bundled into the library
      external: [
        "@emotion/react",
        "@emotion/styled",
        "@fontsource/roboto",
        "@mui/material",
        "@mui/system",
        "@mui/utils",
        "plotly.js",
        "microdiff",
        "react",
        "react-dom",
        "react-plotly.js",
        "zustand",
        ...excludedTestFiles,
        ...excludedDemoFiles,
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          "@emotion/react": "EmotionReact",
          "@emotion/styled": "EmotionStyled",
          "@fontsource/roboto": "FontsourceRoboto",
          "@mui/material": "MuiMaterial",
          "@mui/system": "MuiSystem",
          "@mui/utils": "MuiUtils",
          "plotly.js": "PlotlyJs",
          microdiff: "Microdiff",
          react: "React",
          "react-dom": "ReactDom",
          "react-plotly.js": "ReactPlotlyJs",
          zustand: "Zustand",
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
