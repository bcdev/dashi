import {
  BoxModel,
  ButtonModel,
  ContainerModel,
  EventHandler,
  PlotModel,
} from "./model";
import DashiPlot from "./DashiPlot";
import DashiButton from "./DashiButton";
import DashiBox from "./DashiBox";

export interface DashiContainerProps extends Omit<ContainerModel, "type"> {
  onEvent: EventHandler;
}

function DashiContainer({ components, onEvent }: DashiContainerProps) {
  return (
    <>
      {components.map(({ type, ...model }, index) => {
        const key = model.id || index;
        if (type === "plot") {
          return (
            <DashiPlot key={key} {...(model as PlotModel)} onEvent={onEvent} />
          );
        } else if (type === "button") {
          return (
            <DashiButton
              key={key}
              {...(model as ButtonModel)}
              onEvent={onEvent}
            />
          );
        } else if (type === "box") {
          return (
            <DashiBox key={key} {...(model as BoxModel)} onEvent={onEvent} />
          );
        }
      })}
    </>
  );
}

export default DashiContainer;
