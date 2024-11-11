import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { type DropdownState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";

export interface DropdownProps extends Omit<DropdownState, "type"> {
  onChange: ComponentChangeHandler;
}

export function Dropdown({
  id,
  name,
  value,
  options,
  disabled,
  style,
  label,
  onChange,
}: DropdownProps) {
  const handleChange = (event: SelectChangeEvent) => {
    if (!id) {
      return;
    }
    let newValue: string | number = event.target.value;
    if (typeof value == "number") {
      newValue = Number.parseInt(newValue);
    }

    return onChange({
      componentType: "Dropdown",
      id: id,
      property: "value",
      value: newValue,
    });
  };
  return (
    <FormControl variant="filled" size="small" style={style}>
      {label && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
      <Select
        labelId={`${id}-label`}
        id={id}
        name={name}
        value={`${value}`}
        disabled={disabled}
        onChange={handleChange}
      >
        {options &&
          options.map(([text, value], index) => (
            <MenuItem key={index} value={value}>
              {text}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
