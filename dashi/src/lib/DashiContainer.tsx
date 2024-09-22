import { ContainerModel, EventHandler } from "./model";
import DashiPlot from "./DashiPlot";
import DashiButton from "./DashiButton";
import DashiBox from "./DashiBox";

interface DashiContainerProps extends Omit<ContainerModel, "type"> {
  onEvent: EventHandler;
}

function DashiContainer({ components, onEvent }: DashiContainerProps) {
  return (
    <>
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
    </>
  );
}

export default DashiContainer;
