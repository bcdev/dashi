import { MouseEvent } from "react";
import { ButtonModel, PropertyChangeHandler } from "../model/component";
import Button from '@mui/material/Button';

export interface DashiButtonProps extends Omit<ButtonModel, "type"> {
  onPropertyChange: PropertyChangeHandler;
}

function DashiButton({
  id,
  name,
  value,
  style,
  text,
  disabled,
  onPropertyChange,
}: DashiButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (id) {
      onPropertyChange({
        componentType: "Button",
        componentId: id,
        // Compat with plotly/dash
        propertyName: "n_clicks",
        // TODO: get number of mouse clicks
        propertyValue: event.buttons,
      });
    }
  };
  return (
    <Button
      id={id}
      name={name}
      value={value}
      style={style}
      disabled={disabled}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
}

export default DashiButton;
