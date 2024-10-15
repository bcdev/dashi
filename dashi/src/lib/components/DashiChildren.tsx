import { type PropertyChangeHandler } from "@/lib/types/model/event";
import { type ComponentState } from "@/lib/types/state/component";
import { DashiComponent } from "./DashiComponent";

export interface DashiChildrenProps {
  components?: ComponentState[];
  onPropertyChange: PropertyChangeHandler;
}

export function DashiChildren({
  components,
  onPropertyChange,
}: DashiChildrenProps) {
  if (!components || components.length === 0) {
    return null;
  }
  return (
    <>
      {components.map((component, index) => {
        const key = component.id || index;
        return (
          <DashiComponent
            key={key}
            {...component}
            onPropertyChange={onPropertyChange}
          />
        );
      })}
    </>
  );
}
