import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
} from "@mui/material";

import ExtensionsInfo from "./ExtensionInfo";
import PanelsControl from "./PanelsControl";
import PanelsRow from "./PanelsRow";
import { initAppStore } from "../actions/initAppStore";

initAppStore();

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
        Dashi Demo
      </Typography>
      <ExtensionsInfo />
      <PanelsControl />
      <PanelsRow />
    </ThemeProvider>
  );
}

export default App;
