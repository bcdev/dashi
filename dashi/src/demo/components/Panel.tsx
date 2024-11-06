import type { CSSProperties, ReactElement } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Component } from "@/lib";
import type { ComponentState, ComponentChangeHandler } from "@/lib";
import type { PanelState } from "@/demo/types";

const panelContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: 400,
  height: 400,
  border: "1px gray solid",
};

const panelHeaderStyle: CSSProperties = {
  flexGrow: 0,
  display: "flex",
  flexDirection: "row",
  width: "100%",
  textAlign: "center",
  background: "lightgray",
  padding: "2px 4px 2px 4px",
};

const panelContentStyle: CSSProperties = {
  width: "100%",
  flexGrow: 1,
  padding: 2,
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
    <div style={panelContainerStyle}>
      <div style={panelHeaderStyle}>{title}</div>
      <div style={panelContentStyle}>{panelElement}</div>
    </div>
  );
}

export default Panel;
