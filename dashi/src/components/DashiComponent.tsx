import { ComponentModel, PropertyChangeHandler } from "../model/component.ts";
import DashiPlot from "./DashiPlot.tsx";
import DashiButton from "./DashiButton.tsx";
import DashiBox from "./DashiBox.tsx";
import DashiDropdown from "./DashiDropdown.tsx";

export interface DashiComponentProps extends ComponentModel {
  onPropertyChange: PropertyChangeHandler;
}

function DashiComponent({ type, ...props }: DashiComponentProps) {
  if (type === "Plot") {
    return <DashiPlot {...props} />;
  } else if (type === "Dropdown") {
    return <DashiDropdown {...props} />;
  } else if (type === "Button") {
    return <DashiButton {...props} />;
  } else if (type === "Box") {
    return <DashiBox {...props} />;
  }
}

export default DashiComponent;
