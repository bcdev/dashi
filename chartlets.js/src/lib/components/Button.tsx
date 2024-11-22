import { type MouseEvent } from "react";
import MuiButton from "@mui/material/Button";

import { type ComponentState } from "@/lib/types/state/component";
import type { ComponentProps } from "@/lib/component/Component";

interface ButtonState extends ComponentState {
  text?: string;
}

interface ButtonProps extends ComponentProps, ButtonState {}

export function Button({
  type,
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
        componentType: type,
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
