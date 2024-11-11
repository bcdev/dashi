import { type MouseEvent } from "react";
import MuiButton from "@mui/material/Button";

import { type ButtonState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/model/event";

export interface ButtonProps extends Omit<ButtonState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Button({
  id,
  name,
  style,
  text,
  disabled,
  onChange,
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (id) {
      onChange({
        componentType: "Button",
        id: id,
        // Compat with plotly/dash
        property: "n_clicks",
        // TODO: get number of mouse clicks
        value: event.buttons,
      });
    }
  };
  return (
    <MuiButton
      id={id}
      name={name}
      style={style}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </MuiButton>
  );
}
