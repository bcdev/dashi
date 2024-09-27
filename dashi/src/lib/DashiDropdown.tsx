import "react";
import { DropdownModel, EventHandler } from "./model.ts";
import { ChangeEvent } from "react";

export interface DashiDropdownProps extends Omit<DropdownModel, "type"> {
  onEvent: EventHandler;
}

function DashiDropdown({
  id,
  name,
  value,
  style,
  options,
  disabled,
  onEvent,
}: DashiDropdownProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    let newValue: string | number = event.currentTarget.value;
    if (typeof value === "number") {
      newValue = Number.parseInt(newValue);
    }
    return onEvent({
      componentType: "dropdown",
      componentId: id,
      eventType: "onChange",
      eventData: { [id || name || "value"]: newValue },
    });
  };
  return (
    <select
      id={id}
      style={style}
      disabled={disabled}
      value={value}
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
