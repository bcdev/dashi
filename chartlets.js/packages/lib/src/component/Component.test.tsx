import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Component } from "./Component";

describe("Component", () => {
  it("should render the Component component", () => {
    const boxProps = {
      type: "Box",
      id: "bx",
      children: ["Hello!", "World!"],
      onChange: () => {},
    };
    render(<Component {...boxProps} />);
    // to inspect rendered component, do:
    // expect(document.body).toEqual({});
    expect(screen.getByText("World!")).toBeUndefined();
  });
});
