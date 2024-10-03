import "react";
import { DropdownModel, PropertyChangeHandler } from "../model/component";
import React from "react";
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
  const [dropdownValue, setDropdownValue] = React.useState(value);
  const handleChange = (event: SelectChangeEvent) => {
    if (!id) {
      return;
    }
    let newValue: string | number = event.target.value;
    if (typeof value == "number") {
      newValue = Number.parseInt(newValue);
    }

    setDropdownValue(newValue);
    return onPropertyChange({
      componentType: "Dropdown",
      componentId: id,
      propertyName: "value",
      propertyValue: newValue,
    });
  };
  return (
    <FormControl variant="filled" size="small" style={style}>
      {label && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
      <Select
        labelId={`${id}-label`}
        id={id}
        name={name}
        value={`${dropdownValue}`}
        disabled={disabled}
        onChange={handleChange}
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
