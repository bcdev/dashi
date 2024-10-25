import { type PropertyChangeHandler } from "@/lib/types/model/event";
import { type ComponentState } from "@/lib/types/state/component";
import { DashiComponent } from "@/lib";

export interface DashiChildrenProps {
  components?: ComponentState[];
  onPropertyChange: PropertyChangeHandler;
  panelIndex: number;
}

export function DashiChildren({
  components,
  panelIndex,
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
            panelIndex={panelIndex}
            onPropertyChange={onPropertyChange}
          />
        );
      })}
    </>
  );
}
