import { type ComponentChangeHandler } from "@/lib/types/model/event";
import { type ComponentState } from "@/lib/types/state/component";
import { DashiComponent } from "./DashiComponent";

export interface DashiChildrenProps {
  components?: ComponentState[];
  onChange: ComponentChangeHandler;
}

export function DashiChildren({ components, onChange }: DashiChildrenProps) {
  if (!components || components.length === 0) {
    return null;
  }
  return (
    <>
      {components.map((component, index) => {
        const key = component.id || index;
        return <DashiComponent key={key} {...component} onChange={onChange} />;
      })}
    </>
  );
}
