import type { ElementType } from "react";
import MuiSlider from "@mui/material/Slider";

import type { ComponentProps, ComponentState } from "@/index";

interface SliderState extends ComponentState {
  component?: ElementType<Element>;
}

interface SliderProps extends ComponentProps, SliderState {
  defaultValue: number;
}

export const Slider = ({
  id,
  style,
  defaultValue,
  component,
  // onChange,
}: SliderProps) => {
  return (
    <MuiSlider
      id={id}
      style={style}
      defaultValue={defaultValue}
      // onChange={onChange}
      component={component || "div"}
    ></MuiSlider>
  );
};
