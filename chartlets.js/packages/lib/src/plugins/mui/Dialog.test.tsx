import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Dialog } from "./Dialog";
import "@testing-library/jest-dom";
import { createChangeHandler } from "@/plugins/mui/common.test";

describe("Dialog", () => {
  it("should render the Dialog component with title and content", () => {
    render(
      <Dialog
        id="test-dialog"
        type="Dialog"
        open={true}
        title="Test Title"
        content="Test Content"
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should not render the Dialog if open is false", () => {
    render(
      <Dialog
        id="test-dialog"
        type="Dialog"
        open={false}
        onChange={() => {}}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should handle onClose event and call onChange", () => {
    const { recordedEvents, onChange } = createChangeHandler();

    render(
      <Dialog
        id="test-dialog"
        type="Dialog"
        open={true}
        title="Test Title"
        content="Test Content"
        onChange={onChange}
      />,
    );

    const backdrop = screen.getByRole("dialog", { hidden: true });
    expect(backdrop).toBeInTheDocument();
    console.log(backdrop);
    fireEvent.click(backdrop);

    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Dialog",
      id: "test-dialog",
      property: "value",
      value: expect.any(Object), // Expecting an event object
    });
  });

  it("should render children within DialogActions", () => {
    render(
      <Dialog
        id="test-dialog"
        type="Dialog"
        open={true}
        title="Test Title"
        content="Test Content"
        children={[<button data-testid="test-button">Test Button</button>]}
        onChange={() => {}}
      ></Dialog>,
    );

    expect(
      screen.getByRole("button", { name: "Test Button" }),
    ).toBeInTheDocument();
  });

  it("should handle onClose event and call onChange with correct data", () => {
    const { recordedEvents, onChange } = createChangeHandler();

    render(
      <Dialog
        id="test-dialog"
        type="Dialog"
        open={true}
        title="Test Title"
        content="Test Content"
        onChange={onChange}
      />,
    );

    const backdrop = screen.getByRole("presentation");
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);

    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Dialog",
      id: "test-dialog",
      property: "value",
      value: expect.any(Object),
    });
  });
});
