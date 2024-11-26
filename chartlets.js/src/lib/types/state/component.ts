import { type CSSProperties } from "react";
import { isObject } from "@/lib/utils/isObject";
import { isString } from "@/lib/utils/isString";

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
  type: string;
  children?: ComponentNode[];
  // common HTML attributes
  id?: string;
  name?: string;
  value?: unknown;
  style?: CSSProperties;
  disabled?: boolean;
  label?: string;
  color?: string;
}

export interface ContainerState extends ComponentState {
  children: ComponentNode[];
}

export function isComponentState(object: unknown): object is ComponentState {
  return isObject(object) && isString(object.type);
}

export function isContainerState(object: unknown): object is ContainerState {
  return isComponentState(object) && Array.isArray(object.children);
}
