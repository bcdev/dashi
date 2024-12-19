import MuiSlider from "@mui/material/Slider";
import type { OverridableStringUnion } from "@mui/types";

import type { ComponentProps, ComponentState } from "@/index";
import type { ReactNode } from "react";

interface SliderState extends ComponentState {
  defaultValue?: number;
  ariaLabel?: string;
  color?: OverridableStringUnion<
    "primary" | "secondary" | "success" | "error" | "info" | "warning",
    string
  >;
  disableSwap?: boolean;
  getAriaValueText?: (value: number, index: number) => string;
  min?: number;
  max?: number;
  marks?: boolean | { value: number; label?: ReactNode }[];
  orientation?: "horizontal" | "vertical";
  step?: number;
  size?: OverridableStringUnion<"small" | "medium", string>;
  track?: "inverted" | "normal" | false;
  value?: number | number[];
  valueLabelDisplay?: "auto" | "on" | "off";
}

interface SliderProps extends ComponentProps, SliderState {}

export const Slider = ({
  type,
  id,
  style,
  defaultValue,
  ariaLabel,
  color,
  disableSwap,
  getAriaValueText,
  min,
  max,
  marks,
  orientation,
  step,
  size,
  track,
  value,
  valueLabelDisplay,
  onChange,
}: SliderProps) => {
  const handleSlide = (
    _event: Event,
    value: number | number[],
    _activeThumb: number,
  ) => {
    if (id) {
      onChange({
        componentType: type,
        id: id,
        property: "value",
        value: value,
      });
    }
  };
  return (
    <MuiSlider
      id={id}
      defaultValue={defaultValue}
      aria-label={ariaLabel}
      color={color}
      style={style}
      disableSwap={disableSwap}
      getAriaValueText={getAriaValueText}
      min={min}
      max={max}
      marks={marks}
      orientation={orientation}
      step={step}
      size={size}
      track={track}
      value={value ?? 0}
      valueLabelDisplay={valueLabelDisplay}
      onChange={handleSlide}
      data-testid="slider-test-id"
    />
  );
};
