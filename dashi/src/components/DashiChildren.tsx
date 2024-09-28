import { ComponentModel, PropertyChangeHandler } from "../model/component.ts";
import DashiComponent from "./DashiComponent.tsx";

export interface DashiChildrenProps {
  components?: ComponentModel[];
  onPropertyChange: PropertyChangeHandler;
}

function DashiChildren({ components, onPropertyChange }: DashiChildrenProps) {
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

export default DashiChildren;
