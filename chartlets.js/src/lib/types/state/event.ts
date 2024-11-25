import type { ObjPathLike } from "@/lib/utils/objPath";

export interface ComponentChangeEvent {
  componentType: string;
  // See commonality with StateChange
  id: string;
  property: ObjPathLike;
  value: unknown;
}

export type ComponentChangeHandler = (event: ComponentChangeEvent) => void;
