import { useMemo } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";

import { initializeContributions } from "chartlets";
import mui from "chartlets/plugins/mui";
import vega from "chartlets/plugins/vega";

import { type AppState, appStore, useAppStore } from "@/store";
import ControlBar from "./components/ControlBar";
import ExtensionsInfo from "./components/ExtensionInfo";
import Header from "./components/Header";
import PanelsControl from "./components/PanelsControl";
import PanelsRow from "./components/PanelsRow";

initializeContributions({
  plugins: [mui(), vega()],
  hostStore: {
    // Let Chartlets listen to changes in application state.
    subscribe: (listener: () => void) => appStore.subscribe(listener),
    // Compute a property value and return it. We simply use getValue() here.
    get: (property: string): unknown => {
      return appStore.getState()[property as keyof AppState];
    },
    // Set a property value in the application state.
    set: (property: string, value: unknown) => {
      appStore.setState({ [property as keyof AppState]: value });
    },
  },
  logging: { enabled: true },
});

// Material Design default font families
const fontFamily = "Roboto, Arial, sans-serif";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const systemThemeMode = prefersDarkMode ? "dark" : "light";
  const themeMode = useAppStore((state) => state.themeMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode === "system" ? systemThemeMode : themeMode,
        },
        typography: { fontFamily },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              "*": { fontFamily },
            },
          },
        },
      }),
    [themeMode, systemThemeMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <ExtensionsInfo />
      <ControlBar />
      <PanelsControl />
      <PanelsRow />
    </ThemeProvider>
  );
}

export default App;
