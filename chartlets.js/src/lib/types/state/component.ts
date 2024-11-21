import { type CSSProperties } from "react";
import type { VisualizationSpec } from "react-vega";
import { isObject } from "@/lib/utils/isObject";

export type ComponentType =
  | "Box"
  | "Button"
  | "Checkbox"
  | "Plot"
  | "Select"
  | "Typography";

export type ComponentNode =
  | ComponentState
  | string
  | 0
  | false
  | null
  | undefined;

export interface ComponentState {
  // TODO: Rename to tag, so we can also have
  //   (Html)ElementState along with ComponentState
  type: ComponentType;
  children?: ComponentNode[];
  // common HTML attributes
  id?: string;
  name?: string;
  value?: boolean | string | number;
  style?: CSSProperties;
  disabled?: boolean;
  label?: string;
}

export interface ContainerState extends ComponentState {
  children: ComponentNode[];
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
    | (VisualizationSpec & {
        datasets?: Record<string, unknown>; // Add the datasets property
      })
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
