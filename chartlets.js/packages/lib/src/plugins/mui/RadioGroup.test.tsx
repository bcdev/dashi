import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createChangeHandler } from "./common.test";
import { RadioGroup } from "./RadioGroup";

describe("RadioGroup", () => {
  it("should render the component", () => {
    render(
      <RadioGroup
        id="rg"
        type={"RadioGroup"}
        label={"Gender"}
        value={"f"}
        children={[
          { type: "Radio", value: "f", label: "Female" },
          { type: "Radio", value: "m", label: "Male" },
          { type: "Radio", value: "v", label: "Varying" },
        ]}
        onChange={() => {}}
        row
        dense
      />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#rg")).toEqual({});
    expect(screen.getByRole("radiogroup")).not.toBeUndefined();
  });

  it("should fire 'value' property with text options", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <RadioGroup
        id="rg"
        type={"RadioGroup"}
        label={"Gender"}
        value={"m"}
        children={[
          { type: "Radio", value: "f", label: "Female" },
          { type: "Radio", value: "m", label: "Male" },
          { type: "Radio", value: "v", label: "Varying" },
        ]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByLabelText("Varying"));
    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "RadioGroup",
      id: "rg",
      property: "value",
      value: "v",
    });
    fireEvent.click(screen.getByLabelText("Female"));
    expect(recordedEvents.length).toBe(2);
    expect(recordedEvents[1]).toEqual({
      componentType: "RadioGroup",
      id: "rg",
      property: "value",
      value: "f",
    });
  });
});
