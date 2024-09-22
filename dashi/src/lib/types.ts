import { Config, Layout, PlotData } from "plotly.js";
import { CSSProperties } from "react";

export type ComponentType = "button" | "plot" | "panel" | "box";

export interface ComponentModel {
  type: ComponentType;
  id?: string;
  style?: CSSProperties;
}

export interface ContainerModel extends ComponentModel {
  components: ComponentModel[];
}

export interface ButtonModel extends ComponentModel {
  type: "button";
  text: string;
  disabled?: boolean;
}

export interface PlotModel extends ComponentModel {
  type: "plot";
  data: PlotData[];
  layout: Partial<Layout>;
  config: Partial<Config>;
}

export interface PanelModel extends ContainerModel {
  type: "panel";
}

export interface BoxModel extends ContainerModel {
  type: "box";
}

export interface EventData<T = {}> {
  componentType: ComponentType;
  componentId?: string;
  eventType: string;
  eventData?: T;
}

export type EventHandler<T = {}> = (data: EventData<T>) => void;
