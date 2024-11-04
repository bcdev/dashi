import { type ComponentType } from "@/lib/types/state/component";

export interface ComponentChangeEvent {
  componentType: ComponentType;
  componentId: string;
  propertyName: string;
  propertyValue: unknown;
}

export type ComponentChangeHandler = (event: ComponentChangeEvent) => void;
