import "react";
import { ButtonModel, EventHandler } from "./types";

interface DashiButtonProps extends ButtonModel {
  onEvent: EventHandler;
}

function DashiButton({ id, style, text, disabled, onEvent }: DashiButtonProps) {
  const handleClick = () =>
    onEvent({ componentType: "button", componentId: id, eventType: "onClick" });
  return (
    <button
      id={"dashi." + id}
      style={style}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

export default DashiButton;
