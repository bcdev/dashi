import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IconButton } from "./IconButton";
import { createChangeHandler } from "@/plugins/mui/common.test";

describe("IconButton", () => {
  it("should render the IconButton component", () => {
    render(
      <IconButton
        id="ibt"
        type={"IconButton"}
        icon={"arrow-left"}
        onChange={() => {}}
      />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#ibt")).toEqual({});
    expect(screen.getByRole("button")).not.toBeUndefined();
  });

  it("should fire the 'clicked' property", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <IconButton
        id="ibt"
        type={"IconButton"}
        icon={"arrow-left"}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(recordedEvents.length).toEqual(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "IconButton",
      id: "ibt",
      property: "clicked",
      value: true,
    });
  });
});
