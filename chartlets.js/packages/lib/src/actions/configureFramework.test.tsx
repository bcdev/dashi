import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { configureFramework, resolvePlugin } from "./configureFramework";
import { store } from "@/store";
import { registry } from "@/components/registry";
import { ComponentProps } from "@/components/Component";
import { FC } from "react";

function getComponents() {
  interface DivProps extends ComponentProps {
    text: string;
  }
  const Div: FC<DivProps> = ({ text }) => <div>{text}</div>;
  return [
    ["A", Div as FC<ComponentProps>],
    ["B", Div as FC<ComponentProps>],
  ];
}

describe("configureFramework", () => {
  it("should accept no arg", () => {
    configureFramework();
    expect(store.getState().configuration).toEqual({});
  });

  it("should accept empty arg", () => {
    configureFramework({});
    expect(store.getState().configuration).toEqual({});
  });

  it("should enable logging", () => {
    configureFramework({
      logging: {
        enabled: true,
      },
    });
    expect(store.getState().configuration).toEqual({
      logging: { enabled: true },
    });
  });

  it("should subscribe to host store", () => {
    const listeners = [];
    const hostStore = {
      get: (_key: string) => null,
      subscribe: (l: () => void) => {
        listeners.push(l);
      },
    };
    configureFramework({
      hostStore,
    });
    expect(listeners.length).toBe(1);
  });

  it("should install plugins", () => {
    expect(registry.types.length).toBe(0);
    configureFramework({
      plugins: [{ components: getComponents() }],
    });
    expect(registry.types.length).toBe(2);
  });
});

describe("resolvePlugin", () => {
  beforeEach(() => {
    registry.clear();
  });

  afterEach(() => {
    registry.clear();
  });

  it("should resolve a object", async () => {
    const pluginObj = { components: getComponents() };
    expect(registry.types.length).toBe(0);
    const result = await resolvePlugin(pluginObj);
    expect(result).toBe(pluginObj);
    expect(registry.types.length).toBe(2);
  });

  it("should resolve a function", async () => {
    const pluginObj = { components: getComponents() };
    const pluginFunction = () => pluginObj;
    expect(registry.types.length).toBe(0);
    const result = await resolvePlugin(pluginFunction);
    expect(result).toBe(pluginObj);
    expect(registry.types.length).toBe(2);
  });

  it("should resolve a promise", async () => {
    const pluginObj = { components: getComponents() };
    const pluginPromise = Promise.resolve(pluginObj);
    expect(registry.types.length).toBe(0);
    const result = await resolvePlugin(pluginPromise);
    expect(result).toBe(pluginObj);
    expect(registry.types.length).toBe(2);
  });

  it("should resolve undefined", async () => {
    expect(registry.types.length).toBe(0);
    const result = await resolvePlugin(undefined);
    expect(result).toBe(undefined);
    expect(registry.types.length).toBe(0);
  });
});
