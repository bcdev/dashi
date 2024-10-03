import "react";
import { DropdownModel, PropertyChangeHandler } from "../model/component";
import {
  // Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

export interface DashiDropdownProps extends Omit<DropdownModel, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

function DashiDropdown({
  id,
  name,
  value,
  options,
  disabled,
  style,
  label,
  onPropertyChange,
}: DashiDropdownProps) {
  const handleChange = (event: SelectChangeEvent) => {
    if (!id) {
      return;
    }
    let newValue: string | number = event.target.value;
    if (typeof value == "number") {
      newValue = Number.parseInt(newValue);
    }

    return onPropertyChange({
      componentType: "Dropdown",
      componentId: id,
      propertyName: "value",
      propertyValue: newValue,
    });
  };
  return (
    <FormControl>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        id={id}
        name={name}
        style={style}
        value={`${value}`}
        disabled={disabled}
        onChange={handleChange}
        variant={"filled"}
      >
        {options.map(([text, value], index) => (
          <MenuItem key={index} value={value}>
            {text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DashiDropdown;
