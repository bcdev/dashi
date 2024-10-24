import { type ComponentState } from "@/lib/types/state/component";
import { type PropertyChangeHandler } from "@/lib/types/model/event";
import { DashiPlot, type DashiPlotProps } from "./DashiPlot";
import { DashiButton, type DashiButtonProps } from "./DashiButton";
import { DashiBox, type DashiBoxProps } from "./DashiBox";
import { DashiDropdown, type DashiDropdownProps } from "./DashiDropdown";

export interface DashiComponentProps extends ComponentState {
  onPropertyChange: PropertyChangeHandler;
}

export function DashiComponent({ type, ...props }: DashiComponentProps) {
  // TODO: allow for registering components via their types
  //   and make following code generic.
  //
  // const DashiComp = Registry.getComponent(type);
  // return return <DashiComp {...props} />;
  //
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
