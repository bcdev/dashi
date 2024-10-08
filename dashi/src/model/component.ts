import { CSSProperties } from "react";
import { Config, Layout, PlotData } from "plotly.js";

export type ComponentType = "Button" | "Dropdown" | "Plot" | "Box";

export interface ComponentModel {
  type: ComponentType;
  label?: string;
  // common HTML attributes
  id?: string;
  name?: string;
  value?: string | number;
  style?: CSSProperties;
}

export interface ContainerModel extends ComponentModel {
  components: ComponentModel[];
}

export function isContainerModel(
  componentModel: ComponentModel,
): componentModel is ContainerModel {
  return !!(componentModel as ContainerModel).components;
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

export function getComponentPath(
  componentModel: ComponentModel,
  componentId: string,
): (string | number)[] | undefined {
  if (componentModel.id === componentId) {
    return [];
  }
  if (isContainerModel(componentModel)) {
    for (let i = 0; i < componentModel.components.length; i++) {
      const item = componentModel.components[i];
      if (item.id === componentId) {
        return ["components", i];
      }
      const subPath = getComponentPath(item, componentId);
      if (subPath) {
        return ["components", i].concat(subPath);
      }
    }
  }
}

export function getComponentPathG<
  T extends object,
  IK extends keyof T,
  CK extends keyof T,
>(
  componentModel: T,
  componentIdKey: IK,
  componentChildrenKey: CK,
  componentId: string,
): (CK | number)[] | undefined {
  if (componentModel[componentIdKey] === componentId) {
    return [];
  }
  const children = componentModel[componentChildrenKey] as T[] | undefined;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const item = children[i];
      if (item[componentIdKey] === componentId) {
        return [componentChildrenKey, i];
      }
      const subPath = getComponentPathG(
        item,
        componentIdKey,
        componentChildrenKey,
        componentId,
      );
      if (subPath) {
        return [componentChildrenKey, i].concat(subPath);
      }
    }
  }
}
