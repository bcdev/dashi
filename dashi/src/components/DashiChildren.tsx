import { ComponentState } from "../state/component";
import DashiComponent from "./DashiComponent";
import { PropertyChangeHandler } from "../model/event";

export interface DashiChildrenProps {
  components?: ComponentState[];
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
