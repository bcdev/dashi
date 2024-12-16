import MuiSlider from "@mui/material/Slider";

import type { ComponentProps, ComponentState } from "@/index";

interface SliderState extends ComponentState {}

interface SliderProps extends ComponentProps, SliderState {
  defaultValue?: number;
}

export const Slider = ({ id, style, defaultValue }: SliderProps) => {
  return <MuiSlider id={id} style={style} defaultValue={defaultValue} />;
};
