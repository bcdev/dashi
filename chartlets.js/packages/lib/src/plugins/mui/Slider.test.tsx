import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Slider } from "./Slider";
import "@testing-library/jest-dom";
import { createChangeHandler } from "@/plugins/mui/common.test";
import { useState } from "react";
import type { ComponentChangeEvent } from "@/types/state/event";

describe("Slider", () => {
  it("should render the Slider component", () => {
    render(
      <Slider
        id="slider"
        type={"Slider"}
        min={0}
        max={100}
        value={50}
        onChange={() => {}}
      />,
    );

    const slider = screen.getByRole("slider");
    expect(slider).toBeDefined();

    expect(slider.getAttribute("aria-orientation")).toEqual("horizontal");
    expect(slider.getAttribute("min")).toEqual("0");
    expect(slider.getAttribute("max")).toEqual("100");
    expect(slider.getAttribute("value")).toEqual("50");
  });

  it("should fire 'value' property", () => {
    const { recordedEvents, onChange } = createChangeHandler();

    const TestSlider = () => {
      const [sliderValue, setSliderValue] = useState(60);

      const handleChange = (event: ComponentChangeEvent) => {
        setSliderValue(event.value as number);
        onChange(event);
      };

      return (
        <Slider
          type={"Slider"}
          id="sliderId"
          aria-label={"slider"}
          min={0}
          max={1000}
          onChange={handleChange}
          value={sliderValue}
        />
      );
    };

    render(<TestSlider />);
    const slider = screen.getByTestId("slider-test-id");
    expect(slider).toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveValue("60");

    const input = document.querySelector("input")?.value;
    expect(input).toEqual("60");

    const sliderBounds = {
      left: 100,
      width: 200,
      top: 0,
      bottom: 0,
      height: 20,
    };
    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue(
      sliderBounds as DOMRect,
    );

    // The value selected should be 100
    const clientX = sliderBounds.left + sliderBounds.width * 0.1;

    fireEvent.mouseDown(slider, { clientX: clientX });
    fireEvent.mouseMove(slider, { clientX: clientX });
    fireEvent.mouseUp(slider);
    expect(recordedEvents.length).toEqual(1);

    expect(recordedEvents[0]).toEqual({
      componentType: "Slider",
      id: "sliderId",
      property: "value",
      value: 100,
    });

    expect(screen.getByRole("slider")).toHaveValue("100");
    const updated_input = document.querySelector("input");
    expect(updated_input?.value).toEqual("100");
  });
});
