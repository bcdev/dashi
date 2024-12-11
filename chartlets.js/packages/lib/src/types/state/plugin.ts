import type { ComponentType } from "react";
import type { ComponentProps } from "@/components/Component";

/**
 * A component registration - a pair comprising the component type name
 * and the React component.
 */
export type ComponentRegistration = [string, ComponentType<ComponentProps>];

/**
 * A framework plugin.
 * Plugins are no-arg functions that are called
 * after the framework's initialisation.
 * Most typically, a plugin wants to return new components
 * in the `components` array:
 * `{ components: [["MyComponent", MyComponent]] }`.
 */
export interface Plugin {
  components?: ComponentRegistration[];
}

/**
 * An object of type `Plugin`, or a function that returns a
 * value that can be resolved to a `Plugin`,
 * or a promise that resolves to a value that can be
 * resolved to a `Plugin`.
 */
export type PluginLike = Plugin | (() => PluginLike) | Promise<PluginLike>;
