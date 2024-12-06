import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { type ThemeMode, themeModes, useAppStore } from "@/store";

function Header() {
  const { themeMode, setThemeMode } = useAppStore();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography fontSize="3em" fontWeight="bold">
        Chartlets Demo
      </Typography>
      <Button
        onClick={() => {
          setThemeMode(getNextThemeMode(themeMode));
        }}
        variant="contained"
        size="small"
      >
        {themeMode}
      </Button>
    </Box>
  );
}

export default Header;

const getNextThemeMode = (themeMode: ThemeMode) => {
  return themeModes[
    (themeModes.findIndex((m) => m === themeMode) + 1) % themeModes.length
  ];
};
