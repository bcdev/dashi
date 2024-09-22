import { BoxModel, EventHandler } from "./types";
import DashiPlot from "./DashiPlot";
import DashiButton from "./DashiButton";

interface DashiBoxProps extends BoxModel {
  onEvent: EventHandler;
}

function DashiBox({ id, style, components, onEvent }: DashiBoxProps) {
  return (
    <div id={"dashi." + id} style={style}>
      {components.map((model) => {
        const { type: componentType, ...props } = model;
        if (componentType === "plot") {
          return <DashiPlot {...props} onEvent={onEvent} />;
        } else if (componentType === "button") {
          return <DashiButton {...props} onEvent={onEvent} />;
        } else if (componentType === "box") {
          return <DashiBox {...props} onEvent={onEvent} />;
        }
      })}
    </div>
  );
}

export default DashiBox;
