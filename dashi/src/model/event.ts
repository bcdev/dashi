import { ComponentType } from "../state/component";

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
