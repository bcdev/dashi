import { type ChangeEvent } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

import { type CheckboxState } from "@/lib/types/state/component";
import { type PropertyChangeHandler } from "@/lib/types/model/event";

export interface DashiCheckboxProps extends Omit<CheckboxState, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

export function DashiCheckbox({
  id,
  name,
  value,
  disabled,
  style,
  label,
  onPropertyChange,
}: DashiCheckboxProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (id) {
      return onPropertyChange({
        componentType: "Checkbox",
        componentId: id,
        propertyName: "value",
        propertyValue: event.currentTarget.checked,
      });
    }
  };
  return (
    <FormControl variant="filled" size="small" style={style}>
      <FormControlLabel
        label={label}
        control={
          <Checkbox
            id={id}
            name={name}
            checked={Boolean(value)}
            disabled={disabled}
            onChange={handleChange}
          />
        }
      />
    </FormControl>
  );
}
