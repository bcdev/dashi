import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Typography from "@mui/material/Typography";

import { initSystemStore } from "../store/actions/initSystemStore";
import ExtensionsInfo from "./components/ExtensionInfo";
import PanelsControl from "./components/PanelsControl";
import PanelsRow from "./components/PanelsRow";

initSystemStore();

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
