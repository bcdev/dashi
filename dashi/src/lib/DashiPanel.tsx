import { EventHandler, makeId, PanelModel } from "./model";
import DashiContainer from "./DashiContainer";

interface DashiPanelProps extends PanelModel {
  width: number;
  height: number;
  onEvent: EventHandler;
}

function DashiPanel({
  width,
  height,
  id,
  style,
  components,
  onEvent,
}: DashiPanelProps) {
  return (
    <div id={makeId("panel", id)} style={{ width, height, ...style }}>
      <DashiContainer components={components} onEvent={onEvent} />
    </div>
  );
}

export default DashiPanel;
