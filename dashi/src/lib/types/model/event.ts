import { type ComponentType } from "@/lib/types/state/component";

export interface PropertyChangeEvent {
  componentType: ComponentType;
  componentId: string;
  propertyName: string;
  propertyValue: unknown;
}

export type PropertyChangeHandler = (event: PropertyChangeEvent) => void;
