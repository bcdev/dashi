import { useMemo, useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";

import { initializeContributions } from "chartlets";
import mui from "chartlets/plugins/mui";
import vega from "chartlets/plugins/vega";

import { type AppState, appStore } from "@/store";
import ExtensionsInfo from "./components/ExtensionInfo";
import ControlBar from "./components/ControlBar";
import PanelsControl from "./components/PanelsControl";
import PanelsRow from "./components/PanelsRow";
import Header, { type Mode } from "./components/Header";

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
  const systemMode = prefersDarkMode ? "dark" : "light";
  const [mode, setMode] = useState<Mode>(systemMode);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode === "system" ? systemMode : mode,
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
    [mode, systemMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header mode={mode} setMode={setMode} />
      <ExtensionsInfo />
      <ControlBar />
      <PanelsControl />
      <PanelsRow />
    </ThemeProvider>
  );
}

export default App;
