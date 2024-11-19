import { type MouseEvent } from "react";
import MuiButton from "@mui/material/Button";

import { type ButtonState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";

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
  const handleClick = (_event: MouseEvent<HTMLButtonElement>) => {
    if (id) {
      onChange({
        componentType: "Button",
        id: id,
        property: "clicked",
        value: true,
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
