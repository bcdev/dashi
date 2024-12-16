import { describe, it, expect } from "vitest";
import vega from "./index";

describe("vega Plugin", () => {
  it("registers components", () => {
    const plugin = vega();
    expect(plugin).toBeTypeOf("object");
    expect(Array.isArray(plugin.components)).toBe(true);
    expect(plugin.components?.length).toBeGreaterThan(0);
    plugin.components?.forEach((componentRegistration) => {
      expect(componentRegistration).toHaveLength(2);
      const [name, component] = componentRegistration;
      expect(name).toBeTypeOf("string");
      expect(component).toBeTypeOf("function");
    });
  });
});
