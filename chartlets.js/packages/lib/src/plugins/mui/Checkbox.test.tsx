import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createChangeHandler } from "./common.test";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("should render the Checkbox component", () => {
    render(
      <Checkbox
        id="cb"
        type={"Checkbox"}
        label={"Click!"}
        onChange={() => {}}
      />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#cb")).toEqual({});
    expect(screen.getByText("Click!")).not.toBeUndefined();
  });

  it("should fire 'value' property", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <Checkbox
        data-testid="bt"
        id="cb"
        type={"Checkbox"}
        label={"Click!"}
        value={false}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("Click!"));
    expect(recordedEvents.length).toEqual(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Checkbox",
      id: "cb",
      property: "value",
      value: true,
    });
  });
});
