import { type MouseEvent } from "react";
import Button from "@mui/material/Button";

import { type ButtonState } from "@/lib/types/state/component";
import { type PropertyChangeHandler } from "@/lib/types/model/event";

export interface DashiButtonProps extends Omit<ButtonState, "type"> {
  onPropertyChange: PropertyChangeHandler;
  panelIndex: number;
}

export function DashiButton({
  id,
  name,
  style,
  text,
  disabled,
  onPropertyChange,
}: DashiButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (id) {
      onPropertyChange({
        componentType: "Button",
        componentId: id,
        // Compat with plotly/dash
        propertyName: "n_clicks",
        // TODO: get number of mouse clicks
        propertyValue: event.buttons,
      });
    }
  };
  return (
    <Button
      id={id}
      name={name}
      style={style}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
}
