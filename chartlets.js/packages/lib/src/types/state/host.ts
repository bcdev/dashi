import { isObject } from "@/utils/isObject";
import { isFunction } from "@/utils/isFunction";

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

export function isHostStore(value: unknown): value is HostStore {
  return (
    isObject(value) && isFunction(value.get) && isFunction(value.subscribe)
  );
}

export function isMutableHostStore(value: unknown): value is MutableHostStore {
  return isHostStore(value) && isFunction(value.set);
}
