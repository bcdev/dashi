import MuiFormControl from "@mui/material/FormControl";
import MuiInputLabel from "@mui/material/InputLabel";
import MuiMenuItem from "@mui/material/MenuItem";
import MuiSelect, { type SelectChangeEvent } from "@mui/material/Select";

import { type ComponentState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";

export type SelectOption =
  | string
  | number
  | [string, string]
  | [number, string]
  | { value: string | number; label?: string };

export interface SelectState extends ComponentState {
  type: "Select";
  options: SelectOption[];
}

export interface SelectProps extends Omit<SelectState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Select({
  id,
  name,
  value,
  options,
  disabled,
  style,
  label,
  onChange,
}: SelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    if (!id) {
      return;
    }
    let newValue: string | number = event.target.value;
    if (typeof value == "number") {
      newValue = Number.parseInt(newValue);
    }

    return onChange({
      componentType: "Select",
      id: id,
      property: "value",
      value: newValue,
    });
  };
  return (
    <MuiFormControl variant="filled" size="small" style={style}>
      {label && <MuiInputLabel id={`${id}-label`}>{label}</MuiInputLabel>}
      <MuiSelect
        labelId={`${id}-label`}
        id={id}
        name={name}
        value={`${value}`}
        disabled={disabled}
        onChange={handleChange}
      >
        {Array.isArray(options) &&
          options.map(normalizeSelectOption).map(([value, text], index) => (
            <MuiMenuItem key={index} value={value}>
              {text}
            </MuiMenuItem>
          ))}
      </MuiSelect>
    </MuiFormControl>
  );
}

function normalizeSelectOption(
  option: SelectOption,
): [string | number, string] {
  if (typeof option === "string") {
    return [option, option];
  } else if (typeof option === "number") {
    return [option, option.toString()];
  } else if (Array.isArray(option)) {
    return option;
  } else {
    return [option.value, option.label || `${option.value}`];
  }
}
