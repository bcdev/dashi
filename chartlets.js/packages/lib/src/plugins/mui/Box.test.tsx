import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Box } from "./Box";
import type { ComponentChangeHandler } from "@/types/state/event";

describe("Box", () => {
  it("should render the Box component", () => {
    const onChange: ComponentChangeHandler = () => {};
    render(
      <Box id="bx" type={"Box"} children={["Hallo!"]} onChange={onChange} />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#bx")).toEqual({});
    expect(screen.getByText("Hallo!")).not.toBeUndefined();
  });
});
