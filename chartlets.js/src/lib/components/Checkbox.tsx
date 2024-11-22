import { type ChangeEvent } from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import MuiFormControl from "@mui/material/FormControl";
import MuiFormControlLabel from "@mui/material/FormControlLabel";

import { type ComponentState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";

export interface CheckboxState extends ComponentState {
  type: "Checkbox";
  label: string;
  value?: boolean;
}

export interface CheckboxProps extends Omit<CheckboxState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Checkbox({
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
        componentType: "Checkbox",
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
