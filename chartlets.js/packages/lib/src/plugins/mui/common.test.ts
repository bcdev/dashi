import { describe, it, expect } from "vitest";
import type {
  ComponentChangeEvent,
  ComponentChangeHandler,
} from "@/types/state/event";

export function createChangeHandler() {
  const recordedEvents: ComponentChangeEvent[] = [];
  const onChange: ComponentChangeHandler = (event) => {
    recordedEvents.push(event);
  };
  return { recordedEvents, onChange };
}

describe("createChangeHandler", () => {
  it("works as expected", () => {
    const changHandler = createChangeHandler();
    expect(changHandler.recordedEvents).toEqual([]);
    expect(typeof changHandler.onChange).toEqual("function");

    const events = [
      {
        componentType: "Select",
        id: "sel",
        property: "value",
        value: 5,
      },
      {
        componentType: "Select",
        id: "sel",
        property: "value",
        value: 2,
      },
      {
        componentType: "Select",
        id: "sel",
        property: "value",
        value: 3,
      },
    ];
    changHandler.onChange(events[0]);
    changHandler.onChange(events[1]);
    changHandler.onChange(events[2]);
    expect(changHandler.recordedEvents).toEqual(events);
  });
});
