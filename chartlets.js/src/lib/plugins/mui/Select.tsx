import MuiFormControl from "@mui/material/FormControl";
import MuiInputLabel from "@mui/material/InputLabel";
import MuiMenuItem from "@mui/material/MenuItem";
import MuiSelect, { type SelectChangeEvent } from "@mui/material/Select";

import type { ComponentState, ComponentProps } from "@/lib";
import { isString } from "@/lib";

export type SelectOption =
  | string
  | number
  | [string, string]
  | [number, string]
  | { value: string | number; label?: string };

interface SelectState extends ComponentState {
  options?: SelectOption[];
}

interface SelectProps extends ComponentProps, SelectState {}

export function Select({
  type,
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
      componentType: type,
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
  if (isString(option)) {
    return [option, option];
  } else if (typeof option === "number") {
    return [option, option.toString()];
  } else if (Array.isArray(option)) {
    return option;
  } else {
    return [option.value, option.label || `${option.value}`];
  }
}
