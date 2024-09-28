import "react";
import { DropdownModel, PropertyChangeHandler } from "../model/component.ts";
import { ChangeEvent } from "react";

export interface DashiDropdownProps extends Omit<DropdownModel, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

function DashiDropdown({
  id,
  name,
  value,
  style,
  options,
  disabled,
  onPropertyChange,
}: DashiDropdownProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!id) {
      return;
    }
    let newValue: string | number = event.currentTarget.value;
    if (typeof value === "number") {
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
    <select
      id={id}
      name={name}
      value={value}
      style={style}
      disabled={disabled}
      onChange={handleChange}
    >
      {options.map(([text, value], index) => (
        <option key={index} value={value}>
          {text}
        </option>
      ))}
    </select>
  );
}

export default DashiDropdown;
