import { BoxModel, EventHandler, makeId } from "./model.ts";
import DashiContainer from "./DashiContainer.tsx";

export interface DashiBoxProps extends Omit<BoxModel, "type"> {
  onEvent: EventHandler;
}

function DashiBox({ id, style, components, onEvent }: DashiBoxProps) {
  return (
    <div id={makeId("box", id)} style={style}>
      <DashiContainer components={components} onEvent={onEvent} />
    </div>
  );
}

export default DashiBox;
