import { type CSSProperties } from "react";
import { isObject } from "@/lib/utils/isObject";

export interface ComponentState {
  type: string;
  label?: string;
  children?: ComponentItem[];
  // common HTML attributes
  id?: string;
  name?: string;
  value?: boolean | string | number | null | undefined;
  style?: CSSProperties;
  disabled?: boolean;
}

export type ComponentItem = ComponentState | string;

export interface ContainerState extends ComponentState {
  children: ComponentItem[];
}

export function isComponentState(object: unknown): object is ComponentState {
  return isObject(object) && typeof object.type === "string";
}

export function isContainerState(object: unknown): object is ContainerState {
  return isComponentState(object) && Array.isArray(object.children);
}
