import { type MouseEvent } from "react";
import MuiIconButton from "@mui/material/IconButton";
import MuiIcon from "@mui/material/Icon";

import type { ComponentState, ComponentProps } from "@/index";
import { Tooltip } from "./Tooltip";

interface IconButtonState extends ComponentState {
  icon?: string;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  size?: "small" | "medium" | "large";
}

interface IconButtonProps extends ComponentProps, IconButtonState {}

export function IconButton({
  type,
  id,
  name,
  style,
  tooltip,
  color,
  icon,
  size,
  disabled,
  onChange,
}: IconButtonProps) {
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
      <MuiIconButton
        id={id}
        name={name}
        style={style}
        color={color}
        size={size}
        disabled={disabled}
        onClick={handleClick}
      >
        <MuiIcon>{icon}</MuiIcon>
      </MuiIconButton>
    </Tooltip>
  );
}
