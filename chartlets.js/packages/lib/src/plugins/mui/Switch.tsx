import { type ChangeEvent } from "react";
import MuiSwitch from "@mui/material/Switch";
import MuiFormControl from "@mui/material/FormControl";
import MuiFormControlLabel from "@mui/material/FormControlLabel";

import type { ComponentState, ComponentProps } from "@/index";

interface SwitchState extends ComponentState {
  label?: string;
  value?: boolean | undefined;
}

interface SwitchProps extends ComponentProps, SwitchState {}

export function Switch({
  type,
  id,
  name,
  value,
  disabled,
  style,
  label,
  onChange,
}: SwitchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (id) {
      return onChange({
        componentType: type,
        id: id,
        property: "value",
        value: event.currentTarget.checked,
      });
    }
  };
  return (
    <MuiFormControl variant="filled" size="small" style={style}>
      <MuiFormControlLabel
        label={label}
        control={
          <MuiSwitch
            id={id}
            name={name}
            checked={Boolean(value)}
            disabled={disabled}
            onChange={handleChange}
          />
        }
      />
    </MuiFormControl>
  );
}
