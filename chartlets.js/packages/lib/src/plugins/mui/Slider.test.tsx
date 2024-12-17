import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Slider } from "./Slider";
import { createChangeHandler } from "@/plugins/mui/common.test";
import "@testing-library/jest-dom";
import { createTheme, ThemeProvider } from "@mui/material";

describe("Slider", () => {
  it("should render the Slider component", async () => {
    render(
      <Slider
        id="slider"
        type={"Slider"}
        min={0}
        max={100}
        value={50}
        onChange={() => {}}
        style={{ width: "300px" }}
      />,
    );

    const slider = await waitFor(() => screen.getByRole("slider"));
    expect(slider).toBeDefined();

    expect(slider.getAttribute("aria-orientation")).toEqual("horizontal");
    expect(slider.getAttribute("min")).toEqual("0");
    expect(slider.getAttribute("max")).toEqual("100");
  });

  it("should fire 'value' property", async () => {
    const { recordedEvents, onChange } = createChangeHandler();
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <Slider
          id="sliderId"
          type={"Slider"}
          ariaLabel={"slider"}
          onChange={onChange}
          value={60}
        />
      </ThemeProvider>,
    );
    await waitFor(() => {
      const slider = screen.getByRole("slider");
      expect(slider).toBeInTheDocument();
    });

    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();

    const thumb = document.querySelector(".MuiSlider-thumb");
    expect(thumb).toBeInTheDocument();

    const input = document.querySelector("input")?.value;
    expect(input).toEqual("60");

    if (thumb) {
      fireEvent.mouseDown(slider, { clientX: 0.1 });
      fireEvent.mouseMove(slider, { clientX: 0.1 });
      fireEvent.mouseUp(slider);
      expect(recordedEvents.length).toEqual(1);
      expect(recordedEvents[0]).toEqual({
        componentType: "Slider",
        id: "sliderId",
        property: "value",
        value: 2, //expect.any(Number),
      });
    }
  });
});
