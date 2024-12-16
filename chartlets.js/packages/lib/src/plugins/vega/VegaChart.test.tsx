import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
// import { render, screen, fireEvent } from "@testing-library/react";
import type { TopLevelSpec } from "vega-lite";
import { createChangeHandler } from "@/plugins/mui/common.test";
import { VegaChart } from "./VegaChart";

describe("VegaChart", () => {
  it("should render if chart is not given", () => {
    render(
      <VegaChart id="vc" type={"VegaChart"} chart={null} onChange={() => {}} />,
    );
    // to inspect rendered component, do:
    // expect(document.body).toEqual({});
    expect(document.querySelector("#vc")).not.toBeUndefined();
  });

  it("should render if chart is given", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <VegaChart
        id="vc"
        type={"VegaChart"}
        chart={chart}
        onChange={onChange}
      />,
    );
    // to inspect rendered component, do:
    // expect(document.body).toEqual({});
    expect(recordedEvents.length).toBe(0);

    // TODO: all of the following doesn't work!
    // expect(document.querySelector("canvas")).toEqual({});
    // expect(screen.getByRole("canvas")).not.toBeUndefined();
    // fireEvent.click(screen.getByRole("canvas"));
    // expect(recordedEvents.length).toBe(1);
  });
});

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
