import type { ComponentType } from "react";

import type { ComponentProps } from "@/components/Component";

/**
 * A registry for Chartlets components.
 */
export interface Registry {
  /**
   * Register a React component that renders a Chartlets component.
   *
   * `component` must be a functional React component with at
   * least the following two component props:
   *
   *   - `type: string`: your component's type name.
   *      This will be the same as the `type` used for registration.
   *   - `onChange: ComponentChangeHandler`: an event handler
   *     that your component may call to signal change events.
   *
   * Both props are always be present plus. The component may also
   * be passed any other props provided by the contribution.
   *
   * @param type The Chartlets component's unique type name.
   * @param component A functional React component.
   */
  register(type: string, component: ComponentType<ComponentProps>): () => void;

  /**
   * Lookup the component of the provided type.
   *
   * @param type The Chartlets component's type name.
   */
  lookup(type: string): ComponentType<ComponentProps> | undefined;

  /**
   * Clears the registry.
   * For testing only.
   */
  clear(): void;

  /**
   * Get the type names of all registered components.
   */
  types: string[];
}

// export for testing only
export class RegistryImpl implements Registry {
  private components = new Map<string, ComponentType<ComponentProps>>();

  register(type: string, component: ComponentType<ComponentProps>): () => void {
    const oldComponent = this.components.get(type);
    this.components.set(type, component);
    return () => {
      if (typeof oldComponent === "function") {
        this.components.set(type, oldComponent);
      } else {
        this.components.delete(type);
      }
    };
  }

  lookup(type: string): ComponentType<ComponentProps> | undefined {
    return this.components.get(type);
  }

  clear() {
    this.components.clear();
  }

  get types(): string[] {
    return Array.from(this.components.keys());
  }
}

/**
 * The Chartlets component registry.
 *
 * Use `registry.register("C", C)` to register your own component `C`.
 *
 * `C` must be a functional React component with at least the following
 * two properties:
 *
 *   - `type: string`: your component's type name.
 *   - `onChange: ComponentChangeHandler`: an event handler
 *     that your component may call to signal change events.
 */
export const registry = new RegistryImpl();
