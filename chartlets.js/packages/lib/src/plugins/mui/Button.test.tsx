import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createChangeHandler } from "./common.test";
import { Button } from "./Button";

describe("Button", () => {
  it("should render the Button component", () => {
    render(
      <Button id="bt" type={"Button"} text={"Click!"} onChange={() => {}} />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#bt")).toEqual({});
    expect(screen.getByText("Click!")).not.toBeUndefined();
  });

  it("should fire the 'clicked' property", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <Button
        data-testid="bt"
        id="bt"
        type={"Button"}
        text={"Click!"}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("Click!"));
    expect(recordedEvents.length).toEqual(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Button",
      id: "bt",
      property: "clicked",
      value: true,
    });
  });
});
