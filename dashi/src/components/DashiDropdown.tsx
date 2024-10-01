import "react";
import { DropdownModel, PropertyChangeHandler } from "../model/component";
import React from "react";
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

export interface DashiDropdownProps extends Omit<DropdownModel, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

function DashiDropdown({
  id,
  name,
  value,
  options,
  disabled,
  onPropertyChange,
}: DashiDropdownProps) {
  const label = id?.split("_").map(([firstLetter, ...rest]) => firstLetter.toUpperCase() + rest.join('')).join(' ');
  const [dropdownValue, setValue] = React.useState<string | undefined>(value);
  const handleChange = (event: SelectChangeEvent) => {
    if (!id) {
      return;
    }
    const newValue: string | number = event.target.value;
    setValue(newValue);
    return onPropertyChange({
      componentType: "Dropdown",
      componentId: id,
      propertyName: "value",
      propertyValue: newValue,
    });
  };
  return (
    <Box sx={{ minWidth: 120 }}>
    <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    <Select
      id={id}
      name={name}
      value={dropdownValue}
      disabled={disabled}
      onChange={handleChange}
      variant={"filled"}>
      {options.map(([text, value], index) => (
        <MenuItem key={index} value={value}>
          {text}
        </MenuItem>
      ))}
    </Select>
    </FormControl>
    </Box>
  );
}

export default DashiDropdown;
