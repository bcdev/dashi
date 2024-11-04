import { type ComponentChangeHandler } from "@/lib/types/model/event";
import { type ComponentState } from "@/lib/types/state/component";
import { Component } from "./Component";

export interface ComponentChildrenProps {
  components?: ComponentState[];
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
      {components.map((component, index) => {
        const key = component.id || index;
        return <Component key={key} {...component} onChange={onChange} />;
      })}
    </>
  );
}
