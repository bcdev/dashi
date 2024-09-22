import { EventHandler, PanelModel } from "./types";
import DashiPlot from "./DashiPlot";
import DashiBox from "./DashiBox";
import DashiButton from "./DashiButton";

interface DashiPanelProps extends PanelModel {
  onEvent: EventHandler;
}

function DashiPanel({ id, style, components, onEvent }: DashiPanelProps) {
  const handleEvent: EventHandler = (event) => {
    const { componentId: childId, ...rest } = event;
    onEvent({ componentId: `${id}.${childId}`, ...rest });
  };

  return (
    <div id={"dashi." + id} style={style}>
      {components.map((model) => {
        const { type: componentType, ...props } = model;
        if (componentType === "plot") {
          return <DashiPlot {...props} onEvent={handleEvent} />;
        } else if (componentType === "button") {
          return <DashiButton {...props} onEvent={handleEvent} />;
        } else if (componentType === "box") {
          return <DashiBox {...props} onEvent={handleEvent} />;
        } else if (componentType === "panel") {
          return <DashiPanel {...props} onEvent={handleEvent} />;
        }
      })}
    </div>
  );
}

export default DashiPanel;
