import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { TopLevelSpec } from "vega-lite";
import { useSignalListeners } from "./useSignalListeners";
import { createChangeHandler } from "@/plugins/mui/common.test";

const chart: TopLevelSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.20.1.json",
  config: { view: { continuousWidth: 300, continuousHeight: 300 } },
  data: { name: "data-0" },
  mark: { type: "bar" },
  datasets: {
    "data-0": [
      { x: "A", a: 28, b: 50, c: 50 },
      { x: "B", a: 55, b: 32, c: 40 },
      { x: "C", a: 43, b: 56, c: 30 },
      { x: "D", a: 91, b: 44, c: 20 },
      { x: "E", a: 81, b: 8, c: 10 },
    ],
  },
};

const chartWithSelect: TopLevelSpec = {
  ...chart,
  params: [
    {
      name: "sel_point",
      select: "point",
    },
    {
      name: "sel_interval",
      select: "interval",
    },
    {
      name: "sel_point_a",
      select: { on: "click", type: "point", fields: ["x", "a"] },
    },
    // Event not supported yet
    {
      name: "sel_interval_b",
      select: { on: "wheel", type: "interval", fields: ["x", "b"] },
    },
  ],
};

describe("useSignalListeners", () => {
  it("should return a stable record wo signals", () => {
    const { result, rerender } = renderHook(() =>
      useSignalListeners(chart, "VegaChart", "my_chart", () => {}),
    );
    const signalHandlers1 = result.current;
    rerender();
    const signalHandlers2 = result.current;
    expect(signalHandlers1).toEqual({});
    expect(signalHandlers2).toEqual({});
    expect(signalHandlers1).toBe(signalHandlers1);
  });

  it("should support different signal types", () => {
    const { result } = renderHook(() =>
      useSignalListeners(chartWithSelect, "VegaChart", "my_chart", () => {}),
    );
    const signalHandlers = result.current;
    expect(signalHandlers).toBeDefined();
    expect(signalHandlers["sel_point"]).toBeTypeOf("function");
    expect(signalHandlers["sel_interval"]).toBeTypeOf("function");
    expect(signalHandlers["sel_point_a"]).toBeTypeOf("function");
    // "wheel" not supported
    expect(signalHandlers["sel_point_b"]).toBeUndefined();
  });

  it("should call onChange", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    const { result } = renderHook(() =>
      useSignalListeners(chartWithSelect, "VegaChart", "my_chart", onChange),
    );
    const signalHandlers = result.current;
    expect(signalHandlers).toBeDefined();
    const signalHandler = signalHandlers["sel_point_a"];
    expect(signalHandler).toBeTypeOf("function");
    act(() => {
      signalHandler("sel_point_a", [1, 2, 3]);
    });
    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "VegaChart",
      id: "my_chart",
      property: "sel_point_a",
      value: [1, 2, 3],
    });
  });
});
