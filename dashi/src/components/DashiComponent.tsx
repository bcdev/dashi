import { ComponentModel, PropertyChangeHandler } from "../model/component.ts";
import DashiPlot, { DashiPlotProps } from "./DashiPlot.tsx";
import DashiButton, { DashiButtonProps } from "./DashiButton.tsx";
import DashiBox, { DashiBoxProps } from "./DashiBox.tsx";
import DashiDropdown, { DashiDropdownProps } from "./DashiDropdown.tsx";

export interface DashiComponentProps extends ComponentModel {
  onPropertyChange: PropertyChangeHandler;
}

function DashiComponent({ type, ...props }: DashiComponentProps) {
  // TODO: find way to avoid ugly type casts here
  if (type === "Plot") {
    return <DashiPlot {...(props as DashiPlotProps)} />;
  } else if (type === "Dropdown") {
    return <DashiDropdown {...(props as DashiDropdownProps)} />;
  } else if (type === "Button") {
    return <DashiButton {...(props as DashiButtonProps)} />;
  } else if (type === "Box") {
    return <DashiBox {...(props as DashiBoxProps)} />;
  }
}

export default DashiComponent;
