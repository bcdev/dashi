import type { ObjPathLike } from "@/utils/objPath";

export interface ComponentChangeEvent {
  componentType: string;
  // See commonality with StateChange
  id: string;
  property: ObjPathLike;
  value: unknown;
}

export type ComponentChangeHandler = (event: ComponentChangeEvent) => void;
