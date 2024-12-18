import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ComponentChangeHandler } from "@/types/state/event";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("should render the Box component", () => {
    const onChange: ComponentChangeHandler = () => {};
    render(
      <Divider
        id="dv"
        type={"Divider"}
        flexItem
        children={["Section 1"]}
        onChange={onChange}
      />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#bx")).toEqual({});
    expect(screen.getByText("Section 1")).not.toBeUndefined();
  });
});
