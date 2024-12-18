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
  ["data-testid"]?: string;
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
  ...props
}: SliderProps) => {
  // We need to drop children prop because we want to access the data-testid for
  // tests and slider does not accept children components
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children: _, ...sliderProps } = props;

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
      {...sliderProps}
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
    />
  );
};
