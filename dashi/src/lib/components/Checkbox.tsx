import { type ChangeEvent } from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import MuiFormControl from "@mui/material/FormControl";
import MuiFormControlLabel from "@mui/material/FormControlLabel";

import { type CheckboxState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/model/event";

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
        componentId: id,
        propertyName: "value",
        propertyValue: event.currentTarget.checked,
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
