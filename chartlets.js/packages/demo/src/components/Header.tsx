import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export type Mode = "dark" | "light" | "system";
const modes: Mode[] = ["dark", "light", "system"];

interface HeaderProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

function Header({ mode, setMode }: HeaderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography fontSize="3em" fontWeight="bold">
        Chartlets Demo
      </Typography>
      <Button
        onClick={() => {
          const nextMode = modes[(modes.findIndex((m) => m === mode) + 1) % 3];
          setMode(nextMode);
        }}
        variant="contained"
        size="small"
      >
        {mode}
      </Button>
    </Box>
  );
}

export default Header;
