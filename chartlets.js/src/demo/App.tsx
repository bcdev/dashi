import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Typography from "@mui/material/Typography";

import { initializeContributions } from "@/lib";
import ExtensionsInfo from "./components/ExtensionInfo";
import ControlBar from "@/demo/components/ControlBar";
import PanelsControl from "./components/PanelsControl";
import PanelsRow from "./components/PanelsRow";
import { appStore } from "@/demo/store";
import { getValue, setValue } from "@/lib/utils/objPath";

initializeContributions({
  hostStore: {
    subscribe: (listener: () => void) => appStore.subscribe(listener),
    get: (property: string): unknown => getValue(appStore.getState(), property),
    set: (property: string, value: unknown) =>
      void appStore.setState(setValue(appStore.getState(), property, value)),
  },
  logging: { enabled: true },
});

// MUI's default font family
const fontFamily = "Roboto, Arial, sans-serif";

const theme = createTheme({
  typography: { fontFamily },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": { fontFamily },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography fontSize="3em" fontWeight="bold">
        Chartlets Demo
      </Typography>
      <ExtensionsInfo />
      <ControlBar />
      <PanelsControl />
      <PanelsRow />
    </ThemeProvider>
  );
}

export default App;
