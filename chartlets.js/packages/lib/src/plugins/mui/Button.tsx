import { type MouseEvent } from "react";
import MuiButton from "@mui/material/Button";
import MuiIcon from "@mui/material/Icon";

import type { ComponentProps, ComponentState } from "@/index";
import { Tooltip } from "./Tooltip";

interface ButtonState extends ComponentState {
  text?: string;
  startIcon?: string;
  endIcon?: string;
  variant?: "contained" | "outlined" | "text";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
}

export interface ButtonProps extends ComponentProps, ButtonState {}

export function Button({
  type,
  id,
  name,
  style,
  variant,
  color,
  disabled,
  text,
  startIcon,
  endIcon,
  tooltip,
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
    <Tooltip title={tooltip}>
      <MuiButton
        id={id}
        name={name}
        style={style}
        variant={variant}
        color={color}
        disabled={disabled}
        startIcon={startIcon && <MuiIcon>{startIcon}</MuiIcon>}
        endIcon={endIcon && <MuiIcon>{endIcon}</MuiIcon>}
        onClick={handleClick}
      >
        {text}
      </MuiButton>
    </Tooltip>
  );
}
