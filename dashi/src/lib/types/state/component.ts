import { type CSSProperties } from "react";
import type { VisualizationSpec } from "react-vega";

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
  figure: VisualizationSpec & {
    datasets?: Record<string, unknown>; // Add the datasets property
  };
}

export interface BoxState extends ContainerState {
  type: "Box";
}
