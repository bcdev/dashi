import "react";
import { ButtonModel, EventHandler, makeId } from "./model.ts";

export interface DashiButtonProps extends Omit<ButtonModel, "type"> {
  onEvent: EventHandler;
}

function DashiButton({
  name,
  value,
  id,
  style,
  text,
  disabled,
  onEvent,
}: DashiButtonProps) {
  const handleClick = () =>
    onEvent({
      componentType: "button",
      componentId: id,
      eventType: "onClick",
      eventData: { [id || name || "value"]: value },
    });
  return (
    <button
      id={makeId("button", id)}
      style={style}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

export default DashiButton;
