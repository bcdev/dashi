import { type ChangeEvent } from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import MuiFormControl from "@mui/material/FormControl";
import MuiFormControlLabel from "@mui/material/FormControlLabel";

import type { ComponentState, ComponentProps } from "@/lib";

interface CheckboxState extends ComponentState {
  label?: string;
  value?: boolean | undefined;
}

interface CheckboxProps extends ComponentProps, CheckboxState {}

export function Checkbox({
  type,
  id,
  name,
  value,
  disabled,
  style,
  label,
  onChange,
}: CheckboxProps) {
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
          <MuiCheckbox
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
