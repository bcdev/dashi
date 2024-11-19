import { type ComponentChangeHandler } from "@/lib/types/state/event";
import {
  type ComponentItem,
  isComponentState,
} from "@/lib/types/state/component";
import { Component } from "./Component";

export interface ComponentChildrenProps {
  components?: ComponentItem[];
  onChange: ComponentChangeHandler;
}

export function ComponentChildren({
  components,
  onChange,
}: ComponentChildrenProps) {
  if (!components || components.length === 0) {
    return null;
  }
  return (
    <>
      {components.map((item, index) => {
        if (isComponentState(item)) {
          const key = item.id || index;
          return <Component key={key} {...item} onChange={onChange} />;
        } else {
          return item;
        }
      })}
    </>
  );
}
