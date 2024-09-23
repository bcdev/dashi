import { ContainerModel, EventHandler } from "./model";
import DashiPlot, { DashiPlotProps } from "./DashiPlot";
import DashiButton, { DashiButtonProps } from "./DashiButton";
import DashiBox, { DashiBoxProps } from "./DashiBox";

export interface DashiContainerProps extends Omit<ContainerModel, "type"> {
  onEvent: EventHandler;
}

function DashiContainer({ components, onEvent }: DashiContainerProps) {
  return (
    <>
      {components.map(({ type: componentType, ...props }, index) => {
        const key = props.id || index;
        if (componentType === "plot") {
          return (
            <DashiPlot
              key={key}
              {...(props as DashiPlotProps)}
              onEvent={onEvent}
            />
          );
        } else if (componentType === "button") {
          return (
            <DashiButton
              key={key}
              {...(props as DashiButtonProps)}
              onEvent={onEvent}
            />
          );
        } else if (componentType === "box") {
          return (
            <DashiBox
              key={key}
              {...(props as DashiBoxProps)}
              onEvent={onEvent}
            />
          );
        }
      })}
    </>
  );
}

export default DashiContainer;
