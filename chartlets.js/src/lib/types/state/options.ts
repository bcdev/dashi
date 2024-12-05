import type { ComponentType } from "react";

import type { ApiOptions } from "@/lib/types/api";
import type { LoggingOptions } from "@/lib/actions/helpers/configureLogging";
import type { ComponentProps } from "@/lib/component/Component";

/**
 * The host store represents an interface to the state of
 * the application that is using Chartlets.
 */
export interface HostStore {
  /**
   * Let Chartlets listen to changes in the host store that may
   * cause different values to be returned from the `get()` method.
   *
   * @param listener A listener that is called when the
   *  host store changes
   */
  subscribe: (listener: () => void) => void;

  /**
   * Get a property value from the host state.
   *
   * @param property The property name.
   * @returns The property value.
   */
  get: (property: string) => unknown;

  /**
   * **UNSTABLE API**
   *
   * Set a property value in the host state.
   *
   * @param property The property name.
   * @param value The new property value.
   */
  set?: (property: string, value: unknown) => void;
}

/**
 * A mutable host store implements the `set()` method.
 */
export interface MutableHostStore extends HostStore {
  /**
   * **UNSTABLE API**
   *
   * Set a property value in the host state.
   *
   * @param property The property name.
   * @param value The new property value.
   */
  set: (property: string, value: unknown) => void;
}

export function isMutableHostStore(
  hostStore: HostStore | undefined,
): hostStore is MutableHostStore {
  return !!hostStore && typeof hostStore.set === "function";
}

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

export type ComponentRegistration = [string, ComponentType<ComponentProps>];

export type PluginLike = Plugin | (() => Plugin) | Promise<PluginLike>;

/**
 * Chartlets options to be provided
 * by the application that is using Chartlets.
 */
export interface FrameworkOptions {
  /** API options to configure backend. */
  api?: ApiOptions;

  /** Framework plugins. */
  plugins?: PluginLike[];

  /** The host store. */
  hostStore?: HostStore;

  /** Logging options. */
  logging?: LoggingOptions;
}
