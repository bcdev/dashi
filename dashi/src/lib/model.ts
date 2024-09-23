import { CSSProperties } from "react";
import { Config, Layout, PlotData } from "plotly.js";

export type ComponentType = "button" | "plot" | "panel" | "box";

export interface ComponentModel {
  type: ComponentType;
  // data model
  name?: string;
  value?: unknown;
  // HTML attributes
  id?: string;
  style?: CSSProperties;
}

export interface ContainerModel extends ComponentModel {
  components: ComponentModel[];
}

export interface ButtonModel extends ComponentModel {
  type: "button";
  name: string;
  value: unknown;
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

export interface EventData<T = object> {
  componentType: ComponentType;
  componentId?: string;
  eventType: string;
  eventData?: T;
}

export type EventHandler<T = object> = (data: EventData<T>) => void;

export function makeId(type: ComponentType, id: string | undefined) {
  if (typeof id === "string" && id !== "") {
    return `dashi.${type}.${id}`;
  }
  return undefined;
}
