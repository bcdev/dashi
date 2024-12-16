import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createChangeHandler } from "./common.test";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("should render the Switch component", () => {
    render(
      <Switch id="cb" type={"Switch"} label={"Click!"} onChange={() => {}} />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#cb")).toEqual({});
    expect(screen.getByText("Click!")).not.toBeUndefined();
  });

  it("should fire 'value' property", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <Switch
        data-testid="bt"
        id="cb"
        type={"Switch"}
        label={"Click!"}
        value={false}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("Click!"));
    expect(recordedEvents.length).toEqual(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Switch",
      id: "cb",
      property: "value",
      value: true,
    });
  });
});
