import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { DropdownState } from "@/state/component";
import { PropertyChangeHandler } from "@/model/event";

export interface DashiDropdownProps extends Omit<DropdownState, "type"> {
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
