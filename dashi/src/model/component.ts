import { CSSProperties } from "react";
import { Config, Layout, PlotData } from "plotly.js";

export type ComponentType = "Button" | "Dropdown" | "Plot" | "Box";

export interface ComponentModel {
  type: ComponentType;
  // common HTML attributes
  id?: string;
  name?: string;
  value?: string | number;
  style?: CSSProperties;
}

export interface ContainerModel extends ComponentModel {
  components: ComponentModel[];
}

export interface DropdownModel extends ComponentModel {
  type: "Dropdown";
  options: Array<[string, string | number]>;
  disabled?: boolean;
}

export interface ButtonModel extends ComponentModel {
  type: "Button";
  text: string;
  disabled?: boolean;
}

export interface PlotModel extends ComponentModel {
  type: "Plot";
  figure: {
    data: PlotData[];
    layout: Partial<Layout>;
    config: Partial<Config>;
  } | null;
}

export interface BoxModel extends ContainerModel {
  type: "Box";
}

export interface PropertyChangeEvent {
  componentType: ComponentType;
  componentId: string;
  propertyName: string;
  propertyValue: unknown;
}

export type PropertyChangeHandler = (event: PropertyChangeEvent) => void;

export interface ContributionChangeEvent extends PropertyChangeEvent {
  contribPoint: string;
  contribIndex: number;
}

export type ContributionChangeHandler = (
  event: ContributionChangeEvent,
) => void;
