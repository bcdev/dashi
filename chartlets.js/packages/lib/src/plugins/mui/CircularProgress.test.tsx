import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CircularProgress } from "./CircularProgress";

describe("CircularProgress", () => {
  it("should render the CircularProgress component", () => {
    render(
      <CircularProgress
        type="CircularProgress"
        id="cp"
        size="small"
        onChange={() => {}}
      />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#cp")).toEqual({});
    expect(screen.getByRole("progressbar")).not.toBeUndefined();
  });
});
