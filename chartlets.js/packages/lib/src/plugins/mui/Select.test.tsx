import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { createChangeHandler } from "./common.test";
import { Select } from "./Select";

describe("Select", () => {
  it("should render the component", () => {
    render(
      <Select
        id="sel"
        type={"Select"}
        label={"Colors"}
        options={["red", "green", "blue"]}
        value={"red"}
        onChange={() => {}}
      />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#sel")).toEqual({});
    expect(screen.getByRole("combobox")).not.toBeUndefined();
  });

  it("should fire 'value' property with text options", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <Select
        id="sel"
        type={"Select"}
        label={"Colors"}
        options={["red", "green", "blue"]}
        value={"red"}
        onChange={onChange}
      />,
    );
    // open the Select component's list box
    // note, we must use "mouseDown" as "click" doesn't work
    fireEvent.mouseDown(screen.getByRole("combobox"));
    // click item in the Select component's list box
    const listBox = within(screen.getByRole("listbox"));
    fireEvent.click(listBox.getByText(/green/i));
    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Select",
      id: "sel",
      property: "value",
      value: "green",
    });
  });

  it("should fire 'value' property with numeric options", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <Select
        id="sel"
        type={"Select"}
        label={"Colors"}
        options={[10, 11, 12]}
        value={12}
        onChange={onChange}
      />,
    );
    // open the Select component's list box
    // note, we must use "mouseDown" as "click" doesn't work
    fireEvent.mouseDown(screen.getByRole("combobox"));
    // click item in the Select component's list box
    const listBox = within(screen.getByRole("listbox"));
    fireEvent.click(listBox.getByText(/11/i));
    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Select",
      id: "sel",
      property: "value",
      value: 11,
    });
  });

  it("should fire 'value' property with tuple options", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <Select
        id="sel"
        type={"Select"}
        label={"Colors"}
        options={[
          [10, "red"],
          [11, "yellow"],
          [12, "blue"],
        ]}
        value={11}
        onChange={onChange}
      />,
    );
    // open the Select component's list box
    // note, we must use "mouseDown" as "click" doesn't work
    fireEvent.mouseDown(screen.getByRole("combobox"));
    // click item in the Select component's list box
    const listBox = within(screen.getByRole("listbox"));
    fireEvent.click(listBox.getByText(/blue/i));
    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Select",
      id: "sel",
      property: "value",
      value: 12,
    });
  });

  it("should fire 'value' property with object options", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <Select
        id="sel"
        type={"Select"}
        label={"Colors"}
        options={[
          { value: 10, label: "Black" },
          { value: 20 },
          { value: 30, label: "Blue" },
          { value: 40, label: "Yellow" },
        ]}
        value={11}
        onChange={onChange}
      />,
    );
    // open the Select component's list box
    // note, we must use "mouseDown" as "click" doesn't work
    fireEvent.mouseDown(screen.getByRole("combobox"));
    // click item in the Select component's list box
    const listBox = within(screen.getByRole("listbox"));
    fireEvent.click(listBox.getByText(/Yellow/i));
    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Select",
      id: "sel",
      property: "value",
      value: 40,
    });
    // value 20 has no label, so "20" will be displayed
    fireEvent.click(listBox.getByText(/20/i));
    expect(recordedEvents.length).toBe(2);
    expect(recordedEvents[1]).toEqual({
      componentType: "Select",
      id: "sel",
      property: "value",
      value: 20,
    });
  });
});
