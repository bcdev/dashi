import { CSSProperties, ReactElement } from "react";
import { PropertyChangeHandler } from "../model/component.ts";
import DashiComponent from "../components/DashiComponent.tsx";
import { PanelState } from "./appStore.ts";
import { ContributionModel } from "../model/extension.ts";

const panelContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: 400,
  height: 300,
  padding: 5,
  border: "1px gray solid",
};

interface PanelProps {
  panelModel: ContributionModel;
  panelState: PanelState;
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
    panelElement = <span>Loading {panelModel.name}...</span>;
  }
  return <div style={panelContainerStyle}>{panelElement}</div>;
}

export default Panel;
