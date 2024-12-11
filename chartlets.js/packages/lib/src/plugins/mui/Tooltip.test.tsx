import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("should render its child component", () => {
    render(
      <Tooltip title={"Does nothing :)"}>
        <button>Click Me</button>
      </Tooltip>,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#typo")).toEqual({});
    expect(screen.getByText("Click Me")).not.toBeUndefined();
  });
});
