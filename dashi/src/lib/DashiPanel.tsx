import { PanelEventHandler, makeId, PanelModel, EventData } from "./model";
import DashiContainer from "./DashiContainer";

export interface DashiPanelProps extends Omit<PanelModel, "type"> {
  panelId: string;
  width: number;
  height: number;
  onEvent: PanelEventHandler;
}

function DashiPanel({
  panelId,
  width,
  height,
  id,
  style,
  components,
  onEvent,
}: DashiPanelProps) {
  const handleEvent = (event: EventData) => {
    onEvent({ panelId, ...event });
  };
  return (
    <div id={makeId("panel", id)} style={{ width, height, ...style }}>
      <DashiContainer components={components} onEvent={handleEvent} />
    </div>
  );
}

export default DashiPanel;
