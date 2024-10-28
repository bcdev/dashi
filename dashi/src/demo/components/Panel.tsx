import { type CSSProperties, type ReactElement } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import {
  type Contribution,
  type ContributionState,
  type PropertyChangeHandler,
  DashiComponent,
} from "@/lib";

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

interface PanelProps {
  panelModel: Contribution;
  panelIndex: number;
  panelState: ContributionState;
  onPropertyChange: PropertyChangeHandler;
}

function Panel({
  panelModel,
  panelIndex,
  panelState,
  onPropertyChange,
}: PanelProps) {
  if (!panelState.visible) {
    return null;
  }
  const componentState = panelState.componentState;
  let panelElement: ReactElement | null = null;
  const componentModelResult = panelState.componentStateResult;
  if (componentModelResult.data && componentState) {
    panelElement = (
      <DashiComponent
        {...componentState}
        onPropertyChange={onPropertyChange}
        panelIndex={panelIndex}
      />
    );
  } else if (componentModelResult.error) {
    panelElement = (
      <span>
        Error loading {panelModel.name}: {componentModelResult.error.message}
      </span>
    );
  } else if (componentModelResult.status === "pending") {
    panelElement = (
      <span>
        <CircularProgress size={30} color="secondary" /> Loading{" "}
        {panelModel.name}...
      </span>
    );
  }
  return (
    <div style={panelContainerStyle}>
      <div style={panelHeaderStyle}>{panelState.title}</div>
      <div style={panelContentStyle}>{panelElement}</div>
    </div>
  );
}

export default Panel;
