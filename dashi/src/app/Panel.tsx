import { CSSProperties, ReactElement } from "react";

import { PropertyChangeHandler } from "../model/component";
import DashiComponent from "../components/DashiComponent";
import { ContributionState } from "../store/appStore";
import { CircularProgress } from "@mui/material";
import { PanelModel } from "../model/panel";

const panelContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: 400,
  height: 300,
  padding: 5,
  border: "1px gray solid",
};

const panelHeaderStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  textAlign: "center",
};

interface PanelProps {
  panelModel: PanelModel;
  panelState: ContributionState;
  onPropertyChange: PropertyChangeHandler;
}

function Panel({ panelModel, panelState, onPropertyChange }: PanelProps) {
  if (!panelState.visible) {
    return null;
  }
  let panelElement: ReactElement | null = null;
  const componentModelResult = panelState.componentModelResult;
  if (componentModelResult.data) {
    panelElement = (
      <DashiComponent
        {...componentModelResult.data}
        onPropertyChange={onPropertyChange}
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
      <div style={panelHeaderStyle}>{panelModel.title}</div>
      {panelElement}
    </div>
  );
}

export default Panel;
