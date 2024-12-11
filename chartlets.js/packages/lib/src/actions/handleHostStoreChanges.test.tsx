import { describe, it, expect, beforeEach } from "vitest";
import { store } from "@/store";
import { handleHostStoreChange } from "./handleHostStoreChange";

describe("handleHostStoreChange", () => {
  let listeners: (() => void)[] = [];
  let hostState: Record<string, unknown> = {};
  const hostStore = {
    get: (key: string) => hostState[key],
    set: (key: string, value: unknown) => {
      hostState = { ...hostState, [key]: value };
      listeners.forEach((l) => void l());
    },
    subscribe: (_l: () => void) => {
      listeners.push(_l);
    },
  };

  beforeEach(() => {
    listeners = [];
    hostState = {};
  });

  it("should do nothing without host store", () => {
    store.setState({ configuration: {} });
    const oldState = store.getState();
    handleHostStoreChange();
    const newState = store.getState();
    expect(newState).toBe(oldState);
    expect(newState).toEqual(oldState);
  });

  it("should synchronize theme mode", () => {
    store.setState({ configuration: { hostStore } });
    expect(store.getState().themeMode).toBeUndefined();
    hostStore.set("themeMode", "light");
    handleHostStoreChange();
    expect(store.getState().themeMode).toEqual("light");
  });

  it("should generate callback requests", () => {
    const extensions = [{ name: "e0", version: "0", contributes: ["panels"] }];
    store.setState({
      configuration: { hostStore },
      extensions,
      contributionsResult: {
        status: "ok",
        data: {
          extensions,
          contributions: {
            panels: [
              {
                name: "p0",
                extension: "e0",
                layout: {
                  function: {
                    name: "layout",
                    parameters: [],
                    return: {},
                  },
                  inputs: [],
                  outputs: [],
                },
                callbacks: [
                  {
                    function: {
                      name: "callback",
                      parameters: [],
                      return: {},
                    },
                    inputs: [{ id: "@app", property: "variableName" }],
                    outputs: [{ id: "select", property: "value" }],
                  },
                ],
                initialState: {},
              },
            ],
          },
        },
      },
    });
    hostStore.set("variableName", "CHL");
    handleHostStoreChange();
  });
});
