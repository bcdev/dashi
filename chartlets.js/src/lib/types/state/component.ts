import { type CSSProperties } from "react";
import { isObject } from "@/lib/utils/isObject";
import type {TopLevelSpec} from "vega-lite/src/spec";

export type ComponentType =
  | "Box"
  | "Button"
  | "Checkbox"
  | "Plot"
  | "Select"
  | "Typography";

export interface ComponentState {
  type: ComponentType;
  label?: string;
  children?: ComponentItem[];
  // common HTML attributes
  id?: string;
  name?: string;
  value?: boolean | string | number;
  style?: CSSProperties;
  disabled?: boolean;
}

export type ComponentItem = ComponentState | string;

export interface ContainerState extends ComponentState {
  children: ComponentItem[];
}

export type SelectOption =
  | string
  | number
  | [string, string]
  | [number, string]
  | { value: string | number; label?: string };

export interface SelectState extends ComponentState {
  type: "Select";
  options: SelectOption[];
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
  chart:
    | TopLevelSpec
    | null;
}

export interface BoxState extends ContainerState {
  type: "Box";
}

export interface TypographyState extends ContainerState {
  type: "Typography";
}

export function isComponentState(object: unknown): object is ComponentState {
  return isObject(object) && typeof object.type === "string";
}

export function isContainerState(object: unknown): object is ContainerState {
  return isComponentState(object) && Array.isArray(object.children);
}
