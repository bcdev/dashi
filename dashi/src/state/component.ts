import { CSSProperties } from "react";
import { Config, Layout, PlotData } from "plotly.js";

export type ComponentType = "Button" | "Dropdown" | "Plot" | "Box";

export interface ComponentState {
  type: ComponentType;
  label?: string;
  // common HTML attributes
  id?: string;
  name?: string;
  value?: string | number;
  style?: CSSProperties;
}

export interface ContainerState extends ComponentState {
  components: ComponentState[];
}

export function isContainerState(
  componentModel: ComponentState,
): componentModel is ContainerState {
  return !!(componentModel as ContainerState).components;
}

export interface DropdownState extends ComponentState {
  type: "Dropdown";
  options: Array<[string, string | number]>;
  disabled?: boolean;
}

export interface ButtonState extends ComponentState {
  type: "Button";
  text: string;
  disabled?: boolean;
}

export interface PlotState extends ComponentState {
  type: "Plot";
  figure: {
    data: PlotData[];
    layout: Partial<Layout>;
    config: Partial<Config>;
  } | null;
}

export interface BoxState extends ContainerState {
  type: "Box";
}
