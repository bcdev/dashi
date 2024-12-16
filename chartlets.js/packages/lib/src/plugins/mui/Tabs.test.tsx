import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createChangeHandler } from "./common.test";
import { Tabs } from "./Tabs";

describe("Tabs", () => {
  it("should render the Tabs component", () => {
    render(
      <Tabs
        id="tbs"
        type={"Tabs"}
        onChange={() => {}}
        children={["Datasets", "Variables"]}
      />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#tbs")).toEqual({});
    expect(screen.getByText("Datasets")).not.toBeUndefined();
  });

  it("should fire 'value' property", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <Tabs
        id="tbs"
        type={"Tabs"}
        value={0}
        onChange={onChange}
        children={["Datasets", "Variables", { type: "Tab", label: "Stats" }]}
      />,
    );
    fireEvent.click(screen.getByText("Variables"));
    expect(recordedEvents.length).toEqual(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Tabs",
      id: "tbs",
      property: "value",
      value: 1,
    });
    fireEvent.click(screen.getByText("Stats"));
    expect(recordedEvents.length).toEqual(2);
    expect(recordedEvents[1]).toEqual({
      componentType: "Tabs",
      id: "tbs",
      property: "value",
      value: 2,
    });
  });
});
