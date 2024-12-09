import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type {
  ComponentChangeEvent,
  ComponentChangeHandler,
} from "@/types/state/event";
import { Button } from "./Button";

describe("Button", () => {
  it("should render the Button component", () => {
    const onChange: ComponentChangeHandler = () => {};
    render(
      <Button id="bt" type={"Button"} text={"Click!"} onChange={onChange} />,
    );
    expect(screen.getByText("Click!")).not.toBeUndefined();
  });

  it("should fire the 'clicked'", () => {
    let recordedEvent: ComponentChangeEvent | undefined = undefined;
    const onChange: ComponentChangeHandler = (event) => {
      recordedEvent = event;
    };
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
    expect(recordedEvent).not.toBeUndefined();
  });
});
