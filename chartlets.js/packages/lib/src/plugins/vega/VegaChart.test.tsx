import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { VegaChart } from "./VegaChart";
import type { ComponentChangeHandler } from "@/types/state/event";

describe("VegaChart", () => {
  it("should render the VegaChart component if chart is not given", () => {
    const onChange: ComponentChangeHandler = () => {};
    render(
      <VegaChart id="vc" type={"VegaChart"} chart={null} onChange={onChange} />,
    );
    expect(document.querySelector("#vc")).not.toBeUndefined();
  });
});
