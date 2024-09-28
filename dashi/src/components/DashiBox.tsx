import { BoxModel, PropertyChangeHandler } from "../model/component.ts";
import DashiChildren from "./DashiChildren.tsx";

export interface DashiBoxProps extends Omit<BoxModel, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

function DashiBox({ id, style, components, onPropertyChange }: DashiBoxProps) {
  return (
    <div id={id} style={style}>
      <DashiChildren
        components={components}
        onPropertyChange={onPropertyChange}
      />
    </div>
  );
}

export default DashiBox;
