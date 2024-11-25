import type { ApiOptions } from "@/lib/types/api";
import type { LoggingOptions } from "@/lib/actions/helpers/configureLogging";

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

export interface MutableHostStore extends HostStore {
  set: (property: string, value: unknown) => void;
}

export function isMutableHostStore(
  hostStore: HostStore | undefined,
): hostStore is MutableHostStore {
  return !!hostStore && typeof hostStore.set === "function";
}

/**
 * Chartlets options to be provided
 * by the application that is using Chartlets.
 */
export interface FrameworkOptions {
  /** The host store. */
  hostStore?: HostStore;
  /** API options to configure backend. */
  api?: ApiOptions;
  /** Logging options. */
  logging?: LoggingOptions;
}
