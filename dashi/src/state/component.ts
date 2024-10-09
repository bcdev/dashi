import { CSSProperties } from "react";
import { Config, Layout, PlotData } from "plotly.js";

export type ComponentType = "Button" | "Checkbox" | "Dropdown" | "Plot" | "Box";

export interface ComponentState {
  type: ComponentType;
  label?: string;
  components?: ComponentState[];
  // common HTML attributes
  id?: string;
  name?: string;
  value?: boolean | string | number;
  style?: CSSProperties;
  disabled?: boolean;
}

export interface ContainerState extends ComponentState {
  components: ComponentState[];
}

export function isContainerState(
  componentModel: ComponentState,
): componentModel is ContainerState {
  return !!componentModel.components;
}

export interface DropdownState extends ComponentState {
  type: "Dropdown";
  options: Array<[string, string | number]>;
}

export interface ButtonState extends ComponentState {
  type: "Button";
  text: string;
}

export interface CheckboxState extends ComponentState {
  type: "Checkbox";
  label: string;
  value?: boolean;
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
