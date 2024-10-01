import { BoxModel, PropertyChangeHandler } from "../model/component";
import DashiChildren from "./DashiChildren";

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
