import type { CSSProperties, ReactElement } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Component } from "chartlets";
import type { ComponentState, ComponentChangeHandler } from "chartlets";

import type { PanelState } from "@/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const panelContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: 400,
  // height: 400,
  border: 1,
  borderStyle: "solid",
};

const panelHeaderStyle: CSSProperties = {
  flexGrow: 0,
  display: "flex",
  flexDirection: "row",
  width: "100%",
  textAlign: "center",
  padding: "2px 4px 2px 4px",
};

const panelContentStyle: CSSProperties = {
  width: "100%",
  flexGrow: 1,
  padding: 1,
};

interface PanelProps extends PanelState {
  componentProps?: ComponentState;
  componentStatus?: string;
  componentError?: { message: string };
  onChange: ComponentChangeHandler;
}

function Panel({
  title,
  visible,
  componentProps,
  componentStatus,
  componentError,
  onChange,
}: PanelProps) {
  if (!visible) {
    return null;
  }
  let panelElement: ReactElement | null = null;
  if (componentProps) {
    panelElement = <Component {...componentProps} onChange={onChange} />;
  } else if (componentError) {
    panelElement = (
      <span>
        Error loading panel {title}: {componentError.message}
      </span>
    );
  } else if (componentStatus === "pending") {
    panelElement = (
      <span>
        <CircularProgress size={30} color="secondary" /> Loading {title}...
      </span>
    );
  }
  return (
    <Box
      sx={(theme) => ({
        ...panelContainerStyle,
        borderColor:
          theme.palette.grey[theme.palette.mode === "light" ? 300 : 800],
      })}
    >
      <Box
        sx={(theme) => ({
          ...panelHeaderStyle,
          background:
            theme.palette.grey[theme.palette.mode === "light" ? 300 : 800],
        })}
      >
        <Typography variant="button">{title}</Typography>
      </Box>
      <Box sx={panelContentStyle}>{panelElement}</Box>
    </Box>
  );
}

export default Panel;
