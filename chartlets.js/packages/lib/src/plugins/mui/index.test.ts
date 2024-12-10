import { describe, it, expect } from "vitest";
import mui from "./index";

describe("mui Plugin", () => {
  it("registers components", () => {
    const plugin = mui();
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
